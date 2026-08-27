export type ProductCategory = "Kebab Premix" | "Instant Mix" | "Quick Bites";

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  weight: string;
  price: number;          // paisa (INR × 100)
  mrp: number;
  image: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  servings: string;
  shelf: string;
  diet: "Veg";
  ingredients?: string;
  allergens?: string;
  nutrition?: NutritionFact[];
  cookSteps?: string[];
  cookTip?: string;
}

export interface NutritionFact {
  label: string;
  per100g: string;
}

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  items: string[];        // product handles
  price: number;          // paisa
  accent: string;         // CSS color
  badge?: string;
}

export interface Recipe {
  id: string;
  title: string;
  blurb: string;
  image: string;
  time: string;
  serves: string;
  productHandle: string;
  steps: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "soya-galouti-kebab",
    handle: "soya-galouti-kebab",
    title: "Soya Galouti Kebab Mix",
    subtitle: "Melt-in-your-mouth royale kebabs",
    description: "A regal Awadhi-inspired soya mince kebab mix blended with over 20 aromatic spices. Silky smooth texture, rich flavour — ready in under 20 minutes.",
    category: "Kebab Premix",
    weight: "250g",
    price: 24900,
    mrp: 29900,
    image: "/assets/soya-galouti.jpg",
    tags: ["bestseller"],
    rating: 4.7,
    reviewCount: 128,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Soya granules (textured soya protein), chana dal flour, onion powder, ginger powder, garlic powder, cumin, coriander, green cardamom, black cardamom, star anise, mace, rose water (0.3%), salt, red chilli.",
    allergens: "Contains soya. May contain traces of wheat, milk.",
    nutrition: [
      { label: "Energy", per100g: "380 kcal" },
      { label: "Protein", per100g: "24 g" },
      { label: "Carbohydrate", per100g: "42 g" },
      { label: "  of which sugars", per100g: "4 g" },
      { label: "Fat", per100g: "6 g" },
      { label: "  of which saturates", per100g: "0.8 g" },
      { label: "Fibre", per100g: "7 g" },
      { label: "Sodium", per100g: "0.7 g" },
    ],
    cookSteps: [
      "Add 200ml water to 250g mix in a bowl. Knead into a smooth, firm dough.",
      "Divide into 8–10 equal portions. Shape each into a flat round patty (1 cm thick).",
      "Heat 2 tbsp oil in a non-stick pan over medium-high heat.",
      "Shallow-fry 3–4 minutes per side until deep golden. Or air-fry at 190°C for 12 minutes, flipping halfway.",
      "Rest 2 minutes before serving. Serve with mint chutney and sliced onions.",
    ],
    cookTip: "For ultra-smooth texture, refrigerate the shaped kebabs for 20 minutes before frying.",
  },
  {
    id: "paneer-seekh-kebab",
    handle: "paneer-seekh-kebab",
    title: "Paneer Seekh Kebab Mix",
    subtitle: "Smoky charcoal-style skewered kebabs",
    description: "Crumbled paneer meets bold spices in this seekh mix that grills, air-fries or pan-fries beautifully. The char marks are optional; the flavour isn't.",
    category: "Kebab Premix",
    weight: "250g",
    price: 26900,
    mrp: 31900,
    image: "/assets/paneer-seekh.jpg",
    tags: ["bestseller"],
    rating: 4.6,
    reviewCount: 94,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Paneer powder (20%), potato starch, green chilli powder, ginger, garlic, kasoori methi, garam masala, amchur, cashew powder, salt.",
    allergens: "Contains milk. May contain traces of nuts, soya.",
    nutrition: [
      { label: "Energy", per100g: "362 kcal" },
      { label: "Protein", per100g: "18 g" },
      { label: "Carbohydrate", per100g: "38 g" },
      { label: "  of which sugars", per100g: "3 g" },
      { label: "Fat", per100g: "14 g" },
      { label: "  of which saturates", per100g: "7 g" },
      { label: "Fibre", per100g: "3 g" },
      { label: "Sodium", per100g: "0.8 g" },
    ],
    cookSteps: [
      "Mix 250g with 80ml water and 1 tbsp oil. Knead into a soft, pliable dough.",
      "Divide into 8–10 portions. Mould each tightly around a skewer into a 10 cm log.",
      "Grill on a hot cast-iron pan or over open flame, turning every 2 minutes for 8–10 minutes total.",
      "Alternatively: air-fry at 200°C for 14 minutes, turning once.",
      "Serve with green chutney and a squeeze of lemon.",
    ],
    cookTip: "Soak wooden skewers in water for 30 minutes before use to prevent burning.",
  },
  {
    id: "cheese-corn-tikki",
    handle: "cheese-corn-tikki",
    title: "Cheese & Corn Tikki Mix",
    subtitle: "Gooey cheese pull in every bite",
    description: "Sweet corn and mozzarella-inspired tikki mix — crispy outside, molten inside. Kids love it; adults fight over it.",
    category: "Kebab Premix",
    weight: "250g",
    price: 22900,
    mrp: 27900,
    image: "/assets/cheese-corn.jpg",
    tags: [],
    rating: 4.8,
    reviewCount: 61,
    servings: "10–12 tikkis",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Potato starch, sweet corn flour (18%), cheddar cheese powder (12%), milk solids, pepper, oregano, garlic, salt.",
    allergens: "Contains milk, cereals with gluten. May contain traces of soya.",
    nutrition: [
      { label: "Energy", per100g: "395 kcal" },
      { label: "Protein", per100g: "12 g" },
      { label: "Carbohydrate", per100g: "52 g" },
      { label: "  of which sugars", per100g: "6 g" },
      { label: "Fat", per100g: "14 g" },
      { label: "  of which saturates", per100g: "8 g" },
      { label: "Fibre", per100g: "2 g" },
      { label: "Sodium", per100g: "0.9 g" },
    ],
    cookSteps: [
      "Mix 250g with 100ml cold water. Rest batter 5 minutes.",
      "Shape into thick round tikkis (about 1.5 cm).",
      "Shallow-fry in 3 tbsp oil on medium heat, 3–4 minutes per side until golden.",
      "Serve immediately while cheese is still gooey.",
    ],
    cookTip: "Do not press the tikki while frying — you'll lose the molten centre.",
  },
  {
    id: "hara-bhara-kebab",
    handle: "hara-bhara-kebab",
    title: "Hara Bhara Kebab Mix",
    subtitle: "Garden-fresh green kebabs",
    description: "Spinach, peas, and green coriander make this the most vibrant kebab on the tray. Light, herbaceous, and impossible to eat just one.",
    category: "Kebab Premix",
    weight: "250g",
    price: 21900,
    mrp: 26900,
    image: "/assets/hara-bhara.jpg",
    tags: ["popular"],
    rating: 4.5,
    reviewCount: 77,
    servings: "10–12 kebabs",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Green pea flour (22%), spinach powder (15%), coriander, mint, ginger, green chilli, cumin, potato starch, chaat masala, salt.",
    allergens: "No major allergens. May contain traces of nuts, soya, milk.",
    nutrition: [
      { label: "Energy", per100g: "340 kcal" },
      { label: "Protein", per100g: "16 g" },
      { label: "Carbohydrate", per100g: "50 g" },
      { label: "  of which sugars", per100g: "5 g" },
      { label: "Fat", per100g: "5 g" },
      { label: "  of which saturates", per100g: "0.6 g" },
      { label: "Fibre", per100g: "9 g" },
      { label: "Sodium", per100g: "0.6 g" },
    ],
    cookSteps: [
      "Mix 250g with 90ml water into a firm dough. Add 1 tsp oil.",
      "Shape into flat round kebabs or heart shapes.",
      "Pan-fry in 2 tbsp oil over medium heat, 3 minutes each side.",
      "Or bake at 180°C for 18 minutes, brushing with oil midway.",
    ],
    cookTip: "Stuff a cube of paneer in the centre before shaping for a surprise filling.",
  },
  {
    id: "veg-shami-kebab",
    handle: "veg-shami-kebab",
    title: "Veg Shami Kebab Mix",
    subtitle: "Classic Old Delhi street-style",
    description: "Slow-cooked chana dal meets warming whole spices in this Old Delhi classic. Crispy edges, soft centre — the original street snack, made easy.",
    category: "Kebab Premix",
    weight: "250g",
    price: 23900,
    mrp: 28900,
    image: "/assets/veg-shami.jpg",
    tags: [],
    rating: 4.4,
    reviewCount: 52,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Chana dal (40%), onion powder, ginger, garlic, black pepper, cloves, bay leaf, cumin, coriander, red chilli, cinnamon, mace, salt.",
    allergens: "Contains pulses. May contain traces of wheat, soya, nuts.",
    nutrition: [
      { label: "Energy", per100g: "355 kcal" },
      { label: "Protein", per100g: "20 g" },
      { label: "Carbohydrate", per100g: "44 g" },
      { label: "  of which sugars", per100g: "3 g" },
      { label: "Fat", per100g: "8 g" },
      { label: "  of which saturates", per100g: "1 g" },
      { label: "Fibre", per100g: "10 g" },
      { label: "Sodium", per100g: "0.7 g" },
    ],
    cookSteps: [
      "Combine 250g mix with 90ml water. Knead well into a stiff dough.",
      "Divide into 8–10 balls. Flatten each to 1 cm thick.",
      "Heat oil in a heavy-bottomed pan on medium heat.",
      "Fry 4–5 minutes each side until dark, crispy edges form.",
    ],
    cookTip: "Add 1 tbsp of curd to the dough for a tangier, softer kebab.",
  },
  {
    id: "soya-seekh-kebab",
    handle: "soya-seekh-kebab",
    title: "Soya Seekh Kebab Mix",
    subtitle: "High-protein tandoor-style skewers",
    description: "Protein-rich soya granules spiced the tandoor way. Roll them, skewer them, grill or air-fry — a healthy twist on the dhaba classic.",
    category: "Kebab Premix",
    weight: "250g",
    price: 24900,
    mrp: 29900,
    image: "/assets/soya-seekh.jpg",
    tags: ["high-protein"],
    rating: 4.5,
    reviewCount: 43,
    servings: "8–10 kebabs",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Soya granules (35%), chana dal flour, ginger-garlic powder, red chilli, coriander, cumin, garam masala, kasoori methi, amchur, salt.",
    allergens: "Contains soya. May contain traces of wheat, milk.",
    nutrition: [
      { label: "Energy", per100g: "370 kcal" },
      { label: "Protein", per100g: "28 g" },
      { label: "Carbohydrate", per100g: "40 g" },
      { label: "  of which sugars", per100g: "2 g" },
      { label: "Fat", per100g: "6 g" },
      { label: "  of which saturates", per100g: "0.7 g" },
      { label: "Fibre", per100g: "8 g" },
      { label: "Sodium", per100g: "0.65 g" },
    ],
    cookSteps: [
      "Soak 250g mix in 220ml warm water for 5 minutes. Drain and squeeze out excess water.",
      "Mix with 1 tbsp oil, a pinch of garam masala, and 1 tsp lemon juice.",
      "Form tightly around skewers into 12 cm cylinders.",
      "Grill on high heat or air-fry at 200°C for 12–14 minutes.",
    ],
    cookTip: "Marinate shaped kebabs in a thin yoghurt-turmeric wash before grilling for a golden crust.",
  },
  {
    id: "kala-chana-cutlet",
    handle: "kala-chana-cutlet",
    title: "Kala Chana Cutlet Mix",
    subtitle: "Rustic black chickpea patties",
    description: "Earthy kala chana mixed with tangy amchur and warming spices. Shallow-fry to a dark crispy crust — a roadside favourite, ready at home.",
    category: "Instant Mix",
    weight: "200g",
    price: 19900,
    mrp: 23900,
    image: "/assets/kala-chana.jpg",
    tags: [],
    rating: 4.3,
    reviewCount: 38,
    servings: "14–16 cutlets",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Kala chana flour (50%), potato starch, amchur, cumin, coriander, red chilli, garam masala, onion powder, salt.",
    allergens: "Contains pulses. May contain traces of wheat, nuts.",
    nutrition: [
      { label: "Energy", per100g: "360 kcal" },
      { label: "Protein", per100g: "18 g" },
      { label: "Carbohydrate", per100g: "52 g" },
      { label: "  of which sugars", per100g: "3 g" },
      { label: "Fat", per100g: "5 g" },
      { label: "  of which saturates", per100g: "0.5 g" },
      { label: "Fibre", per100g: "11 g" },
      { label: "Sodium", per100g: "0.6 g" },
    ],
    cookSteps: [
      "Mix 200g with 120ml water into a thick batter. Rest 3 minutes.",
      "Drop spoonfuls onto hot oiled tawa. Flatten to 1 cm.",
      "Cook on medium heat, 4 minutes per side.",
    ],
    cookTip: "Add finely chopped onion and coriander to the batter for extra texture.",
  },
  {
    id: "moong-bhajiya",
    handle: "moong-bhajiya",
    title: "Moong Dal Bhajiya Mix",
    subtitle: "Crispy monsoon-special fritters",
    description: "Ground moong dal batter spiked with ginger, green chilli and ajwain. Just add water and fry — monsoon chai just found its perfect partner.",
    category: "Instant Mix",
    weight: "200g",
    price: 18900,
    mrp: 22900,
    image: "/assets/moong-bhajiya.jpg",
    tags: ["bestseller"],
    rating: 4.6,
    reviewCount: 85,
    servings: "18–20 pieces",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Moong dal flour (60%), ajwain, ginger powder, green chilli powder, hing, coriander, salt.",
    allergens: "Contains pulses. May contain traces of wheat, nuts.",
    nutrition: [
      { label: "Energy", per100g: "345 kcal" },
      { label: "Protein", per100g: "22 g" },
      { label: "Carbohydrate", per100g: "50 g" },
      { label: "  of which sugars", per100g: "2 g" },
      { label: "Fat", per100g: "3 g" },
      { label: "  of which saturates", per100g: "0.4 g" },
      { label: "Fibre", per100g: "6 g" },
      { label: "Sodium", per100g: "0.55 g" },
    ],
    cookSteps: [
      "Mix 200g with 150ml water into a thick, pourable batter.",
      "Heat oil for deep frying to 175°C.",
      "Drop tablespoon-sized portions and fry 3–4 minutes until golden.",
      "Drain on paper. Serve hot with green chutney.",
    ],
    cookTip: "Add 2 tbsp fine semolina for extra crunch.",
  },
  {
    id: "dal-vada",
    handle: "dal-vada",
    title: "Dal Vada Mix",
    subtitle: "South Indian-style crispy lentil vadas",
    description: "Chana dal batter with curry leaves, dried red chilli and a hint of asafoetida — the South Indian vada, no soaking required.",
    category: "Instant Mix",
    weight: "200g",
    price: 18900,
    mrp: 22900,
    image: "/assets/dal-vada.jpg",
    tags: [],
    rating: 4.4,
    reviewCount: 47,
    servings: "16–18 vadas",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Chana dal flour (55%), rice flour, curry leaf powder, dried red chilli, hing, ginger, salt.",
    allergens: "Contains pulses. May contain traces of wheat, nuts.",
    nutrition: [
      { label: "Energy", per100g: "350 kcal" },
      { label: "Protein", per100g: "17 g" },
      { label: "Carbohydrate", per100g: "52 g" },
      { label: "  of which sugars", per100g: "2 g" },
      { label: "Fat", per100g: "4 g" },
      { label: "  of which saturates", per100g: "0.5 g" },
      { label: "Fibre", per100g: "9 g" },
      { label: "Sodium", per100g: "0.6 g" },
    ],
    cookSteps: [
      "Mix 200g with 100ml water into a thick batter (not runny).",
      "Wet your palms. Take a ball of batter and press a hole in the centre to form a ring.",
      "Deep-fry at 180°C, 3 minutes per side until crispy.",
      "Serve with coconut chutney and sambar.",
    ],
    cookTip: "The batter should be firm enough to hold its shape when dropped in oil.",
  },
  {
    id: "ragi-kurkure",
    handle: "ragi-kurkure",
    title: "Ragi Kurkure Snack Mix",
    subtitle: "Crunchy millet finger snacks",
    description: "Finger-millet (ragi) dough spiced with chaat masala and black pepper — roll thin, cut into sticks, bake or fry.",
    category: "Quick Bites",
    weight: "150g",
    price: 17900,
    mrp: 21900,
    image: "/assets/ragi-kurkure.jpg",
    tags: ["healthy"],
    rating: 4.2,
    reviewCount: 29,
    servings: "2–3 servings",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Ragi flour (70%), rice flour, black pepper, chaat masala, ajwain, salt.",
    allergens: "No major allergens. May contain traces of wheat, nuts.",
    nutrition: [
      { label: "Energy", per100g: "358 kcal" },
      { label: "Protein", per100g: "9 g" },
      { label: "Carbohydrate", per100g: "68 g" },
      { label: "  of which sugars", per100g: "1 g" },
      { label: "Fat", per100g: "3 g" },
      { label: "  of which saturates", per100g: "0.5 g" },
      { label: "Fibre", per100g: "4 g" },
      { label: "Sodium", per100g: "0.5 g" },
    ],
    cookSteps: [
      "Mix 150g with 60ml warm water and 1 tsp oil into a firm dough.",
      "Roll out thin (3mm). Cut into finger sticks.",
      "Bake at 160°C for 20 minutes until crisp. Or deep-fry at 170°C for 2 minutes.",
    ],
    cookTip: "Add a pinch of sesame seeds to the dough for extra nuttiness.",
  },
  {
    id: "veg-cutlet",
    handle: "veg-cutlet",
    title: "Mixed Veg Cutlet Mix",
    subtitle: "The everyday party starter",
    description: "A medley of diced vegetables bound with mild spices — shape into any cutter and pan-fry. The go-to starter for birthday teas and office potlucks.",
    category: "Quick Bites",
    weight: "200g",
    price: 19900,
    mrp: 23900,
    image: "/assets/veg-cutlet.jpg",
    tags: ["popular"],
    rating: 4.5,
    reviewCount: 66,
    servings: "14–16 cutlets",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Potato starch, green pea, carrot powder, beans powder, bell pepper powder, onion, ginger, cumin, coriander, salt.",
    allergens: "No major allergens. May contain traces of wheat, soya, nuts.",
    nutrition: [
      { label: "Energy", per100g: "330 kcal" },
      { label: "Protein", per100g: "8 g" },
      { label: "Carbohydrate", per100g: "60 g" },
      { label: "  of which sugars", per100g: "4 g" },
      { label: "Fat", per100g: "4 g" },
      { label: "  of which saturates", per100g: "0.4 g" },
      { label: "Fibre", per100g: "5 g" },
      { label: "Sodium", per100g: "0.55 g" },
    ],
    cookSteps: [
      "Mix 200g with 100ml water and 1 tbsp oil. Knead into a smooth dough.",
      "Shape using cookie cutters or roll into balls and flatten.",
      "Pan-fry in 2 tbsp oil on medium heat, 3–4 minutes per side.",
    ],
    cookTip: "Coat in fine breadcrumbs before frying for an extra crispy shell.",
  },
  {
    id: "aloo-tikki",
    handle: "aloo-tikki",
    title: "Aloo Tikki Mix",
    subtitle: "Street-cart tikkis at home",
    description: "The OG — mashed potato patties seasoned with cumin, coriander and a sharp chilli note. Serve with green chutney and tamarind for full street-cart experience.",
    category: "Quick Bites",
    weight: "200g",
    price: 17900,
    mrp: 21900,
    image: "/assets/aloo-tikki.jpg",
    tags: ["bestseller"],
    rating: 4.7,
    reviewCount: 112,
    servings: "14–16 tikkis",
    shelf: "9 months",
    diet: "Veg",
    ingredients: "Potato starch (65%), cumin, coriander, amchur, red chilli, green chilli powder, ginger, salt.",
    allergens: "No major allergens. May contain traces of wheat, soya, milk.",
    nutrition: [
      { label: "Energy", per100g: "315 kcal" },
      { label: "Protein", per100g: "6 g" },
      { label: "Carbohydrate", per100g: "68 g" },
      { label: "  of which sugars", per100g: "3 g" },
      { label: "Fat", per100g: "2 g" },
      { label: "  of which saturates", per100g: "0.3 g" },
      { label: "Fibre", per100g: "4 g" },
      { label: "Sodium", per100g: "0.5 g" },
    ],
    cookSteps: [
      "Mix 200g with 90ml water. Knead into a firm dough.",
      "Divide into 14–16 portions. Roll into balls, then flatten into round tikkis.",
      "Heat a tawa with 1–2 tbsp oil on medium heat.",
      "Cook tikkis 4 minutes each side until golden-brown and crisp.",
    ],
    cookTip: "Make a well in the centre of each tikki and press down slightly — this ensures even cooking.",
  },
];

