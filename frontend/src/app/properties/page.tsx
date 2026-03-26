"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");

  const loadProperties = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      location,
      minPrice,
      maxPrice,
      type,
      sort,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
    );

    const data = await res.json();
    setProperties(data.properties || []);
    setFilterApplied(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Discover Properties
        </h1>
        <p className="text-gray-500 text-md pt-2">
          Find your dream home...
        </p>
      </div>

      {/* Filters Card */}
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-5 mb-8 border border-gray-200 grid md:grid-cols-6 gap-3">

        <input
          placeholder="Search title..."
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="City"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          placeholder="Min Price"
          type="number"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          placeholder="Max Price"
          type="number"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <select
          className="border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Latest</option>
          <option value="price_low">Price Low → High</option>
          <option value="price_high">Price High → Low</option>
        </select>

        <button
          onClick={loadProperties}
          className="col-span-6 bg-black hover:bg-gray-900 text-white py-2 rounded-lg transition font-semibold"
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-xl shadow p-3"
            >
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="h-4 bg-gray-200 mt-3 rounded"></div>
              <div className="h-4 bg-gray-200 mt-2 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filterApplied && !loading && properties.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-xl font-semibold">No properties found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {properties.map((p) => (
            <Link key={p._id} href={`/properties/${p._id}`}>
              <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden cursor-pointer border border-gray-100">

                {/* Image */}
                <div className="relative">
                  <Image
                    src={p.images?.[0] || "/no-image.png"}
                    alt={p.title}
                    width={500}
                    height={300}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                  />

                  <span className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1 rounded-full">
                    {p.type || "Property"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {p.title}
                  </h2>

                  <p className="text-black font-bold text-xl mt-1">
                    ₹ {p.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    📍 {p.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
