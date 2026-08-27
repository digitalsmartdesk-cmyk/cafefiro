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
// Sample kit packs are HALF the size of the regular pack
const halfWeight = w => (parseInt(w,10)/2) + 'g';
const kitValue = Math.round(KIT.items.reduce((s,id)=>s+P[id].price/2,0)/10)*10; // value of 8 half-size packs

/* ===== State ===== */
const LS_KEY = 'cafefiro_cart_v1';
let cart = load();
function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY))||{}; }catch(e){ return {}; } }
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(cart)); }

/* ===== Helpers ===== */
const rs = n => '₹'+Number(n).toLocaleString('en-IN');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ===== Render product grid ===== */
function renderGrid(filter='All'){
  const grid = $('#grid');
  const list = filter==='All' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p=>`
    <article class="card reveal" data-cat="${p.cat}">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="card-tag">${p.cat}</span>
        <span class="card-time">⏱ ${p.time}</span>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="card-sub">${p.sub} · ${p.weight}</div>
        <p class="card-tagline">${p.tagline}</p>
        <div class="card-foot">
          <div class="price"><span class="now">${rs(p.price)}</span><span class="was">${rs(p.mrp)}</span></div>
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
function addToCart(id, qty=1){
  cart[id] = (cart[id]||0)+qty;
  save(); syncCart();
  const label = id==='sample-kit' ? 'Sample Kit' : P[id].name;
  toast(`${label} added to cart`);
}
function setQty(id, q){
  if(q<=0) delete cart[id]; else cart[id]=q;
  save(); syncCart();
}
function cartCount(){ return Object.values(cart).reduce((a,b)=>a+b,0); }
function lineItems(){
  return Object.entries(cart).map(([id,qty])=>{
    if(id==='sample-kit') return {id, qty, name:KIT.name, sub:'8 half-size packs · welcome offer', price:KIT.price, img:P[KIT.items[0]].img, isKit:true};
    const p=P[id]; return {id, qty, name:p.name, sub:p.sub+' · '+p.weight, price:p.price, img:p.img, isKit:false};
  });
}
function subtotal(){ return lineItems().reduce((s,l)=>s+l.price*l.qty,0); }

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
    if(l.isKit){
      return `<div class="line kit-line">
        <div class="line-img"><img src="${l.img}" alt=""></div>
        <div class="line-info">
          <span class="badge">SAMPLE KIT</span>
          <h4>${l.name}</h4>
          <div class="ls">8 half-size packs · welcome offer</div>
          <div class="line-bot">
            <div class="qty">
              <button data-dec="${l.id}">−</button><span>${l.qty}</span><button data-inc="${l.id}">＋</button>
            </div>
            <div class="line-price">${rs(l.price*l.qty)}</div>
          </div>
          <button class="remove" data-rm="${l.id}" style="margin-top:6px">Remove</button>
        </div>
      </div>`;
    }
    return `<div class="line">
      <div class="line-img"><img src="${l.img}" alt=""></div>
      <div class="line-info">
        <h4>${l.name}</h4>
        <div class="ls">${l.sub}</div>
        <div class="line-bot">
          <div class="qty"><button data-dec="${l.id}">−</button><span>${l.qty}</span><button data-inc="${l.id}">＋</button></div>
          <div class="line-price">${rs(l.price*l.qty)}</div>
        </div>
        <button class="remove" data-rm="${l.id}" style="margin-top:6px">Remove</button>
      </div>
    </div>`;
  }).join('');

  const sub = subtotal();
  const ship = sub>=399 || cart['sample-kit'] ? 0 : 49;
  foot.innerHTML = `
    <div class="sumrow"><span>Subtotal</span><span>${rs(sub)}</span></div>
    <div class="sumrow"><span>Shipping</span><span class="${ship===0?'ship-free':''}">${ship===0?'FREE':rs(ship)}</span></div>
    <div class="sumrow total"><span>Total</span><span>${rs(sub+ship)}</span></div>
    <button class="btn btn-primary btn-block" id="checkoutBtn">Proceed to Checkout →</button>
    <p style="text-align:center;font-size:.78rem;color:var(--ink-soft);margin-top:10px">🔒 Secure checkout · COD available</p>`;
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
  const ship = sub>=399 || cart['sample-kit'] ? 0 : 49;
  $('#modal').innerHTML = `
    <button class="modal-close" id="modalClose">✕</button>
    <div class="checkout-form">
      <h3>Checkout</h3>
      <p class="sub">Demo checkout — no real payment is taken.</p>
      <div class="field"><label>Full name</label><input id="f-name" placeholder="Priya Sharma" value=""></div>
      <div class="frow">
        <div class="field"><label>Phone</label><input id="f-phone" placeholder="98765 43210"></div>
        <div class="field"><label>Email</label><input id="f-email" placeholder="priya@email.com"></div>
      </div>
      <div class="field"><label>Address</label><input id="f-addr" placeholder="Flat / House, Street, Area"></div>
      <div class="frow">
        <div class="field"><label>City</label><input id="f-city" placeholder="Mumbai"></div>
        <div class="field"><label>Pincode</label><input id="f-pin" placeholder="400001"></div>
      </div>
      <label style="font-weight:700;font-size:.82rem;display:block;margin:10px 0 8px">Payment method</label>
      <div class="pay-rows" id="payRows">
        <div class="pay-opt sel" data-pay="upi"><div class="dot"></div><b>UPI / GPay / PhonePe</b><span>Instant</span></div>
        <div class="pay-opt" data-pay="card"><div class="dot"></div><b>Credit / Debit Card</b><span>Secure</span></div>
        <div class="pay-opt" data-pay="cod"><div class="dot"></div><b>Cash on Delivery</b><span>+₹0</span></div>
      </div>
      <button class="btn btn-primary btn-block" id="placeOrder">Place Order · ${rs(sub+ship)}</button>
    </div>
    <div class="checkout-side">
      <h4>Order Summary</h4>
      ${items.map(l=>`<div class="co-line"><img src="${l.img}" alt=""><div class="ci"><b>${l.name}</b><span>Qty ${l.qty}${l.isKit?' · 8 half-size packs':''}</span></div><div class="cp">${rs(l.price*l.qty)}</div></div>`).join('')}
      <div class="co-sum">
        <div class="r"><span>Subtotal</span><span>${rs(sub)}</span></div>
        <div class="r"><span>Shipping</span><span>${ship===0?'FREE':rs(ship)}</span></div>
        <div class="r tot"><span>Total</span><span>${rs(sub+ship)}</span></div>
      </div>
    </div>`;
  $('#modalClose').onclick = closeCheckout;
  $('#payRows').onclick = e=>{
    const opt = e.target.closest('.pay-opt'); if(!opt) return;
    $$('.pay-opt').forEach(o=>o.classList.remove('sel')); opt.classList.add('sel');
  };
  $('#placeOrder').onclick = placeOrder;
}
function placeOrder(){
  const oid = 'CF'+Math.floor(100000+Math.random()*900000);
  $('#modal').innerHTML = `<div class="success">
    <div class="check">✓</div>
    <h3>Order Confirmed!</h3>
    <div class="oid">Order ID · ${oid}</div>
    <p>Thank you for choosing CafeFiro. Your kebabs-in-a-pouch are on the way — you'll get an SMS & email with tracking shortly.</p>
    <p style="font-size:.86rem">Easy to cook. Delicious to share. 🌿</p>
    <button class="btn btn-ember" id="doneBtn" style="margin-top:18px">Continue Shopping</button>
  </div>`;
  cart = {}; save(); syncCart();
  $('#doneBtn').onclick = ()=>{ closeCheckout(); };
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
  const add = e.target.closest('[data-add]');
  if(add){ addToCart(add.dataset.add); add.classList.add('added'); add.textContent='✓ Added'; setTimeout(()=>{add.classList.remove('added');add.textContent='＋ Add';},1100); return; }
  if(e.target.closest('[data-inc]')){ const id=e.target.closest('[data-inc]').dataset.inc; setQty(id,(cart[id]||0)+1); return; }
  if(e.target.closest('[data-dec]')){ const id=e.target.closest('[data-dec]').dataset.dec; setQty(id,(cart[id]||0)-1); return; }
  if(e.target.closest('[data-rm]')){ setQty(e.target.closest('[data-rm]').dataset.rm,0); return; }
  if(e.target.closest('#checkoutBtn')){ closeDrawer(); setTimeout(openCheckout,260); return; }
});

document.addEventListener('DOMContentLoaded', ()=>{
  renderGrid();
  renderKit();
  syncCart();
  observeReveals();

  // filters
  $('#filters').addEventListener('click', e=>{
    const f = e.target.closest('.filter'); if(!f) return;
    $$('.filter').forEach(x=>x.classList.remove('active')); f.classList.add('active');
    renderGrid(f.dataset.filter);
  });

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
