/* ===== CafeFiro — Gift Cards ===== */
(function(){
  const DENOMS=[250,500,1000,2000];
  const DESIGNS=[
    {id:'classic',name:'Classic',bg:'linear-gradient(135deg,#B0242A,#C77B2C)'},
    {id:'forest',name:'Forest',bg:'linear-gradient(135deg,#234B2E,#5C5A2E)'},
    {id:'festive',name:'Festive',bg:'linear-gradient(135deg,#8E1C20,#C77B2C 70%,#E9C77E)'},
  ];
  let state={amount:500,custom:'',to:'',toEmail:'',from:'',msg:'',date:'',design:'classic'};

  // seed a demo redeemable gift card so redemption is testable
  (function seed(){
    try{
      const g=JSON.parse(localStorage.getItem('cafefiro_giftcards_v1'))||{};
      if(!g['CAFE-GIFT-500']){ g['CAFE-GIFT-500']={balance:500,amount:500,to:'You',from:'CafeFiro',msg:'Welcome gift',issued:new Date().toISOString(),demo:true}; localStorage.setItem('cafefiro_giftcards_v1',JSON.stringify(g)); }
    }catch(e){}
  })();

  function curAmount(){ return state.custom!=='' ? Math.max(0,Math.min(10000,parseInt(state.custom,10)||0)) : state.amount; }

  function preview(){
    const d=DESIGNS.find(x=>x.id===state.design)||DESIGNS[0];
    return `<div class="gc-preview" style="background:${d.bg}">
        <div class="gc-top"><span class="gc-brand">CafeFiro</span><span class="gc-egift">e-Gift Card</span></div>
        <div class="gc-amt">${curAmount()?('₹'+curAmount().toLocaleString('en-IN')):'₹—'}</div>
        <div class="gc-names">
          <div><span>To</span><b>${state.to||'—'}</b></div>
          <div><span>From</span><b>${state.from||'—'}</b></div>
        </div>
        ${state.msg?`<p class="gc-msg">“${state.msg}”</p>`:''}
      </div>`;
  }

  function open(){
    render(); $('#giftScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#giftCard').scrollTop=0;
  }
  function close(){ $('#giftScrim').classList.remove('open'); document.body.style.overflow=''; }

  function render(){
    const today=new Date().toISOString().slice(0,10);
    $('#giftCard').innerHTML=`
      <button class="modal-close" id="giftClose">✕</button>
      <div class="gc-grid">
        <div class="gc-left">
          <span class="eyebrow">e-Gift Card</span>
          <h2>Gift the joy of cooking</h2>
          ${preview()}
          <div class="gc-designs" id="gcDesigns">
            ${DESIGNS.map(d=>`<button class="gc-design ${state.design===d.id?'sel':''}" data-design="${d.id}"><span style="background:${d.bg}"></span>${d.name}</button>`).join('')}
          </div>
        </div>
        <div class="gc-right">
          <label class="gc-label">Choose amount</label>
          <div class="gc-denoms" id="gcDenoms">
            ${DENOMS.map(d=>`<button class="gc-denom ${state.custom===''&&state.amount===d?'sel':''}" data-denom="${d}">₹${d.toLocaleString('en-IN')}</button>`).join('')}
            <div class="gc-custom ${state.custom!==''?'sel':''}"><span>₹</span><input id="gcCustom" type="number" min="100" max="10000" placeholder="Custom" value="${state.custom}"></div>
          </div>
          <div class="field"><label>Recipient's name</label><input id="gc-to" placeholder="e.g. Aunt Meera" value="${state.to}"></div>
          <div class="field"><label>Recipient's email</label><input id="gc-toEmail" type="email" placeholder="them@email.com" value="${state.toEmail}"></div>
          <div class="field"><label>Your name</label><input id="gc-from" placeholder="From you" value="${state.from}"></div>
          <div class="field"><label>Message <span class="opt">(optional)</span></label><textarea id="gc-msg" maxlength="140" placeholder="Add a personal note…">${state.msg}</textarea></div>
          <div class="field"><label>Send date</label><input id="gc-date" type="date" min="${today}" value="${state.date||today}"></div>
          <button class="btn btn-primary btn-block" id="gcAdd">Add to Cart · ₹${curAmount().toLocaleString('en-IN')}</button>
          <p class="gc-fine">Delivered by email on your chosen date. Redeemable on any order. Valid 12 months.</p>
        </div>
      </div>`;
    wire();
  }
  function wire(){
    $('#giftClose').onclick=close;
    $('#gcDenoms').onclick=e=>{ const b=e.target.closest('[data-denom]'); if(!b) return; state.amount=+b.dataset.denom; state.custom=''; render(); };
    const cust=$('#gcCustom'); if(cust) cust.oninput=()=>{ state.custom=cust.value; const add=$('#gcAdd'); if(add) add.textContent='Add to Cart · ₹'+curAmount().toLocaleString('en-IN'); updatePreviewLight(); $$('#gcDenoms .gc-denom').forEach(x=>x.classList.remove('sel')); $('#gcDenoms .gc-custom').classList.add('sel'); };
    $('#gcDesigns').onclick=e=>{ const b=e.target.closest('[data-design]'); if(!b) return; state.design=b.dataset.design; render(); };
    // live text fields update preview without full re-render
    [['gc-to','to'],['gc-toEmail','toEmail'],['gc-from','from'],['gc-msg','msg'],['gc-date','date']].forEach(([id,key])=>{
      const el=$('#'+id); if(el) el.oninput=()=>{ state[key]=el.value; updatePreviewLight(); };
    });
    $('#gcAdd').onclick=add;
  }
  function updatePreviewLight(){
    const host=$('.gc-left'); if(!host) return;
    const old=host.querySelector('.gc-preview'); if(old) old.outerHTML=preview();
  }
  function add(){
    const amount=curAmount();
    if(amount<100){ toast('Minimum gift amount is ₹100'); return; }
    if(!state.to){ toast('Please enter the recipient’s name'); $('#gc-to').focus(); return; }
    if(!/^\S+@\S+\.\S+$/.test(state.toEmail||'')){ toast('Please enter a valid recipient email'); $('#gc-toEmail').focus(); return; }
    addGiftCard({amount, to:state.to, toEmail:state.toEmail, from:state.from||'A friend', msg:state.msg, date:state.date||new Date().toISOString().slice(0,10), design:state.design});
    close();
    setTimeout(()=>openDrawer(),200);
    // reset
    state={amount:500,custom:'',to:'',toEmail:'',from:'',msg:'',date:'',design:'classic'};
  }

  window.CFGift={open,close};
  document.addEventListener('DOMContentLoaded',()=>{
    $('#giftScrim').onclick=e=>{ if(e.target===$('#giftScrim')) close(); };
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
    document.addEventListener('click',e=>{ const t=e.target.closest('[data-gift]'); if(t){ e.preventDefault(); open(); } });
  });
})();
