"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight"
        >
          QuickHome
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          
          <Link
            href="/properties"
            className="relative group transition"
          >
            Properties
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          {loading ? null : !user ? (
            <>
              <Link
                href="/login"
                className="hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-lg shadow hover:scale-105 hover:shadow-lg transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* User badge */}
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold">{user?.name}</span>
              </div>

              {/* Add Property Button */}
              <Link
                href="/addproperty"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg shadow hover:scale-105 hover:shadow-xl transition"
              >
                + Add Property
              </Link>

              <Link
                href="/my-properties"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg shadow hover:scale-105 hover:shadow-xl transition"
              >
                My Property
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
