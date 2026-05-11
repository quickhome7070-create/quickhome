"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  listingType: "buy" | "rent";
  images?: string[];
};

export default function PropertiesPage() {
  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [keyword, setKeyword] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [listingType, setListingType] =
    useState("");

  const [sort, setSort] =
    useState("");

  const loadProperties = async () => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (keyword) {
        params.append(
          "keyword",
          keyword
        );
      }

      if (location) {
        params.append(
          "location",
          location
        );
      }

      if (listingType) {
        params.append(
          "listingType",
          listingType
        );
      }

      if (sort) {
        params.append("sort", sort);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property?${params.toString()}`
      );

      const data = await res.json();

      setProperties(data.properties);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-5">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white p-4 rounded-2xl shadow mb-6 grid md:grid-cols-5 gap-3">

          <input
            type="text"
            placeholder="Search"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={listingType}
            onChange={(e) =>
              setListingType(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
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

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="border p-3 rounded-xl"
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

          <button
            onClick={loadProperties}
            className="bg-orange-500 text-white rounded-xl"
          >
            {loading
              ? "Loading..."
              : "Search"}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {properties.map((property) => (
            <Link
              href={`/properties/${property._id}`}
              key={property._id}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow">

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

                  <h2 className="font-bold text-lg">
                    {property.title}
                  </h2>

                  <p className="text-orange-500 font-bold mt-2">
                    ₹ {property.price}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {property.location}
                  </p>

                  <span className="inline-block mt-3 bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {property.listingType.toUpperCase()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}