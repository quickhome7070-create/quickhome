import Footer from "../components/Footer";
import Header from "../components/Header";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

import { ReactNode } from "react";

export const metadata = {
  title: "Ghar Destiny",
  description: "Buy Sell Rent Properties",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
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
