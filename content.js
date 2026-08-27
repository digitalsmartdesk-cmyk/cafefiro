/* ===== CafeFiro — Content pages (policies, FAQ, contact, about) ===== */
(function(){
  const FAQS=[
    ['How do I cook CafeFiro mixes?','Just add water (or curd for some kebabs), mix into a dough or batter, shape, and shallow-fry, air-fry or deep-fry as printed on the pack. Most products are ready in 15–20 minutes.'],
    ['Are all products 100% vegetarian?','Yes. Every CafeFiro product is 100% vegetarian, with no added preservatives, artificial colours or flavours.'],
    ['What is the shelf life?','Our mixes stay fresh for 9 months from manufacture when stored in a cool, dry place. Reseal the pack tightly after opening.','Each pack is date-stamped — check the back of the pouch.'],
    ['How much does each pack make?','A 250g pack typically makes 8–12 kebabs/tikkis; a 200g instant mix makes 14–20 pieces. Exact yield is printed on each pack.'],
    ['Do you deliver across India?','Yes, we ship pan-India. Enter your pincode on any product or at checkout to see delivery time and COD availability.'],
    ['Is Cash on Delivery available?','COD is available on most pincodes. You can confirm it during the pincode check at checkout.'],
  ];
  const CONTENT={
    about:{title:'Our Story',html:`
      <p>CafeFiro began with a simple belief — that the joy of a perfectly spiced kebab shouldn't be reserved for restaurants or hours of prep.</p>
      <p>We bottled the technique: authentic recipes, slow-ground spices, and clean vegetarian ingredients, ready the moment you are. No added preservatives. No artificial colours or flavours. Just honest mixes that turn a busy weeknight into something worth gathering around.</p>
      <p><b>Easy to cook. Delicious to share.</b> That's not just our tagline — it's the whole point.</p>`},
    contact:{title:'Contact Us',html:`
      <div class="contact-grid">
        <a class="contact-card" href="https://wa.me/919667395420" target="_blank" rel="noopener"><span class="ci">💬</span><b>WhatsApp</b><span>+91 96673 95420</span></a>
        <a class="contact-card" href="mailto:hello@cafefiro.in"><span class="ci">✉️</span><b>Email</b><span>hello@cafefiro.in</span></a>
        <a class="contact-card" href="tel:+919667395420"><span class="ci">📞</span><b>Call / Care</b><span>Mon–Sat, 10am–7pm</span></a>
      </div>
      <p style="margin-top:18px"><b>Registered office:</b><br>CafeFiro Foods Pvt. Ltd.<br>Unit 4, Food Park, Andheri East,<br>Mumbai, Maharashtra 400093, India</p>
      <p><b>FSSAI Lic. No.:</b> 10020031000000 &nbsp;·&nbsp; <b>GSTIN:</b> 27ABCDE1234F1Z5</p>`},
    shipping:{title:'Shipping Policy',html:`
      <p>We ship across India through trusted courier partners.</p>
      <ul>
        <li><b>Dispatch:</b> Orders are dispatched within 24–48 hours (excluding Sundays & holidays).</li>
        <li><b>Delivery time:</b> Typically 3–7 working days depending on your location. Check your pincode at checkout for an estimate.</li>
        <li><b>Shipping charge:</b> Flat ₹49. <b>FREE</b> on all orders above ₹399 and on the Sample Kit.</li>
        <li><b>Tracking:</b> You'll receive an SMS & email with a tracking link once your order ships.</li>
      </ul>`},
    returns:{title:'Returns & Refunds',html:`
      <p>Because our products are food items, we cannot accept returns once delivered. Your satisfaction matters, so:</p>
      <ul>
        <li>If you receive a <b>damaged, leaking, or expired</b> pack, share an unboxing photo within <b>48 hours</b> of delivery.</li>
        <li>We'll arrange a <b>free replacement</b> or a <b>full refund</b> to your original payment method.</li>
        <li>Refunds are processed within <b>5–7 working days</b> of approval.</li>
        <li>Wrong item delivered? We'll replace it at no extra cost.</li>
      </ul>
      <p>Write to <b>hello@cafefiro.in</b> or WhatsApp us with your order ID to start a claim.</p>`},
    privacy:{title:'Privacy Policy',html:`
      <p>We respect your privacy and collect only what we need to fulfil your order.</p>
      <ul>
        <li><b>What we collect:</b> name, contact details, and delivery address.</li>
        <li><b>How we use it:</b> to process orders, deliver products, and (with consent) send offers.</li>
        <li><b>What we never do:</b> sell your data. Payment details are handled by secure, PCI-compliant gateways and never stored by us.</li>
        <li><b>Your rights:</b> request access to or deletion of your data anytime at hello@cafefiro.in.</li>
      </ul>
      <p class="fine">This is a demo prototype — any details you enter are stored only in your browser.</p>`},
    terms:{title:'Terms of Service',html:`
      <p>By using this website and placing an order, you agree to the following:</p>
      <ul>
        <li>Prices and offers are subject to change without notice.</li>
        <li>The Sample Kit is limited to one per household at the introductory price.</li>
        <li>We reserve the right to cancel orders in case of pricing errors or stock issues, with a full refund.</li>
        <li>Product images are representational; cooked results may vary.</li>
        <li>All content and trademarks belong to CafeFiro Foods Pvt. Ltd.</li>
      </ul>`},
    faq:{title:'Frequently Asked Questions',html:`<div class="faq" id="faqList">${FAQS.map((f,i)=>`<div class="faq-item"><button class="faq-q" data-fq="${i}">${f[0]}<span>+</span></button><div class="faq-a">${f.slice(1).map(p=>`<p>${p}</p>`).join('')}</div></div>`).join('')}</div>`},
  };

  function open(page){
    const c=CONTENT[page]; if(!c) return;
    $('#contentCard').innerHTML=`<button class="modal-close" id="contentClose">✕</button>
      <div class="content-body"><span class="eyebrow">CafeFiro</span><h2>${c.title}</h2>${c.html}</div>`;
    $('#contentScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#contentCard').scrollTop=0;
    $('#contentClose').onclick=close;
    const fl=$('#faqList'); if(fl) fl.onclick=e=>{ const q=e.target.closest('[data-fq]'); if(!q)return; q.parentElement.classList.toggle('open'); };
  }
  function close(){ $('#contentScrim').classList.remove('open'); document.body.style.overflow=''; }

  // generic content overlay (used by recipes & others)
  function openHtml(eyebrow, title, html){
    $('#contentCard').innerHTML=`<button class="modal-close" id="contentClose">✕</button>
      <div class="content-body"><span class="eyebrow">${eyebrow||'CafeFiro'}</span><h2>${title}</h2>${html}</div>`;
    $('#contentScrim').classList.add('open'); document.body.style.overflow='hidden'; $('#contentCard').scrollTop=0;
    $('#contentClose').onclick=close;
  }

  window.CFContent={open,close,openHtml};
  document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('click',e=>{ const p=e.target.closest('[data-page]'); if(p){ e.preventDefault(); open(p.dataset.page); } });
    $('#contentScrim').onclick=e=>{ if(e.target===$('#contentScrim')) close(); };
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  });
})();
