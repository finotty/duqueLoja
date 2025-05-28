"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  specifications: Record<string, string>;
  location: string;
  displayLocation: string;
  category: string;
}

export function useProducts(location?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, "products");
      const q = location 
        ? query(productsRef, where('displayLocation', '==', location))
        : productsRef;
      
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByLocation = (location: 'header' | 'destaques' | 'recomendados') => {
    return products.filter(product => product.displayLocation === location);
  };

  const getProductsByCategory = (category: Product['category']) => {
    return products.filter(product => product.category === category);
  };

  useEffect(() => {
    fetchProducts();
  }, [location]);

  return {
    products,
    loading,
    error,
    getProductsByLocation,
    getProductsByCategory,
    refreshProducts: fetchProducts
  };
} 