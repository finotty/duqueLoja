export interface Product {
  id: string;
  name: string;
  category: 'pistolas' | 'revolveres' | 'espingardas' | 'acessorios';
  image: string;
  specifications: {
    calibre?: string;
    capacidade?: string;
    peso?: string;
    comprimento?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  price: number;
  displayLocation?: 'header' | 'destaques' | 'recomendados';
}

export const preConfiguredProducts: Product[] = [
  {
    id: 'pistola-9mm-1',
    name: 'Pistola Beretta m9a4 cal9mm 18 tiros cano 5 polegadas',
    category: 'pistolas',
    image: '/img/products/pistola-beretta-m9a4-cal9mm-18-tiros-cano-5polegadas_1_200.jpg',
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
    specifications: {
      calibre: '9mm',
      capacidade: '17',
      peso: '1.1kg',
      comprimento: '180mm',
      material: 'Aço inoxidável'
    },
    price: 0
  },

  
]; 