export const SAMPLE_KIT_PRODUCTS = [
  "soya-galouti-kebab",
  "paneer-seekh-kebab",
  "hara-bhara-kebab",
  "veg-shami-kebab",
  "moong-bhajiya",
  "kala-chana-cutlet",
  "veg-cutlet",
  "aloo-tikki",
];

export const SAMPLE_KIT_PRICE = 49900;   // ₹499 in paisa

export const BUNDLES: Bundle[] = [
  {
    id: "kebab-trio",
    name: "Kebab Co. Trio",
    tagline: "The three kebabs every table needs",
    items: ["soya-galouti-kebab", "paneer-seekh-kebab", "hara-bhara-kebab"],
    price: 49900,
    accent: "#B0242A",
  },
  {
    id: "party-pack",
    name: "The Party Pack",
    tagline: "Six mixes. One legendary spread.",
    items: ["soya-galouti-kebab", "paneer-seekh-kebab", "hara-bhara-kebab", "moong-bhajiya", "veg-cutlet", "aloo-tikki"],
    price: 89900,
    accent: "#C77B2C",
    badge: "Most popular",
  },
  {
    id: "protein-pack",
    name: "High-Protein Pack",
    tagline: "Fuel up without compromise",
    items: ["soya-galouti-kebab", "soya-seekh-kebab", "kala-chana-cutlet", "hara-bhara-kebab"],
    price: 64900,
    accent: "#234B2E",
  },
  {
    id: "teatime-box",
    name: "Tea-Time Snack Box",
    tagline: "Your 5 o'clock sorted",
    items: ["moong-bhajiya", "ragi-kurkure", "dal-vada", "aloo-tikki"],
    price: 54900,
    accent: "#5C5A2E",
  },
];

