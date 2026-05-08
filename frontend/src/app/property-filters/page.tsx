"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
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

export default function PropertyFilters() {
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  const [category, setCategory] = useState("Buy");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("");

  // detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // apply filters
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

  // reset filters
  const resetFilters = () => {
    setCategory("Buy");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("");
    setSort("");
  };

  // desktop hide
  if (!isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="flex items-center justify-between px-4 py-4">

          <h1 className="text-lg font-semibold text-gray-800">
            Filters
          </h1>

          <button
            onClick={() => router.back()}
            className="text-sm text-orange-500 font-medium"
          >
            Close
          </button>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-2 rounded-xl whitespace-nowrap text-sm transition

              ${
                category === item
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-5">

        {/* LOCATION */}
        <div>

          <p className="text-sm font-light text-gray-500 mb-2">
            Search City
          </p>

          <input
            type="text"
            placeholder="Enter city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* PRICE */}
        <div>

          <p className="text-sm font-light text-gray-500 mb-2">
            Budget
          </p>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div>

          <p className="text-sm font-light text-gray-500 mb-2">
            Property Type
          </p>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Select Type
            </option>

            {propertyTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div>

          <p className="text-sm font-light text-gray-500 mb-2">
            Sort By
          </p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">
              Latest
            </option>

            <option value="priceLow">
              Price Low → High
            </option>

            <option value="priceHigh">
              Price High → Low
            </option>
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">

        <button
          onClick={resetFilters}
          className="w-1/3 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-700"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="w-2/3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white rounded-xl py-3 text-sm font-semibold shadow-lg active:scale-95 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}