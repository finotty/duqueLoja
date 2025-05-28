import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import pistola1 from "../../../public/img/pistola 1.png";
import pistola2 from "../../../public/img/pistola 2.png";
import pistola3 from "../../../public/img/pistola 3.png";
import { useCart } from "../../context/CartContext";

const produtos = [
  {
    image: pistola1,
    name: "Pistola Glock G19 Gen5",
    badge: "Novo",
    price: "R$ 4.950,00",
  },
  {
    image: pistola2,
    name: "Pistola Taurus TX22",
    badge: "-5%",
    price: "R$ 3.277,50",
  },
  {
    image: pistola3,
    name: "Revólver Smith & Wesson 686",
    badge: "-10%",
    price: "R$ 5.301,00",
  },
];

export default function ProdutosQuePodemInteressar() {
  const { addToCart } = useCart();
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Produtos que podem te interessar</h2>
      <div className={styles.grid}>
        {produtos.map((p, i) => (
          <div className={styles.card} key={i}>
            {p.badge && (
              <span className={p.badge === "Novo" ? styles.badgeNew : styles.badgeDiscount}>{p.badge}</span>
            )}
            <Image src={p.image} alt={p.name} width={120} height={80} className={styles.productImg} />
            <div className={styles.name}>{p.name}</div>
            <div className={styles.price}>{p.price}</div>
            <button className={styles.addBtn} onClick={() => addToCart({
              image: typeof p.image === 'object' && 'src' in p.image ? p.image.src : p.image,
              name: p.name,
              price: p.price,
              quantity: 1
            })}>Adicionar</button>
          </div>
        ))}
      </div>
    </section>
  );
} 