export const RECIPES: Recipe[] = [
  {
    id: "galouti-sliders",
    title: "Galouti Kebab Sliders",
    blurb: "Regal Awadhi kebabs nestled in toasted brioche buns with mint mayo and crispy onions.",
    image: "/assets/soya-galouti.jpg",
    time: "25 min",
    serves: "4",
    productHandle: "soya-galouti-kebab",
    steps: [
      "Prepare Soya Galouti mix per pack instructions into 8 small round kebabs.",
      "Slice and toast 4 brioche buns until golden.",
      "Mix 3 tbsp mayo with 2 tbsp mint chutney for mint mayo.",
      "Assemble: bottom bun → mint mayo → lettuce → double kebab → crispy onions → top bun.",
      "Secure with a toothpick. Serve with tamarind dipping sauce.",
    ],
  },
  {
    id: "paneer-seekh-roll",
    title: "Paneer Seekh Kathi Roll",
    blurb: "Smoky seekh kebabs rolled in a laccha paratha with crunchy slaw and chutney.",
    image: "/assets/paneer-seekh.jpg",
    time: "20 min",
    serves: "2",
    productHandle: "paneer-seekh-kebab",
    steps: [
      "Prepare 4 Paneer Seekh Kebabs per pack instructions.",
      "Warm 2 laccha parathas on a dry tawa.",
      "Slice kebabs lengthways. Toss shredded cabbage with lemon and salt.",
      "Lay paratha flat. Spread green chutney. Add kebab slices and slaw.",
      "Roll tightly, wrap the bottom half in foil. Serve immediately.",
    ],
  },
  {
    id: "tikki-chaat",
    title: "Aloo Tikki Chaat",
    blurb: "Crispy tikkis drowned in chole, yoghurt, chutneys, and sev. Pure street magic.",
    image: "/assets/aloo-tikki.jpg",
    time: "30 min",
    serves: "4",
    productHandle: "aloo-tikki",
    steps: [
      "Prepare 12 Aloo Tikkis per pack instructions.",
      "Warm 1 cup canned chole (or pressure-cooked chickpeas) with a pinch of cumin.",
      "Whisk 1 cup thick yoghurt with salt and roasted cumin powder.",
      "Place 2–3 tikkis per bowl. Top with chole, then yoghurt, green chutney, tamarind chutney.",
      "Finish with sev, pomegranate seeds, and fresh coriander.",
    ],
  },
  {
    id: "harabhara-bowl",
    title: "Hara Bhara Buddha Bowl",
    blurb: "Green protein bowls with hara bhara kebabs, roasted veggies, quinoa, and tahini.",
    image: "/assets/hara-bhara.jpg",
    time: "35 min",
    serves: "2",
    productHandle: "hara-bhara-kebab",
    steps: [
      "Cook ½ cup quinoa in 1 cup water. Season with lemon and olive oil.",
      "Roast 1 cup mixed veggies (zucchini, peppers, broccoli) at 200°C for 20 min.",
      "Prepare 6 Hara Bhara Kebabs per pack instructions.",
      "Whisk 2 tbsp tahini with 1 tbsp lemon, 1 tsp honey, water to thin.",
      "Assemble bowls: quinoa → roasted veggies → halved kebabs → tahini drizzle → sesame seeds.",
    ],
  },
];

