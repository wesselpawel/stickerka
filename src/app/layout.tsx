import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";

import SessionHandler from "@/components/SessionHandler";
import StoreProvider from "@/redux/Provider";
import Toast from "@/components/Toast";
import PrepareCart from "@/components/PrepareCart";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Stickerka.pl",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${jakarta.variable} ${fraunces.variable} font-sans`}
      >
        

        {" "}
        <StoreProvider>
          <Toast />
          <Header />
          <PrepareCart />
          <SessionHandler />
         {children}
          <Footer />
        </StoreProvider>
      
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-YY7NKD2K0W"
        />
        <Script strategy="afterInteractive" id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YY7NKD2K0W');
          `}
        </Script>
      </body>
    </html>
  );
}
