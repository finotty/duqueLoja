"use client";
import { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/img/Frame 99.png";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await signIn(email, senha);
    } catch (error: any) {
      setError(
        error.code === "auth/invalid-credential"
          ? "E-mail ou senha inválidos"
          : "Erro ao fazer login. Tente novamente."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoArea}>
          <Image src={logo} alt="Logo" width={260} height={60} quality={100} />
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
          <div className={styles.links}>
            <a href="#">Esqueceu a senha?</a>
            <a href="#">Criar conta</a>
          </div>
        </form>
      </div>
    </div>
  );
} 