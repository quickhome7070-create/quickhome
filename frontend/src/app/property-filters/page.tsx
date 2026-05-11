"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Home,
  Map,
  Briefcase,
  Store,
} from "lucide-react";

export default function PropertyFiltersPage() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingType, setListingType] = useState("");
  const [sort, setSort] = useState("");


const propertyTabs = [
  {
    name: "Flat",
    icon: Building2,
    
  },
  {
    name: "House",
    icon: Home,
  },
  {
    name: "Plot",
    icon: Map,
  },
  {
    name: "Office Space",
    icon: Briefcase,
  },
  {
    name: "Shop",
    icon: Store,
  },
];



  const applyFilters = () => {

    const params = new URLSearchParams();

    if (keyword.trim()) {
  params.append("propertyType", keyword);
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

    

     <div className="flex gap-3">

  {["buy", "rent"].map((type) => (

    <button
      key={type}
      type="button"
      onClick={() =>
        setListingType(type)
      }
      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition ${
        listingType === type
          ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      {type === "buy"
        ? "Buy"
        : "Rent"}
    </button>

  ))}

</div>

    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

  {propertyTabs.map((item) => {

    const Icon = item.icon;

    return (

      <button
        key={item.name}
        onClick={() =>
          setKeyword(item.name)
          
        }
        className={`flex flex-col w-16 h-16 items-center justify-center min-w-[90px] px-4 py-3 rounded-2xl text-sm font-medium border transition ${
          keyword === item.name
            ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
            : "bg-white text-gray-700 border-gray-200"
        }`}
      >
        <Icon size={22} />

        <span className="mt-2 text-xs">
          {item.name}
        </span>
      </button>
    );
  })}

</div>
     
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
          className="w-1/2 border rounded-xl py-3"
        >
          Reset
        </button>

      <button
  onClick={applyFilters}
  className="w-1/2 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white rounded-xl py-3 shadow-md"
>
  Search
</button>
      </div>
    </div>
  );
}