"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight"
        >
          QuickHome
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">

          <Link href="/properties" className="relative group">
            Properties
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          {!loading && !user && (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>

              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-lg shadow hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{user?.name}</span>
              </div>

              <Link
                href="/addproperty"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                + Add
              </Link>

              <Link
                href="/my-properties"
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                My Property
              </Link>

              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-semibold"
              >
                Logout
              </button>
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