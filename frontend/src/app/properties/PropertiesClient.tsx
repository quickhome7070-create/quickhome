// app/properties/PropertiesClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  listingType?: "buy" | "rent";
};

type Props = {
  searchParams: {
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    listingType?: string;
    sort?: string;
  };
};

export default function PropertiesClient({
  searchParams,
}: Props) {

  const router = useRouter();

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(false);

  // Filters
  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [listingType, setListingType] =
    useState("");

  const [sort, setSort] =
    useState("");

  // Load filters from URL
  useEffect(() => {

    const locationParam =
      searchParams.location || "";

    const minPriceParam =
      searchParams.minPrice || "";

    const maxPriceParam =
      searchParams.maxPrice || "";

    const listingTypeParam =
      searchParams.listingType || "";

    const sortParam =
      searchParams.sort || "";

    setLocation(locationParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setListingType(listingTypeParam);
    setSort(sortParam);

    loadProperties({
      location: locationParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      listingType: listingTypeParam,
      sort: sortParam,
    });

  }, []);

  const loadProperties = async (
    filters?: any
  ) => {

    try {
      setLoading(true);

      const finalFilters =
        filters || {
          search,
          location,
          minPrice,
          maxPrice,
          listingType,
          sort,
        };

      const params =
        new URLSearchParams();

      if (finalFilters.search) {
        params.append(
          "keyword",
          finalFilters.search
        );
      }

      if (finalFilters.location) {
        params.append(
          "location",
          finalFilters.location
        );
      }

      if (finalFilters.minPrice) {
        params.append(
          "minPrice",
          finalFilters.minPrice
        );
      }

      if (finalFilters.maxPrice) {
        params.append(
          "maxPrice",
          finalFilters.maxPrice
        );
      }

      if (finalFilters.listingType) {
        params.append(
          "listingType",
          finalFilters.listingType
        );
      }

      if (finalFilters.sort) {
        params.append(
          "sort",
          finalFilters.sort
        );
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
      );

      const data = await res.json();

      setProperties(
        data.properties || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div>

      {/* MOBILE SEARCH */}
      <div className="md:hidden mb-5">

        <button
          onClick={() =>
            router.push(
              "/property-filters"
            )
          }
          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 shadow-sm text-left"
        >
          <p className="text-sm text-gray-400">
            🔍 Search city, budget,
            buy/rent...
          </p>
        </button>
      </div>

      {/* DESKTOP FILTERS */}
      <div className="hidden md:grid bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 grid-cols-7 gap-3">

        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Location */}
        <input
          type="text"
          placeholder="City"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Buy / Rent */}
        <select
          value={listingType}
          onChange={(e) =>
            setListingType(
              e.target.value
            )
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">
            All
          </option>

          <option value="buy">
            Buy
          </option>

          <option value="rent">
            Rent
          </option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
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

        {/* Search Button */}
        <button
          onClick={() =>
            loadProperties()
          }
          className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white rounded-xl font-medium shadow-md"
        >
          {loading
            ? "Loading..."
            : "Search"}
        </button>
      </div>

      {/* PROPERTY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {properties.map(
          (property) => (

            <Link
              key={property._id}
              href={`/properties/${property._id}`}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">

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

                <div className="p-4">

                  <h2 className="font-semibold text-lg line-clamp-1">
                    {property.title}
                  </h2>

                  <div className="flex items-center justify-between mt-2">

                    <p className="text-orange-600 text-xl font-bold">
                      ₹ {property.price}
                    </p>

                    {property.listingType && (
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          property.listingType ===
                          "buy"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {property.listingType.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {property.location}
                  </p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}