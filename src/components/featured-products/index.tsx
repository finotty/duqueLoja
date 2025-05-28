import React from "react";
import styles from "./styles.module.scss";
import Product from "../product";
import pistola1 from "../../../public/img/pistola 1.png";
import pistola2 from "../../../public/img/pistola 2.png";
import pistola3 from "../../../public/img/pistola 3.png";

const products = [
  {
    image: pistola1,
    name: "Pistola Glock G19 Gen5",
    price: "R$ 4.950,00",
    rating: 4.5,
    reviews: 154,
    isNew: true,
    description: "A Glock G19 Gen5 é uma pistola compacta, ideal para defesa pessoal e uso policial. Possui alta precisão, durabilidade e fácil manutenção.",
  },
  {
    image: pistola2,
    name: "Pistola Taurus TX22",
    price: "R$ 3277.50",
    rating: 4.0,
    reviews: 76,
    isNew: true,
    discount: "-5%",
    description: "A Taurus TX22 é uma pistola moderna, leve e ergonômica, perfeita para prática esportiva e lazer.",
  },
  {
    image: pistola3,
    name: "Revólver Smith & Wesson 686",
    price: "R$ 5301.00",
    rating: 4.7,
    reviews: 89,
    discount: "-10%",
    description: "O revólver Smith & Wesson 686 é reconhecido por sua robustez, precisão e confiabilidade, sendo uma escolha clássica para atiradores.",
  },
  {
    image: pistola3,
    name: "Revólver Smith & Wesson 686",
    price: "R$ 5301.00",
    rating: 4.7,
    reviews: 89,
    discount: "-10%",
    description: "O revólver Smith & Wesson 686 é reconhecido por sua robustez, precisão e confiabilidade, sendo uma escolha clássica para atiradores.",
  },
  {
    image: pistola3,
    name: "Revólver Smith & Wesson 686",
    price: "R$ 5301.00",
    rating: 4.7,
    reviews: 89,
    discount: "-10%",
    description: "O revólver Smith & Wesson 686 é reconhecido por sua robustez, precisão e confiabilidade, sendo uma escolha clássica para atiradores.",
  },
  {
    image: pistola3,
    name: "Revólver Smith & Wesson 686",
    price: "R$ 5301.00",
    rating: 4.7,
    reviews: 89,
    discount: "-10%",
    description: "O revólver Smith & Wesson 686 é reconhecido por sua robustez, precisão e confiabilidade, sendo uma escolha clássica para atiradores.",
  },
];

export default function FeaturedProducts() {
  return (
    <section className={styles.featuredSection}>
      <div className={styles.header}>
        <h2>Produtos em Destaque</h2>
        <button className={styles.filterBtn}>Filtros</button>
      </div>
      <div className={styles.productsGrid}>
        {products.map((p, i) => (
          <Product key={i} {...p} />
        ))}
      </div>
      <div className={styles.moreBtnWrapper}>
        <button className={styles.moreBtn}>Ver mais produtos</button>
      </div>
    </section>
  );
} 