export const PROMO_CODES: Record<string, { type: "flat" | "pct" | "ship"; value: number; min: number; cap?: number }> = {
  WELCOME50: { type: "flat", value: 5000, min: 29900 },
  FIRO10:    { type: "pct",  value: 10,   min: 39900, cap: 10000 },
  FREESHIP:  { type: "ship", value: 0,   min: 0 },
};

export const PARTNER_COUPONS = [
  { amount: 100, threshold: 75000, code: "CAFE-FB100", partner: "FreshBasket", cat: "Groceries & Staples", emoji: "🧺", min: 499, days: 30, color: "#2E7D5B", desc: "₹100 off fresh produce & pantry staples." },
  { amount: 200, threshold: 125000, code: "CAFE-BH200", partner: "BrewHouse Coffee", cat: "Beverages", emoji: "☕", min: 600, days: 30, color: "#7B4A2C", desc: "₹200 off artisan coffee, chai & teaware." },
  { amount: 500, threshold: 250000, code: "CAFE-HW500", partner: "Hearthware Cookware", cat: "Kitchen & Appliances", emoji: "🍳", min: 1500, days: 45, color: "#B0242A", desc: "₹500 off pans, air-fryers & cookware." },
];

export const FREE_SHIP_THRESHOLD = 39900;   // ₹399 in paisa
export const SHIPPING_CHARGE    = 4900;     // ₹49 in paisa
export const SUB_RATE           = 0.15;     // 15% off for subscriptions

export const SUB_FREQUENCIES: Record<string, string> = {
  "2w": "Every 2 weeks",
  "1m": "Every month",
  "2m": "Every 2 months",
};

export const BLOCKED_PINCODES = ["190001", "737101", "744101", "796001"];

/** Compute delivery estimate from pincode last digit (demo logic) */
export function pincodeInfo(pin: string): { days: string; cod: boolean } | null {
  if (!/^\d{6}$/.test(pin)) return null;
  if (BLOCKED_PINCODES.includes(pin)) return null;
  const last = parseInt(pin.slice(-1));
  return {
    days: last < 4 ? "2–3 working days" : last < 7 ? "3–5 working days" : "5–7 working days",
    cod: last % 2 === 0,
  };
}

export function formatPrice(paisa: number): string {
  return "₹" + (paisa / 100).toLocaleString("en-IN");
}

export function discountPct(price: number, mrp: number): number {
  return Math.round(((mrp - price) / mrp) * 100);
}

export function productByHandle(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function bundleValue(bundle: Bundle): number {
  return bundle.items.reduce((sum, h) => {
    const p = productByHandle(h);
    return sum + (p?.price ?? 0);
  }, 0);
}
