import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const animalNameToIdentifier: Record<string, string> = {
  "Domestic Pig": "domestic_pig",
  "Giant Tortoise": "giant_tortoise",
  "Sheep": "sheep",
  "Red Kangaroo": "red_kangaroo",
  "Koala": "koala",
  "Wild Boar": "wild_boar",
  "Kodiak Bear": "kodiak_bear",
  "Plains Zebra": "plains_zebra",
  "Red Fox": "red_fox",
  "Flamingo": "flamingo",
  "Bald Eagle": "bald_eagle",
  "Lion": "lion",
  "Moose": "moose",
  "Common Ostrich": "common_ostrich",
  "Lynx": "lynx",
  "Scarlet Macaw": "scarlet_macaw",
  "Armadillo": "armadillo",
  "Wolf": "wolf",
  "Reticulated Giraffe": "reticulated_giraffe",
  "Panther": "panther",
  "White Rhinoceros": "white_rhinoceros",
  "Alpaca": "alpaca",
  "Green Anaconda": "green_anaconda",
  "Baboon": "baboon",
  "Hippopotamus": "hippopotamus",
  "Nile Crocodile": "nile_crocodile",
  "American Bison": "american_bison",
  "Moon Bear": "moon_bear",
  "Toco Toucan": "toco_toucan",
  "Tapir": "tapir",
  "African Wild Ass": "african_wild_ass",
  "Komodo Dragon": "komodo_dragon",
  "European Badger": "european_badger",
  "Aardvark": "aardvark",
  "Polar Bear": "polar_bear",
  "Pesquet's Parrot": "pesquets_parrot",
  "Straw-Necked Ibis": "straw_necked_ibis",
  "Thresher Shark": "thresher_shark",
};

