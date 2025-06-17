"use client";

import { Product } from '../../data/products';
import styles from './styles.module.scss';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user, setRedirectPath } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      // Salva o produto no localStorage para adicionar ao carrinho após o login
      localStorage.setItem('pendingProduct', JSON.stringify({
        image: product.image,
        name: product.name,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.price),
        quantity: 1
      }));
      
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
    router.push('/carrinho');
  };

  return (
    <div className={styles.productCard}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
      {product.specifications && (
        <div className={styles.specifications}>
          {Object.entries(product.specifications).map(([key, value]) => (
            <p key={key} className={styles.spec}>
              <strong>{key}:</strong> {value}
            </p>
          ))}
        </div>
      )}
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
} 