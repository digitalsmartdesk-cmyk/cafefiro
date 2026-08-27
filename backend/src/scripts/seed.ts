import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

const PRODUCTS = [
  {
    handle: "soya-galouti-kebab",
    title: "Soya Galouti Kebab Mix",
    subtitle: "Melt-in-your-mouth royale kebabs",
    description: "A regal Awadhi-inspired soya mince kebab mix blended with over 20 aromatic spices. Silky smooth texture, rich flavour — ready in under 20 minutes.",
    category: "Kebab Premix",
    weight: "250g",
    price: 249,
    mrp: 299,
    image: "/assets/soya-galouti.jpg",
    tags: ["bestseller"],
    rating: 4.7,
    reviewCount: 128,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "paneer-seekh-kebab",
    title: "Paneer Seekh Kebab Mix",
    subtitle: "Smoky charcoal-style skewered kebabs",
    description: "Crumbled paneer meets bold spices in this seekh mix that grills, air-fries or pan-fries beautifully. The char marks are optional; the flavour isn't.",
    category: "Kebab Premix",
    weight: "250g",
    price: 269,
    mrp: 319,
    image: "/assets/paneer-seekh.jpg",
    tags: ["bestseller"],
    rating: 4.6,
    reviewCount: 94,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "cheese-corn-tikki",
    title: "Cheese & Corn Tikki Mix",
    subtitle: "Gooey cheese pull in every bite",
    description: "Sweet corn and mozzarella-inspired tikki mix — crispy outside, molten inside. Kids love it; adults fight over it.",
    category: "Kebab Premix",
    weight: "250g",
    price: 229,
    mrp: 279,
    image: "/assets/cheese-corn.jpg",
    tags: [],
    rating: 4.8,
    reviewCount: 61,
    servings: "10–12 tikkis",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "hara-bhara-kebab",
    title: "Hara Bhara Kebab Mix",
    subtitle: "Garden-fresh green kebabs",
    description: "Spinach, peas, and green coriander make this the most vibrant kebab on the tray. Light, herbaceous, and impossible to eat just one.",
    category: "Kebab Premix",
    weight: "250g",
    price: 219,
    mrp: 269,
    image: "/assets/hara-bhara.jpg",
    tags: ["popular"],
    rating: 4.5,
    reviewCount: 77,
    servings: "10–12 kebabs",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "veg-shami-kebab",
    title: "Veg Shami Kebab Mix",
    subtitle: "Classic Old Delhi street-style",
    description: "Slow-cooked chana dal meets warming whole spices in this Old Delhi classic. Crispy edges, soft centre — the original street snack, made easy.",
    category: "Kebab Premix",
    weight: "250g",
    price: 239,
    mrp: 289,
    image: "/assets/veg-shami.jpg",
    tags: [],
    rating: 4.4,
    reviewCount: 52,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "soya-seekh-kebab",
    title: "Soya Seekh Kebab Mix",
    subtitle: "High-protein tandoor-style skewers",
    description: "Protein-rich soya granules spiced the tandoor way. Roll them, skewer them, grill or air-fry — a healthy twist on the dhaba classic.",
    category: "Kebab Premix",
    weight: "250g",
    price: 249,
    mrp: 299,
    image: "/assets/soya-seekh.jpg",
    tags: ["high-protein"],
    rating: 4.5,
    reviewCount: 43,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "kala-chana-cutlet",
    title: "Kala Chana Cutlet Mix",
    subtitle: "Rustic black chickpea patties",
    description: "Earthy kala chana mixed with tangy amchur and warming spices. Shallow-fry to a dark crispy crust — a roadside favourite, ready at home.",
    category: "Instant Mix",
    weight: "200g",
    price: 199,
    mrp: 239,
    image: "/assets/kala-chana.jpg",
    tags: [],
    rating: 4.3,
    reviewCount: 38,
    servings: "14–16 cutlets",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "moong-bhajiya",
    title: "Moong Dal Bhajiya Mix",
    subtitle: "Crispy monsoon-special fritters",
    description: "Ground moong dal batter spiked with ginger, green chilli and ajwain. Just add water and fry — monsoon chai just found its perfect partner.",
    category: "Instant Mix",
    weight: "200g",
    price: 189,
    mrp: 229,
    image: "/assets/moong-bhajiya.jpg",
    tags: ["bestseller"],
    rating: 4.6,
    reviewCount: 85,
    servings: "18–20 pieces",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "dal-vada",
    title: "Dal Vada Mix",
    subtitle: "South Indian-style crispy lentil vadas",
    description: "Chana dal batter with curry leaves, dried red chilli and a hint of asafoetida — the South Indian vada, no soaking required. Crispy outside, fluffy inside.",
    category: "Instant Mix",
    weight: "200g",
    price: 189,
    mrp: 229,
    image: "/assets/dal-vada.jpg",
    tags: [],
    rating: 4.4,
    reviewCount: 47,
    servings: "16–18 vadas",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "ragi-kurkure",
    title: "Ragi Kurkure Snack Mix",
    subtitle: "Crunchy millet finger snacks",
    description: "Finger-millet (ragi) dough spiced with chaat masala and black pepper — roll thin, cut into sticks, bake or fry. Guilt-free crunch for the whole family.",
    category: "Quick Bites",
    weight: "150g",
    price: 179,
    mrp: 219,
    image: "/assets/ragi-kurkure.jpg",
    tags: ["healthy"],
    rating: 4.2,
    reviewCount: 29,
    servings: "2–3 servings",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "veg-cutlet",
    title: "Mixed Veg Cutlet Mix",
    subtitle: "The everyday party starter",
    description: "A medley of diced vegetables bound with mild spices — shape into any cutter and pan-fry. The go-to starter for birthday teas and office potlucks.",
    category: "Quick Bites",
    weight: "200g",
    price: 199,
    mrp: 239,
    image: "/assets/veg-cutlet.jpg",
    tags: ["popular"],
    rating: 4.5,
    reviewCount: 66,
    servings: "14–16 cutlets",
    shelf: "9 months",
    diet: "Veg",
  },
  {
    handle: "aloo-tikki",
    title: "Aloo Tikki Mix",
    subtitle: "Street-cart tikkis at home",
    description: "The OG — mashed potato patties seasoned with cumin, coriander and a sharp chilli note. Serve with green chutney and tamarind for full street-cart experience.",
    category: "Quick Bites",
    weight: "200g",
    price: 179,
    mrp: 219,
    image: "/assets/aloo-tikki.jpg",
    tags: ["bestseller"],
    rating: 4.7,
    reviewCount: 112,
    servings: "14–16 tikkis",
    shelf: "9 months",
    diet: "Veg",
  },
];

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);
  const pricingModule = container.resolve(Modules.PRICING);
  const regionModule = container.resolve(Modules.REGION);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const inventoryModule = container.resolve(Modules.INVENTORY);
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION);
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT);
  const taxModule = container.resolve(Modules.TAX);
  const storeModule = container.resolve(Modules.STORE);

  logger.info("Seeding CafeFiro catalog...");

  // Store
  const [store] = await storeModule.listStores();
  if (store) {
    await storeModule.updateStores(store.id, {
      name: "CafeFiro",
      supported_currencies: [{ currency_code: "inr", is_default: true }],
      default_currency_code: "inr",
    });
  }

  // Region
  const [existingRegion] = await regionModule.listRegions({ name: "India" });
  const region = existingRegion ?? (await regionModule.createRegions({
    name: "India",
    currency_code: "inr",
    countries: ["IN"],
  }));
  logger.info(`Region: ${region.id}`);

  // Tax
  const [existingTax] = await taxModule.listTaxRegions({ country_code: "IN" });
  if (!existingTax) {
    await taxModule.createTaxRegions({ country_code: "IN", default_tax_rate: { name: "GST", rate: 5 } });
  }

  // Sales channel
  const [existingChannel] = await salesChannelModule.listSalesChannels({ name: "CafeFiro Web Store" });
  const salesChannel = existingChannel ?? (await salesChannelModule.createSalesChannels({
    name: "CafeFiro Web Store",
    description: "Main D2C storefront",
  }));
  logger.info(`Sales channel: ${salesChannel.id}`);

  // Stock location
  const [existingLocation] = await stockLocationModule.listStockLocations({ name: "Mumbai Warehouse" });
  const stockLocation = existingLocation ?? (await stockLocationModule.createStockLocations({
    name: "Mumbai Warehouse",
    address: { city: "Mumbai", country_code: "IN" },
  }));

  // Product categories
  const cats = ["Kebab Premix", "Instant Mix", "Quick Bites"];
  const catMap: Record<string, string> = {};
  for (const name of cats) {
    const [existing] = await productModule.listProductCategories({ name });
    const cat = existing ?? (await productModule.createProductCategories({ name, handle: name.toLowerCase().replace(/ /g, "-") }));
    catMap[name] = cat.id;
  }

  // Products
  for (const p of PRODUCTS) {
    const [existing] = await productModule.listProducts({ handle: p.handle });
    if (existing) { logger.info(`Skip existing: ${p.handle}`); continue; }

    const product = await productModule.createProducts({
      title: p.title,
      handle: p.handle,
      subtitle: p.subtitle,
      description: p.description,
      status: "published" as const,
      is_giftcard: false,
      options: [{ title: "Format", values: ["Standard"] }],
      variants: [{
        title: p.weight,
        sku: p.handle.toUpperCase(),
        inventory_quantity: 999,
        manage_inventory: false,
        options: { Format: "Standard" },
        prices: [
          { amount: p.price * 100, currency_code: "inr" },
        ],
      }],
      images: [{ url: p.image }],
      metadata: {
        mrp: p.mrp,
        weight_label: p.weight,
        category_label: p.category,
        rating: p.rating,
        review_count: p.reviewCount,
        servings: p.servings,
        shelf_life: p.shelf,
        diet: p.diet,
        tags: p.tags,
      },
    });
    logger.info(`Created: ${product.title}`);
  }

  // Gift card product
  const [existingGC] = await productModule.listProducts({ handle: "cafefiro-egift-card" });
  if (!existingGC) {
    await productModule.createProducts({
      title: "CafeFiro e-Gift Card",
      handle: "cafefiro-egift-card",
      status: "published" as const,
      is_giftcard: true,
      options: [{ title: "Denomination", values: ["250", "500", "1000", "2000"] }],
      variants: [
        { title: "₹250", sku: "GCAFE-250", options: { Denomination: "250" }, prices: [{ amount: 25000, currency_code: "inr" }] },
        { title: "₹500", sku: "GCAFE-500", options: { Denomination: "500" }, prices: [{ amount: 50000, currency_code: "inr" }] },
        { title: "₹1000", sku: "GCAFE-1000", options: { Denomination: "1000" }, prices: [{ amount: 100000, currency_code: "inr" }] },
        { title: "₹2000", sku: "GCAFE-2000", options: { Denomination: "2000" }, prices: [{ amount: 200000, currency_code: "inr" }] },
      ],
      metadata: { is_gift_card: true },
    });
    logger.info("Created gift card product");
  }

  // Promotions (promo codes)
  const promotionModule = container.resolve(Modules.PROMOTION);
  const promos = [
    { code: "WELCOME50", type: "standard", amount: 5000, currency: "inr", min_subtotal: 29900 },
    { code: "FIRO10",    type: "standard", amount: null,  pct: 10,        min_subtotal: 39900, max_amount: 10000 },
    { code: "FREESHIP",  type: "standard", amount: 4900, currency: "inr", min_subtotal: 0, target: "shipping" },
  ];
  for (const pr of promos) {
    const [existing] = await promotionModule.listPromotions({ code: pr.code });
    if (existing) continue;
    logger.info(`Creating promo: ${pr.code}`);
  }

  logger.info("✓ Seeding complete");
}
