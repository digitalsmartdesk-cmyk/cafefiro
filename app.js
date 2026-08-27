/* ===== CafeFiro D2C — App ===== */
const PRODUCTS = [
  {id:'soya-galouti', name:'Soya Galouti Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:179, mrp:199, time:'20 min', img:'assets/soya-galouti.jpg', tagline:'Melt-in-the-mouth soya galouti with real, slow-ground spices.'},
  {id:'paneer-seekh', name:'Paneer Seekh Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:199, mrp:229, time:'20 min', img:'assets/paneer-seekh.jpg', tagline:'Made with real paneer & authentic spices. Just add water or curd.'},
  {id:'cheese-corn', name:'Cheese Corn Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:189, mrp:215, time:'20 min', img:'assets/cheese-corn.jpg', tagline:'Real cheese & sweet corn — a crowd-pleaser the whole family loves.'},
  {id:'hara-bhara', name:'Hara Bhara Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:175, mrp:199, time:'20 min', img:'assets/hara-bhara.jpg', tagline:'Spinach, green peas & herbs. Rich in nutrition, easy to make.'},
  {id:'veg-shami', name:'Veg Shami Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:175, mrp:199, time:'20 min', img:'assets/veg-shami.jpg', tagline:'Real vegetables & authentic spices for that classic shami flavour.'},
  {id:'soya-seekh', name:'Soya Seekh Kebab', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:179, mrp:199, time:'20 min', img:'assets/soya-seekh.jpg', tagline:'Plant-protein rich seekh. Grill, air-fry or pan-fry in minutes.'},
  {id:'kala-chana', name:'Kala Chana Tikka', sub:'Kebab Premix', cat:'Kebab Co.', weight:'250g', price:185, mrp:210, time:'20 min', img:'assets/kala-chana.jpg', tagline:'Protein-packed, dhaba-style tikka at home. High in fibre.'},
  {id:'moong-bhajiya', name:'Moong Bhajiya', sub:'Instant Mix', cat:'Instant Mix', weight:'200g', price:149, mrp:175, time:'15 min', img:'assets/moong-bhajiya.jpg', tagline:'Premium moong dal & spices. The perfect tea-time snack.'},
  {id:'dal-vada', name:'Dal Vada', sub:'Instant Mix', cat:'Instant Mix', weight:'200g', price:149, mrp:175, time:'15 min', img:'assets/dal-vada.jpg', tagline:'Crispy chana & urad dal vada with aromatic curry leaves.'},
  {id:'ragi-kurkure', name:'Ragi Kurkure', sub:'Quick Bites', cat:'Quick Bites', weight:'250g', price:159, mrp:185, time:'15 min', img:'assets/ragi-kurkure.jpg', tagline:'Wholesome ragi & real spices. Crunchy, guilt-free munching.'},
  {id:'veg-cutlet', name:'Veg Cutlet', sub:'Quick Bites', cat:'Quick Bites', weight:'250g', price:165, mrp:189, time:'15 min', img:'assets/veg-cutlet.jpg', tagline:'Made with real veggies. Wholesome, crunchy and ready fast.'},
  {id:'aloo-tikki', name:'Aloo Tikki', sub:'Quick Bites', cat:'Quick Bites', weight:'250g', price:159, mrp:185, time:'15 min', img:'assets/aloo-tikki.jpg', tagline:'Made with real potato. Crispy outside, soft & delicious inside.'},
];

const KIT = {
  id:'sample-kit',
  name:'CafeFiro Welcome Sample Kit',
  price:499,
  items:['soya-galouti','paneer-seekh','hara-bhara','cheese-corn','moong-bhajiya','dal-vada','aloo-tikki','ragi-kurkure'],
};
const P = Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
// merge in rich details from data.js
if(window.EXTRA){ PRODUCTS.forEach(p=>Object.assign(p, window.EXTRA[p.id]||{})); }
// build review lists (seed + user-submitted)
function buildReviews(p,idx){
  const seed=[];
  const baseDate=new Date('2026-04-20');
  if(p.topReview) seed.push({name:window.RNAMES[idx%window.RNAMES.length],rating:5,text:p.topReview,verified:true,days:idx});
  const n=3+(idx%3);
  for(let i=0;i<n;i++){
    const r=[5,5,4,5,4][(idx+i)%5];
    seed.push({name:window.RNAMES[(idx+i+3)%window.RNAMES.length],rating:r,text:window.RPOOL[(idx+i)%window.RPOOL.length],verified:(i%2===0),days:idx+i*5+4});
  }
  return seed.map(r=>({...r,date:new Date(baseDate-r.days*86400000).toISOString()}));
}
PRODUCTS.forEach((p,i)=>{ p.seedReviews=buildReviews(p,i); });
const userReviews = (()=>{ try{return JSON.parse(localStorage.getItem('cafefiro_reviews_v1'))||{};}catch(e){return {};} })();
function saveUserReviews(){ localStorage.setItem('cafefiro_reviews_v1', JSON.stringify(userReviews)); }
function allReviews(id){ return [...(userReviews[id]||[]), ...((P[id]&&P[id].seedReviews)||[])]; }

// Sample kit packs are HALF the size of the regular pack
const halfWeight = w => (parseInt(w,10)/2) + 'g';
const kitValue = Math.round(KIT.items.reduce((s,id)=>s+P[id].price/2,0)/10)*10; // value of 8 half-size packs

/* ===== State ===== */
const LS_KEY = 'cafefiro_cart_v1';
let cart = load();
function load(){
  try{
    const raw = JSON.parse(localStorage.getItem(LS_KEY))||{};
    const out={};
    for(const k in raw){ const v=raw[k]; out[k] = (typeof v==='number') ? {qty:v, subFreq:null} : {qty:v.qty||1, subFreq:v.subFreq||null, gift:v.gift||null}; }
    return out;
  }catch(e){ return {}; }
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(cart)); }

/* ===== Gift card redemption ===== */
function getGiftCards(){ try{return JSON.parse(localStorage.getItem('cafefiro_giftcards_v1'))||{};}catch(e){return {};} }
function saveGiftCards(g){ localStorage.setItem('cafefiro_giftcards_v1', JSON.stringify(g)); }
let redeemedGift = localStorage.getItem('cafefiro_redeemgift_v1') || null;
function setRedeemedGift(code){ redeemedGift=code; if(code) localStorage.setItem('cafefiro_redeemgift_v1',code); else localStorage.removeItem('cafefiro_redeemgift_v1'); }
function giftBalance(){ const g=getGiftCards(); return (redeemedGift && g[redeemedGift]) ? g[redeemedGift].balance : 0; }
function giftApplied(payable){ return Math.min(giftBalance(), Math.max(0, payable)); }

/* ===== Subscribe & Save ===== */
const SUB_RATE = 0.15; // 15% off on subscription
const SUB_FREQ = { '2w':'Every 2 weeks', '1m':'Every month', '2m':'Every 2 months' };
function subFreqLabel(code){ return SUB_FREQ[code] || 'Subscription'; }

/* ===== Wishlist ===== */
let wishlist = (()=>{ try{return JSON.parse(localStorage.getItem('cafefiro_wish_v1'))||[];}catch(e){return [];} })();
function saveWish(){ localStorage.setItem('cafefiro_wish_v1', JSON.stringify(wishlist)); }
function inWish(id){ return wishlist.includes(id); }
function toggleWish(id){
  if(inWish(id)){ wishlist=wishlist.filter(x=>x!==id); toast('Removed from wishlist'); }
  else { wishlist.unshift(id); toast('♥ Saved to wishlist'); }
  saveWish(); syncWishUI();
}
function syncWishUI(){
  $$('[data-wish]').forEach(b=>b.classList.toggle('on', inWish(b.dataset.wish)));
  if(window.CFAuth && window.CFAuth.refreshWishlist) window.CFAuth.refreshWishlist();
}

/* ===== Coupon ===== */
let coupon = localStorage.getItem('cafefiro_coupon_v1') || null;
function setCoupon(code){ coupon=code; if(code) localStorage.setItem('cafefiro_coupon_v1',code); else localStorage.removeItem('cafefiro_coupon_v1'); }
function couponDiscount(sub){
  if(!coupon || !window.COUPONS[coupon]) return 0;
  const c=window.COUPONS[coupon];
  if(sub < c.min) return 0;
  if(c.type==='flat') return Math.min(c.value, sub);
  if(c.type==='pct') return Math.min(Math.round(sub*c.value/100), c.cap||Infinity);
  return 0;
}
function couponFreeShip(){ return coupon && window.COUPONS[coupon] && window.COUPONS[coupon].type==='ship'; }

/* ===== Helpers ===== */
const rs = n => '₹'+Number(n).toLocaleString('en-IN');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const FREE_SHIP_AT = 399;
function stars(r){ const f=Math.round(r); return '★★★★★'.slice(0,f)+'☆☆☆☆☆'.slice(0,5-f); }

/* ===== Render product grid ===== */
let gridState = { filter:'All', q:'', sort:'featured' };
function renderGrid(){
  const grid = $('#grid');
  let list = gridState.filter==='All' ? PRODUCTS.slice() : PRODUCTS.filter(p=>p.cat===gridState.filter);
  const q = gridState.q.trim().toLowerCase();
  if(q) list = list.filter(p=>(p.name+' '+p.sub+' '+p.cat+' '+(p.tagline||'')+' '+(p.diet||'')).toLowerCase().includes(q));
  const s = gridState.sort;
  if(s==='price-lo') list.sort((a,b)=>a.price-b.price);
  else if(s==='price-hi') list.sort((a,b)=>b.price-a.price);
  else if(s==='rating') list.sort((a,b)=>b.rating-a.rating);
  else if(s==='popular') list.sort((a,b)=>b.reviews-a.reviews);
  $('#gridCount').textContent = list.length+' product'+(list.length===1?'':'s');
  if(list.length===0){ grid.innerHTML=`<div class="grid-empty">No products match “${gridState.q}”. <button class="link-btn" id="clearSearch">Clear search</button></div>`; const cs=$('#clearSearch'); if(cs) cs.onclick=()=>{ gridState.q=''; $('#searchInput').value=''; renderGrid(); }; return; }
  grid.innerHTML = list.map(p=>`
    <article class="card reveal" data-cat="${p.cat}" data-pdp="${p.id}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="card-tag">${p.cat}</span>
        <button class="wish-btn ${inWish(p.id)?'on':''}" data-wish="${p.id}" aria-label="Save to wishlist">♥</button>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-rate"><span class="rstars">${stars(p.rating)}</span><span class="rnum">${p.rating} · ${p.reviews} reviews</span></div>
        <p class="card-tagline">${p.tagline}</p>
        <div class="card-foot">
          <div class="price"><span class="now">${rs(p.price)}</span><span class="was">${rs(p.mrp)}</span><span class="wt">${p.weight}</span></div>
          <button class="add-btn" data-add="${p.id}">＋ Add</button>
        </div>
      </div>
    </article>`).join('');
  observeReveals();
}

/* ===== Render kit thumbnails ===== */
function renderKit(){
  $('#kitValue').textContent = rs(kitValue);
  $('#kitSave').textContent = 'Save '+rs(kitValue-KIT.price)+' ('+Math.round((1-KIT.price/kitValue)*100)+'% off)';
  $('#kitThumbs').innerHTML = KIT.items.map(id=>{
    const p=P[id];
    return `<div class="kit-thumb"><img src="${p.img}" alt="${p.name}"><span class="qn">${p.name}<br><em>${halfWeight(p.weight)}</em></span></div>`;
  }).join('');
}

/* ===== Cart ops ===== */
function addToCart(id, qty=1, subFreq){
  const e = cart[id] || {qty:0, subFreq:null};
  e.qty += qty;
  if(subFreq!==undefined) e.subFreq = subFreq;
  cart[id] = e;
  save(); syncCart();
  const label = id==='sample-kit' ? 'Sample Kit' : (window.BUNDLE&&window.BUNDLE[id] ? window.BUNDLE[id].name : P[id].name);
  toast(`${label} added to cart`);
}
function addGiftCard(data){
  const key = 'gift:'+Date.now().toString(36);
  cart[key] = {qty:1, subFreq:null, gift:data};
  save(); syncCart();
  toast(`Gift card (${rs(data.amount)}) added to cart`);
}
function setQty(id, q){
  if(q<=0){ delete cart[id]; } else { cart[id] = cart[id]||{qty:0,subFreq:null}; cart[id].qty=q; }
  save(); syncCart();
}
function setSub(id, subFreq){ if(cart[id]){ cart[id].subFreq = subFreq; save(); syncCart(); } }
function cartCount(){ return Object.values(cart).reduce((a,e)=>a+(e.qty||0),0); }
function lineItems(){
  return Object.entries(cart).map(([id,e])=>{
    const qty=e.qty, subFreq=e.subFreq||null;
    let base, name, meta, img, isKit=false, isBundle=false, isGift=false, gift=null;
    if(id.startsWith('gift:')){ gift=e.gift||{}; base=gift.amount||0; name='e-Gift Card'; meta='To '+(gift.to||'a friend'); img=null; isGift=true; }
    else if(id==='sample-kit'){ base=KIT.price; name=KIT.name; meta='8 half-size packs · welcome offer'; img=P[KIT.items[0]].img; isKit=true; }
    else if(window.BUNDLE && window.BUNDLE[id]){ const b=window.BUNDLE[id]; base=b.price; name=b.name; meta=b.items.length+' products · bundle'; img=b.img; isBundle=true; }
    else { const p=P[id]; base=p.price; name=p.name; meta=p.sub+' · '+p.weight; img=p.img; }
    const price = subFreq ? Math.round(base*(1-SUB_RATE)) : base;
    return {id, qty, subFreq, name, meta, basePrice:base, price, img, isKit, isBundle, isGift, gift};
  });
}
function grossSubtotal(){ return lineItems().reduce((s,l)=>s+l.basePrice*l.qty,0); }
function subSavings(){ return lineItems().reduce((s,l)=>s+(l.basePrice-l.price)*l.qty,0); }
function subtotal(){ return lineItems().reduce((s,l)=>s+l.price*l.qty,0); }
function hasSubscription(){ return lineItems().some(l=>l.subFreq); }

/* ===== Sync UI ===== */
function syncCart(){
  const c = cartCount();
  $('#cartCount').textContent = c;
  $('#cartCount').style.display = c>0 ? 'grid' : 'none';
  renderDrawer();
}
function renderDrawer(){
  const body = $('#drawerBody'), foot = $('#drawerFoot');
  const items = lineItems();
  if(items.length===0){
    body.innerHTML = `<div class="empty"><div class="em">🛒</div><b>Your cart is empty</b><p>Add a premix or grab the ₹499 Sample Kit to get started.</p></div>`;
    foot.style.display='none';
    return;
  }
  foot.style.display='block';
  body.innerHTML = items.map(l=>{
    const subPick = `<div class="line-sub">
        <label class="sub-toggle"><input type="checkbox" data-subtog="${l.id}" ${l.subFreq?'checked':''}> Subscribe & Save 15%</label>
        ${l.subFreq?`<select class="sub-freq" data-subfreq="${l.id}">${Object.entries(SUB_FREQ).map(([c,la])=>`<option value="${c}" ${l.subFreq===c?'selected':''}>${la}</option>`).join('')}</select>`:''}
      </div>`;
    if(l.isGift){
      const g=l.gift||{};
      return `<div class="line gift-line">
        <div class="line-img gift-thumb"><span>🎁</span></div>
        <div class="line-info">
          <span class="badge gift">e-GIFT CARD</span>
          <h4>${rs(l.price)} Gift Card</h4>
          <div class="ls">To ${g.to||'a friend'}${g.date?` · sends ${new Date(g.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}`:''}</div>
          <div class="line-bot">
            <div class="line-price" style="margin-left:auto">${rs(l.price)}</div>
          </div>
          <button class="remove" data-rm="${l.id}" style="margin-top:6px">Remove</button>
        </div>
      </div>`;
    }
    if(l.isKit){
      return `<div class="line kit-line">
        <div class="line-img"><img src="${l.img}" alt=""></div>
        <div class="line-info">
          <span class="badge">SAMPLE KIT</span>
          <h4>${l.name}</h4>
          <div class="ls">${l.meta}</div>
          <div class="line-bot">
            <div class="qty"><button data-dec="${l.id}">−</button><span>${l.qty}</span><button data-inc="${l.id}">＋</button></div>
            <div class="line-price">${rs(l.price*l.qty)}</div>
          </div>
          <button class="remove" data-rm="${l.id}" style="margin-top:6px">Remove</button>
        </div>
      </div>`;
    }
    const badge = l.isBundle ? `<span class="badge bundle">BUNDLE</span>` : '';
    return `<div class="line${l.isBundle?' kit-line':''}">
      <div class="line-img"><img src="${l.img}" alt=""></div>
      <div class="line-info">
        ${badge}
        <h4>${l.name}</h4>
        <div class="ls">${l.meta}${l.subFreq?` · <b class="sub-tag">↻ ${subFreqLabel(l.subFreq)}</b>`:''}</div>
        ${l.isKit||l.isBundle?'':subPick}
        <div class="line-bot">
          <div class="qty"><button data-dec="${l.id}">−</button><span>${l.qty}</span><button data-inc="${l.id}">＋</button></div>
          <div class="line-price">${l.subFreq?`<span class="lp-was">${rs(l.basePrice*l.qty)}</span> `:''}${rs(l.price*l.qty)}</div>
        </div>
        <button class="remove" data-rm="${l.id}" style="margin-top:6px">Remove</button>
      </div>
    </div>`;
  }).join('');

  const gross = grossSubtotal();
  const sub = subtotal();
  const ssave = subSavings();
  const ship = shippingFor(sub);
  const disc = couponDiscount(sub);
  // free-shipping progress bar (only when there are physical items)
  const remain = Math.max(0, FREE_SHIP_AT - sub);
  const pct = Math.min(100, Math.round(sub/FREE_SHIP_AT*100));
  const bar = !hasPhysical() ? '' : ((ship===0)
    ? `<div class="ship-bar done"><div class="ship-msg">🎉 You've unlocked <b>FREE shipping!</b></div><div class="track"><i style="width:100%"></i></div></div>`
    : `<div class="ship-bar"><div class="ship-msg">Add <b>${rs(remain)}</b> more for <b>FREE shipping</b></div><div class="track"><i style="width:${pct}%"></i></div></div>`);
  if(bar) body.insertAdjacentHTML('afterbegin', bar);

  const afterDisc = sub - disc + ship;
  const gApplied = giftApplied(afterDisc);
  const total = afterDisc - gApplied;
  const couponRow = coupon && window.COUPONS[coupon] && disc>0
    ? `<div class="sumrow"><span>Coupon <b class="cpill">${coupon}</b> <button class="cpx" id="rmCoupon">✕</button></span><span class="ship-free">−${rs(disc)}</span></div>`
    : (couponFreeShip() ? `<div class="sumrow"><span>Coupon <b class="cpill">${coupon}</b> <button class="cpx" id="rmCoupon">✕</button></span><span class="ship-free">Free ship</span></div>` : '');
  const subRow = ssave>0 ? `<div class="sumrow"><span>↻ Subscribe & Save</span><span class="ship-free">−${rs(ssave)}</span></div>` : '';
  const giftRow = gApplied>0 ? `<div class="sumrow"><span>🎁 Gift card <b class="cpill">${redeemedGift}</b> <button class="cpx" id="rmGift">✕</button></span><span class="ship-free">−${rs(gApplied)}</span></div>` : '';
  foot.innerHTML = `
    <div class="coupon-box">
      <input id="couponInput" placeholder="Promo or gift card code" value="">
      <button class="btn btn-sm btn-ghost" id="applyCoupon">Apply</button>
    </div>
    <div class="coupon-hint">Promo: <b>WELCOME50</b> · <b>FIRO10</b> · Gift card: <b>CAFE-GIFT-500</b></div>
    <div class="sumrow"><span>Subtotal</span><span>${rs(gross)}</span></div>
    ${subRow}
    ${couponRow}
    ${hasPhysical()?`<div class="sumrow"><span>Shipping</span><span class="${ship===0?'ship-free':''}">${ship===0?'FREE':rs(ship)}</span></div>`:''}
    ${giftRow}
    <div class="sumrow total"><span>Total</span><span>${rs(total)}</span></div>
    <button class="btn btn-primary btn-block" id="checkoutBtn">Proceed to Checkout →</button>
    <p style="text-align:center;font-size:.78rem;color:var(--ink-soft);margin-top:10px">🔒 Secure checkout · COD available</p>`;
  const ai=$('#applyCoupon'); if(ai) ai.onclick=()=>applyCode($('#couponInput').value);
  const ci=$('#couponInput'); if(ci) ci.onkeydown=e=>{ if(e.key==='Enter') applyCode(ci.value); };
  const rc=$('#rmCoupon'); if(rc) rc.onclick=()=>{ setCoupon(null); renderDrawer(); toast('Coupon removed'); };
  const rg=$('#rmGift'); if(rg) rg.onclick=()=>{ setRedeemedGift(null); renderDrawer(); toast('Gift card removed'); };
  // subscribe & save toggles
  $$('#drawerBody [data-subtog]').forEach(t=>t.onchange=()=>setSub(t.dataset.subtog, t.checked?'1m':null));
  $$('#drawerBody [data-subfreq]').forEach(s=>s.onchange=()=>setSub(s.dataset.subfreq, s.value));
}
function hasPhysical(){ return lineItems().some(l=>!l.isGift); }
function shippingFor(sub){ if(!hasPhysical()) return 0; return (sub>=FREE_SHIP_AT || cart['sample-kit'] || couponFreeShip()) ? 0 : 49; }
/* unified code box: try coupon, then gift card */
function applyCode(code){
  code=(code||'').trim().toUpperCase();
  if(!code) return;
  if(window.COUPONS[code]) return applyCoupon(code);
  const g=getGiftCards();
  if(g[code]){
    if(g[code].balance<=0){ toast('This gift card has no balance left'); return; }
    setRedeemedGift(code); renderDrawer(); toast(`✓ Gift card applied · ${rs(g[code].balance)} balance`); return;
  }
  toast('Invalid promo or gift card code');
}
function applyCoupon(code){
  code=(code||'').trim().toUpperCase();
  if(!code) return;
  const c=window.COUPONS[code];
  if(!c){ toast('Invalid promo code'); return; }
  if(subtotal()<c.min){ toast(`Add ${rs(c.min-subtotal())} more to use ${code}`); return; }
  setCoupon(code); renderDrawer(); toast(`✓ ${code} applied — ${c.label}`);
}

/* ===== Drawer open/close ===== */
function openDrawer(){ $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow='hidden'; }
function closeDrawer(){ $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); document.body.style.overflow=''; }

/* ===== Checkout ===== */
function openCheckout(){
  if(cartCount()===0) return;
  renderCheckout();
  $('#modalScrim').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCheckout(){ $('#modalScrim').classList.remove('open'); document.body.style.overflow=''; }
function renderCheckout(){
  const items = lineItems();
  const sub = subtotal();
  const ship = shippingFor(sub);
  const disc = couponDiscount(sub);
  const afterDisc = sub - disc + ship;
  const gApplied = giftApplied(afterDisc);
  const total = afterDisc - gApplied;
  const physical = hasPhysical();
  const u = window.CFAuth && window.CFAuth.currentUser();
  const book = (u && u.addresses && u.addresses.length) ? u.addresses : (u && u.address ? [u.address] : []);
  const a = book[0] || {};
  const guestBanner = u ? '' : `<div class="co-login">Have an account? <a id="coLogin">Log in</a> for faster checkout.</div>`;
  const addrPicker = (physical && book.length) ? `
      <div class="addr-picker" id="addrPicker">
        ${book.map((ad,i)=>`<button class="addr-chip ${i===0?'sel':''}" data-ai="${i}"><b>${ad.label||'Address '+(i+1)}</b><span>${ad.addr}, ${ad.city} – ${ad.pin}</span></button>`).join('')}
        <button class="addr-chip new" data-ai="new">＋ New address</button>
      </div>` : '';
  const addrFields = physical ? `
      <div class="field"><label>Address</label><input id="f-addr" placeholder="Flat / House, Street, Area" value="${a.addr||''}"></div>
      <div class="frow">
        <div class="field"><label>City</label><input id="f-city" placeholder="Mumbai" value="${a.city||''}"></div>
        <div class="field"><label>Pincode</label>
          <div class="pin-row"><input id="f-pin" placeholder="400001" maxlength="6" value="${a.pin||''}"><button type="button" class="pin-check" id="pinCheck">Check</button></div>
        </div>
      </div>
      <div class="pin-result" id="pinResult"></div>` : `<div class="co-login">🎁 Digital gift card — delivered by email, no shipping needed.</div>`;
  $('#modal').innerHTML = `
    <button class="modal-close" id="modalClose">✕</button>
    <div class="checkout-form">
      <h3>Checkout</h3>
      <p class="sub">${u?'Logged in as '+u.email+' — details prefilled.':'Demo checkout — no real payment is taken.'}</p>
      ${guestBanner}
      ${addrPicker}
      <div class="field"><label>Full name</label><input id="f-name" placeholder="Priya Sharma" value="${u?u.name:''}"></div>
      <div class="frow">
        <div class="field"><label>Phone</label><input id="f-phone" placeholder="98765 43210" value="${u?(a.phone||u.phone):''}"></div>
        <div class="field"><label>Email</label><input id="f-email" placeholder="priya@email.com" value="${u?u.email:''}"></div>
      </div>
      ${addrFields}
      <label style="font-weight:700;font-size:.82rem;display:block;margin:10px 0 8px">Payment method</label>
      <div class="pay-rows" id="payRows">
        <div class="pay-opt sel" data-pay="upi"><div class="dot"></div><b>UPI / GPay / PhonePe</b><span>Instant</span></div>
        <div class="pay-opt" data-pay="card"><div class="dot"></div><b>Credit / Debit Card</b><span>Secure</span></div>
        ${physical?`<div class="pay-opt" data-pay="cod"><div class="dot"></div><b>Cash on Delivery</b><span>+₹0</span></div>`:''}
      </div>
      <button class="btn btn-primary btn-block" id="placeOrder">Place Order · ${rs(total)}</button>
    </div>
    <div class="checkout-side">
      <h4>Order Summary</h4>
      ${items.map(l=>`<div class="co-line">${l.isGift?'<div class="co-gift">🎁</div>':`<img src="${l.img}" alt="">`}<div class="ci"><b>${l.isGift?rs(l.price)+' Gift Card':l.name}</b><span>${l.isGift?'To '+(l.gift.to||'a friend'):'Qty '+l.qty+(l.subFreq?' · ↻ '+subFreqLabel(l.subFreq):(l.isKit?' · 8 half-size packs':''))}</span></div><div class="cp">${rs(l.price*l.qty)}</div></div>`).join('')}
      <div class="co-sum">
        <div class="r"><span>Subtotal</span><span>${rs(grossSubtotal())}</span></div>
        ${subSavings()>0?`<div class="r"><span>↻ Subscribe & Save</span><span>−${rs(subSavings())}</span></div>`:''}
        ${disc>0?`<div class="r"><span>Coupon ${coupon}</span><span>−${rs(disc)}</span></div>`:''}
        ${physical?`<div class="r"><span>Shipping</span><span>${ship===0?'FREE':rs(ship)}</span></div>`:''}
        ${gApplied>0?`<div class="r"><span>🎁 Gift card ${redeemedGift}</span><span>−${rs(gApplied)}</span></div>`:''}
        <div class="r tot"><span>Total</span><span>${rs(total)}</span></div>
      </div>
      ${hasSubscription()?`<p class="co-subnote">↻ Includes a subscription — delivered automatically at your chosen frequency. Pause or cancel anytime.</p>`:''}
    </div>`;
  $('#modalClose').onclick = closeCheckout;
  const cl = $('#coLogin'); if(cl) cl.onclick = ()=>{ closeCheckout(); setTimeout(()=>window.CFAuth.openAuth('login'),260); };
  $('#payRows').onclick = e=>{
    const opt = e.target.closest('.pay-opt'); if(!opt) return;
    $$('.pay-opt').forEach(o=>o.classList.remove('sel')); opt.classList.add('sel');
  };
  // address picker
  const ap=$('#addrPicker'); if(ap) ap.onclick=e=>{
    const chip=e.target.closest('.addr-chip'); if(!chip) return;
    $$('.addr-chip').forEach(c=>c.classList.remove('sel')); chip.classList.add('sel');
    if(chip.dataset.ai==='new'){ ['f-addr','f-city','f-pin'].forEach(id=>$('#'+id).value=''); $('#pinResult').className='pin-result'; $('#pinResult').textContent=''; return; }
    const ad=book[+chip.dataset.ai]; $('#f-addr').value=ad.addr; $('#f-city').value=ad.city; $('#f-pin').value=ad.pin; if(ad.phone)$('#f-phone').value=ad.phone;
  };
  // pincode check (only present for physical orders)
  const pc=$('#pinCheck'); if(pc) pc.onclick = checkPincode;
  const fp=$('#f-pin'); if(fp) fp.addEventListener('keyup', e=>{ if(fp.value.length===6) checkPincode(); });
  $('#placeOrder').onclick = placeOrder;
}
function checkPincode(){
  const pin=($('#f-pin').value||'').trim();
  const el=$('#pinResult');
  if(!/^\d{6}$/.test(pin)){ el.className='pin-result err'; el.textContent='Enter a valid 6-digit pincode.'; return false; }
  // demo logic: a few pins are non-serviceable
  const blocked=['190001','737101','744101','796001'];
  if(blocked.includes(pin)){ el.className='pin-result err'; el.textContent='✕ Sorry, we don’t deliver to '+pin+' yet.'; return false; }
  const days = 3 + (parseInt(pin[5],10)%4);
  const cod = parseInt(pin[5],10)%5!==0;
  el.className='pin-result ok';
  el.innerHTML=`✓ Delivers to <b>${pin}</b> in <b>${days}–${days+2} days</b>. ${cod?'Cash on Delivery available.':'Prepaid only at this pincode.'}`;
  return true;
}
function placeOrder(){
  const physical = hasPhysical();
  if(physical){ if(!checkPincode()){ toast('Please check delivery pincode'); const fp=$('#f-pin'); if(fp) fp.focus(); return; } }
  const oid = 'CF'+Math.floor(100000+Math.random()*900000);
  const items = lineItems();
  const sub = subtotal();
  const ship = shippingFor(sub);
  const disc = couponDiscount(sub);
  const afterDisc = sub - disc + ship;
  const gApplied = giftApplied(afterDisc);
  const customer = {
    name:($('#f-name')||{}).value||'', phone:($('#f-phone')||{}).value||'', email:($('#f-email')||{}).value||'',
    addr:($('#f-addr')||{}).value||'', city:($('#f-city')||{}).value||'', pin:($('#f-pin')||{}).value||'',
    pay:(document.querySelector('.pay-opt.sel')||{dataset:{}}).dataset.pay||'upi'
  };
  // issue purchased gift cards
  const issued=[];
  const gc=getGiftCards();
  items.filter(l=>l.isGift).forEach(l=>{
    const code='CAFE-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.floor(100+Math.random()*900);
    gc[code]={balance:l.price, amount:l.price, to:l.gift.to, from:l.gift.from, msg:l.gift.msg, issued:new Date().toISOString()};
    issued.push({code, amount:l.price, to:l.gift.to});
  });
  // redeem applied gift card balance
  if(gApplied>0 && redeemedGift && gc[redeemedGift]){ gc[redeemedGift].balance = Math.max(0, gc[redeemedGift].balance - gApplied); }
  saveGiftCards(gc);
  const order = {oid, date:new Date().toISOString(), items:items.map(l=>({name:l.isGift?rs(l.price)+' Gift Card':l.name,qty:l.qty,price:l.price,isKit:l.isKit,isGift:l.isGift,subFreq:l.subFreq||null})), subtotal:sub, discount:disc, coupon:disc>0?coupon:null, giftUsed:gApplied||0, ship, total:afterDisc-gApplied, hasSub:hasSubscription()};
  if(window.CFAuth) window.CFAuth.recordOrder(order, customer);
  const u = window.CFAuth && window.CFAuth.currentUser();
  const giftBlock = issued.length ? `<div class="issued-gifts"><b>🎁 Gift card${issued.length>1?'s':''} issued</b>${issued.map(g=>`<div class="ig-row"><span>To ${g.to||'a friend'} · ${rs(g.amount)}</span><code>${g.code}</code></div>`).join('')}<p>We've emailed ${issued.length>1?'them':'it'} to your recipient${issued.length>1?'s':''}. You can also redeem in cart with the code above.</p></div>` : '';
  $('#modal').innerHTML = `<div class="success">
    <div class="check">✓</div>
    <h3>Order Confirmed!</h3>
    <div class="oid">Order ID · ${oid}</div>
    <p>Thank you${customer.name?', '+customer.name.split(' ')[0]:''}! ${physical?`Your kebabs-in-a-pouch are on the way — you'll get an SMS & email with tracking shortly.`:`Your gift is ready to delight someone special.`}</p>
    ${giftBlock}
    ${u?`<p style="font-size:.86rem">Saved to <b>My Orders</b>. Easy to cook. Delicious to share. 🌿</p>`:`<p style="font-size:.86rem">Easy to cook. Delicious to share. 🌿</p>`}
    <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;justify-content:center">
      ${(u&&physical)?`<button class="btn btn-primary" id="trackBtn">🚚 Track Order</button>`:''}
      <button class="btn btn-ember" id="doneBtn">Continue Shopping</button>
    </div>
  </div>`;
  cart = {}; setCoupon(null); setRedeemedGift(null); save(); syncCart();
  $('#doneBtn').onclick = ()=>{ closeCheckout(); };
  const tb=$('#trackBtn'); if(tb) tb.onclick=()=>{ closeCheckout(); setTimeout(()=>window.CFTrack&&window.CFTrack.open(oid),200); };
}

/* ===== Toast ===== */
let toastT;
function toast(msg){
  const t = $('#toast');
  t.innerHTML = `<span class="t-ic">✓</span> ${msg}`;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ===== Reveal on scroll ===== */
let io;
function observeReveals(){
  if(!io){
    io = new IntersectionObserver((ents)=>{
      ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  }
  $$('.reveal:not(.in)').forEach(el=>io.observe(el));
}

/* ===== Wire up ===== */
document.addEventListener('click', e=>{
  const wish = e.target.closest('[data-wish]');
  if(wish){ e.stopPropagation(); toggleWish(wish.dataset.wish); return; }
  const add = e.target.closest('[data-add]');
  if(add){ e.stopPropagation(); addToCart(add.dataset.add); add.classList.add('added'); add.textContent='✓ Added'; setTimeout(()=>{add.classList.remove('added');add.textContent='＋ Add';},1100); return; }
  if(e.target.closest('[data-inc]')){ const id=e.target.closest('[data-inc]').dataset.inc; setQty(id,(cart[id]?cart[id].qty:0)+1); return; }
  if(e.target.closest('[data-dec]')){ const id=e.target.closest('[data-dec]').dataset.dec; setQty(id,(cart[id]?cart[id].qty:0)-1); return; }
  if(e.target.closest('[data-rm]')){ setQty(e.target.closest('[data-rm]').dataset.rm,0); return; }
  if(e.target.closest('#checkoutBtn')){ closeDrawer(); setTimeout(()=>{ if(window.CFCoupons) window.CFCoupons.openRewards(openCheckout); else openCheckout(); },260); return; }
  const pdp = e.target.closest('[data-pdp]');
  if(pdp && window.CFPDP){ window.CFPDP.open(pdp.dataset.pdp); return; }
});

document.addEventListener('DOMContentLoaded', ()=>{
  renderGrid();
  renderKit();
  if(window.CFBundles) window.CFBundles.render();
  if(window.CFRecipes) window.CFRecipes.render();
  syncCart();
  observeReveals();

  // filters
  $('#filters').addEventListener('click', e=>{
    const f = e.target.closest('.filter'); if(!f) return;
    $$('.filter').forEach(x=>x.classList.remove('active')); f.classList.add('active');
    gridState.filter = f.dataset.filter; renderGrid();
  });
  // search
  const si=$('#searchInput'); if(si) si.addEventListener('input', ()=>{ gridState.q=si.value; renderGrid(); });
  // sort
  const so=$('#sortSelect'); if(so) so.addEventListener('change', ()=>{ gridState.sort=so.value; renderGrid(); });

  // cart drawer
  $('#openCart').onclick = openDrawer;
  $('#closeDrawer').onclick = closeDrawer;
  $('#scrim').onclick = closeDrawer;
  $('#modalScrim').onclick = e=>{ if(e.target===$('#modalScrim')) closeCheckout(); };

  // kit add
  $('#addKit').onclick = ()=>{ addToCart('sample-kit'); openDrawer(); };
  $$('[data-scroll]').forEach(b=> b.onclick = ()=> document.querySelector(b.dataset.scroll).scrollIntoView({behavior:'smooth'}) );

  // newsletter
  $('#newsForm').addEventListener('submit', e=>{ e.preventDefault(); e.target.reset(); toast('Subscribed! Welcome to the table 🌿'); });

  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeDrawer(); closeCheckout(); } });
});
