/* MRB Matcha Bar — menu data. Prices in EUR, VAT included. */
window.MRB_C = {
  milk: "#FFF6E6", oat: "#F3E2C4", almond: "#F6EBDD", coconut: "#FBF7EE",
  matcha: "#86B23D", matchaD: "#5E8F2A", hoji: "#B4703E", coffee: "#6B3E22",
  tea: "#E8B54A", peach: "#F7A67E", sesame: "#5F5A55", pinkShake: "#F59AB5",
  greenShake: "#A9CC6A", tonic: "#DDF1F5", yuzu: "#F2D04B",
  creamW: "#FFFBF2", creamP: "#F8BCD1", creamG: "#C9E09A", choco: "#5A3420"
};
(function () {
  const C = window.MRB_C;
  window.MRB_MENU = [
    /* ---------- MATCHA ---------- */
    { id: "matcha-boba", cat: "matcha", price: 6.5, sig: true, photo: "matcha-boba.webp", cut: true,
      name: { en: "Matcha Boba Float", es: "Matcha Boba Float" },
      desc: { en: "Brown sugar boba, milk marbled with Uji matcha and a scoop of matcha gelato.", es: "Boba de azúcar moreno, leche veteada con matcha de Uji y una bola de helado de matcha." },
      d: { layers: [{ c: "#F4F7E6", h: 0.42 }, { c: "#9CC35A", h: 0.38 }], boba: true, scoop: "#A9C95E", straw: "#F6A6C1" }, tags: ["signature"] },
    { id: "strawberry-cloud", photo: "p-cloud.webp", cat: "matcha", price: 6.2, sig: true,
      name: { en: "Strawberry Cloud Matcha", es: "Matcha Nube de Fresa" },
      desc: { en: "Uji matcha over oat milk, crowned with strawberry cold foam.", es: "Matcha de Uji sobre leche de avena, coronado con espuma fría de fresa." },
      d: { layers: [{ c: C.oat, h: 0.42 }, { c: C.matcha, h: 0.36 }], ice: true, cream: C.creamP, top: "strawberry", straw: "#F6A6C1" }, tags: ["vegan", "signature"] },
    { id: "uji-latte", cat: "matcha", price: 5.6, photo: "matcha-cream.webp", cut: true,
      name: { en: "Uji Cream Latte", es: "Uji Cream Latte" },
      desc: { en: "Iced matcha latte under a cloud of cream and a snowfall of matcha.", es: "Matcha latte con hielo bajo una nube de nata y una nevada de matcha." },
      d: { layers: [{ c: "#7FAE3A", h: 0.24 }, { c: "#C5DC8E", h: 0.42 }, { c: "#FFF6E6", h: 0.12 }], ice: true, cream: "#FFFBF2", creamDust: true, straw: "#86B23D" }, tags: [] },
    /* ---------- COFFEE ---------- */
    { id: "dirty-matcha", photo: "p-dirty.webp", cat: "coffee", price: 5.9, sig: true,
      name: { en: "Dirty Matcha", es: "Dirty Matcha" },
      desc: { en: "Three layers: milk, matcha and a double espresso on top.", es: "Tres capas: leche, matcha y un espresso doble arriba." },
      d: { layers: [{ c: C.milk, h: 0.36 }, { c: C.matcha, h: 0.24 }, { c: C.coffee, h: 0.18 }], ice: true, top: "none", straw: "#E4483F" }, tags: ["signature"] },
    { id: "hojicha-latte", photo: "p-hojicha.webp", cat: "coffee", price: 5.2,
      name: { en: "Hojicha Latte", es: "Hojicha Latte" },
      desc: { en: "Hot roasted green tea with steamed oat milk. Caramel notes, low caffeine.", es: "Té verde tostado caliente con bebida de avena vaporizada. Notas de caramelo y poca cafeína." },
      d: { layers: [{ c: C.oat, h: 0.42 }, { c: C.hoji, h: 0.34 }], ice: true, top: "dust", dust: "#9B5B32", straw: "#B4703E" }, tags: ["vegan"] },
    /* ---------- ICED TEA ---------- */
    { id: "yuzu-sencha", photo: "p-yuzu.webp", cat: "tea", price: 4.6,
      name: { en: "Yuzu Sencha", es: "Sencha con yuzu" },
      desc: { en: "Cold-steeped sencha with yuzu, lemon and fresh mint. Bright, clean, awake.", es: "Sencha infusionado en frío con yuzu, limón y hierbabuena. Limpio y despierta." },
      d: { layers: [{ c: C.yuzu, h: 0.74 }], ice: true, top: "lemon", straw: "#86B23D" }, tags: ["vegan"] },
    { id: "peach-oolong", photo: "p-peach.webp", cat: "tea", price: 4.8,
      name: { en: "White Peach Oolong", es: "Oolong de melocotón" },
      desc: { en: "Floral iced oolong with fresh white peach slices.", es: "Oolong floral con hielo y rodajas de melocotón blanco." },
      d: { layers: [{ c: C.peach, h: 0.72 }], ice: true, top: "peach", straw: "#F6A6C1" }, tags: ["vegan"] },
    /* ---------- SHAKES ---------- */
    { id: "strawberry-shake", cat: "shake", price: 6.5, sig: true, photo: "strawberry-shake.webp",
      name: { en: "Strawberry Meringue Shake", es: "Batido de fresa y merengue" },
      desc: { en: "Fresh strawberries, crushed meringue and coulis running down the glass.", es: "Fresas frescas, merengue roto y coulis cayendo por la copa." },
      d: { layers: [{ c: C.pinkShake, h: 0.86 }], shake: true, cream: C.creamW, crumble: true, drip: "#D9353B", top: "strawberry", straw: "none" }, tags: ["signature"] },
    { id: "hazelnut-shake", cat: "shake", price: 6.9, photo: "wafer-shake.webp",
      name: { en: "Hazelnut Wafer Shake", es: "Batido de avellana y barquillo" },
      desc: { en: "Hazelnut ice cream, crispy wafer bars and a milk chocolate drizzle.", es: "Helado de avellana, barritas de barquillo crujiente y chocolate con leche." },
      d: { layers: [{ c: "#EBD8B8", h: 0.86 }], shake: true, speck: "#9B6A48", cream: C.creamW, drip: "#9B6A48", top: "wafer", straw: "none" }, tags: [] },
    /* ---------- SPLASH SHAKES (photo series) ---------- */
    { id: "strawberry-splash", cat: "shake", price: 6.2, sig: true, photo: "sp-strawberry.webp", splash: { bg: "#F6A6C1", drop: "#F07FA4", word: "STRAWBERRY" },
      name: { en: "Strawberry Splash", es: "Strawberry Splash" },
      desc: { en: "Whole strawberries, vanilla ice cream and cold milk. Pink, loud and very honest.", es: "Fresas enteras, helado de vainilla y leche fría. Rosa, ruidoso y muy sincero." },
      d: { layers: [{ c: C.pinkShake, h: 0.86 }], shake: true, speck: "#D9353B", top: "strawberry", straw: "none" }, tags: ["signature"] },
    { id: "pb-banana", cat: "shake", price: 6.8, photo: "sp-peanut.webp", video: "pb.mp4", splash: { bg: "#F3D29A", drop: "#C98A3E", word: "PEANUT" },
      name: { en: "Peanut Butter Banana", es: "Crema de cacahuete y plátano" },
      desc: { en: "Roasted peanut butter, ripe banana, soft-serve and a caramel swirl down the glass.", es: "Crema de cacahuete tostado, plátano maduro, helado suave y espiral de caramelo." },
      d: { layers: [{ c: "#E8CFA5", h: 0.86 }], shake: true, cream: C.creamW, drip: "#C98A3E", straw: "none" }, tags: [] },
    { id: "berry-swirl", cat: "shake", price: 6.6, photo: "sp-berry.webp", splash: { bg: "#CDB2E6", drop: "#7A3E8C", word: "BERRIES" },
      name: { en: "Wild Berry Swirl", es: "Remolino de frutos del bosque" },
      desc: { en: "Blueberries, blackberries, Greek yoghurt and a homemade jam ribbon. Fresh mint on top.", es: "Arándanos, moras, yogur griego y una cinta de mermelada casera. Hierbabuena encima." },
      d: { layers: [{ c: "#C99BD6", h: 0.86 }], shake: true, speck: "#4B2457", cream: "#E3C6EE", drip: "#7A1F3D", straw: "none" }, tags: [] },
    { id: "choc-avocado", cat: "shake", price: 6.9, photo: "sp-choc.webp", splash: { bg: "#9B6A50", drop: "#4A2717", word: "CACAO", dark: true },
      name: { en: "Cacao Avocado Shake", es: "Batido de cacao y aguacate" },
      desc: { en: "70% dark chocolate, creamy avocado and oat milk. Tastes like dessert, plant-based all the way.", es: "Chocolate negro 70 %, aguacate cremoso y bebida de avena. Sabe a postre y es 100 % vegetal." },
      d: { layers: [{ c: "#7B4A30", h: 0.86 }], shake: true, cream: "#8C5A3C", drip: "#3B1E10", straw: "none" }, tags: ["vegan"] },
    /* ---------- BITES ---------- */
    { id: "mochi", photo: "p-mochi.webp", cat: "bites", price: 3.2, bite: "mochi",
      name: { en: "Matcha Mochi (x3)", es: "Mochi de matcha (x3)" },
      desc: { en: "Soft, chewy, dusted with matcha and filled with matcha cream.", es: "Blanditos, con polvo de matcha y rellenos de crema de matcha." }, tags: ["vegan"] },
    { id: "hoji-cookie", photo: "p-cookie.webp", cat: "bites", price: 2.8, bite: "cookie",
      name: { en: "Hojicha Cookie", es: "Cookie de hojicha" },
      desc: { en: "Brown butter, roasted tea and white chocolate.", es: "Mantequilla tostada, té tostado y chocolate blanco." }, tags: [] }
  ];
  window.MRB_CATS = [
    ["matcha", "Matcha", "Matcha"], ["coffee", "Coffee & hojicha", "Café y hojicha"], ["tea", "Iced tea", "Tés fríos"], ["shake", "Shakes", "Batidos"], ["bites", "Bites", "Para picar"]
  ];
})();
