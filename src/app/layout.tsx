import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "../components/header";
import Footer from "../components/footer";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Duque Loja",
  description: "Loja de armas Duque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}