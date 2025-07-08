"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { preConfiguredProducts, tacticalEquipment, Product, sportEquipment } from "../../data/products";
import { db } from "../../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import styles from "./styles.module.scss";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import ContactMessages from './components/ContactMessages';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";

// Componente para renderizar imagem (URL ou SVG)
const ProductImage = ({ image, alt, className }: { image: string; alt: string; className?: string }) => {
  if (image.startsWith('<svg')) {
    // É um SVG
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: image }}
        className={className}
        style={{ display: 'inline-block' }}
      />
    );
  } else {
    // É uma URL
    return <img src={image} alt={alt} className={className} />;
  }
};

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState("");
  const [displayLocation, setDisplayLocation] = useState<'header' | 'destaques' | 'recomendados' | 'taticos' | 'esportivos'>('header');
  const [message, setMessage] = useState({ text: "", type: "" });
  const [registeredProducts, setRegisteredProducts] = useState<Product[]>([]);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [searchSection, setSearchSection] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<'preConfigured' | 'tactical' | 'esportivos'>('preConfigured');
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductData, setCustomProductData] = useState<Partial<Product>>({
    name: '',
    marca: '',
    image: '',
    category: 'pistolas',
    specifications: {},
  });
  const [showCustomProductModal, setShowCustomProductModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
      // Buscar produtos da coleção 'products'
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      })) as Product[];

      // Buscar produtos personalizados da coleção 'customProducts'
      const customSnapshot = await getDocs(collection(db, "customProducts"));
      const customProducts = customSnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      })) as Product[];

      // Unir os dois arrays
      setRegisteredProducts([...products, ...customProducts]);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setMessage({ text: "Erro ao carregar produtos", type: "error" });
    }
  };

  const handleProductSelect = (productId: string) => {
    if (productId === 'custom') {
      setShowCustomProductModal(true);
      setSelectedProduct(null);
      setMessage({ text: '', type: '' });
      return;
    }
    setIsCustomProduct(false);
    const allProducts = [
      ...(selectedProductType === 'preConfigured' ? preConfiguredProducts : selectedProductType === 'tactical' ? tacticalEquipment : sportEquipment),
      ...customProducts.filter(p => p.category === (selectedProductType === 'preConfigured' ? 'pistolas' : selectedProductType === 'tactical' ? 'taticos' : 'esporte'))
    ];
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
      setSelectedProduct(null);
      return;
    }
    const isProductRegistered = registeredProducts.some(
      registeredProduct => registeredProduct.name === product.name
    );
    if (isProductRegistered) {
      setShowDuplicateModal(true);
      setSelectedProduct(null);
      return;
    }
    setSelectedProduct(product);
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !price || !displayLocation) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      const productData = {
        ...selectedProduct,
        price: parseFloat(price),
        displayLocation,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'products'), productData);
      setSelectedProduct(null);
      setPrice('');
      setDisplayLocation('header');
      fetchRegisteredProducts();
      setMessage({ text: "Produto cadastrado com sucesso!", type: "success" });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
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
      // Verifica se o produto é personalizado (customProducts) ou padrão (products)
      // Critério: se existe na lista customProducts
      const isCustom = customProducts.some(p => p.id === selectedProductForEdit.id);
      const collectionName = isCustom ? "customProducts" : "products";
      const productRef = doc(db, collectionName, selectedProductForEdit.firestoreId);
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
    const matchesSection = !searchSection || product.displayLocation === searchSection;
    return matchesSearch && matchesCategory && matchesSection;
  });

  const categories = Array.from(new Set(registeredProducts.map(p => p.category)));

  // Buscar produtos personalizados do Firebase
  useEffect(() => {
    const fetchCustomProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customProducts"));
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          firestoreId: doc.id,
          ...doc.data()
        })) as Product[];
        setCustomProducts(products);
      } catch (error) {
        console.error("Erro ao buscar produtos personalizados:", error);
      }
    };
    fetchCustomProducts();
  }, []);

  // Função para converter imagem para SVG
  const convertImageToSVG = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Definir tamanho do canvas
        const maxSize = 300;
        let { width, height } = img;
        
        // Redimensionar mantendo proporção
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem no canvas
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para base64
        const dataURL = canvas.toDataURL('image/png');
        
        // Criar SVG com a imagem como base64
        const svg = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <image href="${dataURL}" width="${width}" height="${height}"/>
          </svg>
        `.trim();
        
        resolve(svg);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Função para lidar com upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      try {
        // Mostrar preview da imagem original
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Converter para SVG
        const svgCode = await convertImageToSVG(file);
        setCustomProductData({ ...customProductData, image: svgCode });
        
        // Mostrar preview do SVG
        setImagePreview(`data:image/svg+xml;base64,${btoa(svgCode)}`);
        
      } catch (error) {
        console.error('Erro ao converter imagem:', error);
        setMessage({ text: 'Erro ao processar imagem', type: 'error' });
      }
    }
  };

  // Alterar handleCustomProductSubmit para salvar SVG
  const handleCustomProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, marca, image, category, specifications } = customProductData;
    if (!name || !marca || !image || !category) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    try {
      const newProduct: Product = {
        id: uuidv4(),
        name: name!,
        marca: marca!,
        image: image!, // Agora contém o código SVG
        category: category as Product['category'],
        specifications: specifications || {},
        price: parseFloat(price),
        displayLocation,
      };
      await addDoc(collection(db, 'customProducts'), newProduct);
      setCustomProductData({ name: '', marca: '', image: '', category: 'pistolas', specifications: {} });
      setPrice('');
      setDisplayLocation('header');
      setShowCustomProductModal(false);
      setSelectedImage(null);
      setImagePreview('');
      setMessage({ text: 'Produto personalizado cadastrado com sucesso!', type: 'success' });
      // Atualiza lista de customProducts
      const querySnapshot = await getDocs(collection(db, "customProducts"));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      })) as Product[];
      setCustomProducts(products);
    } catch (error) {
      console.error('Erro ao cadastrar produto personalizado:', error);
      setMessage({ text: 'Erro ao cadastrar produto personalizado', type: 'error' });
    }
  };

  // Buscar pedidos do Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };
    fetchOrders();
  }, []);

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
          <div className={styles.productRegistration}>
            <h2>Cadastro de Produtos</h2>
            
            <div className={styles.productTypeSelector}>
              <button
                className={`${styles.typeButton} ${selectedProductType === 'preConfigured' ? styles.active : ''}`}
                onClick={() => setSelectedProductType('preConfigured')}
              >
                Produtos Padrão
              </button>
              <button
                className={`${styles.typeButton} ${selectedProductType === 'tactical' ? styles.active : ''}`}
                onClick={() => setSelectedProductType('tactical')}
              >
                Equipamentos Táticos
              </button>
              <button
                className={`${styles.typeButton} ${selectedProductType === 'esportivos' ? styles.active : ''}`}
                onClick={() => setSelectedProductType('esportivos')}
              >
                Equipamentos Esportivos
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Selecione o Produto:</label>
                <select
                  value={isCustomProduct ? 'custom' : selectedProduct?.id || ""}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  required
                >
                  <option value="">Selecione um produto</option>
                  <option value="custom">Produto Personalizado</option>
                  {(selectedProductType === 'preConfigured' ? preConfiguredProducts : selectedProductType === 'tactical' ? tacticalEquipment : sportEquipment)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  {customProducts
                    .filter(p => p.category === (selectedProductType === 'preConfigured' ? 'pistolas' : selectedProductType === 'tactical' ? 'taticos' : 'esporte'))
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Personalizado)
                      </option>
                    ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Preço:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Digite o preço"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Local de Exibição:</label>
                <select
                  value={displayLocation}
                  onChange={(e) => setDisplayLocation(e.target.value as 'header' | 'destaques' | 'recomendados' | 'taticos' | 'esportivos')}
                  required
                >
                  <option value="header">Header</option>
                  <option value="destaques">Destaques</option>
                  <option value="recomendados">Recomendados</option>
                  <option value="taticos">Equipamentos Táticos</option>
                  <option value="esportivos">Equipamentos Esportivos</option>
                </select>
              </div>

              {selectedProduct && (
                <>
                  <div className={styles.productPreview}>
                    <h3>Preview do Produto</h3>
                    <div className={styles.previewContent}>
                      <div className={styles.productColumn}>
                        <ProductImage image={selectedProduct.image} alt={selectedProduct.name} />
                        <div className={styles.brandInfo}>
                          <img 
                            src={`/img/marcas/${selectedProduct.marca.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                            alt={selectedProduct.marca}
                            className={styles.brandImage}
                          />
                        </div>
                      </div>
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
            <select
              value={searchSection}
              onChange={(e) => setSearchSection(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Todas as seções</option>
              <option value="header">Menu Principal</option>
              <option value="destaques">Produtos em Destaque</option>
              <option value="recomendados">Produtos Recomendados</option>
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
                    <p className={styles.section}>
                      Seção: {
                        product.displayLocation === 'header' ? 'Menu Principal' :
                        product.displayLocation === 'destaques' ? 'Produtos em Destaque' :
                        product.displayLocation === 'taticos' ? 'Equipamentos Táticos' :
                        'Produtos Recomendados'
                      }
                    </p>
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
                    <ProductImage image={product.image} alt={product.name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Pedidos</h2>
          {orders.length === 0 ? (
            <p>Nenhum pedido encontrado.</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.productOrderCard} onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>
                  <div className={styles.productOrderCardHeader}>
                    <span className={styles.productOrderCardTitle}>Cliente: {order.user?.nomeCompleto || order.user?.email}</span>
                    <span className={styles.productOrderCardTotal}>Total: R$ {order.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className={styles.productOrderCardStatus}>{order.status}</span>
                  </div>
                  <div className={styles.productOrderCardInfo}>
                    <span>Data: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString('pt-BR') : ''}</span>
                    <span>Forma de Pagamento: {order.formaPagamento}</span>
                  </div>
                  <div className={styles.productOrderCardProducts}>
                    {order.products?.map((prod: any, idx: number) => (
                      <span key={idx} className={styles.productOrderCardProduct}>{prod.name} (Qtd: {prod.quantity})</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <ProductImage image={selectedProductForEdit.image} alt={selectedProductForEdit.name} />
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

      {showCustomProductModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCustomProductModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Cadastro de Produto Personalizado</h3>
            <form onSubmit={handleCustomProductSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Nome do Produto:</label>
                <input 
                  type="text" 
                  value={customProductData.name || ''} 
                  onChange={e => setCustomProductData({ ...customProductData, name: e.target.value })} 
                  placeholder="Digite o nome do produto"
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Marca:</label>
                <input 
                  type="text" 
                  value={customProductData.marca || ''} 
                  onChange={e => setCustomProductData({ ...customProductData, marca: e.target.value })} 
                  placeholder="Digite a marca"
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Imagem:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  required 
                />
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <div 
                      dangerouslySetInnerHTML={{ __html: customProductData.image || '' }}
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        marginTop: '8px',
                        display: 'inline-block'
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label>Categoria:</label>
                <select 
                  value={customProductData.category || 'pistolas'} 
                  onChange={e => setCustomProductData({ ...customProductData, category: e.target.value as Product['category'] })} 
                  required
                >
                  <option value="pistolas">Pistolas</option>
                  <option value="revolveres">Revólveres</option>
                  <option value="espingardas">Espingardas</option>
                  <option value="acessorios">Acessórios</option>
                  <option value="taticos">Táticos</option>
                  <option value="esporte">Esporte</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Especificações:</label>
                <div className={styles.specificationsInput}>
                  <input 
                    type="text" 
                    placeholder="Ex: calibre: 9mm" 
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value;
                        if (value && value.includes(':')) {
                          const [key, val] = value.split(':').map(s => s.trim());
                          setCustomProductData({
                            ...customProductData,
                            specifications: { ...customProductData.specifications, [key]: val }
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <small>Pressione Enter para adicionar cada especificação</small>
                </div>
                <div className={styles.specificationsList}>
                  {customProductData.specifications && Object.entries(customProductData.specifications).map(([key, val]) => (
                    <div key={key} className={styles.specItem}>
                      <span>{key}: {val}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newSpecs = { ...customProductData.specifications };
                          delete newSpecs[key];
                          setCustomProductData({ ...customProductData, specifications: newSpecs });
                        }}
                        className={styles.removeSpec}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Preço (R$):</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="0.00"
                  step="0.01"
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Local de Exibição:</label>
                <select 
                  value={displayLocation} 
                  onChange={(e) => setDisplayLocation(e.target.value as 'header' | 'destaques' | 'recomendados' | 'taticos' | 'esportivos')} 
                  required
                >
                  <option value="header">Header</option>
                  <option value="destaques">Destaques</option>
                  <option value="recomendados">Recomendados</option>
                  <option value="taticos">Equipamentos Táticos</option>
                  <option value="esportivos">Equipamentos Esportivos</option>
                </select>
              </div>
              
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>
                  Cadastrar Produto
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCustomProductModal(false);
                    setCustomProductData({ name: '', marca: '', image: '', category: 'pistolas', specifications: {} });
                    setPrice('');
                    setDisplayLocation('header');
                    setSelectedImage(null);
                    setImagePreview('');
                  }} 
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
          <div className={styles.adminOrderModal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowOrderModal(false)}>×</button>
            <div className={styles.adminOrderModalTitle}>Detalhes do Pedido</div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Nome:</span>
              <span className={styles.adminOrderModalValue}>{selectedOrder.user?.nomeCompleto}</span>
            </div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Email:</span>
              <span className={styles.adminOrderModalValue}>{selectedOrder.user?.email}</span>
            </div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Telefone:</span>
              <span className={styles.adminOrderModalValue}>{selectedOrder.user?.telefone}</span>
            </div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Total:</span>
              <span className={styles.adminOrderModalValue}>R$ {selectedOrder.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Data:</span>
              <span className={styles.adminOrderModalValue}>{selectedOrder.createdAt?.seconds ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString('pt-BR') : ''}</span>
            </div>
            <div className={styles.adminOrderModalSection}>
              <span className={styles.adminOrderModalLabel}>Status:</span>
              <span className={styles.adminOrderModalValue}>{selectedOrder.status}</span>
            </div>
            <div className={styles.adminOrderModalPagamento}>
              Forma de Pagamento: {selectedOrder.formaPagamento}
            </div>
            <div className={styles.adminOrderModalSection}>
              <div className={styles.adminOrderModalLabel} style={{marginBottom: 6}}>Produtos:</div>
              <div className={styles.adminOrderModalProducts}>
                {selectedOrder.products?.map((prod: any, idx: number) => (
                  <div key={idx} className={styles.adminOrderModalProductCard}>
                    <div className={styles.adminOrderModalProductImage}>
                      <ProductImage image={prod.image} alt={prod.name} className={styles.adminOrderModalProductImg} />
                    </div>
                    <div className={styles.adminOrderModalProductInfo}>
                      <strong>{prod.name}</strong>
                      <div>Quantidade: <span className={styles.adminOrderModalValue}>{prod.quantity}</span></div>
                      <div>Preço: <span className={styles.adminOrderModalValue}>{prod.price}</span></div>
                      {selectedOrder.formaPagamento === 'Cartão de crédito' && (
                        <div style={{color:'#1976d2', fontWeight:600, fontSize:'0.97rem'}}>Parcelas: {prod.parcelas}x de {(typeof prod.price === 'number' ? prod.price : parseFloat(String(prod.price).replace('R$', '').replace('.', '').replace(',', '.'))/prod.parcelas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.adminOrderModalContato}>
              <strong>Contato:</strong><br/>
              Email: <a href={`mailto:${selectedOrder.user?.email}`}>{selectedOrder.user?.email}</a><br/>
              WhatsApp: <a href={`https://wa.me/55${(selectedOrder.user?.telefone || '').replace(/\D/g, '')}?text=Olá! Vi seu pedido no site e gostaria de falar com você.`} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              {selectedOrder.status !== 'Concluído' && (
                <button
                  className={styles.concluirVendaButton}
                  onClick={async () => {
                    const orderRef = doc(db, 'orders', selectedOrder.id);
                    await updateDoc(orderRef, { status: 'Concluído' });
                    setShowOrderModal(false);
                    // Atualiza lista de pedidos
                    const querySnapshot = await getDocs(collection(db, 'orders'));
                    const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(ordersData);
                  }}
                >
                  Concluir Venda
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 