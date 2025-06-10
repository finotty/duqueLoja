"use client";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export function FeaturedProducts() {
  const { products, loading } = useProducts('destaques');
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const router = useRouter();

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  if (!products.length) {
    return null;
  }

  const handleBuy = (product: typeof products[0]) => {
    addToCart({
      image: product.image,
      name: product.name,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(product.price),
      quantity: 1
    });
    setSelectedProduct(null);
    router.push('/carrinho');
  };

  const handleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Produtos em Destaque</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.card}
            onClick={() => setSelectedProduct(product)}
          >
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
              <div className={styles.price}>{formatPrice(product.price)}</div>
              <div className={styles.installments}>
                Em até 10x de {formatPrice(product.price / 10)} sem juros
              </div>
              <button 
                className={styles.favoriteButton}
                onClick={(e) => handleFavorite(e, product.id)}
                title={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorite(product.id) ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalImageContainer}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={300}
                height={300}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>
              <div className={styles.modalSpecs}>
                {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                  <div key={key} className={styles.modalSpec}>
                    <span className={styles.modalSpecLabel}>{key}</span>
                    <span className={styles.modalSpecValue}>{value}</span>
                  </div>
                ))}
              </div>
              <div className={styles.modalPrice}>
                {formatPrice(selectedProduct.price)}
              </div>
              <div className={styles.modalInstallments}>
                Em até 10x de {formatPrice(selectedProduct.price / 10)} sem juros
              </div>
              <button 
                className={styles.modalBuyButton}
                onClick={() => handleBuy(selectedProduct)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
            <button 
              className={styles.modalCloseButton}
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
} 