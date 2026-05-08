"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  type?: string;
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMobile, setIsMobile] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- MOBILE CHECK ---------------- */

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();

    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  /* ---------------- FILTERS ---------------- */

  const location = searchParams.get("location") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  /* ---------------- LOAD PROPERTIES ---------------- */

  useEffect(() => {
    fetchProperties();
  }, [
    location,
    minPrice,
    maxPrice,
    propertyType,
    category,
    sort,
  ]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (propertyType)
        params.append("propertyType", propertyType);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
      );

      const data = await res.json();

      setProperties(data.properties || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
      {/* HEADER */}

      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Discover Properties
            </h1>

            <p className="text-sm text-gray-400 font-light mt-1">
              Search city, budget & property type
            </p>
          </div>

          {/* MOBILE FILTER BUTTON */}

          {isMobile && (
            <button
              onClick={() => router.push("/property-filters")}
              className="bg-black text-white text-sm px-4 py-2 rounded-lg"
            >
              Filters
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP FILTERS */}

      {!isMobile && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-6 gap-3">
            <input
              type="text"
              value={location}
              readOnly
              placeholder="City"
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="text"
              value={propertyType}
              readOnly
              placeholder="Property Type"
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="text"
              value={category}
              readOnly
              placeholder="Category"
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="text"
              value={minPrice}
              readOnly
              placeholder="Min Price"
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="text"
              value={maxPrice}
              readOnly
              placeholder="Max Price"
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={() => router.push("/property-filters")}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
            >
              Edit Filters
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white rounded-xl p-3 border"
            >
              <div className="bg-gray-200 h-48 rounded-lg" />

              <div className="h-4 bg-gray-200 rounded mt-4" />

              <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}

      {!loading && properties.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              No properties found
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Try changing filters
            </p>
          </div>
        </div>
      )}

      {/* PROPERTIES */}

      {!loading && properties.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <Link
              key={property._id}
              href={`/properties/${property._id}`}
            >
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
                {/* IMAGE */}

                <div className="relative">
                  <Image
                    src={
                      property.images?.[0] ||
                      "/no-image.png"
                    }
                    alt={property.title}
                    width={500}
                    height={300}
                    className="w-full h-52 object-cover"
                  />

                  <span className="absolute top-3 left-3 bg-black/80 text-white text-xs px-3 py-1 rounded-md">
                    {property.type || "Property"}
                  </span>
                </div>

                {/* CONTENT */}

                <div className="p-4">
                  <h2 className="font-semibold text-gray-800 line-clamp-1">
                    {property.title}
                  </h2>

                  <p className="text-xl font-bold text-black mt-2">
                    ₹ {property.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {property.location}
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