"use client";
import { useState, useRef } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./styles.module.scss";
import ProductImage from "../ProductImage";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function FeaturedProducts() {
  const { products, loading } = useProducts('destaques');
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user, setRedirectPath } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 300; // Largura base do card
      const gap = 35; // Espaçamento entre cards (2rem = 32px)
      const cardsPerView = 5; // Número máximo de cards visíveis
      const scrollAmount = (cardWidth + gap) * cardsPerView;
      
      const currentScroll = scrollRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  if (!products.length) {
    return null;
  }

  const handleBuy = (product: typeof products[0]) => {
    if (!user) {
      localStorage.setItem('pendingProduct', JSON.stringify({
        image: product.image,
        name: product.name,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.price),
        quantity: 1
      }));
      
      setSelectedProduct(null);
      setRedirectPath('/carrinho');
      router.push('/login');
      return;
    }

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
    
    if (!user) {
      setRedirectPath('/');
      router.push('/login');
      return;
    }

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
      <div className={styles.scrollContainer}>
        <button 
          className={`${styles.scrollButton} ${styles.leftButton}`}
          onClick={() => scroll('left')}
        >
          <FaChevronLeft />
        </button>
        <div className={styles.productsScroll} ref={scrollRef}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => setSelectedProduct(product)}
            >
              <div className={styles.imageContainer}>
                <ProductImage
                  image={product.image}
                  alt={product.name}
                  stylesCustom={{ 
                    marginLeft:'20%',
                    marginTop:'13%'
                  }}
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    objectFit: 'contain' 
                  }}
                />
                <button 
                  className={styles.favoriteButton}
                  onClick={(e) => handleFavorite(e, product.id)}
                  title={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {isFavorite(product.id) ? <FaHeart color="#e74c3c" /> : <FaRegHeart color="#000" />}
                </button>
              </div>
              <div className={styles.content}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.price}>{formatPrice(product.price)}</div>
                <div className={styles.installments}>
                  Em até 10x de {formatPrice(product.price / 10)} sem juros
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          className={`${styles.scrollButton} ${styles.rightButton}`}
          onClick={() => scroll('right')}
        >
          <FaChevronRight />
        </button>
      </div>

      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalImageContainer}>
              <ProductImage
                image={selectedProduct.image}
                alt={selectedProduct.name}
                style={{ 
                  width: '300px', 
                  height: '300px', 
                  objectFit: 'contain' 
                }}
                stylesCustom={{ 
                  marginLeft:'28%',
                  marginTop:'13%'
                }}
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