const levelData = [
  {"level":1,"coins":null,"diamonds":null,"zooItems":"Starting Level","enclosureItems":[],"chests":[],"animals":[]},
  {"level":2,"coins":2000,"diamonds":2,"zooItems":"5 trees","enclosureItems":[],"chests":[],"animals":[]},
  {"level":3,"coins":3500,"diamonds":2,"zooItems":"5 flowers","enclosureItems":[],"chests":[],"animals":[]},
  {"level":4,"coins":4000,"diamonds":2,"zooItems":"5 cactus","enclosureItems":[],"chests":[],"animals":[]},
  {"level":5,"coins":5000,"diamonds":2,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"grassland"}],"chests":[],"animals":[]},
  {"level":6,"coins":5000,"diamonds":2,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Domestic Pig"}]},
  {"level":7,"coins":5500,"diamonds":1,"zooItems":"10 iron fences","enclosureItems":[],"chests":[],"animals":[]},
  {"level":8,"coins":3000,"diamonds":1,"zooItems":"1 drink booth","enclosureItems":[],"chests":[],"animals":[]},
  {"level":9,"coins":3250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Giant Tortoise"}]},
  {"level":10,"coins":3500,"diamonds":10,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"water hole","biomeIdentifier":"grassland"}],"chests":[{"quantity":1,"chestType":"Normal"}],"animals":[]},
  {"level":11,"coins":3750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"forest"}],"chests":[],"animals":[]},
  {"level":12,"coins":4000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Sheep"}]},
  {"level":13,"coins":4250,"diamonds":1,"zooItems":"5 flowers","enclosureItems":[],"chests":[],"animals":[]},
  {"level":14,"coins":4500,"diamonds":1,"zooItems":"2 sweet chestnut trees","enclosureItems":[],"chests":[],"animals":[]},
  {"level":15,"coins":4750,"diamonds":5,"zooItems":"10 flowers","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":16,"coins":5000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Red Kangaroo"}]},
  {"level":17,"coins":5250,"diamonds":1,"zooItems":"3 Pink Rose Bushes","enclosureItems":[],"chests":[],"animals":[]},
  {"level":18,"coins":5500,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"plains"}],"chests":[],"animals":[]},
  {"level":19,"coins":5750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Koala"}]},
  {"level":20,"coins":6000,"diamonds":20,"zooItems":"15 white iron fences","enclosureItems":[],"chests":[{"quantity":2,"chestType":"Normal"}],"animals":[]},
  {"level":21,"coins":6250,"diamonds":1,"zooItems":"2 Plum Trees","enclosureItems":[],"chests":[],"animals":[]},
  {"level":22,"coins":6500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Wild Boar"}]},
  {"level":23,"coins":6750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"stump","biomeIdentifier":"forest"}],"chests":[],"animals":[]},
  {"level":24,"coins":7000,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"forest"}],"chests":[],"animals":[]},
  {"level":25,"coins":7250,"diamonds":5,"zooItems":"3 red photinia","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":26,"coins":7500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Kodiak Bear"}]},
  {"level":27,"coins":7750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"mountain"}],"chests":[],"animals":[]},
  {"level":28,"coins":8000,"diamonds":1,"zooItems":"20 stone pathways","enclosureItems":[],"chests":[],"animals":[]},
  {"level":29,"coins":8250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Plains Zebra"}]},
  {"level":30,"coins":8500,"diamonds":30,"zooItems":"1 rose arch","enclosureItems":[],"chests":[{"quantity":3,"chestType":"Normal"}],"animals":[]},
  {"level":31,"coins":8750,"diamonds":1,"zooItems":"10 flowers","enclosureItems":[],"chests":[],"animals":[]},
  {"level":32,"coins":9000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Red Fox"}]},
  {"level":33,"coins":9250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"playground","biomeIdentifier":null}],"chests":[],"animals":[]},
  {"level":34,"coins":9500,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"savanna"}],"chests":[],"animals":[]},
  {"level":35,"coins":9750,"diamonds":5,"zooItems":"3 bushes","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":36,"coins":10000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Flamingo"}]},
  {"level":37,"coins":10250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trunk","biomeIdentifier":"mountain"}],"chests":[],"animals":[]},
  {"level":38,"coins":10500,"diamonds":1,"zooItems":"1 lilac rosewood tree","enclosureItems":[],"chests":[],"animals":[]},
  {"level":39,"coins":10750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Bald Eagle"}]},
  {"level":40,"coins":11000,"diamonds":40,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"mountain"}],"chests":[{"quantity":4,"chestType":"Normal"}],"animals":[]},
  {"level":41,"coins":11250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"skull","biomeIdentifier":"savanna"}],"chests":[],"animals":[]},
  {"level":42,"coins":11500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Lion"}]},
  {"level":43,"coins":11750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"rocks","biomeIdentifier":"mountain"}],"chests":[],"animals":[]},
  {"level":44,"coins":12000,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"jungle"}],"chests":[],"animals":[]},
  {"level":45,"coins":12250,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"cactus","biomeIdentifier":"savanna"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":46,"coins":12500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Moose"}]},
  {"level":47,"coins":12750,"diamonds":1,"zooItems":"10 stone walls","enclosureItems":[],"chests":[],"animals":[]},
  {"level":48,"coins":13000,"diamonds":1,"zooItems":"1 philodendron (Jungle)","enclosureItems":[],"chests":[],"animals":[]},
  {"level":49,"coins":13250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Common Ostrich"}]},
  {"level":50,"coins":13750,"diamonds":50,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"maple tree","biomeIdentifier":"mountain"}],"chests":[{"quantity":5,"chestType":"Normal"}],"animals":[]},
  {"level":51,"coins":13750,"diamonds":1,"zooItems":"3 bushes","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Lynx"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":52,"coins":14000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":53,"coins":14250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"acacia","biomeIdentifier":"savanna"}],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":54,"coins":14500,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"palm tree","biomeIdentifier":"jungle"}],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":55,"coins":14750,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"savanna"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Scarlet Macaw"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":56,"coins":15000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":57,"coins":15250,"diamonds":1,"zooItems":"1 bush","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":58,"coins":15500,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"stone arch","biomeIdentifier":"mountain"}],"chests":[],"animals":[{"quantity":1,"name":"Armadillo"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":59,"coins":15750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":60,"coins":16000,"diamonds":60,"zooItems":null,"enclosureItems":[{"quantity":6,"name":"play rocks","biomeIdentifier":"savanna"}],"chests":[{"quantity":6,"chestType":"Normal"}],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":61,"coins":16250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":2,"name":"orchids","biomeIdentifier":"jungle"}],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":62,"coins":16500,"diamonds":1,"zooItems":"1 magnolia","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":63,"coins":16750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Wolf"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":64,"coins":17000,"diamonds":1,"zooItems":"10 yellow pansies","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":65,"coins":17250,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"jungle"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Reticulated Giraffe"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":66,"coins":17500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":67,"coins":17750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"deco rock","biomeIdentifier":"jungle"}],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":68,"coins":18000,"diamonds":1,"zooItems":"1 yellow rosewood tree","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Panther"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":69,"coins":18250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":70,"coins":18500,"diamonds":70,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"palm tree","biomeIdentifier":"jungle"}],"chests":[{"quantity":7,"chestType":"Normal"}],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":71,"coins":18750,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"lilypad pond","biomeIdentifier":null}],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":72,"coins":19000,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"japanese maple","biomeIdentifier":"mountain"}],"chests":[],"animals":[{"quantity":1,"name":"White Rhinoceros"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":73,"coins":19250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":74,"coins":19500,"diamonds":1,"zooItems":"2 Pink Rhododendron","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":75,"coins":19750,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":2,"name":"spruce","biomeIdentifier":"mountain"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"},{"quantity":1,"name":"Straw-Necked Ibis Puzzle Piece"}]},
  {"level":76,"coins":20000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Alpaca"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":77,"coins":20250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"savanna"}],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":78,"coins":20500,"diamonds":1,"zooItems":"2 Pink Hibiscus","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":79,"coins":20750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Green Anaconda"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":80,"coins":21000,"diamonds":80,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"palm tree","biomeIdentifier":"jungle"}],"chests":[{"quantity":8,"chestType":"Normal"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":81,"coins":21250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"jungle"}],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":82,"coins":21500,"diamonds":1,"zooItems":"1 Red Japanese Maple","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":83,"coins":21750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Baboon"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":84,"coins":22000,"diamonds":1,"zooItems":"10 Pink Larkspur","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":85,"coins":22250,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":3,"name":"dandelion","biomeIdentifier":"plains"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":86,"coins":22500,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Hippopotamus"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":87,"coins":22750,"diamonds":1,"zooItems":"10 Orange Lillies","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":88,"coins":23000,"diamonds":1,"zooItems":"1 Pink-Blossoming Chestnut","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":89,"coins":23250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Nile Crocodile"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":90,"coins":23500,"diamonds":90,"zooItems":"10 Red Lillies","enclosureItems":[],"chests":[{"quantity":9,"chestType":"Normal"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":91,"coins":23750,"diamonds":1,"zooItems":"3 White Rose Bush","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":92,"coins":24000,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":3,"name":"philodendron","biomeIdentifier":"jungle"}],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":93,"coins":24250,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"American Bison"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":94,"coins":24500,"diamonds":1,"zooItems":"3 Yellow Dahlias","enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":95,"coins":24750,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"small plum tree","biomeIdentifier":"jungle"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Moon Bear"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":96,"coins":25000,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":97,"coins":25250,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"small waterfall","biomeIdentifier":null}],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":98,"coins":25500,"diamonds":1,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"japanese maple","biomeIdentifier":"mountain"}],"chests":[],"animals":[{"quantity":1,"name":"Toco Toucan"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":99,"coins":25750,"diamonds":1,"zooItems":null,"enclosureItems":[],"chests":[],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":100,"coins":26000,"diamonds":100,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"elephant statue","biomeIdentifier":null}],"chests":[{"quantity":10,"chestType":"Normal"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":101,"coins":31000,"diamonds":5,"zooItems":"5 Enormous Red Lily","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":102,"coins":32000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"trough","biomeIdentifier":"water"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":103,"coins":33000,"diamonds":5,"zooItems":"1 Forest Toilet","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":104,"coins":34000,"diamonds":5,"zooItems":"2 Jungle Lanterns","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":105,"coins":35000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[{"quantity":1,"name":"Tapir"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":106,"coins":36000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":107,"coins":37000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"ice"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"African Wild Ass"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":108,"coins":38000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":109,"coins":39000,"diamonds":5,"zooItems":"5 Yellow Hibiscus","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":110,"coins":40000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Legendary"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":111,"coins":41000,"diamonds":5,"zooItems":"1 White Rhododendron","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":112,"coins":42000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"shelter","biomeIdentifier":"ice"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":113,"coins":43000,"diamonds":5,"zooItems":"2 Savanna Lanterns","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":114,"coins":44000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Komodo Dragon"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":115,"coins":45000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":116,"coins":46000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"japanese maple","biomeIdentifier":"jungle"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":117,"coins":47000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"watering hole","biomeIdentifier":"jungle"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":118,"coins":48000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"European Badger"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":119,"coins":49000,"diamonds":5,"zooItems":"2 Mountain Lanterns","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":120,"coins":50000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Legendary"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":121,"coins":51000,"diamonds":5,"zooItems":"1 Purple Rhododendron","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":122,"coins":52000,"diamonds":5,"zooItems":null,"enclosureItems":[{"quantity":1,"name":"mangrove","biomeIdentifier":"water"}],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":123,"coins":53000,"diamonds":5,"zooItems":"5 Mixed Hydrangeas","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":124,"coins":54000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Aardvark"},{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":125,"coins":55000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[{"quantity":1,"name":"Pesquet's Parrot Puzzle Piece"}]},
  {"level":126,"coins":56000,"diamonds":5,"zooItems":"5 Big Blue Bamboos","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":127,"coins":57000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":128,"coins":58000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Polar Bear"},{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":129,"coins":59000,"diamonds":5,"zooItems":"1 Ice Toilet","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":130,"coins":60000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Legendary"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":131,"coins":61000,"diamonds":5,"zooItems":"1 Colorful Laburnum","enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":132,"coins":62000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":133,"coins":63000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":134,"coins":64000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":135,"coins":65000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":136,"coins":66000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":137,"coins":67000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":138,"coins":68000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":139,"coins":69000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":140,"coins":70000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Legendary"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":141,"coins":71000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":142,"coins":72000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":143,"coins":73000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":144,"coins":74000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":145,"coins":75000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":146,"coins":76000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":147,"coins":77000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":148,"coins":78000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":149,"coins":79000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[{"quantity":1,"name":"Thresher Shark Puzzle Piece"}]},
  {"level":150,"coins":80000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Legendary"}],"animals":[]},
  {"level":151,"coins":81000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":152,"coins":82000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":153,"coins":83000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":154,"coins":84000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":155,"coins":85000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Retro"}],"animals":[]},
  {"level":156,"coins":86000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":157,"coins":87000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":158,"coins":88000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":159,"coins":89000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":160,"coins":90000,"diamonds":100,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"},{"quantity":1,"chestType":"Legendary"}],"animals":[]},
  {"level":161,"coins":91000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":162,"coins":92000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":163,"coins":93000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":164,"coins":94000,"diamonds":5,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"}],"animals":[]},
  {"level":165,"coins":95000,"diamonds":10,"zooItems":null,"enclosureItems":[],"chests":[{"quantity":1,"chestType":"Epic"},{"quantity":1,"chestType":"Legendary"}],"animals":[]},
];

function getAnimalIdentifier(name: string): string | null {
  // Strip "Puzzle Piece" suffix
  const baseName = name.replace(/ Puzzle Piece$/, "").trim();
  return animalNameToIdentifier[baseName] ?? null;
}

async function main() {
  console.log("Seeding level rewards...");

  // Pre-fetch animal identifiers to avoid N+1 queries
  const allAnimals = await prisma.animal.findMany({
    select: { id: true, identifier: true },
  });
  const animalByIdentifier = new Map(
    allAnimals.filter((a) => a.identifier).map((a) => [a.identifier!, a.id])
  );

  await prisma.$transaction(async (tx) => {
    for (const entry of levelData) {
      // Resolve animal IDs
      const animalRewardsData = entry.animals.map((a) => {
        const identifier = getAnimalIdentifier(a.name);
        const animalId = identifier ? animalByIdentifier.get(identifier) ?? null : null;
        return {
          quantity: a.quantity,
          name: a.name,
          animalId,
        };
      });

      await tx.levelReward.create({
        data: {
          level: entry.level,
          coins: entry.coins,
          diamonds: entry.diamonds,
          texts: entry.zooItems
            ? { create: { languageCode: "en", zooItems: entry.zooItems } }
            : undefined,
          enclosureItems: {
            create: entry.enclosureItems.map((e) => ({
              quantity: e.quantity,
              name: e.name,
              biomeIdentifier: e.biomeIdentifier ?? null,
            })),
          },
          chests: {
            create: entry.chests.map((c) => ({
              quantity: c.quantity,
              chestType: c.chestType,
            })),
          },
          animalRewards: {
            create: animalRewardsData,
          },
        },
      });
    }
  });

  console.log(`Seeded ${levelData.length} level rewards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
