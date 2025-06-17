"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/img/Frame 99.png";
import { useRouter } from "next/navigation";
import { useProducts, Product } from "../../hooks/useProducts";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { FaUser, FaShoppingCart, FaHeart, FaSignOutAlt, FaCog, FaTachometerAlt, FaSearch } from "react-icons/fa";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { FaRegHeart } from "react-icons/fa";

const menuItems = [
  { label: "Pistolas", category: "pistolas" },
  { label: "Revólveres", category: "revolveres" },
  { label: "Espingardas", category: "espingardas" },
  { label: "Acessórios", category: "acessorios" },
  { label: "Treinamento" },
  { label: "Contato", href: "/contato" },
];

export default function Header() {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [hoveredPistola, setHoveredPistola] = useState<Product | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [primeiroNome, setPrimeiroNome] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { getProductsByCategory, loading, products } = useProducts();
  const { user, setRedirectPath, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Função para extrair o primeiro nome
  const extrairPrimeiroNome = (nomeCompleto: string) => {
    return nomeCompleto.split(' ')[0];
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const dados = getFirestore(db.app);
          const userDoc = doc(dados, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (userData.nomeCompleto) {
              setPrimeiroNome(extrairPrimeiroNome(userData.nomeCompleto));
              console.log(userData.nomeCompleto);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.dropdownWrapper}`) && !target.closest(`.${styles.userMenuWrapper}`)) {
        setOpenMenuIndex(null);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log('Estado do menu mudou:', userMenuOpen);
  }, [userMenuOpen]);

  const handleMenuClick = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle menu - Estado atual:', userMenuOpen);
    setUserMenuOpen(prev => !prev);
    console.log('Toggle menu - Novo estado:', !userMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenMenuIndex(null);
  };

  const handleBuy = (product: Product) => {
    if (!user) {
      // Salva o produto no localStorage antes de redirecionar
      localStorage.setItem('pendingProduct', JSON.stringify({
        image: product.image,
        name: product.name,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.price),
        quantity: 1
      }));
      
      // Fecha o modal antes de redirecionar
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
      console.log('Usuário não logado, salvando produto pendente:', productId);
      // Salva apenas o ID do produto no localStorage
      localStorage.setItem('pendingFavorite', productId);
      
      // Fecha o modal antes de redirecionar
      setSelectedProduct(null);
      setRedirectPath('/favoritos');
      router.push('/login');
      return;
    }

    try {
      if (isFavorite(productId)) {
        console.log('Removendo dos favoritos:', productId);
        await removeFromFavorites(productId);
      } else {
        console.log('Adicionando aos favoritos:', productId);
        await addToFavorites(productId);
      }
    } catch (error) {
      console.error('Erro ao manipular favoritos:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoArea} onClick={() => router.push("/")}>
        <Image src={logo} alt="Logo" width={260} height={60} quality={100} className={styles.logoImg} />
      </div>
      <nav className={styles.menu}>
        {menuItems.map((item, index) => {
          if (item.category) {
            const products = item.category === "acessorios"
              ? [...getProductsByCategory("acessorios"), ...getProductsByCategory("taticos")]
              : getProductsByCategory(item.category as Product['category']);
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
                            onClick={() => handleProductClick(product)}
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
          } else if (item.href) {
            return (
              <div
                key={item.label}
                className={styles.menuItem}
                onClick={() => router.push(item.href!)}
              >
                {item.label}
              </div>
            );
          } else {
            return (
              <div key={item.label} className={styles.menuItem}>
                {item.label}
              </div>
            );
          }
        })}
      </nav>
      <div className={styles.rightArea}>
        <div className={styles.searchArea}>
          <FaSearch className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowSearchResults(true)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className={styles.searchResultItem}
                  onClick={() => handleSearchResultClick(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                  />
                  <div className={styles.searchResultInfo}>
                    <span className={styles.searchResultName}>{product.name}</span>
                    <span className={styles.searchResultPrice}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {user ? (
          <div className={styles.userMenuWrapper}>
            <button 
              className={styles.userButton}
              onClick={toggleUserMenu}
            >
              <FaUser size={20} />
              {primeiroNome && <span className={styles.userName}>{primeiroNome}</span>}
            </button>
            {userMenuOpen && (
              <div 
                className={styles.userMenu} 
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>
                    <FaUser size={20} />
                  </div>
                  <span>Olá, {primeiroNome}</span>
                </div>
                <div className={styles.menuItems}>
                  {!isAdmin && <button onClick={() => router.push('/dashboard')}>
                    <FaTachometerAlt /> Dashboard
                  </button>}
                  {isAdmin && (
                    <button onClick={() => router.push('/admin')}>
                      <FaCog /> Painel Admin
                    </button>
                  )}
                  
                  <button onClick={() => {
                  router.push('/carrinho');
                  setUserMenuOpen(false);
                   }}>
                  <FaShoppingCart /> Carrinho
                  </button>

                  <button onClick={() => router.push('/favoritos')}>
                    <FaHeart /> Favoritos
                  </button>
                   
                  
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            className={styles.loginButton}
            onClick={() => {
              setRedirectPath('/');
              router.push("/login");
            }}
          >
            Entrar
          </button>
        )}
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
              <button 
                className={styles.modalFavoriteButton}
                onClick={(e) => handleFavorite(e, selectedProduct.id)}
                title={isFavorite(selectedProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorite(selectedProduct.id) ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
                {isFavorite(selectedProduct.id) ? " Remover dos Favoritos" : " Adicionar aos Favoritos"}
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
    </header>
  );
}
