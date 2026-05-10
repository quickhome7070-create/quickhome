"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  listingType: "buy" | "rent";
};

export default function PropertiesPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [listingType, setListingType] = useState("");

  // Load filters from URL


  const loadProperties = async (filters?: any) => {
  try {
    setLoading(true);

    const params = new URLSearchParams();

    const finalFilters = filters || {
      search,
      location,
      minPrice,
      maxPrice,
      sort,
      listingType,
    };

    if (finalFilters.search) {
      params.append("search", finalFilters.search);
    }

    if (finalFilters.location) {
      params.append("location", finalFilters.location);
    }

    if (finalFilters.minPrice) {
      params.append("minPrice", finalFilters.minPrice);
    }

    if (finalFilters.maxPrice) {
      params.append("maxPrice", finalFilters.maxPrice);
    }

    if (finalFilters.sort) {
      params.append("sort", finalFilters.sort);
    }

    if (finalFilters.listingType) {
      params.append(
        "listingType",
        finalFilters.listingType
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
    );

    const data = await res.json();

    setProperties(data.properties || []);

  } catch (error) {
    console.error(error);

  } finally {
    setLoading(false);
  }
};

//   const locationParam = searchParams.get("location") || "";
//   const minPriceParam = searchParams.get("minPrice") || "";
//   const maxPriceParam = searchParams.get("maxPrice") || "";
//   const sortParam = searchParams.get("sort") || "";
//   const listingTypeParam =
//     searchParams.get("listingType") || "";

//   // Set UI states
//   setLocation(locationParam);
//   setMinPrice(minPriceParam);
//   setMaxPrice(maxPriceParam);
//   setSort(sortParam);
//   setListingType(listingTypeParam);

//   // Load directly using params
//   loadProperties({
//     location: locationParam,
//     minPrice: minPriceParam,
//     maxPrice: maxPriceParam,
//     sort: sortParam,
//     listingType: listingTypeParam,
//   });

// }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Discover Properties
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Find your dream home
        </p>
      </div>

      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden max-w-7xl mx-auto mb-5">
        <button
          onClick={() => router.push("/property-filters")}
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-left shadow-sm"
        >
          <p className="text-sm text-gray-400">
            Open Filters
          </p>
        </button>
      </div>

      {/* DESKTOP FILTERS */}
      <div className="hidden md:grid max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 grid-cols-7 gap-3">

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="text"
          placeholder="City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* BUY / RENT */}
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Latest</option>
          <option value="price_low">
            Price Low → High
          </option>

          <option value="price_high">
            Price High → Low
          </option>
        </select>

        {/* SEARCH BUTTON */}
        <button
          onClick={loadProperties}
          className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 hover:from-orange-600 hover:via-amber-500 hover:to-yellow-400 text-white rounded-xl font-medium shadow-md transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* PROPERTY GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {properties.map((property) => (
          <Link
            key={property._id}
            href={`/properties/${property._id}`}
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">

              <Image
                src={property.images?.[0] || "/no-image.png"}
                alt={property.title}
                width={500}
                height={300}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">

                <h2 className="font-semibold text-lg line-clamp-1">
                  {property.title}
                </h2>

                <div className="flex items-center justify-between mt-2">

                  <p className="text-orange-600 text-xl font-bold">
                    ₹ {property.price}
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      property.listingType === "buy"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {property.listingType.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  📍 {property.location}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}