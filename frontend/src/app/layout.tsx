import Footer from "../components/Footer";
import Header from "../components/Header";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ghar Destiny",
  description: "Buy Sell Rent Properties",
  
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <AuthProvider>
          <Header />

          <main className="min-h-screen container mx-auto p-4">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}