"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyFiltersPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingType, setListingType] = useState("");
  const [sort, setSort] = useState("");

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) {
      params.append("keyword", keyword);
    }

    if (location.trim()) {
      params.append("location", location);
    }

    if (minPrice) {
      params.append("minPrice", minPrice);
    }

    if (maxPrice) {
      params.append("maxPrice", maxPrice);
    }

    if (listingType) {
      params.append("listingType", listingType);
    }

    if (sort) {
      params.append("sort", sort);
    }

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setKeyword("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setListingType("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">

      <input
        type="text"
        placeholder="Search properties"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-xl px-4 py-3"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-xl px-4 py-3"
        />
      </div>

      <select
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      >
        <option value="">All</option>
        <option value="buy">Buy</option>
        <option value="rent">Rent</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full border rounded-xl px-4 py-3"
      >
        <option value="">Latest</option>
        <option value="priceLow">Price Low → High</option>
        <option value="priceHigh">Price High → Low</option>
      </select>

      <div className="flex gap-3">
        <button
          onClick={clearFilters}
          className="w-1/3 border rounded-xl py-3"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="w-2/3 bg-orange-500 text-white rounded-xl py-3"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}