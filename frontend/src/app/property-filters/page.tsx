"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PropertyFiltersPage() {
  const router = useRouter();

  const [category, setCategory] = useState("Buy");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("");

  const tabs = [
    "Buy",
    "Rent",
    "PG",
    "Plot",
    "Commercial",
    "Shop",
  ];

  const applyFilters = () => {
    const params = new URLSearchParams({
      location,
      minPrice,
      maxPrice,
      propertyType,
      category,
      sort,
    });

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">
            Filters
          </h1>

          <button
            onClick={() => router.back()}
            className="text-sm text-orange-500 font-medium"
          >
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCategory(tab)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200
              
              ${
                category === tab
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-5">

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City / Locality
          </label>

          <input
            type="text"
            placeholder="Enter city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget
          </label>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Commercial">Commercial</option>
            <option value="Shop">Shop</option>
            <option value="PG">PG</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Latest</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
          </select>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">

        <button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white py-3 rounded-2xl font-semibold shadow-lg active:scale-95 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}