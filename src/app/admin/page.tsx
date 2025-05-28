"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { preConfiguredProducts, Product } from "../../data/products";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import styles from "./styles.module.scss";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [displayLocation, setDisplayLocation] = useState<'header' | 'destaques' | 'recomendados'>('header');
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const productData = {
        ...selectedProduct,
        price: Number(price),
        displayLocation
      };

      await addDoc(collection(db, "products"), productData);
      setMessage({ text: "Produto cadastrado com sucesso!", type: "success" });
      setSelectedProduct(null);
      setPrice("");
    } catch (error) {
      setMessage({ text: "Erro ao cadastrar produto", type: "error" });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>Painel Administrativo</h1>
      <div className={styles.welcome}>
        Bem-vindo, {user.email}!
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Cadastrar Produto</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Produto</label>
              <select
                value={selectedProduct?.id || ""}
                onChange={(e) => {
                  const product = preConfiguredProducts.find(p => p.id === e.target.value);
                  setSelectedProduct(product || null);
                }}
                required
              >
                <option value="">Selecione um produto</option>
                {preConfiguredProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div className={styles.formGroup}>
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Local de Exibição</label>
                  <select
                    value={displayLocation}
                    onChange={(e) => setDisplayLocation(e.target.value as any)}
                    required
                  >
                    <option value="header">Menu Principal</option>
                    <option value="destaques">Produtos em Destaque</option>
                    <option value="recomendados">Produtos Recomendados</option>
                  </select>
                </div>

                <div className={styles.productPreview}>
                  <h3>Preview do Produto</h3>
                  <div className={styles.previewContent}>
                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                    <div className={styles.previewDetails}>
                      <h4>{selectedProduct.name}</h4>
                      <div className={styles.specs}>
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className={styles.spec}>
                            <span className={styles.specLabel}>{key}:</span>
                            <span className={styles.specValue}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              Cadastrar Produto
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2>Produtos Cadastrados</h2>
          <p>Visualizar e gerenciar produtos cadastrados</p>
        </div>

        <div className={styles.card}>
          <h2>Pedidos</h2>
          <p>Visualizar e gerenciar pedidos</p>
        </div>
      </div>
    </div>
  );
} 