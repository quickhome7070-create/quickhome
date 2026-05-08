"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
};

export default function PropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const loadProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.append("keyword", search);
      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);

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

  useEffect(() => {
    loadProperties();
  }, []);

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

      {/* MOBILE SEARCH */}
      <div className="md:hidden max-w-7xl mx-auto mb-5">
        <button
          onClick={() => router.push("/property-filters")}
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-left shadow-sm"
        >
          <p className="text-sm text-gray-400">
            Search city...
          </p>
        </button>
      </div>

      {/* DESKTOP FILTERS */}
      <div className="hidden md:grid max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 grid-cols-6 gap-3">

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

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Latest</option>
          <option value="priceLow">Price Low → High</option>
          <option value="priceHigh">Price High → Low</option>
        </select>

        <button
          onClick={loadProperties}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
        >
          {loading ? "Loading..." : "Apply"}
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

                <p className="text-orange-600 text-xl font-bold mt-2">
                  ₹ {property.price}
                </p>

                <p className="text-sm text-gray-500 mt-1">
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