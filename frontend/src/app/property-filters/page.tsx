
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  "Buy",
  "Rent",
  "PG",
  "Plot",
  "Commercial",
  "Shop",
];

const propertyTypes = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Shop",
  "PG",
];

export default function PropertyFiltersPage() {
  const router = useRouter();

  const [category, setCategory] = useState("Buy");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("");

  // Redirect desktop users
useEffect(() => {
  if (typeof window === "undefined") return;

  if (window.innerWidth >= 768) {
    router.replace("/properties");
  }
}, [router]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.append("location", location);
    }

    if (minPrice) {
      params.append("minPrice", minPrice);
    }

    if (maxPrice) {
      params.append("maxPrice", maxPrice);
    }

    if (propertyType) {
      params.append("propertyType", propertyType);
    }

    if (category) {
      params.append("category", category);
    }

    if (sort) {
      params.append("sort", sort);
    }

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setCategory("Buy");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-800">
            Filters
          </h1>

          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-orange-500"
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
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition

                ${
                  category === tab
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
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
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City / Locality
          </label>

          <input
            type="text"
            placeholder="Enter city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Budget
          </label>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Property Type
          </label>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Select Type
            </option>

            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Latest
            </option>

            <option value="price_low">
              Price Low → High
            </option>

            <option value="price_high">
              Price High → Low
            </option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">

        <button
          onClick={clearFilters}
          className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="w-2/3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white py-3 rounded-2xl font-semibold shadow-lg active:scale-95 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

