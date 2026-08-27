/* ===== CafeFiro — Partner Coupons / Rewards ===== */
(function(){
  // Coupons redeemable on PARTNER websites (cross-brand perks for CafeFiro shoppers)
  const PARTNERS=[
    {amount:100, threshold:750, code:'CAFE-FB100', partner:'FreshBasket', cat:'Groceries & Staples', emoji:'🧺', min:499, days:30, color:'#2E7D5B', url:'https://www.example.com/freshbasket', desc:'₹100 off fresh produce & pantry staples.'},
    {amount:200, threshold:1250, code:'CAFE-BH200', partner:'BrewHouse Coffee', cat:'Beverages', emoji:'☕', min:600, days:30, color:'#7B4A2C', url:'https://www.example.com/brewhouse', desc:'₹200 off artisan coffee, chai & teaware.'},
    {amount:500, threshold:2500, code:'CAFE-HW500', partner:'Hearthware Cookware', cat:'Kitchen & Appliances', emoji:'🍳', min:1500, days:45, color:'#B0242A', url:'https://www.example.com/hearthware', desc:'₹500 off pans, air-fryers & cookware.'},
  ];
  const CLAIM_KEY='cafefiro_partner_claimed_v1';
  const claimed=()=>{ try{return JSON.parse(localStorage.getItem(CLAIM_KEY))||[];}catch(e){return [];} };
  const setClaimed=a=>localStorage.setItem(CLAIM_KEY, JSON.stringify(a));
  const validTill=days=>{ const d=new Date(Date.now()+days*864e5); return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); };

  function card(c, cartVal){
    const unlocked = cartVal >= c.threshold;
    const cl = claimed();
    const isC = cl.includes(c.code);
    const anyClaimed = cl.length>0;
    const need = Math.max(0, c.threshold - cartVal);
    let action;
    if(isC){
      action = `<div class="pc-code">
          <code class="on">${c.code}</code>
          <button class="pc-claim" data-claim="${c.code}">📋 Copy</button>
        </div>
        <a class="pc-redeem" href="${c.url}" target="_blank" rel="noopener">Redeem on ${c.partner} ↗</a>`;
    } else if(anyClaimed){
      action = `<div class="pc-used">✓ You've already claimed your coupon for this order — only one per customer.</div>`;
    } else if(unlocked){
      action = `<div class="pc-code">
          <code>XXXX-XXXX-XXX</code>
          <button class="pc-claim" data-claim="${c.code}">Claim code</button>
        </div>
        <a class="pc-redeem" href="${c.url}" target="_blank" rel="noopener">Redeem on ${c.partner} ↗</a>`;
    } else {
      action = `<div class="pc-locked">🔒 Add <b>₹${need.toLocaleString('en-IN')}</b> more to your cart to unlock this coupon.</div>`;
    }
    return `<div class="pc-card ${isC?'claimed':''} ${(!unlocked&&!isC)?'locked':''} ${(anyClaimed&&!isC)?'disabled':''}" style="--pc:${c.color}">
      <div class="pc-stub">
        <span class="pc-emoji">${(unlocked||isC)?c.emoji:'🔒'}</span>
        <span class="pc-amt">₹${c.amount}</span>
        <span class="pc-off">OFF</span>
      </div>
      <div class="pc-perf"></div>
      <div class="pc-main">
        <div class="pc-head"><b>${c.partner}</b><span>${c.cat}</span></div>
        <p class="pc-desc">${c.desc}</p>
        <div class="pc-meta">Unlocks on cart above ₹${c.threshold.toLocaleString('en-IN')} · Redeem on min. spend ₹${c.min.toLocaleString('en-IN')} · Valid till ${validTill(c.days)}</div>
        ${action}
      </div>
    </div>`;
  }
  function grid(cartVal){ const cv=(cartVal==null)?cartValue():cartVal; return `<div class="pc-grid">${PARTNERS.map(c=>card(c,cv)).join('')}</div>`; }
  function cartValue(){ try{ return typeof subtotal==='function' ? subtotal() : 0; }catch(e){ return 0; } }

  function wireGrid(root){
    if(!root) return;
    root.querySelectorAll('[data-claim]').forEach(b=>b.onclick=()=>{
      const code=b.dataset.claim;
      const cl=claimed();
      if(!cl.includes(code)){
        if(cl.length>0){ toast('Only one coupon can be claimed per customer'); return; }
        cl.push(code); setClaimed(cl);
      }
      if(navigator.clipboard) navigator.clipboard.writeText(code).catch(()=>{});
      toast('✓ '+code+' copied — use it on the partner site');
      // re-render whichever grid is open
      const host=b.closest('.pc-grid'); if(host){ host.outerHTML=grid(); wireGrid(b.closest('#rewardsCard')||b.closest('#contentCard')); }
    });
  }

  /* ---- interstitial after 'Proceed to Checkout' ---- */
  function openRewards(onContinue){
    $('#rewardsCard').innerHTML=`
      <button class="modal-close" id="rewardsClose" aria-label="Close">✕</button>
      <div class="rewards-body">
        <div class="rewards-spark">🎁</div>
        <span class="eyebrow" style="justify-content:center">CafeFiro Perks</span>
        <h2>You've unlocked partner coupons!</h2>
        <p class="rewards-sub">A little thank-you for shopping with us — claim these exclusive coupons to spend on our partner websites.</p>
        ${grid()}
        <button class="btn btn-primary btn-block" id="rewardsContinue">Continue to Checkout →</button>
        <button class="rewards-skip" id="rewardsSkip">View all perks later</button>
      </div>`;
    $('#rewardsScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#rewardsCard').scrollTop=0;
    wireGrid($('#rewardsCard'));
    const go=()=>{ closeRewards(); if(typeof onContinue==='function') setTimeout(onContinue,260); };
    $('#rewardsContinue').onclick=go;
    $('#rewardsClose').onclick=go;
    $('#rewardsSkip').onclick=go;
  }
  function closeRewards(){ $('#rewardsScrim').classList.remove('open'); document.body.style.overflow=''; }

  /* ---- dedicated page ---- */
  function openPage(){
    if(!window.CFContent) return;
    const html=`
      <p>Shopping with CafeFiro earns you exclusive coupons to use across our partner brands. Claim a code below and redeem it on the partner's website.</p>
      ${grid()}
      <p class="pc-note">Codes are single-use per customer and subject to each partner's terms. Partner links are illustrative for this demo.</p>`;
    window.CFContent.openHtml('Partner Perks', 'Coupons & Partner Offers', html);
    wireGrid($('#contentCard'));
  }

  window.CFCoupons={openRewards,openPage,closeRewards};
  document.addEventListener('DOMContentLoaded',()=>{
    const s=$('#rewardsScrim'); if(s) s.onclick=e=>{ if(e.target===s) closeRewards(); };
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeRewards(); });
    document.addEventListener('click',e=>{ const t=e.target.closest('[data-perks]'); if(t){ e.preventDefault(); openPage(); } });
  });
})();
