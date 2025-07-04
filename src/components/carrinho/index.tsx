"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import ProdutosQuePodemInteressar from "../produtos-que-podem-interessar";
import ProductImage from "../ProductImage";
import { useCart } from "../../context/CartContext";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import * as produtosData from "../../data/products";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

function getProductDataByName(name: string) {
  const preConfigured = produtosData.preConfiguredProducts.find((p: any) => p.name === name);
  const esporte = produtosData.sportEquipment.find((p: any) => p.name === name);
  const tactical = produtosData.tacticalEquipment.find((p: any) => p.name === name);
  return preConfigured || tactical || esporte;
}

const perguntasFrequentes = [
  {
    pergunta: "Como funciona a entrega?",
    resposta: "A entrega é realizada por transportadora especializada, com seguro e rastreamento." 
  },
  {
    pergunta: "Quais as formas de pagamento?",
    resposta: "Aceitamos cartão de crédito, débito, Pix e boleto bancário. Parcelamento em até 10x sem juros." 
  },
  {
    pergunta: "Preciso de documentação?",
    resposta: "Sim, é necessário apresentar toda a documentação exigida por lei para compra de armas de fogo." 
  },
];

const avaliacoesMock = [
  {
    nome: "João S.",
    nota: 5,
    comentario: "Produto excelente, entrega rápida e atendimento nota 10!",
  },
  {
    nome: "Maria F.",
    nota: 4,
    comentario: "Gostei muito, só achei o manual um pouco confuso.",
  },
  {
    nome: "Carlos P.",
    nota: 5,
    comentario: "Ótimo custo-benefício, recomendo!",
  },
];

