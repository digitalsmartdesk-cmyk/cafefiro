/* ===== CafeFiro — Product Detail Page overlay ===== */
(function(){
  let cur=null, qty=1, tab='overview', rdraft=5, mode='once';

  function open(id){ cur=P[id]; if(!cur) return; qty=1; tab='overview'; mode='once'; render(); $('#pdpScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#pdp').scrollTop=0; }
  function close(){ $('#pdpScrim').classList.remove('open'); document.body.style.overflow=''; }

  function revStats(id){
    const list=allReviews(id);
    const avg=list.reduce((s,r)=>s+r.rating,0)/(list.length||1);
    const dist=[0,0,0,0,0]; list.forEach(r=>dist[5-r.rating]++);
    return {list,avg:avg.toFixed(1),count:list.length,dist};
  }
  const fmtDate=d=>new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});

  function tabHtml(p){
    if(tab==='overview'){
      return `<div class="pdp-pane">
        <p class="pdp-desc">${p.desc}</p>
        <div class="pdp-facts">
          <div><span>Diet</span><b>${p.diet}</b></div>
          <div><span>Cook time</span><b>${p.time}</b></div>
          <div><span>Yield</span><b>${p.servings}</b></div>
          <div><span>Shelf life</span><b>${p.shelf}</b></div>
        </div>
        <div class="pdp-promise">
          <span>🌿 100% Vegetarian</span><span>🚫 No preservatives</span><span>🎨 No artificial colours</span><span>🇮🇳 Made in India</span>
        </div>
      </div>`;
    }
    if(tab==='nutrition'){
      const n=p.nutrition;
      return `<div class="pdp-pane">
        <h4>Ingredients</h4>
        <p class="pdp-ing">${p.ingredients}</p>
        <p class="pdp-allerg">⚠ ${p.allergens}</p>
        <h4 style="margin-top:22px">Nutrition <span class="per">per 100g (uncooked)</span></h4>
        <table class="nutri">
          <tr><td>Energy</td><td>${n.energy} kcal</td></tr>
          <tr><td>Protein</td><td>${n.protein} g</td></tr>
          <tr><td>Carbohydrate</td><td>${n.carb} g</td></tr>
          <tr><td>Total Fat</td><td>${n.fat} g</td></tr>
          <tr><td>Dietary Fibre</td><td>${n.fibre} g</td></tr>
        </table>
      </div>`;
    }
    if(tab==='cook'){
      return `<div class="pdp-pane">
        <ol class="cook-steps">${p.cook.map(s=>`<li>${s}</li>`).join('')}</ol>
        <div class="cook-tip">💡 Tip: For an air-fryer, brush lightly with oil and cook at 180°C, turning once.</div>
      </div>`;
    }
    // reviews
    const s=revStats(p.id);
    const u=window.CFAuth&&window.CFAuth.currentUser();
    const bars=s.dist.map((c,i)=>`<div class="rbar"><span>${5-i}★</span><div class="rt"><i style="width:${s.count?c/s.count*100:0}%"></i></div><em>${c}</em></div>`).join('');
    const writer = u
      ? `<div class="rev-write">
          <b>Write a review</b>
          <div class="star-pick" id="starPick">${[1,2,3,4,5].map(n=>`<span data-s="${n}" class="${n<=rdraft?'on':''}">★</span>`).join('')}</div>
          <textarea id="rText" placeholder="Share your experience…"></textarea>
          <button class="btn btn-ember btn-sm" id="rSubmit">Submit review</button>
        </div>`
      : `<div class="rev-login">Want to share your experience? <a id="revLogin">Log in</a> to write a review.</div>`;
    return `<div class="pdp-pane">
      <div class="rev-summary">
        <div class="rev-avg"><b>${s.avg}</b><div class="rstars">${stars(+s.avg)}</div><span>${s.count} reviews</span></div>
        <div class="rev-bars">${bars}</div>
      </div>
      ${writer}
      <div class="rev-list">
        ${s.list.map(r=>`<div class="rev"><div class="rev-top"><span class="rev-name">${r.name}</span>${r.verified?'<span class="verified">✓ Verified</span>':''}<span class="rev-date">${fmtDate(r.date)}</span></div><div class="rstars sm">${stars(r.rating)}</div><p>${r.text}</p></div>`).join('')}
      </div>
    </div>`;
  }

  function render(){
    const p=cur;
    const s=revStats(p.id);
    const rel=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
    const off=Math.round((1-p.price/p.mrp)*100);
    $('#pdp').innerHTML=`
      <button class="modal-close" id="pdpClose">✕</button>
      <div class="pdp-grid">
        <div class="pdp-media">
          <div class="pdp-img"><img src="${p.img}" alt="${p.name}"><button class="wish-btn lg ${inWish(p.id)?'on':''}" data-wish="${p.id}">♥</button>${off>0?`<span class="pdp-off">${off}% OFF</span>`:''}</div>
        </div>
        <div class="pdp-info">
          <div class="pdp-cat">${p.cat} · ${p.sub}</div>
          <h2>${p.name}</h2>
          <div class="pdp-rate"><span class="rstars">${stars(p.rating)}</span> <b>${s.avg}</b> <a class="rate-link" data-gtab="reviews">${s.count} reviews</a></div>
          <div class="pdp-price"><span class="now">${rs(p.price)}</span><span class="was">${rs(p.mrp)}</span><span class="wt">${p.weight} pack</span><span class="incl">(incl. of all taxes)</span></div>
          <div class="pdp-purchase" id="pdpPurchase">
            <label class="purchase-opt sel" data-mode="once"><span class="po-radio"></span><span class="po-text"><b>One-time purchase</b><span>${rs(p.price)}</span></span></label>
            <label class="purchase-opt" data-mode="sub"><span class="po-radio"></span><span class="po-text"><b>Subscribe &amp; Save 15%</b><span><s>${rs(p.price)}</s> ${rs(Math.round(p.price*0.85))} · deliver
              <select class="po-freq" id="pdpFreq" onclick="event.preventDefault()"><option value="1m">every month</option><option value="2w">every 2 weeks</option><option value="2m">every 2 months</option></select></span></span></label>
          </div>
          <div class="pdp-buy">
            <div class="qty big"><button id="qDec">−</button><span id="qVal">1</span><button id="qInc">＋</button></div>
            <button class="btn btn-primary" id="pdpAdd">Add to Cart · <span id="pdpTotal">${rs(p.price)}</span></button>
          </div>
          <button class="pdp-buynow" id="pdpBuy">⚡ Buy it now</button>
          <div class="pdp-mini">
            <input id="pdpPin" placeholder="Pincode" maxlength="6"><button id="pdpPinBtn">Check delivery</button>
          </div>
          <div class="pdp-mini-res" id="pdpPinRes"></div>
          <div class="pdp-tabs" id="pdpTabs">
            <button class="ptab ${tab==='overview'?'active':''}" data-gtab="overview">Overview</button>
            <button class="ptab ${tab==='nutrition'?'active':''}" data-gtab="nutrition">Ingredients & Nutrition</button>
            <button class="ptab ${tab==='cook'?'active':''}" data-gtab="cook">How to Cook</button>
            <button class="ptab ${tab==='reviews'?'active':''}" data-gtab="reviews">Reviews (${s.count})</button>
          </div>
          ${tabHtml(p)}
        </div>
      </div>
      <div class="pdp-rel">
        <h3>You may also like</h3>
        <div class="rel-grid">
          ${rel.map(r=>`<div class="rel-card" data-pdp="${r.id}"><div class="rel-img"><img src="${r.img}" alt="${r.name}"></div><b>${r.name}</b><div class="rel-foot"><span>${rs(r.price)}</span><button class="rel-add" data-add="${r.id}">＋ Add</button></div></div>`).join('')}
        </div>
      </div>`;
    wire();
  }

  function wire(){
    $('#pdpClose').onclick=close;
    $('#qDec').onclick=()=>{ qty=Math.max(1,qty-1); upQty(); };
    $('#qInc').onclick=()=>{ qty++; upQty(); };
    $('#pdpAdd').onclick=()=>{ addToCart(cur.id,qty, mode==='sub'?($('#pdpFreq').value||'1m'):null); };
    $('#pdpBuy').onclick=()=>{ addToCart(cur.id,qty, mode==='sub'?($('#pdpFreq').value||'1m'):null); close(); setTimeout(()=>{ openDrawer(); },200); };
    // purchase mode (one-time vs subscribe)
    const pp=$('#pdpPurchase'); if(pp) pp.onclick=e=>{
      const opt=e.target.closest('.purchase-opt'); if(!opt) return;
      if(e.target.classList.contains('po-freq')) return;
      mode=opt.dataset.mode;
      $$('#pdpPurchase .purchase-opt').forEach(o=>o.classList.toggle('sel',o===opt));
      upQty();
    };
    const ff=$('#pdpFreq'); if(ff) ff.onchange=()=>{}; // value read on add
    $('#pdpPinBtn').onclick=pdpPin;
    $('#pdpPin').addEventListener('keyup',e=>{ if($('#pdpPin').value.length===6) pdpPin(); });
    $$('#pdp [data-gtab]').forEach(b=>b.onclick=()=>{ tab=b.dataset.gtab; render(); document.querySelector('.pdp-tabs').scrollIntoView({behavior:'smooth',block:'nearest'}); });
    // reviews interactions
    const sp=$('#starPick'); if(sp) sp.onclick=e=>{ const s=e.target.closest('[data-s]'); if(!s)return; rdraft=+s.dataset.s; $$('#starPick span').forEach((x,i)=>x.classList.toggle('on',i<rdraft)); };
    const rs2=$('#rSubmit'); if(rs2) rs2.onclick=submitReview;
    const rl=$('#revLogin'); if(rl) rl.onclick=()=>{ window.CFAuth.openAuth('login'); };
  }
  function upQty(){
    $('#qVal').textContent=qty;
    const unit = mode==='sub' ? Math.round(cur.price*0.85) : cur.price;
    $('#pdpTotal').textContent=rs(unit*qty);
  }
  function pdpPin(){
    const pin=($('#pdpPin').value||'').trim(); const el=$('#pdpPinRes');
    if(!/^\d{6}$/.test(pin)){ el.className='pdp-mini-res err'; el.textContent='Enter a valid 6-digit pincode.'; return; }
    const blocked=['190001','737101','744101','796001'];
    if(blocked.includes(pin)){ el.className='pdp-mini-res err'; el.textContent='✕ Not serviceable at '+pin+' yet.'; return; }
    const days=3+(parseInt(pin[5],10)%4);
    el.className='pdp-mini-res ok'; el.innerHTML=`✓ Delivers in <b>${days}–${days+2} days</b> · COD ${parseInt(pin[5],10)%5!==0?'available':'not available'}`;
  }
  function submitReview(){
    const u=window.CFAuth&&window.CFAuth.currentUser(); if(!u) return;
    const text=($('#rText').value||'').trim();
    if(text.length<4){ toast('Please write a few words'); return; }
    if(!userReviews[cur.id]) userReviews[cur.id]=[];
    userReviews[cur.id].unshift({name:u.name,rating:rdraft,text,verified:true,date:new Date().toISOString()});
    saveUserReviews(); rdraft=5; tab='reviews'; render(); toast('★ Thanks for your review!');
  }

  window.CFPDP={open,close};
  document.addEventListener('DOMContentLoaded',()=>{
    $('#pdpScrim').onclick=e=>{ if(e.target===$('#pdpScrim')) close(); };
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  });
})();
