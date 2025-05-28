"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/img/Frame 99.png";
import pistola1 from "../../../public/img/pistola 1.png";
import pistola2 from "../../../public/img/pistola 2.png";
import pistola3 from "../../../public/img/pistola 3.png";
//import mira from "../../../public/img/mira.png";
import { useRouter } from "next/navigation";

const menuItems = [
  { label: "Loja" },
  { label: "Pistolas" },
  { label: "Revólveres" },
  { label: "Espingardas" },
  { label: "Acessórios" },
  { label: "Treinamento" },
  { label: "Contato" },
];

const pistolas = [
  {
    nome: "Pistola 9mm",
    img: pistola1,
    preco: "R$ 4.950,00",
  },
  {
    nome: "Pistola .40",
    img: pistola2,
    preco: "R$ 5.200,00",
  },
  {
    nome: "Pistola .45",
    img: pistola3,
    preco: "R$ 5.800,00",
  },
  {
    nome: "Pistolas Compactas",
    img: pistola1,
    preco: "R$ 4.700,00",
  },
  {
    nome: "Pistolas Full-Size",
    img: pistola2,
    preco: "R$ 5.600,00",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPistola, setHoveredPistola] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdownWrapper}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea} onClick={() => router.push("/")}>
        <Image src={logo} alt="Logo" width={260} height={60} quality={100} className={styles.logoImg} />
      </div>
      <nav className={styles.menu}>
        {menuItems.map((item) => {
          if (item.label === "Pistolas") {
            return (
              <div key={item.label} className={styles.dropdownWrapper}>
                <div
                  className={styles.menuItem + (isOpen ? ' ' + styles.active : '')}
                  onClick={handleMenuClick}
                >
                  {item.label} <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.dropdownContent}>
                      <div className={styles.pistolasList}>
                        <div className={styles.pistolasTitle}><span>🪖</span> Todas as Pistolas</div>
                        <div className={styles.pistolasDivider}></div>
                        {pistolas.map((p, idx) => (
                          <div
                            key={p.nome}
                            className={styles.pistolaItem + (hoveredPistola === idx ? ' ' + styles.pistolaItemActive : '')}
                            onMouseEnter={() => setHoveredPistola(idx)}
                            onMouseLeave={() => setHoveredPistola(null)}
                          >
                            {p.nome}
                          </div>
                        ))}
                      </div>
                      <div className={styles.pistolaPreview}>
                        {hoveredPistola === null ? (
                          <div className={styles.previewDefault}>
                            {/*<Image src={mira} alt="Mira" width={60} height={60} />*/}
                            <span>Passe o mouse sobre um produto</span>
                          </div>
                        ) : (
                          <div className={styles.previewProduto}>
                            <Image src={pistolas[hoveredPistola].img} alt={pistolas[hoveredPistola].nome} width={180} height={120} />
                            <div className={styles.previewPreco}>{pistolas[hoveredPistola].preco}</div>
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
      <div className={styles.searchArea}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar produtos..."
        />
      </div>
    </header>
  );
}
