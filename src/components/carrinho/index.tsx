"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";
import ProdutosQuePodemInteressar from "../produtos-que-podem-interessar";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";
import { FaStar, FaRegStar } from "react-icons/fa";
import * as produtosData from "../../data/products";

function getProductDataByName(name: string) {
  return produtosData.preConfiguredProducts.find((p: any) => p.name === name);
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

  const total = cart.reduce((acc, item) => {
    let priceStr = String(item.price).replace(/[^\d,\.]/g, '');
    if (priceStr.includes(',')) {
      priceStr = priceStr.replace(/\./g, '').replace(',', '.');
    }
    const price = parseFloat(priceStr);
    return acc + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  if (authLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (user) {
    // Se o usuário já estiver logado, mostre a tela final de compra/checkout
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Finalizar Compra</h1>
        </div>
        <div className={styles.cartSectionProfissional}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartMsg}>Seu carrinho está vazio.</div>
          ) : (
            cart.map((item, idx) => {
              const productData = getProductDataByName(item.name);
              return (
                <div className={styles.productBox} key={idx}>
                  <div className={styles.productImageArea}>
                    <Image src={item.image} alt={item.name} width={520} height={420} className={styles.productImageGrande} />
                  </div>
                  <div className={styles.productInfoArea}>
                    <h2 className={styles.productName}>{item.name}</h2>
                    <div className={styles.ratingArea}>
                      {[1,2,3,4,5].map(i => i <= 4 ? <FaStar key={i} color="#f0b63d" /> : <FaRegStar key={i} color="#f0b63d" />)}
                      <span className={styles.reviews}>(12 avaliações)</span>
                    </div>
                    <div className={styles.productCode}>Cód: {productData?.id || '---'}</div>
                    <div className={styles.productPrice}>{item.price}</div>
                    <div className={styles.productInstallments}>Em até 10x de {(parseFloat(String(item.price).replace(/[^\d,\.]/g, '').replace(',', '.'))/10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</div>
                    <div className={styles.qtyControlProfissional}>
                      <button type="button" onClick={() => handleQty(idx, -1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => handleQty(idx, 1)}>+</button>
                    </div>
                    <button className={styles.removeBtn} title="Remover" onClick={() => removeFromCart(idx)}>🗑️ Remover</button>
                    <button className={styles.checkoutButtonGrande}>Finalizar Compra</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Descrição do produto */}
        {cart.length > 0 && (
          <div className={styles.productDescriptionBox}>
            <h3>Descrição do Produto</h3>
            <p>{getProductDataByName(cart[0].name)?.specifications?.material ? `Material: ${getProductDataByName(cart[0].name)?.specifications?.material}` : 'Produto de alta qualidade, com garantia e procedência.'}</p>
            <p>Calibre: {getProductDataByName(cart[0].name)?.specifications?.calibre || '---'}</p>
            <p>Peso: {getProductDataByName(cart[0].name)?.specifications?.peso || '---'}</p>
            <p>Comprimento: {getProductDataByName(cart[0].name)?.specifications?.comprimento || '---'}</p>
          </div>
        )}
        {/* Perguntas Frequentes */}
        <div className={styles.faqBox}>
          <h3>Perguntas Frequentes</h3>
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
        <div className={styles.avaliacoesBox}>
          <h3>Avaliações dos Clientes</h3>
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
        <ProdutosQuePodemInteressar />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Finalizar Compra</h1>
      </div>
      <div className={styles.cartSection}>
        <div className={styles.cartBox}>
          <h2>Produtos no Carrinho</h2>
          {/* Conteúdo do carrinho existente */}
          {cart.length === 0 ? (
            <div className={styles.emptyCartMsg}>Seu carrinho está vazio.</div>
          ) : (
            cart.map((item, idx) => {
              let imgSrc = item.image;
              return (
                <div className={styles.cartItem} key={idx}>
                  <Image src={imgSrc} alt={item.name} width={90} height={60} />
                  <div className={styles.itemInfo}>
                    <strong>{item.name}</strong>
                    <div>{item.price}</div>
                  </div>
                  <div className={styles.qtyControl}>
                    <button type="button" onClick={() => handleQty(idx, -1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => handleQty(idx, 1)}>+</button>
                  </div>
                  <button className={styles.removeBtn} title="Remover" onClick={() => removeFromCart(idx)}>🗑️</button>
                </div>
              );
            })
          )}
           <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalValue}>
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
        <div className={styles.checkoutBox}>
          <div className={styles.authOptions}>
            <h2>Dados para Compra</h2>
            <div className={styles.authBtns}>
              <button className={styles.loginBtn}>Entrar</button>
              <button className={styles.registerBtn} onClick={() => router.push('/register')}>Cadastrar-se</button>
            </div>
            <p className={styles.infoMsg}>Você não está logado. Por favor, entre ou cadastre-se para continuar.</p>
          </div>
        </div>
      </div>
      <ProdutosQuePodemInteressar />
    </div>
  );
} 