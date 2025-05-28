"use client";

import React from "react";
import styles from "./styles.module.scss";
import ProdutosQuePodemInteressar from "../produtos-que-podem-interessar";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

export default function Carrinho() {
  const { cart, handleQty, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => {
    let priceStr = String(item.price).replace(/[^\d,\.]/g, '');
    if (priceStr.includes(',')) {
      priceStr = priceStr.replace(/\./g, '').replace(',', '.');
    }
    const price = parseFloat(priceStr);
    return acc + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Finalizar Compra</h1>
      </div>
      <div className={styles.cartSection}>
        <div className={styles.cartBox}>
          <h2>Produtos no Carrinho</h2>
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
          <h2>Dados para Compra</h2>
          <div className={styles.authBtns}>
            <button className={styles.loginBtn}>Entrar</button>
            <button className={styles.registerBtn}>Cadastrar-se</button>
          </div>
          <p className={styles.infoMsg}>Você não está logado. Por favor, entre ou cadastre-se para continuar.</p>
        </div>
      </div>
      <ProdutosQuePodemInteressar />
    </div>
  );
} 