"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { preConfiguredProducts, Product } from "../../data/products";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import styles from "./styles.module.scss";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ContactMessages from './components/ContactMessages';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [displayLocation, setDisplayLocation] = useState<'header' | 'destaques' | 'recomendados'>('header');
  const [message, setMessage] = useState({ text: "", type: "" });
  const [registeredProducts, setRegisteredProducts] = useState<Product[]>([]);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && !isAdmin) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    fetchRegisteredProducts();
  }, []);

  const fetchRegisteredProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      })) as Product[];
      setRegisteredProducts(products);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMessage({ text: "Erro ao carregar produtos", type: "error" });
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = preConfiguredProducts.find(p => p.id === productId);
    if (!product) {
      setSelectedProduct(null);
      return;
    }

    // Verifica se o produto já está cadastrado
    const isProductRegistered = registeredProducts.some(
      registeredProduct => registeredProduct.name === product.name
    );

    if (isProductRegistered) {
      setShowDuplicateModal(true);
      setSelectedProduct(null);
      return;
    }

    setSelectedProduct(product);
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const productData = {
        ...selectedProduct,
        price: Number(price),
        displayLocation
      };

      // Removemos o id do produto pré-configurado antes de salvar
      const { id, ...productDataWithoutId } = productData;

      const docRef = await addDoc(collection(db, "products"), productDataWithoutId);
      
      // Atualizamos o documento com seu próprio ID
      await updateDoc(docRef, {
        firestoreId: docRef.id
      });

      setMessage({ text: "Produto cadastrado com sucesso!", type: "success" });
      setSelectedProduct(null);
      setPrice("");
      fetchRegisteredProducts();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setMessage({ text: "Erro ao cadastrar produto", type: "error" });
    }
  };

  const handleEdit = async () => {
    if (!selectedProductForEdit || !editPrice) return;

    try {
      console.log("Editando produto:", selectedProductForEdit);
      if (!selectedProductForEdit.firestoreId) {
        throw new Error("ID do documento não encontrado");
      }
      const productRef = doc(db, "products", selectedProductForEdit.firestoreId);
      await updateDoc(productRef, {
        price: Number(editPrice)
      });
      setMessage({ text: "Preço atualizado com sucesso!", type: "success" });
      setShowEditModal(false);
      setSelectedProductForEdit(null);
      setEditPrice("");
      fetchRegisteredProducts();
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
      setMessage({ text: "Erro ao atualizar preço", type: "error" });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      setMessage({ text: "Excluindo produto...", type: "info" });
      
      // Encontra o produto pelo ID
      const product = registeredProducts.find(p => p.id === productId);
      if (!product || !product.firestoreId) {
        throw new Error("Produto não encontrado");
      }
      
      // Verifica se o documento existe antes de tentar excluir
      const productRef = doc(db, "products", product.firestoreId);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error("Produto não encontrado");
      }

      await deleteDoc(productRef);
      
      // Atualiza a lista de produtos imediatamente
      const updatedProducts = registeredProducts.filter(p => p.id !== productId);
      setRegisteredProducts(updatedProducts);
      
      setMessage({ text: "Produto excluído com sucesso!", type: "success" });
      
      // Atualiza a lista completa do Firestore
      await fetchRegisteredProducts();
      
      // Fecha o modal de detalhes se estiver aberto
      if (showDetailsModal) {
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setMessage({ 
        text: error instanceof Error ? error.message : "Erro ao excluir produto", 
        type: "error" 
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const filteredProducts = registeredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !searchCategory || product.category === searchCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(registeredProducts.map(p => p.category)));

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
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
                onChange={(e) => handleProductSelect(e.target.value)}
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
          <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.productsContainer}>
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={styles.productCard} onClick={() => {
                  setSelectedProductForEdit(product);
                  setShowDetailsModal(true);
                }}>
                  <div className={styles.productInfo}>
                    <h3>{product.name}</h3>
                    <p className={styles.price}>{formatPrice(product.price)}</p>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForEdit(product);
                          setEditPrice(product.price.toString());
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Pedidos</h2>
          <p>Visualizar e gerenciar pedidos</p>
        </div>
      </div>

      <ContactMessages />

      {showEditModal && selectedProductForEdit && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Editar Preço</h3>
            <div className={styles.formGroup}>
              <label>Novo Preço (R$)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleEdit} className={styles.submitButton}>
                Salvar
              </button>
              <button onClick={() => setShowEditModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedProductForEdit && (
        <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img src={selectedProductForEdit.image} alt={selectedProductForEdit.name} />
              </div>
              <div className={styles.modalDetails}>
                <h3>{selectedProductForEdit.name}</h3>
                <p className={styles.modalPrice}>{formatPrice(selectedProductForEdit.price)}</p>
                <div className={styles.modalSpecs}>
                  {Object.entries(selectedProductForEdit.specifications).map(([key, value]) => (
                    <div key={key} className={styles.modalSpec}>
                      <span className={styles.specLabel}>{key}:</span>
                      <span className={styles.specValue}>{value}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.modalActions}>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedProductForEdit(selectedProductForEdit);
                      setEditPrice(selectedProductForEdit.price.toString());
                      setShowEditModal(true);
                    }}
                    className={styles.editButton}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDelete(selectedProductForEdit.id);
                    }}
                    className={styles.deleteButton}
                  >
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
            </div>
            <button className={styles.closeButton} onClick={() => setShowDetailsModal(false)}>×</button>
          </div>
        </div>
      )}

      {showDuplicateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDuplicateModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Atenção!</h3>
            <p>Este produto já está cadastrado! Procure-o em "Produtos Cadastrados".</p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowDuplicateModal(false)} 
                className={styles.submitButton}
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 