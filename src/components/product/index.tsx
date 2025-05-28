"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./styles.module.scss";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ProductProps {
  image: StaticImageData;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: string;
  favorite?: boolean;
  description: string;
}

export default function Product({
  image,
  name,
  price,
  rating,
  reviews,
  isNew,
  discount,
  favorite,
  description,
}: ProductProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  function handleBuy() {
    if (typeof window === "undefined") return;
    const cartStr = localStorage.getItem("cart");
    let cart = cartStr ? JSON.parse(cartStr) : [];
    const imgSrc = typeof image === 'object' && 'src' in image ? image.src : image;
    const idx = cart.findIndex((item: any) => item.name === name);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ image: imgSrc, name, price, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/carrinho";
  }

  return (
    <>
      <div className={styles.card} onClick={() => setShowModal(true)}>
        <div className={styles.topBar}>
          {isNew && <span className={styles.badgeNew}>Novo</span>}
          {discount && <span className={styles.badgeDiscount}>{discount}</span>}
          {/*<span className={styles.favorite}><FaHeart color={favorite ? "#f0b63d" : "#fff"} /></span>*/}
        </div>
        <div className={styles.imageWrapper}>
          <Image src={image} alt={name} width={120} height={80} className={styles.productImg} />
        </div>
        <div className={styles.rating}>
          {[1,2,3,4,5].map(i => i <= Math.round(rating) ? <FaStar key={i} color="#f0b63d" /> : <FaRegStar key={i} color="#f0b63d" />)}
          <span className={styles.reviews}>{rating.toFixed(1)} ({reviews})</span>
        </div>
        <div className={styles.name}>{name}</div>
        <div className={styles.price}>{price}</div>
      </div>
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <Image src={image} alt={name} width={260} height={180} className={styles.modalImg} />
            <div className={styles.modalInfo}>
              <h2>{name}</h2>
              <div className={styles.rating}>
                {[1,2,3,4,5].map(i => i <= Math.round(rating) ? <FaStar key={i} color="#f0b63d" /> : <FaRegStar key={i} color="#f0b63d" />)}
                <span className={styles.reviews}>{rating.toFixed(1)} ({reviews})</span>
              </div>
              <div className={styles.modalPrice}>{price}</div>
              <p className={styles.modalDesc}>{description}</p>
              <button className={styles.buyBtn} onClick={handleBuy}>Comprar</button>
            </div>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
          </div>
        </div>
      )}
    </>
  );
} 