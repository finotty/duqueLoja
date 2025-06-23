export interface Product {
  id: string;
  firestoreId?: string;
  name: string;
  category: 'pistolas' | 'revolveres' | 'espingardas' | 'acessorios' | 'taticos' | 'esporte';
  image: string;
  marca: string;
  specifications: {
    calibre?: string;
    capacidade?: string;
    peso?: string;
    comprimento?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  price: number;
  displayLocation?: 'header' | 'destaques' | 'recomendados' | 'taticos';
}

export const preConfiguredProducts: Product[] = [
  {
    id: 'pistola-9mm-1',
    name: 'Pistola Beretta m9a4 cal9mm 18 tiros cano 5 polegadas',
    category: 'pistolas',
    image: '/img/products/pistola-beretta-m9a4-cal9mm-18-tiros-cano-5polegadas_1_200.jpg',
    marca: 'Beretta',
    specifications: {
      calibre: '9mm',
      capacidade: '17+1',
      peso: '970g',
      comprimento: '216mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },
  {
    id: 'pistola-glock-g17',
    name: 'Pistola- Glock g17 gen3 cal 9mm Oxidada 17 Tiros',
    category: 'pistolas',
    image: '/img/products/pistola-glock-g17-gen3-cal-9mm-oxidada-17-tiros_1_200.jpg',
    marca: 'Glock',
    specifications: {
      calibre: '.9mm',
      capacidade: '17',
      peso: '1020g',
      comprimento: '216mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },
  {
    id: 'revolver-38-1',
    name: 'Revólver .38 Taurus 856',
    category: 'revolveres',
    image: '/img/products/revolver-38-1.jpg',
    marca: 'Taurus',
    specifications: {
      calibre: '.38 Special',
      capacidade: '6 tiros',
      peso: '680g',
      comprimento: '165mm',
      material: 'Aço carbono'
    },
    price: 0
  },
  {
    id: 'espingarda-12-1',
    name: 'Espingarda Semi Automatica Huglu xr7 Calibre 12 18 Polegadas Black',
    category: 'espingardas',
    image: '/img/products/espingarda-semi-automatica-huglu-xr7-calibre12-18polegadas-black_1_200.jpg',
    marca: 'Huglu',
    specifications: {
      calibre: '12',
      capacidade: '4+1',
      peso: '3.2kg',
      comprimento: '1016mm',
      material: 'Aço e madeira'
    },
    price: 0
  },
  {
    id: 'pistola-beretta-17',
    name: 'Pistola Beretta APX Cal. 9mm Oxidada 17 Tiros Cano 4.25"',
    category: 'pistolas',
    image: '/img/products/pistola-beretta-apx-cal9mm-oxidada-17-tiros-cano-425polegadas_1_200.jpg',
    marca: 'Beretta',
    specifications: {
      calibre: '9mm',
      capacidade: '17+1',
      peso: '1.1kg',
      comprimento: '180mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },
  {
    id: 'pistola-ceska-zbrojovka-9mm-2',
    name: 'Pistola 9mm CZ Shadow 2 Oxidada Tala Azul 17 Tiros Cano 4.7"',
    category: 'pistolas',
    image: '/img/products/pistola-ceska-zbrojovka-cz-shadow-2-cal9mm-oxidada-tala-azul-17-tiros-cano-47_1_200.png',
    marca: 'CZ',
    specifications: { 
      calibre: '9mm',
      capacidade: '17',
      peso: '1.1kg',
      comprimento: '180mm',
      material: 'Aço inoxidável'
    }, 
    price: 0
  },
  {
    id: 'pistola-alfa-proj-brno-cz3035-635mm-1',
    name: 'Pistola Alfa Proj Brno CZ3035 635mm',
    category: 'pistolas',
    image: '/img/products/pistola-alfa-proj-brno-cz3035-635mm_1_12001.jpg',
    marca: 'Alfa Proj',
    specifications: {
      calibre: '9mm',
      capacidade: '17',
      peso: '1.1kg',
      comprimento: '180mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },
  {
    id: 'pistola-springfield-hellcat-micro-compact-osp-cal9mm-13-tiros-cano-3polegadas',
    name: 'Pistola Springfield Hellcat Micro Compact OSP Cal. 9mm 13',
    category: 'pistolas',
    image: '/img/products/Springfield.jpg',
    marca: 'bersa',
    specifications: {
      calibre: '9mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },
];

export const tacticalEquipment: Product[] = [
  {
    id: 'tatico-1',
    name: 'Coldre Int. Pol. Fobus APN19J Glock G19/G23/G25/G32',
    image: '/img/acessorios/coldre-int-pol-fobus-apn19j-glock-g19-g23-g25-g3_1_200.jpg',
    price: 299.90,
    category: 'taticos',
    marca: 'Glock',
    specifications: {
      'Marca': 'Fobus',
      'Modelo': 'APN19J',
      'Compatibilidade': 'Glock G19/G23/G25/G32',
      'Material': 'Polímero',
      'Tipo': 'Interno'
    }
  },
  {
    id: 'tatico-2',
    name: 'Coldre de Cintura Fobus para Imbel/Colt',
    image: '/img/acessorios/coldre-de-cintura-fobus-para-imbel-colt-kmspnd-ref239_1_200.jpg',
    price: 249.90,
    category: 'taticos',
    marca: 'boito',
    specifications: {
      'Marca': 'Fobus',
      'Modelo': 'KMSPND',
      'Compatibilidade': 'Imbel/Colt',
      'Material': 'Polímero',
      'Tipo': 'Cintura'
    }
  },
  {
    id: 'tatico-3',
    name: 'Coldre Ext. Magnum Glock G19/G25 Black Canhoto',
    image: '/img/acessorios/coldre-ext-magnum-glock-g19-g25-black-canhoto_1_200.jpg',
    price: 199.90,
    category: 'taticos',
    marca: 'hatsan',
    specifications: {
      'Marca': 'Magnum',
      'Modelo': 'G19/G25',
      'Compatibilidade': 'Glock G19/G25',
      'Material': 'Nylon',
      'Tipo': 'Externo'
    }
  },
  {
    id: 'tatico-4',
    name: 'Relógio Glock Watch Global Chrono',
    image: '/img/acessorios/relogio-glock-watch-global-chrono-set-gwc0003_4_200.jpg',
    price: 1299.90,
    category: 'taticos',
    marca: 'Glock',
    specifications: {
      'Marca': 'Glock',
      'Modelo': 'GWC0003',
      'Tipo': 'Cronógrafo',
      'Material': 'Aço Inox',
      'Resistência': '200m'
    }
  },
  {
    id: 'tatico-5',
    name: 'Coldre Neoprene Pistola Taurus PT840 Destro',
    image: '/img/acessorios/coldre-neoprene-pistola-taurus-pt840-destro_1_200.jpg',
    price: 179.90,
    category: 'taticos',
    marca: 'taurus',
    specifications: {
      'Marca': 'Taurus',
      'Modelo': 'PT840',
      'Compatibilidade': 'Taurus PT840',
      'Material': 'Neoprene',
      'Tipo': 'Cintura'
    }
  },
  {
    id: 'tatico-6',
    name: 'Coldre Cobra Kydex Pist Taurus G2C Destro',
    image: '/img/acessorios/coldre-cobra-kydex-pist-taurus-g2c-destro_1_200.jpg',
    price: 229.90,
    category: 'taticos',
    marca: 'yildiz',
    specifications: {
      'Marca': 'Cobra',
      'Modelo': 'G2C',
      'Compatibilidade': 'Taurus G2C',
      'Material': 'Kydex',
      'Tipo': 'Cintura'
    }
  },
  {
    id: 'tatico-7',
    name: 'Jet Loader 5T 520',
    image: '/img/acessorios/jet-loader-5t-520_1_200.jpg',
    price: 159.90,
    category: 'taticos',
    marca: 'Jet Loader',
    specifications: {
      'Marca': 'Jet Loader',
      'Modelo': '5T 520',
      'Capacidade': '5 munições',
      'Material': 'Polímero',
      'Tipo': 'Carregador Rápido'
    }
  }
]; 

export const sportEquipment: Product[] = [
  {
    id: 'esporte-1',
    name: 'Carabina de Pressao Gamo Big Cat 1000 IGT cal 55mm',
    image: '/img/esportivo/carabina-de-pressao-gamo-big-cat-1000-igt-cal-55mm_1_200.jpg',
    price: 299.90,
    category: 'esporte',
    marca: 'Glock',
    specifications: {
      calibre: '55mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
  },
  {
    id: 'esporte-2',
    name: 'carabina de pressao gamo elite premium igt 55mm',
    image: '/img/esportivo/carabina-de-pressao-gamo-elite-premium-igt-55mm_1_200.jpg',
    price: 299.90,
    category: 'esporte',
    marca: 'Glock',
    specifications: {
      calibre: '55mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
  },
  {
    id: 'esporte-3',
    name: 'Carpressao hatsan ht 95 sas 55mm gas ram',
    image: '/img/esportivo/carpressao-hatsan-ht-95-sas-55mm-gas-ram_1_200.jpg',
    price: 299.90,
    category: 'esporte',
    marca: 'Glock',
    specifications: {
      calibre: '55mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
  },
  {
    id: 'esporte-4',
    name: 'Pistola umarex hecklerkoch usp co2 45mm 22 tiros',
    image: '/img/esportivo/pistola-umarex-hecklerkoch-usp-co2-45mm-22-tiros_1_200.jpg',
    price: 299.90,
    category: 'esporte',
    marca: 'Glock',
    specifications: {
      calibre: '55mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
  },
  {
    id: 'esporte-5',
    name: 'Revolver umarex colt double duel co2 45mm 6t',
    image: '/img/esportivo/revolver-umarex-colt-double-duel-co2-45mm-6t_1_200.jpg',
    price: 299.90,
    category: 'esporte',
    marca: 'Glock',
    specifications: {
      calibre: '55mm',
      capacidade: '13',
      peso: '0.8kg',
      comprimento: '160mm',
      material: 'Aço inoxidável'
    },
  },
]; 