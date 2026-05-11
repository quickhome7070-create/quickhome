"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
   

  return (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 border-b border-orange-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        {/* Left Side */}
<div className="flex items-center gap-4">

  {/* Logo */}
  <Link
    href="/"
    className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight"
  >
    Ghar Destiny
  </Link>


  
</div>
{/* Desktop Nav */}
<nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-900">

  <Link
    href="/properties"
    className="hover:text-black transition-all duration-300"
  >
    Properties
  </Link>

  {!loading && !user && (
    <>
      <Link
        href="/login"
        className="hover:text-black transition-all duration-300"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="hover:text-black transition-all duration-300"
      >
        Register
      </Link>
    </>
  )}

  {!loading && user && (
    <>
      <Link
        href="/profile"
        className="flex items-center gap-2 hover:opacity-80 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        

        <span>
          {user?.name}
        </span>
      </Link>

      <Link
        href="/addproperty"
        className="hover:text-black transition-all duration-300"
      >
        + Post Property
      </Link>

      <Link
        href="/dashboard/my-properties"
        className="hover:text-black transition-all duration-300"
      >
        My Property
      </Link>

      <Link
        href="/"
        onClick={logout}
        className="text-red-600 hover:text-red-700 transition-all duration-300"
      >
        Logout
      </Link>
    </>
  )}
</nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-lg">

          <Link href="/properties" onClick={() => setMenuOpen(false)}>
            <div className="py-2 border-b">Properties</div>
          </Link>

          {!loading && !user && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b">Login</div>
              </Link>

              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b text-blue-600 font-semibold">
                  Register
                </div>
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <div className="flex items-center gap-2 py-2 border-b">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-semibold">{user?.name}</span>
              </div>

              <Link href="/addproperty" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b">+ Add Property</div>
              </Link>

              <Link href="/my-properties" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b">My Property</div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-red-500 font-semibold py-2"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}