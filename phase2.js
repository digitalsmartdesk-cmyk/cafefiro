/* ===== CafeFiro — Phase 2: Bundles, Recipes, Referral ===== */
(function(){
  /* ---------- BUNDLES ---------- */
  const BUNDLE = {
    'kebab-trio':{id:'kebab-trio',name:'Kebab Co. Trio',tagline:'Three best-selling kebab mixes for the perfect platter.',
      items:['soya-galouti','paneer-seekh','hara-bhara'],price:499,img:'assets/paneer-seekh.jpg',color:'var(--brick)'},
    'party-pack':{id:'party-pack',name:'The Party Pack',tagline:'Six crowd-favourite mixes — enough to feed a gathering.',
      items:['soya-galouti','paneer-seekh','cheese-corn','hara-bhara','aloo-tikki','moong-bhajiya'],price:899,img:'assets/cheese-corn.jpg',color:'var(--ember)',best:true},
    'protein-pack':{id:'protein-pack',name:'High-Protein Pack',tagline:'Four protein-rich picks for gym-friendly snacking.',
      items:['soya-galouti','paneer-seekh','soya-seekh','kala-chana'],price:649,img:'assets/soya-seekh.jpg',color:'var(--forest)'},
    'teatime-box':{id:'teatime-box',name:'Tea-Time Snack Box',tagline:'Crispy bites & bhajiyas — the ultimate chai companion.',
      items:['moong-bhajiya','dal-vada','aloo-tikki','ragi-kurkure'],price:549,img:'assets/moong-bhajiya.jpg',color:'var(--olive)'},
  };
  // compute value/mrp/save from member items
  Object.values(BUNDLE).forEach(b=>{
    b.value = b.items.reduce((s,id)=>s+(P[id]?P[id].price:0),0);
    b.save = b.value - b.price;
    b.pct = Math.round((1-b.price/b.value)*100);
  });
  window.BUNDLE = BUNDLE;

  function renderBundles(){
    const wrap=$('#bundleGrid'); if(!wrap) return;
    wrap.innerHTML = Object.values(BUNDLE).map(b=>`
      <article class="bundle-card reveal">
        ${b.best?'<span class="bundle-best">★ Most popular</span>':''}
        <div class="bundle-img" style="--bc:${b.color}">
          <img src="${b.img}" alt="${b.name}">
          <span class="bundle-count">${b.items.length} mixes</span>
        </div>
        <div class="bundle-body">
          <h3>${b.name}</h3>
          <p class="bundle-tag">${b.tagline}</p>
          <ul class="bundle-list">${b.items.map(id=>`<li>${P[id].name}</li>`).join('')}</ul>
          <div class="bundle-foot">
            <div class="bundle-price">
              <div><span class="bp-now">${rs(b.price)}</span> <span class="bp-was">${rs(b.value)}</span></div>
              <span class="bp-save">Save ${rs(b.save)} · ${b.pct}% off</span>
            </div>
            <button class="btn btn-ember btn-sm" data-add="${b.id}">＋ Add bundle</button>
          </div>
        </div>
      </article>`).join('');
    observeReveals();
  }
  window.CFBundles={render:renderBundles};

  /* ---------- RECIPES ---------- */
  const RECIPES = [
    {id:'galouti-slider',title:'Galouti Kebab Sliders',uses:'soya-galouti',time:'25 min',serves:'Makes 6',
      img:'assets/soya-galouti.jpg',blurb:'Soft pav buns, melt-in-the-mouth galouti, mint mayo & onions.',
      steps:['Prepare Soya Galouti mix as per pack; shape into small patties to fit slider buns.','Shallow-fry till golden, 3–4 min a side.','Slit mini pav, toast with butter.','Spread mint mayo, layer galouti, sliced onion & a squeeze of lime.','Serve warm — perfect for parties.']},
    {id:'paneer-wrap',title:'Paneer Seekh Kathi Roll',uses:'paneer-seekh',time:'30 min',serves:'Makes 4',
      img:'assets/paneer-seekh.jpg',blurb:'Tandoori-style paneer seekh rolled in a flaky paratha with chutney.',
      steps:['Make Paneer Seekh mix; mould around skewers and grill/air-fry till charred.','Warm parathas on a tawa.','Spread green chutney & a little curd.','Add seekh, onions, capsicum & chaat masala.','Roll tight in butter paper and serve.']},
    {id:'tikki-chaat',title:'Aloo Tikki Chaat',uses:'aloo-tikki',time:'20 min',serves:'Serves 4',
      img:'assets/aloo-tikki.jpg',blurb:'Crispy tikki topped with curd, chutneys, sev & pomegranate.',
      steps:['Make Aloo Tikki mix; shallow-fry till crisp & golden.','Plate 2 tikkis per portion, lightly crush.','Top with whisked curd, tamarind & green chutney.','Sprinkle chaat masala, sev, onions & pomegranate.','Serve immediately while crisp.']},
    {id:'harabhara-bowl',title:'Hara Bhara Buddha Bowl',uses:'hara-bhara',time:'30 min',serves:'Serves 2',
      img:'assets/hara-bhara.jpg',blurb:'Protein bowl with hara bhara kebabs, salad & a yogurt drizzle.',
      steps:['Air-fry Hara Bhara kebabs till golden.','Build a bowl of greens, cucumber, cherry tomatoes & boiled rajma.','Add the kebabs on top.','Drizzle minted yogurt dressing.','Finish with roasted seeds & lemon.']},
  ];
  const R = Object.fromEntries(RECIPES.map(r=>[r.id,r]));

  function renderRecipes(){
    const wrap=$('#recipeGrid'); if(!wrap) return;
    wrap.innerHTML = RECIPES.map(r=>{
      const p=P[r.uses];
      return `<article class="recipe-card reveal" data-recipe="${r.id}">
        <div class="recipe-img"><img src="${r.img}" alt="${r.title}"><span class="recipe-time">⏱ ${r.time}</span></div>
        <div class="recipe-body">
          <h3>${r.title}</h3>
          <p>${r.blurb}</p>
          <div class="recipe-foot"><span class="recipe-uses">Uses <b>${p.name}</b></span><span class="recipe-link">View recipe →</span></div>
        </div>
      </article>`;
    }).join('');
    wrap.onclick=e=>{ const c=e.target.closest('[data-recipe]'); if(!c) return; openRecipe(c.dataset.recipe); };
    observeReveals();
  }
  function openRecipe(id){
    const r=R[id]; if(!r||!window.CFContent) return;
    const p=P[r.uses];
    const html=`
      <div class="recipe-detail">
        <div class="rd-img"><img src="${r.img}" alt="${r.title}"></div>
        <div class="rd-meta"><span>⏱ ${r.time}</span><span>🍽 ${r.serves}</span><span>🌿 100% Veg</span></div>
        <p class="rd-blurb">${r.blurb}</p>
        <div class="rd-uses">
          <img src="${p.img}" alt="">
          <div><b>You'll need: ${p.name}</b><span>${rs(p.price)} · ${p.weight}</span></div>
          <button class="btn btn-ember btn-sm" data-add="${p.id}">＋ Add mix</button>
        </div>
        <h4>Method</h4>
        <ol class="cook-steps">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      </div>`;
    window.CFContent.openHtml('Recipe', r.title, html);
  }
  window.CFRecipes={render:renderRecipes,open:openRecipe};

  /* ---------- REFERRAL ---------- */
  function refCode(u){
    if(!u) return 'FIROFRIEND';
    const base=(u.name||'FIRO').replace(/[^a-z]/gi,'').toUpperCase().slice(0,5)||'FIRO';
    let n=0; for(const ch of u.email) n=(n+ch.charCodeAt(0))%1000;
    return base+String(100+n%900);
  }
  window.CFReferral={code:refCode};
})();
