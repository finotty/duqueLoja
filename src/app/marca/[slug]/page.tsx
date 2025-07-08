"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '../../../data/products';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import styles from './styles.module.scss';
import ProductCard from '../../../components/ProductCard';

export default function BrandPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const slug = params.slug as string;
        const formattedBrandName = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        setBrandName(formattedBrandName);

        // Buscar na coleção 'products'
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('marca', '==', formattedBrandName));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        })) as Product[];

        // Buscar na coleção 'customProducts'
        const customRef = collection(db, 'customProducts');
        const qCustom = query(customRef, where('marca', '==', formattedBrandName));
        const customSnapshot = await getDocs(qCustom);
        const customProductsData = customSnapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        })) as Product[];

        // Unir os dois arrays
        setProducts([...productsData, ...customProductsData]);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.slug]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Produtos {brandName}</h1>
      
      {products.length === 0 ? (
        <div className={styles.noProducts}>
          <p>Nenhum produto encontrado para esta marca.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 