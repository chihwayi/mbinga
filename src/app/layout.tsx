import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Libre_Bodoni, Montserrat, Cinzel } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import CartDrawer from "@/components/cart/CartDrawer";
import BackgroundAudio from "@/components/layout/BackgroundAudio";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat-raw",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel-raw",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MBINGA | Luxury African Fragrance House",
  description: "Born from the heart of Africa, MBINGA is a luxury fragrance house defined by presence, refinement, and quiet authority.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${inter.variable} ${libreBodoni.variable} ${montserrat.variable} ${cinzel.variable} antialiased bg-black text-cream`}
      >
        <CurrencyProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </CurrencyProvider>
        <BackgroundAudio />
      </body>
    </html>
  );
}
