/* ===== CafeFiro — Accounts & Customer Data (mock, localStorage) ===== */
(function(){
  const USERS_KEY='cafefiro_users_v1';
  const SESS_KEY='cafefiro_session_v1';
  const LEADS_KEY='cafefiro_leads_v1';

  const getUsers = ()=>{ try{return JSON.parse(localStorage.getItem(USERS_KEY))||{};}catch(e){return {};} };
  const saveUsers = u=>localStorage.setItem(USERS_KEY,JSON.stringify(u));
  const getSession = ()=>localStorage.getItem(SESS_KEY)||null;
  const setSession = e=>localStorage.setItem(SESS_KEY,e);
  const clearSession = ()=>localStorage.removeItem(SESS_KEY);
  const getLeads = ()=>{ try{return JSON.parse(localStorage.getItem(LEADS_KEY))||[];}catch(e){return [];} };
  const saveLeads = l=>localStorage.setItem(LEADS_KEY,JSON.stringify(l));

  function currentUser(){ const e=getSession(); if(!e) return null; return getUsers()[e.toLowerCase()]||null; }
  const initials = n => (n||'U').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();

  /* ---- order tracking ---- */
  const TRACK_STAGES=[
    {key:'confirmed',label:'Order Confirmed',cls:'',icon:'✓',hrs:0,desc:'We’ve received your order.'},
    {key:'packed',label:'Packed',cls:'',icon:'📦',hrs:18,desc:'Your mixes are packed & ready to ship.'},
    {key:'shipped',label:'Shipped',cls:'',icon:'🚚',hrs:36,desc:'Handed to our courier partner.'},
    {key:'out',label:'Out for Delivery',cls:'',icon:'🛵',hrs:84,desc:'Arriving today — keep your phone handy.'},
    {key:'delivered',label:'Delivered',cls:'done',icon:'🏠',hrs:108,desc:'Enjoy! Easy to cook, delicious to share.'},
  ];
  function orderStageIndex(o){
    const hrs=(Date.now()-new Date(o.date).getTime())/36e5;
    let idx=0; TRACK_STAGES.forEach((s,i)=>{ if(hrs>=s.hrs) idx=i; });
    return idx;
  }
  function orderStatus(o){
    const i=orderStageIndex(o); const s=TRACK_STAGES[i];
    return {label:s.label, cls:i>=4?'done':(i>=2?'ship':'')};
  }
  function eta(o){
    const i=orderStageIndex(o);
    if(i>=4) return 'Delivered';
    const remHrs=TRACK_STAGES[4].hrs-(Date.now()-new Date(o.date).getTime())/36e5;
    const d=new Date(Date.now()+remHrs*36e5);
    return 'Est. delivery by '+d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
  }
  function openTracking(oid){
    const u=currentUser(); if(!u) return;
    const o=u.orders.find(x=>x.oid===oid); if(!o) return;
    const cur=orderStageIndex(o);
    const courier=['Delhivery','BlueDart','Ekart','Shadowfax'][parseInt(oid.slice(-1),36)%4];
    const awb='CF'+oid.slice(2)+'IN';
    const steps=TRACK_STAGES.map((s,i)=>{
      const state=i<cur?'past':(i===cur?'now':'future');
      const when=new Date(new Date(o.date).getTime()+s.hrs*36e5);
      const whenTxt=i<=cur?when.toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
      return `<div class="trk-step ${state}">
        <div class="trk-dot">${i<cur?'✓':s.icon}</div>
        <div class="trk-info"><b>${s.label}</b><p>${s.desc}</p>${whenTxt?`<span class="trk-when">${whenTxt}</span>`:''}</div>
      </div>`;
    }).join('');
    const html=`
      <div class="trk-head">
        <div><span class="trk-oid">Order #${o.oid}</span><div class="trk-eta">${eta(o)}</div></div>
        <div class="trk-courier"><span>${courier}</span><b>${awb}</b></div>
      </div>
      <div class="trk-map"><div class="trk-line"><i style="height:${cur/(TRACK_STAGES.length-1)*100}%"></i></div><div class="trk-steps">${steps}</div></div>
      <div class="trk-items"><h4>In this shipment</h4>${o.items.map(i=>`<div class="trk-item"><span>${i.qty}× ${i.name}</span>${i.subFreq?'<em>↻ subscription</em>':''}</div>`).join('')}</div>
      <p class="trk-help">Need help? <a href="https://wa.me/919667395420" target="_blank" rel="noopener">WhatsApp us</a> with your order ID.</p>`;
    if(window.CFContent) window.CFContent.openHtml('Track Order', o.items[0]?'Tracking your order':'Order', html);
  }
  window.CFTrack={open:openTracking};

  /* ---- auth ops ---- */
  function register({name,email,phone,password}){
    email=(email||'').trim().toLowerCase();
    if(!name||!email||!phone||!password) return {err:'Please fill in all fields.'};
    if(!/^\S+@\S+\.\S+$/.test(email)) return {err:'Please enter a valid email.'};
    if(!/^\d{10}$/.test(phone.replace(/\D/g,'').slice(-10)) ) return {err:'Please enter a valid 10-digit phone.'};
    if(password.length<6) return {err:'Password must be at least 6 characters.'};
    const users=getUsers();
    if(users[email]) return {err:'An account with this email already exists. Try logging in.'};
    users[email]={name:name.trim(),email,phone:phone.trim(),password,address:null,addresses:[],orders:[],joined:new Date().toISOString()};
    saveUsers(users); setSession(email);
    return {ok:true};
  }
  function login(email,password){
    email=(email||'').trim().toLowerCase();
    const users=getUsers(); const u=users[email];
    if(!u) return {err:'No account found with this email.'};
    if(u.password!==password) return {err:'Incorrect password. Please try again.'};
    setSession(email); return {ok:true};
  }
  function logout(){ clearSession(); updateNav(); closeAcct(); toast('Logged out'); }

  /* ---- record order / capture data ---- */
  function recordOrder(order, customer){
    const u=currentUser();
    if(u){
      const users=getUsers();
      users[u.email].orders.unshift(order);
      // save / refresh address book from checkout
      if(customer && customer.addr){
        const ad={label:customer.city||'Home',addr:customer.addr,city:customer.city,pin:customer.pin,phone:customer.phone||u.phone};
        users[u.email].address=ad;
        if(!users[u.email].addresses) users[u.email].addresses=[];
        const exists=users[u.email].addresses.some(x=>x.addr===ad.addr&&x.pin===ad.pin);
        if(!exists) users[u.email].addresses.unshift(ad);
      }
      saveUsers(users); updateNav();
    } else if(customer){
      // capture guest data as a lead so no customer info is lost
      const leads=getLeads();
      leads.unshift({...customer, oid:order.oid, total:order.total, date:order.date});
      saveLeads(leads);
    }
  }
  function addAddress(ad){ const u=currentUser(); if(!u) return; const users=getUsers(); if(!users[u.email].addresses) users[u.email].addresses=[]; users[u.email].addresses.unshift(ad); users[u.email].address=ad; saveUsers(users); }
  function removeAddress(i){ const u=currentUser(); if(!u) return; const users=getUsers(); users[u.email].addresses.splice(i,1); saveUsers(users); }

  /* ===== NAV STATE ===== */
  function updateNav(){
    const u=currentUser();
    const loginBtn=$('#loginBtn'), userBtn=$('#userBtn');
    if(u){
      loginBtn.style.display='none';
      userBtn.style.display='inline-flex';
      $('#avatar').textContent=initials(u.name);
      $('#uname').textContent=u.name.split(' ')[0];
      $('#menuName').textContent=u.name;
      $('#menuEmail').textContent=u.email;
      const n=u.orders.length;
      $('#ordBadge').textContent=n?n:'';
      $('#ordBadge').style.display=n?'inline-grid':'none';
      const w=(wishlist||[]).length;
      const wb=$('#wishBadge'); if(wb){ wb.textContent=w?w:''; wb.style.display=w?'inline-grid':'none'; }
    } else {
      loginBtn.style.display='inline-flex';
      userBtn.style.display='none';
      $('#acctMenu').classList.remove('open');
    }
  }

  /* ===== AUTH MODAL ===== */
  function openAuth(mode='login'){ renderAuth(mode); $('#authScrim').classList.add('open'); document.body.style.overflow='hidden'; }
  function closeAuth(){ $('#authScrim').classList.remove('open'); document.body.style.overflow=''; }
  function renderAuth(mode){
    const isLogin = mode!=='signup';
    $('#authCard').innerHTML=`
      <button class="modal-close" id="authClose">✕</button>
      <div class="auth-hero">
        <img src="assets/logo.png" alt="CafeFiro">
        <p>${isLogin?'Welcome back to the table.':'Join the CafeFiro family.'}</p>
        <ul class="auth-perks">
          <li>⚡ Faster checkout</li>
          <li>📦 Track all your orders</li>
          <li>🎁 Subscriber-only offers</li>
        </ul>
      </div>
      <div class="auth-body">
        <div class="auth-tabs">
          <button class="auth-tab ${isLogin?'active':''}" data-mode="login">Log in</button>
          <button class="auth-tab ${!isLogin?'active':''}" data-mode="signup">Sign up</button>
        </div>
        <div class="auth-err" id="authErr"></div>
        <form id="authForm">
          ${isLogin?'':`<div class="field"><label>Full name</label><input id="a-name" placeholder="Priya Sharma" autocomplete="name"></div>`}
          <div class="field"><label>Email</label><input id="a-email" type="email" placeholder="priya@email.com" autocomplete="email"></div>
          ${isLogin?'':`<div class="field"><label>Phone</label><input id="a-phone" placeholder="98765 43210" autocomplete="tel"></div>`}
          <div class="field"><label>Password</label><input id="a-pass" type="password" placeholder="${isLogin?'Your password':'At least 6 characters'}" autocomplete="${isLogin?'current-password':'new-password'}"></div>
          <button class="btn btn-primary btn-block" type="submit">${isLogin?'Log in':'Create account'}</button>
        </form>
        <p class="auth-switch">${isLogin?"New to CafeFiro? <a data-mode='signup'>Create an account</a>":"Already have an account? <a data-mode='login'>Log in</a>"}</p>
        <p class="auth-fine">Demo only — data is stored locally in your browser, never sent anywhere.</p>
      </div>`;
    $('#authClose').onclick=closeAuth;
    $('#authForm').onsubmit=e=>{
      e.preventDefault();
      let res;
      if(isLogin){ res=login($('#a-email').value,$('#a-pass').value); }
      else{ res=register({name:$('#a-name').value,email:$('#a-email').value,phone:$('#a-phone').value,password:$('#a-pass').value}); }
      if(res.err){ const el=$('#authErr'); el.textContent=res.err; el.classList.add('show'); return; }
      updateNav(); closeAuth();
      toast(isLogin?`Welcome back, ${currentUser().name.split(' ')[0]}!`:`Welcome to CafeFiro, ${currentUser().name.split(' ')[0]}! 🌿`);
    };
    $$('#authCard [data-mode]').forEach(b=>b.onclick=()=>renderAuth(b.dataset.mode));
  }

  /* ===== ACCOUNT MODAL ===== */
  function openAcct(tab='profile'){ if(!currentUser()) return openAuth('login'); renderAcct(tab); $('#acctScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#acctMenu').classList.remove('open'); }
  function closeAcct(){ $('#acctScrim').classList.remove('open'); document.body.style.overflow=''; }
  let acctTab='profile';
  function renderAcct(tab='profile'){
    acctTab=tab;
    const u=currentUser(); if(!u) return;
    const book=u.addresses&&u.addresses.length?u.addresses:(u.address?[u.address]:[]);
    const profile=`
      <div class="acct-section">
        <h4>Profile details</h4>
        <div class="info-grid">
          <div class="info"><span>Name</span><b>${u.name}</b></div>
          <div class="info"><span>Email</span><b>${u.email}</b></div>
          <div class="info"><span>Phone</span><b>${u.phone}</b></div>
          <div class="info"><span>Member since</span><b>${new Date(u.joined).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</b></div>
        </div>
      </div>
      <div class="acct-section">
        <h4>Quick stats</h4>
        <div class="info-grid">
          <div class="info"><span>Orders placed</span><b>${u.orders.length}</b></div>
          <div class="info"><span>Wishlist items</span><b>${(wishlist||[]).length}</b></div>
          <div class="info"><span>Saved addresses</span><b>${book.length}</b></div>
          <div class="info"><span>Total spent</span><b>${rs(u.orders.reduce((s,o)=>s+(o.total||0),0))}</b></div>
        </div>
      </div>`;
    const orders=u.orders.length?u.orders.map(o=>{
      const st=orderStatus(o);
      return `
      <div class="ord-card">
        <div class="ord-top"><b>#${o.oid}</b><span class="ord-status ${st.cls}">${st.label}</span></div>
        <div class="ord-date">${new Date(o.date).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
        <div class="ord-items">${o.items.map(i=>`<span>${i.qty}× ${i.name}</span>`).join('')}</div>
        <div class="ord-foot"><span>${o.items.reduce((s,i)=>s+i.qty,0)} item(s)${o.coupon?' · '+o.coupon:''}</span><b>${rs(o.total)}</b></div>
        <button class="ord-track-btn" data-track="${o.oid}">🚚 Track order</button>
      </div>`;}).join(''):`<div class="ord-empty"><div class="em">📦</div><b>No orders yet</b><p>Your order history will appear here.</p><button class="btn btn-ember btn-sm" id="shopNow">Shop the range</button></div>`;
    const wl=(wishlist||[]);
    const wishlistPane=wl.length?`<div class="wish-grid">${wl.map(id=>{const p=P[id]; if(!p)return ''; return `<div class="wish-row"><img src="${p.img}" alt=""><div class="wi"><b>${p.name}</b><span>${rs(p.price)} · ${p.weight}</span></div><div class="wa"><button class="btn btn-sm btn-ember" data-add="${id}">＋ Add</button><button class="wish-rm" data-wish="${id}">Remove</button></div></div>`;}).join('')}</div>`:`<div class="ord-empty"><div class="em">♥</div><b>Your wishlist is empty</b><p>Tap the heart on any product to save it here.</p><button class="btn btn-ember btn-sm" id="shopNow">Browse products</button></div>`;
    const addresses=`
      <div class="addr-list">
        ${book.map((ad,i)=>`<div class="addr-card lg"><div><b>${ad.label||'Address '+(i+1)}</b><p>${ad.addr}<br>${ad.city} – ${ad.pin}</p><span>📞 ${ad.phone||u.phone}</span></div><button class="addr-del" data-del="${i}">✕</button></div>`).join('') || `<div class="addr-empty">No saved addresses yet.</div>`}
      </div>
      <button class="btn btn-ghost btn-sm" id="addAddrBtn" style="margin-top:14px">＋ Add new address</button>
      <form class="addr-form" id="addrForm" style="display:none">
        <div class="field"><label>Label (e.g. Home, Office)</label><input id="ad-label" placeholder="Home"></div>
        <div class="field"><label>Address</label><input id="ad-addr" placeholder="Flat / House, Street, Area"></div>
        <div class="frow"><div class="field"><label>City</label><input id="ad-city" placeholder="Mumbai"></div><div class="field"><label>Pincode</label><input id="ad-pin" placeholder="400001" maxlength="6"></div></div>
        <div class="field"><label>Phone</label><input id="ad-phone" placeholder="98765 43210"></div>
        <button class="btn btn-primary btn-sm" type="submit">Save address</button>
      </form>`;
    const titles={profile:'My Account',orders:'My Orders',wishlist:'My Wishlist',addresses:'Address Book',refer:'Refer & Earn'};
    const code = window.CFReferral ? window.CFReferral.code(u) : 'FIROFRIEND';
    const refer=`
      <div class="refer-hero">
        <div class="refer-amt">₹100</div>
        <p>Give friends <b>₹100 off</b> their first order. When they order, <b>you get ₹100</b> too.</p>
      </div>
      <label style="font-weight:700;font-size:.82rem;display:block;margin:6px 0 8px">Your referral code</label>
      <div class="refer-code"><span id="refCode">${code}</span><button class="btn btn-sm btn-ember" id="copyRef">Copy</button></div>
      <div class="refer-share">
        <a class="rs-btn wa" href="https://wa.me/?text=${encodeURIComponent('Try CafeFiro — easy vegetarian premixes! Use my code '+code+' for ₹100 off your first order: https://cafefiro.in')}" target="_blank" rel="noopener">💬 Share on WhatsApp</a>
        <button class="rs-btn" id="copyLink">🔗 Copy invite link</button>
      </div>
      <div class="refer-stats"><div><b>0</b><span>Friends joined</span></div><div><b>₹0</b><span>Earned</span></div><div><b>₹0</b><span>Available</span></div></div>`;
    const panes={profile,orders:`<div class="ord-list">${orders}</div>`,wishlist:wishlistPane,addresses,refer};
    $('#acctCard').innerHTML=`
      <button class="modal-close" id="acctClose">✕</button>
      <div class="acct-side">
        <div class="acct-avatar">${initials(u.name)}</div>
        <b>${u.name}</b>
        <span>${u.email}</span>
        <nav class="acct-nav">
          <button class="acct-navi ${tab==='profile'?'active':''}" data-tab="profile">👤 My Account</button>
          <button class="acct-navi ${tab==='orders'?'active':''}" data-tab="orders">📦 Orders (${u.orders.length})</button>
          <button class="acct-navi ${tab==='wishlist'?'active':''}" data-tab="wishlist">♥ Wishlist (${wl.length})</button>
          <button class="acct-navi ${tab==='addresses'?'active':''}" data-tab="addresses">📍 Addresses (${book.length})</button>
          <button class="acct-navi ${tab==='refer'?'active':''}" data-tab="refer">🎁 Refer & Earn</button>
          <button class="acct-navi logout" id="acctLogout">↪ Log out</button>
        </nav>
      </div>
      <div class="acct-main">
        <h3>${titles[tab]}</h3>
        ${panes[tab]}
      </div>`;
    $('#acctClose').onclick=closeAcct;
    $('#acctLogout').onclick=logout;
    $$('#acctCard [data-tab]').forEach(b=>b.onclick=()=>renderAcct(b.dataset.tab));
    const sn=$('#shopNow'); if(sn) sn.onclick=()=>{ closeAcct(); document.querySelector('#range').scrollIntoView({behavior:'smooth'}); };
    $$('#acctCard [data-track]').forEach(b=>b.onclick=()=>openTracking(b.dataset.track));
    // wishlist remove
    $$('#acctCard .wish-rm').forEach(b=>b.onclick=e=>{ e.stopPropagation(); toggleWish(b.dataset.wish); });
    // addresses
    const ab=$('#addAddrBtn'); if(ab) ab.onclick=()=>{ $('#addrForm').style.display='block'; ab.style.display='none'; };
    const af=$('#addrForm'); if(af) af.onsubmit=e=>{
      e.preventDefault();
      const ad={label:$('#ad-label').value||'Home',addr:$('#ad-addr').value,city:$('#ad-city').value,pin:$('#ad-pin').value,phone:$('#ad-phone').value};
      if(!ad.addr||!ad.city||!ad.pin){ toast('Please fill address, city & pincode'); return; }
      addAddress(ad); toast('✓ Address saved'); renderAcct('addresses');
    };
    $$('#acctCard [data-del]').forEach(b=>b.onclick=()=>{ removeAddress(+b.dataset.del); renderAcct('addresses'); toast('Address removed'); });
    // refer & earn
    const cr=$('#copyRef'); if(cr) cr.onclick=()=>{ navigator.clipboard&&navigator.clipboard.writeText(code); toast('✓ Code '+code+' copied'); };
    const clk=$('#copyLink'); if(clk) clk.onclick=()=>{ navigator.clipboard&&navigator.clipboard.writeText('https://cafefiro.in/?ref='+code); toast('✓ Invite link copied'); };
  }
  function refreshWishlist(){ if($('#acctScrim').classList.contains('open')) renderAcct(acctTab); updateNav(); }

  /* ===== wire up ===== */
  function init(){
    $('#loginBtn').onclick=()=>openAuth('login');
    $('#userBtn').onclick=e=>{ e.stopPropagation(); $('#acctMenu').classList.toggle('open'); };
    $('#logoutBtn').onclick=logout;
    $$('#acctMenu [data-acct]').forEach(b=>b.onclick=()=>openAcct(b.dataset.acct));
    $('#authScrim').onclick=e=>{ if(e.target===$('#authScrim')) closeAuth(); };
    $('#acctScrim').onclick=e=>{ if(e.target===$('#acctScrim')) closeAcct(); };
    document.addEventListener('click', e=>{ if(!e.target.closest('#acctWrap')) $('#acctMenu').classList.remove('open'); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeAuth(); closeAcct(); } });
    updateNav();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();

  window.CFAuth={currentUser,recordOrder,openAuth,openAcct,refreshWishlist};
})();
