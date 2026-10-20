import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Translations per shop id: { en, de, da, es, fr, nl }
const translations: Record<number, Record<string, string>> = {
  1:  { en: "Ice Cream Cart",       de: "Eiswagen",                        da: "Isvogn",                              es: "Carrito de helados",                     fr: "Chariot à glaces",                    nl: "IJskarretje" },
  2:  { en: "Drink Cart",           de: "Getränkewagen",                   da: "Drikkevogn",                          es: "Carrito de bebidas",                     fr: "Chariot à boissons",                  nl: "Drankenwagen" },
  3:  { en: "Snack Cart",           de: "Snackwagen",                      da: "Snackvogn",                           es: "Carrito de bocadillos",                  fr: "Chariot à snacks",                    nl: "Snackwagen" },
  4:  { en: "Souvenir Cart",        de: "Souvenirwagen",                   da: "Souvenirsvogn",                       es: "Carrito de souvenirs",                   fr: "Chariot à souvenirs",                 nl: "Souvenirwagen" },
  5:  { en: "Ice Cream Shop",       de: "Eisdiele",                        da: "Isbutik",                             es: "Heladería",                              fr: "Boutique de glaces",                  nl: "IJswinkel" },
  6:  { en: "Drink Shop",           de: "Getränkeladen",                   da: "Drikkevarebutik",                     es: "Tienda de bebidas",                      fr: "Boutique de boissons",                nl: "Drankwinkel" },
  7:  { en: "Snack Shop",           de: "Snackladen",                      da: "Snackbutik",                          es: "Tienda de snacks",                       fr: "Boutique de snacks",                  nl: "Snackwinkel" },
  8:  { en: "Souvenir Shop",        de: "Souvenirladen",                   da: "Souvenirbutik",                       es: "Tienda de souvenirs",                    fr: "Boutique de souvenirs",               nl: "Souvenirwinkel" },
  9:  { en: "Ice Cream Parlor",     de: "Eissalon",                        da: "Iscafé",                              es: "Salón de helados",                       fr: "Salon de glaces",                     nl: "IJssalon" },
  10: { en: "Safari Restaurant",    de: "Safari-Restaurant",               da: "Safaristaurant",                      es: "Restaurante Safari",                     fr: "Restaurant Safari",                   nl: "Safaristaurant" },
  11: { en: "Zoo Store",            de: "Zoo-Laden",                       da: "Zoo-butik",                           es: "Tienda del zoo",                         fr: "Boutique du zoo",                     nl: "Dierentuinwinkel" },
  12: { en: "Kiosk",                de: "Kiosk",                           da: "Kiosk",                               es: "Quiosco",                                fr: "Kiosque",                             nl: "Kiosk" },
  13: { en: "Safari Hat Stand",     de: "Safari-Hutstand",                 da: "Safari-hattestand",                   es: "Puesto de sombreros safari",             fr: "Stand de chapeaux safari",            nl: "Safari-hoedenkraam" },
  // Oceanside
  14: { en: "Small Snack Shop",     de: "Kleiner Snackladen",              da: "Lille snackbutik",                    es: "Pequeña tienda de snacks",               fr: "Petite boutique de snacks",           nl: "Kleine snackwinkel" },
  15: { en: "Small Drink Shop",     de: "Kleiner Getränkeladen",           da: "Lille drikkevarebutik",               es: "Pequeña tienda de bebidas",              fr: "Petite boutique de boissons",         nl: "Kleine drankwinkel" },
  16: { en: "Small Souvenir Shop",  de: "Kleiner Souvenirladen",           da: "Lille souvenirbutik",                 es: "Pequeña tienda de souvenirs",            fr: "Petite boutique de souvenirs",        nl: "Kleine souvenirwinkel" },
  17: { en: "Medium Snack Shop",    de: "Mittlerer Snackladen",            da: "Mellemstor snackbutik",               es: "Tienda de snacks mediana",               fr: "Boutique de snacks moyenne",          nl: "Middelgrote snackwinkel" },
  18: { en: "Medium Drink Shop",    de: "Mittlerer Getränkeladen",         da: "Mellemstor drikkevarebutik",          es: "Tienda de bebidas mediana",              fr: "Boutique de boissons moyenne",        nl: "Middelgrote drankwinkel" },
  19: { en: "Medium Souvenir Shop", de: "Mittlerer Souvenirladen",         da: "Mellemstor souvenirbutik",            es: "Tienda de souvenirs mediana",            fr: "Boutique de souvenirs moyenne",       nl: "Middelgrote souvenirwinkel" },
  20: { en: "Large Snack Shop",     de: "Großer Snackladen",               da: "Stor snackbutik",                     es: "Gran tienda de snacks",                  fr: "Grande boutique de snacks",           nl: "Grote snackwinkel" },
  21: { en: "Large Drink Shop",     de: "Großer Getränkeladen",            da: "Stor drikkevarebutik",                es: "Gran tienda de bebidas",                 fr: "Grande boutique de boissons",         nl: "Grote drankwinkel" },
  22: { en: "Large Souvenir Shop",  de: "Großer Souvenirladen",            da: "Stor souvenirbutik",                  es: "Gran tienda de souvenirs",               fr: "Grande boutique de souvenirs",        nl: "Grote souvenirwinkel" },
  // Polar Park
  23: { en: "Small Snack Shop",     de: "Kleiner Snackladen",              da: "Lille snackbutik",                    es: "Pequeña tienda de snacks",               fr: "Petite boutique de snacks",           nl: "Kleine snackwinkel" },
  24: { en: "Small Drink Shop",     de: "Kleiner Getränkeladen",           da: "Lille drikkevarebutik",               es: "Pequeña tienda de bebidas",              fr: "Petite boutique de boissons",         nl: "Kleine drankwinkel" },
  25: { en: "Small Souvenir Shop",  de: "Kleiner Souvenirladen",           da: "Lille souvenirbutik",                 es: "Pequeña tienda de souvenirs",            fr: "Petite boutique de souvenirs",        nl: "Kleine souvenirwinkel" },
  26: { en: "Medium Snack Shop",    de: "Mittlerer Snackladen",            da: "Mellemstor snackbutik",               es: "Tienda de snacks mediana",               fr: "Boutique de snacks moyenne",          nl: "Middelgrote snackwinkel" },
  27: { en: "Medium Drink Shop",    de: "Mittlerer Getränkeladen",         da: "Mellemstor drikkevarebutik",          es: "Tienda de bebidas mediana",              fr: "Boutique de boissons moyenne",        nl: "Middelgrote drankwinkel" },
  28: { en: "Medium Souvenir Shop", de: "Mittlerer Souvenirladen",         da: "Mellemstor souvenirbutik",            es: "Tienda de souvenirs mediana",            fr: "Boutique de souvenirs moyenne",       nl: "Middelgrote souvenirwinkel" },
  29: { en: "Large Snack Shop",     de: "Großer Snackladen",               da: "Stor snackbutik",                     es: "Gran tienda de snacks",                  fr: "Grande boutique de snacks",           nl: "Grote snackwinkel" },
  30: { en: "Large Drink Shop",     de: "Großer Getränkeladen",            da: "Stor drikkevarebutik",                es: "Gran tienda de bebidas",                 fr: "Grande boutique de boissons",         nl: "Grote drankwinkel" },
  31: { en: "Large Souvenir Shop",  de: "Großer Souvenirladen",            da: "Stor souvenirbutik",                  es: "Gran tienda de souvenirs",               fr: "Grande boutique de souvenirs",        nl: "Grote souvenirwinkel" },
  // Rainforest Park
  32: { en: "Small Snack Shop",     de: "Kleiner Snackladen",              da: "Lille snackbutik",                    es: "Pequeña tienda de snacks",               fr: "Petite boutique de snacks",           nl: "Kleine snackwinkel" },
  33: { en: "Small Drink Shop",     de: "Kleiner Getränkeladen",           da: "Lille drikkevarebutik",               es: "Pequeña tienda de bebidas",              fr: "Petite boutique de boissons",         nl: "Kleine drankwinkel" },
  34: { en: "Small Souvenir Shop",  de: "Kleiner Souvenirladen",           da: "Lille souvenirbutik",                 es: "Pequeña tienda de souvenirs",            fr: "Petite boutique de souvenirs",        nl: "Kleine souvenirwinkel" },
  35: { en: "Medium Snack Shop",    de: "Mittlerer Snackladen",            da: "Mellemstor snackbutik",               es: "Tienda de snacks mediana",               fr: "Boutique de snacks moyenne",          nl: "Middelgrote snackwinkel" },
  36: { en: "Medium Drink Shop",    de: "Mittlerer Getränkeladen",         da: "Mellemstor drikkevarebutik",          es: "Tienda de bebidas mediana",              fr: "Boutique de boissons moyenne",        nl: "Middelgrote drankwinkel" },
  37: { en: "Medium Souvenir Shop", de: "Mittlerer Souvenirladen",         da: "Mellemstor souvenirbutik",            es: "Tienda de souvenirs mediana",            fr: "Boutique de souvenirs moyenne",       nl: "Middelgrote souvenirwinkel" },
  38: { en: "Large Snack Shop",     de: "Großer Snackladen",               da: "Stor snackbutik",                     es: "Gran tienda de snacks",                  fr: "Grande boutique de snacks",           nl: "Grote snackwinkel" },
  39: { en: "Large Drink Shop",     de: "Großer Getränkeladen",            da: "Stor drikkevarebutik",                es: "Gran tienda de bebidas",                 fr: "Grande boutique de boissons",         nl: "Grote drankwinkel" },
  40: { en: "Large Souvenir Shop",  de: "Großer Souvenirladen",            da: "Stor souvenirbutik",                  es: "Gran tienda de souvenirs",               fr: "Grande boutique de souvenirs",        nl: "Grote souvenirwinkel" },
  // Special Events
  41: { en: "Salad Bar",                        de: "Salatbar",                           da: "Salatbar",                            es: "Barra de ensaladas",                     fr: "Bar à salades",                       nl: "Saladebar" },
  42: { en: "Swedish Café",                     de: "Schwedisches Café",                  da: "Svensk café",                         es: "Cafetería sueca",                        fr: "Café suédois",                        nl: "Zweeds café" },
  43: { en: "Market Stall",                     de: "Marktstand",                         da: "Markedsstand",                        es: "Puesto de mercado",                      fr: "Étal de marché",                      nl: "Marktkraam" },
  44: { en: "Flower Vendor",                    de: "Blumenverkäufer",                    da: "Blomsterhandler",                     es: "Vendedor de flores",                     fr: "Vendeur de fleurs",                   nl: "Bloemverkoper" },
  45: { en: "Fall Festival Snack Shop",         de: "Herbstfest-Snackladen",              da: "Efterårsfestival-snackbutik",         es: "Tienda de snacks del festival de otoño", fr: "Boutique de snacks du festival d'automne", nl: "Herfstfestival snackwinkel" },
  46: { en: "Cloud Café",                       de: "Cloud-Café",                         da: "Sky-café",                            es: "Café Nube",                              fr: "Café Nuage",                          nl: "Wolkencafé" },
  47: { en: "Anniversary Snack Shop",           de: "Jubiläums-Snackladen",               da: "Jubilæums-snackbutik",               es: "Tienda de snacks del aniversario",       fr: "Boutique de snacks anniversaire",     nl: "Jubileum snackwinkel" },
  48: { en: "upjers Anniversary Souvenir Shop", de: "upjers Jubiläums-Souvenirladen",    da: "upjers jubilæums-souvenirbutik",     es: "Tienda de souvenirs del aniversario upjers", fr: "Boutique de souvenirs anniversaire upjers", nl: "upjers jubileum souvenirwinkel" },
  // Terrarium
  49: { en: "Chip Vending Machine",             de: "Chip-Automat",                       da: "Chip-automat",                        es: "Máquina expendedora de patatas fritas",  fr: "Distributeur de chips",               nl: "Chipautomaat" },
  50: { en: "Coffee Vending Machine",           de: "Kaffeeautomat",                      da: "Kaffeautomat",                        es: "Máquina expendedora de café",            fr: "Distributeur de café",                nl: "Koffieautomaat" },
  51: { en: "Cookie Vending Machine",           de: "Keks-Automat",                       da: "Kage-automat",                        es: "Máquina expendedora de galletas",        fr: "Distributeur de cookies",             nl: "Koekjesautomaat" },
  52: { en: "Granola Bar Vending Machine",      de: "Müsliriegel-Automat",                da: "Myslibar-automat",                    es: "Máquina expendedora de barritas de granola", fr: "Distributeur de barres de granola", nl: "Granolabarautomaat" },
  53: { en: "Iced Tea Vending Machine",         de: "Eistee-Automat",                     da: "Isthe-automat",                       es: "Máquina expendedora de té helado",       fr: "Distributeur de thé glacé",           nl: "IJstheeautomaat" },
  54: { en: "Juice Vending Machine",            de: "Saftautomat",                        da: "Juice-automat",                       es: "Máquina expendedora de zumos",           fr: "Distributeur de jus",                 nl: "Sapautomaat" },
  55: { en: "Soft Serve Vending Machine",       de: "Softeis-Automat",                    da: "Soft ice-automat",                    es: "Máquina expendedora de helado suave",    fr: "Distributeur de glace molle",         nl: "Softijsautomaat" },
  56: { en: "Water Vending Machine",            de: "Wasserautomat",                      da: "Vandautomat",                         es: "Máquina expendedora de agua",            fr: "Distributeur d'eau",                  nl: "Waterautomaat" },
  57: { en: "Photo Booth",                      de: "Fotoautomat",                        da: "Fotoboks",                            es: "Fotomatón",                              fr: "Photomaton",                          nl: "Fotohokje" },
  58: { en: "Balloon Shop",                     de: "Ballonladen",                        da: "Ballonbutik",                         es: "Tienda de globos",                       fr: "Boutique de ballons",                 nl: "Ballonwinkel" },
  59: { en: "Claw Machine",                     de: "Greifautomat",                       da: "Kloautomat",                          es: "Máquina de garras",                      fr: "Machine à pinces",                    nl: "Grijpautomaat" },
  // Aquarium
  60: { en: "Cookie Vending Machine",           de: "Keks-Automat",                       da: "Kage-automat",                        es: "Máquina expendedora de galletas",        fr: "Distributeur de cookies",             nl: "Koekjesautomaat" },
  61: { en: "Iced Drinks Vending Machine",      de: "Eisgetränke-Automat",                da: "Isdrikke-automat",                    es: "Máquina expendedora de bebidas heladas", fr: "Distributeur de boissons glacées",    nl: "IJsdrankautomaat" },
  62: { en: "Chocolate Bar Vending Machine",    de: "Schokoriegel-Automat",               da: "Chokoladebar-automat",                es: "Máquina expendedora de barritas de chocolate", fr: "Distributeur de barres de chocolat", nl: "Chocoladereepautomaat" },
  63: { en: "Fruit Gummie Vending Machine",     de: "Fruchtgummi-Automat",                da: "Frugt-gummiautomat",                  es: "Máquina expendedora de gominolas de frutas", fr: "Distributeur de bonbons gélifiés aux fruits", nl: "Fruitgummiautomaat" },
  64: { en: "Water Cooler",                     de: "Wasserspender",                      da: "Vandkøler",                           es: "Fuente de agua",                         fr: "Fontaine à eau",                      nl: "Waterkoeler" },
  65: { en: "Balloon Shop",                     de: "Ballonladen",                        da: "Ballonbutik",                         es: "Tienda de globos",                       fr: "Boutique de ballons",                 nl: "Ballonwinkel" },
  66: { en: "Cocktail Bar",                     de: "Cocktailbar",                        da: "Cocktailbar",                         es: "Bar de cócteles",                        fr: "Bar à cocktails",                     nl: "Cocktailbar" },
  67: { en: "Fish Claw Machine",                de: "Fisch-Greifautomat",                 da: "Fiske-kloautomat",                    es: "Máquina de garras de peces",             fr: "Machine à pinces à poissons",         nl: "Visgrijpautomaat" },
  68: { en: "Smoothie Machine",                 de: "Smoothie-Automat",                   da: "Smoothie-maskine",                    es: "Máquina de smoothies",                   fr: "Machine à smoothies",                 nl: "Smoothieautomaat" },
  69: { en: "Soft Serve Machine",               de: "Softeis-Maschine",                   da: "Soft ice-maskine",                    es: "Máquina de helado suave",                fr: "Machine à glace molle",               nl: "Softijsmachine" },
  70: { en: 'Photo Booth "Deep Dive"',          de: 'Fotoautomat "Deep Dive"',            da: 'Fotoboks "Deep Dive"',                es: 'Fotomatón "Deep Dive"',                  fr: 'Photomaton "Deep Dive"',              nl: 'Fotohokje "Deep Dive"' },
  // Noctarium
  71: { en: "Water Vending Machine",            de: "Wasserautomat",                      da: "Vandautomat",                         es: "Máquina expendedora de agua",            fr: "Distributeur d'eau",                  nl: "Waterautomaat" },
  72: { en: "Pizza Snack Machine",              de: "Pizza-Snack-Automat",                da: "Pizza-snack-automat",                 es: "Máquina de pizza snack",                 fr: "Distributeur de pizzas snack",        nl: "Pizza-snackautomaat" },
  73: { en: "Balloon Shop",                     de: "Ballonladen",                        da: "Ballonbutik",                         es: "Tienda de globos",                       fr: "Boutique de ballons",                 nl: "Ballonwinkel" },
  74: { en: "Lemonade Vending Machine",         de: "Limonaden-Automat",                  da: "Limonade-automat",                    es: "Máquina expendedora de limonada",        fr: "Distributeur de limonade",            nl: "Limonadeautomaat" },
  75: { en: "Cracker Snack Vending Machine",    de: "Cracker-Snack-Automat",              da: "Kiks-snack-automat",                  es: "Máquina expendedora de galletas snack",  fr: "Distributeur de crackers snack",      nl: "Crackersnackautomaat" },
  // Aviary
  76: { en: "Water Vending Machine",            de: "Wasserautomat",                      da: "Vandautomat",                         es: "Máquina expendedora de agua",            fr: "Distributeur d'eau",                  nl: "Waterautomaat" },
  77: { en: "Cake Snack Machine",               de: "Kuchen-Snack-Automat",               da: "Kage-snack-automat",                  es: "Máquina de snacks de pastel",            fr: "Distributeur de gâteaux snack",       nl: "Taartensnackautomaat" },
  78: { en: "Coffee Vending Machine",           de: "Kaffeeautomat",                      da: "Kaffeautomat",                        es: "Máquina expendedora de café",            fr: "Distributeur de café",                nl: "Koffieautomaat" },
  79: { en: "Ice Cream Machine",                de: "Eisautomat",                          da: "Is-maskine",                          es: "Máquina de helado",                      fr: "Machine à glaces",                    nl: "IJsmachine" },
  80: { en: "Photo Booth",                      de: "Fotoautomat",                        da: "Fotoboks",                            es: "Fotomatón",                              fr: "Photomaton",                          nl: "Fotohokje" },
};

const LOCALES = ["en", "de", "da", "es", "fr", "nl"];

async function main() {
  const rows: { shopId: number; languageCode: string; name: string }[] = [];

  for (const [idStr, names] of Object.entries(translations)) {
    const shopId = Number(idStr);
    for (const locale of LOCALES) {
      rows.push({ shopId, languageCode: locale, name: names[locale] });
    }
  }

  await prisma.regionShopText.createMany({ data: rows, skipDuplicates: true });
  console.log(`Inserted ${rows.length} rows into regionshoptext.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
