"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/img/Frame 99.png";
import { useRouter } from "next/navigation";
import { useProducts, Product } from "../../hooks/useProducts";

const menuItems = [
  { label: "Loja" },
  { label: "Pistolas", category: "pistolas" },
  { label: "Revólveres", category: "revolveres" },
  { label: "Espingardas", category: "espingardas" },
  { label: "Acessórios", category: "acessorios" },
  { label: "Treinamento" },
  { label: "Contato" },
];

export default function Header() {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [hoveredPistola, setHoveredPistola] = useState<Product | null>(null);
  const router = useRouter();
  const { getProductsByCategory, loading } = useProducts();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdownWrapper}`)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea} onClick={() => router.push("/")}>
        <Image src={logo} alt="Logo" width={260} height={60} quality={100} className={styles.logoImg} />
      </div>
      <nav className={styles.menu}>
        {menuItems.map((item, index) => {
          if (item.category) {
            const products = getProductsByCategory(item.category as Product['category']);
            return (
              <div key={item.label} className={styles.dropdownWrapper}>
                <div
                  className={styles.menuItem + (openMenuIndex === index ? ' ' + styles.active : '')}
                  onClick={() => handleMenuClick(index)}
                >
                  {item.label} <span className={styles.arrow}>{openMenuIndex === index ? "▲" : "▼"}</span>
                </div>
                {openMenuIndex === index && (
                  <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.dropdownContent}>
                      <div className={styles.pistolasList}>
                        <div className={styles.pistolasTitle}>
                          <span>🪖</span> Todas as {item.label}
                        </div>
                        <div className={styles.pistolasDivider}></div>
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className={styles.pistolaItem + (hoveredPistola?.id === product.id ? ' ' + styles.pistolaItemActive : '')}
                            onMouseEnter={() => setHoveredPistola(product)}
                            onMouseLeave={() => setHoveredPistola(null)}
                          >
                            {product.name}
                          </div>
                        ))}
                      </div>
                      <div className={styles.pistolaPreview}>
                        {hoveredPistola === null ? (
                          <div className={styles.previewDefault}>
                            <span>Passe o mouse sobre um produto</span>
                          </div>
                        ) : (
                          <div className={styles.previewProduto}>
                            <Image 
                              src={hoveredPistola.image} 
                              alt={hoveredPistola.name} 
                              width={180} 
                              height={120}
                              style={{ objectFit: 'contain' }}
                            />
                            <div className={styles.previewPreco}>
                              R$ {hoveredPistola.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
          return (
            <div key={item.label} className={styles.menuItem}>
              {item.label} <span className={styles.arrow}>▼</span>
            </div>
          );
        })}
      </nav>
      <div className={styles.rightArea}>
        <div className={styles.searchArea}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar produtos..."
          />
        </div>
        <button 
          className={styles.loginButton}
          onClick={() => router.push("/login")}
        >
          Entrar
        </button>
      </div>
    </header>
  );
}
