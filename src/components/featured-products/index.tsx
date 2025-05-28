"use client";
import { useProducts } from "@/hooks/useProducts";
import styles from "./styles.module.scss";
import Image from "next/image";

export function FeaturedProducts() {
  const { products, loading } = useProducts('destaques');

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Produtos em Destaque</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.specs}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className={styles.spec}>
                    <span className={styles.specLabel}>{key}</span>
                    <span className={styles.specValue}>{value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.price}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </div>
              <button className={styles.buyButton}>
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 