export default function Carrinho() {
  const { cart, handleQty, removeFromCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<{[key: number]: number}>({});
  const [nomeCompleto, setNomeCompleto] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const dados = getFirestore(db.app);
          const userDoc = doc(dados, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          
          console.log('Dados encontrados:', userSnapshot.exists());
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log('Dados do usuário:', userData);
            setNomeCompleto(userData.nomeCompleto);
          } else {
            console.log('Documento do usuário não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const total = cart.reduce((acc, item) => {
    let valorNumerico = typeof item.price === 'number'
      ? item.price
      : parseFloat(String(item.price)
          .replace('R$', '')
          .trim()
          .replace(/\./g, '')  // Remove pontos de milhar
          .replace(',', '.')); // Substitui vírgula por ponto
    const price = isNaN(valorNumerico) ? 0 : valorNumerico * item.quantity;
    return acc + price;
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      // Salvar o caminho atual no localStorage
      localStorage.setItem('redirectAfterLogin', '/carrinho');
      // Redirecionar para o login
      window.location.href = '/login';
      return;
    }
    // Prosseguir com o processo de compra
    console.log('Usuário logado, prosseguindo com a compra.');
  };

  if (authLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  // Se o usuário já estiver logado, mostre a tela final de compra/checkout
  return (
    <div className={styles.wrapper}>
    
        <div className={styles.cartSectionProfissional}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartMsg}>Seu carrinho está vazio.</div>
          ) : (
            cart.map((item, idx) => {
              const productData = getProductDataByName(item.name);
              let valorNumerico = typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price)
                    .replace('R$', '')
                    .trim()
                    .replace(/\./g, '')  // Remove pontos de milhar
                    .replace(',', '.')); // Substitui vírgula por ponto
              const parcelas = parcelasSelecionadas[idx] || 10;
              return (
                <div className={styles.productBox} key={idx}>
                  <div className={styles.productImageArea}>
                    <ProductImage 
                      image={item.image} 
                      alt={item.name} 
                      className={styles.productImageGrande}
                      style={{ width: '520px', height: '420px' }}
                    />
                  </div>
                    
                  <div className={styles.productInfoArea}>
                    <div className={styles.productInfoAreaTop}>
                      <h2 className={styles.productName}>{item.name}</h2>
                      <button className={styles.removeBtn} title="Remover" onClick={() => removeFromCart(idx)}>🗑️</button>
                    </div>
                    <div className={styles.ratingArea}>
                      {[1,2,3,4,5].map(i => i <= 4 ? <FaStar key={i} color="#f0b63d" /> : <FaRegStar key={i} color="#f0b63d" />)}
                      <span className={styles.reviews}>(12 avaliações)</span>
                    </div>
                    <div className={styles.productCode}>Cód: {productData?.id || '---'}</div>
                    <div className={styles.productPrice}>
                      <span>Por Apenas:</span>
                      {item.price}
                    </div>
                    <div className={styles.productInstallments}>
                      <span className={styles.installment1}>Em até</span>
                      <select
                        value={parcelas}
                        onChange={e => setParcelasSelecionadas({ ...parcelasSelecionadas, [idx]: Number(e.target.value) })}
                        className={styles.selectParcelas}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            <span className={styles.installment}>{num}x</span> de { (valorNumerico/num).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
                          </option>
                        ))}
                      </select>
                      <span className={styles.installment1}>sem juros</span>
                    </div>
                    <div className={styles.pix}>
                      <span className={styles.pixText}>ou </span>
                      <span className={styles.pixValue}>
                        {((valorNumerico * 0.85).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))} 
                      </span>
                      <span className={styles.pixText}> no Pix, Boleto ou transferência à vista (15% desconto)</span>
                    </div>
                    <div className={styles.imgText}>
                      <span>IMAGENS MERAMENTE ILUSTRATIVAS.</span>
                    </div>
                 
                    <button className={styles.checkoutButtonGrande} onClick={handleCheckout}>
                      Finalizar Compra
                    </button>
                  </div>
                  
                </div>
              );
            })
          )}
        </div>
        
        {/* Descrição do produto */}
        {cart.length > 0 && (
          <div className={styles.productDescriptionBox}>
            <h3 className={styles.productDescriptionBoxTitle}>Descrição do Produto</h3>
            {cart.map((item, idx) => {
              const productData = getProductDataByName(item.name);
              return (
                <div key={idx} className={styles.productDescription}>
                  <h4>{item.name}</h4>
                  {productData?.specifications && (
                    <div className={styles.specifications}>
                      {Object.entries(productData.specifications).map(([key, value]) => (
                        <div key={key} className={styles.specification}>
                          <span className={styles.specLabel}>{key}:</span>
                          <span className={styles.specValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Perguntas Frequentes */}
        <div className={styles.faqBox}>
          <h3 className={styles.faqBoxTitle}>Perguntas Frequentes</h3>
          {perguntasFrequentes.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <button className={styles.faqQuestion} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {faq.pergunta}
              </button>
              {faqOpen === i && <div className={styles.faqAnswer}>{faq.resposta}</div>}
            </div>
          ))}
        </div>
        {/* Avaliações dos Clientes */}
        {/*
        <div className={styles.avaliacoesBox}>
          <h3 className={styles.avaliacoesBoxTitle}>Avaliações dos Clientes</h3>
          <div className={styles.avaliacoesList}>
            {avaliacoesMock.map((av, i) => (
              <div key={i} className={styles.avaliacaoItem}>
                <div className={styles.avaliacaoNome}>{av.nome}</div>
                <div className={styles.avaliacaoNota}>
                  {[1,2,3,4,5].map(j => j <= av.nota ? <FaStar key={j} color="#f0b63d" /> : <FaRegStar key={j} color="#f0b63d" />)}
                </div>
                <div className={styles.avaliacaoComentario}>{av.comentario}</div>
              </div>
            ))}
          </div>
        </div>
        
        */}
        {/* Novo: Seção de Procedimento para Compra de Arma de Fogo */}
        <div className={styles.purchaseProcedureSection}>
          <h2>Procedimento Compra de Arma de Fogo</h2>
          <ol>
            <li>
              <strong>Compra:</strong> O primeiro processo é o de compra, onde o usuário poderá escolher o modelo da arma desejada e aguardar as informações contratuais e da loja para prosseguir com a autorização de compra. Antes de realizar a compra da arma o cliente deverá entrar em contato e confirmar a disponibilidade de envio da arma para sua região.
            </li>
            <li>
              <strong>Autorização Deferida:</strong> Após receber o contrato e os dados, o cliente iniciará o processo de autorização de compras junto ao órgão de sua escolha responsável por realizar esse procedimento. Uma vez que a autorização for DEFERIDA, o cliente deverá nos enviar uma cópia nítida escaneada da mesma através do e-mail CONTATO@PESCAECIAARMAS.COM.BR.
            </li>
            <li>
              <strong>Nota:</strong> Ao recebermos a AUTORIZAÇÃO DE COMPRAS e verificarmos se está correta, encaminharemos o pedido ao setor responsável pela emissão das notas fiscais, que será processada em até 07 dias úteis. Com a nota fiscal em mãos, o cliente poderá dar continuidade ao processo de registro da arma de fogo.
            </li>
            <li>
              <strong>Registro Deferido:</strong> Após o deferimento do registro, o cliente deverá enviar, via e-mail para CONTATO@PESCAECIAARMAS.COM.BR, uma cópia escaneada e nítida do seu registro emitido pelo Exército ou Polícia Federal, juntamente com um documento de identificação com foto, como RG, CNH ou documento funcional. Após o envio dos documentos, o cliente aguardará o contato do SETOR RESPONSÁVEL, que ocorrerá em até 24 horas, via WhatsApp ou e-mail. Esse contato será feito para organizar todas as questões referentes ao envio da arma.
            </li>
          </ol>
        </div>
        <ProdutosQuePodemInteressar/>
      </div>
    );
 
}