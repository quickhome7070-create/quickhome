"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const loadProperties = async (
  locationValue = location,
  minValue = minPrice,
  maxValue = maxPrice,
  sortValue = sort,
  categoryValue = "",
  propertyTypeValue = ""
) => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      location: locationValue,
      minPrice: minValue,
      maxPrice: maxValue,
      sort: sortValue,
      category: categoryValue,
      propertyType: propertyTypeValue,
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
    );

    const data = await res.json();

    setProperties(data.properties || []);
    setFilterApplied(true);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const searchParams = useSearchParams();
  useEffect(() => {
  const locationParam = searchParams.get("location") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "";
  const categoryParam = searchParams.get("category") || "";
  const propertyTypeParam =
    searchParams.get("propertyType") || "";

  setLocation(locationParam);
  setMinPrice(minPriceParam);
  setMaxPrice(maxPriceParam);
  setSort(sortParam);

  loadProperties(
    locationParam,
    minPriceParam,
    maxPriceParam,
    sortParam,
    categoryParam,
    propertyTypeParam
  );
}, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Discover Properties
        </h1>

        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Find your dream home...
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">

        {/* Mobile Filter */}
        <Link href="/property-filters" className="block md:hidden">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 flex items-center gap-3">

            

            <div>
              <p className="text-sm font-light text-gray-500">
  Search City...
</p>

              
            </div>
          </div>
        </Link>

        {/* Desktop Filters */}
        <div className="hidden md:grid bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-5 border border-gray-200 grid-cols-6 gap-3">

          <input
            type="text"
            placeholder="Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            placeholder="City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Latest</option>
            <option value="priceLow">Price Low → High</option>
            <option value="priceHigh">Price High → Low</option>
          </select>

          <button
            onClick={() => loadProperties()}
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition"
          >
            {loading ? "Loading..." : "Apply"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl shadow p-3"
            >
              <div className="bg-gray-200 h-44 sm:h-52 rounded-xl" />

              <div className="h-4 bg-gray-200 mt-4 rounded" />

              <div className="h-4 bg-gray-200 mt-2 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filterApplied && properties.length === 0 && (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-xl font-semibold">
            No properties found
          </p>

          <p className="text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && properties.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {properties.map((p) => (
            <Link key={p._id} href={`/properties/${p._id}`}>

              <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden border border-gray-100 cursor-pointer">

                {/* Image */}
                <div className="relative overflow-hidden">

                  <Image
                    src={p.images?.[0] || "/no-image.png"}
                    alt={p.title}
                    width={500}
                    height={300}
                    className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition duration-300"
                  />

                  <span className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                    {p.type || "Property"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">

                  <h2 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
                    {p.title}
                  </h2>

                  <p className="text-black font-bold text-lg sm:text-xl mt-1">
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