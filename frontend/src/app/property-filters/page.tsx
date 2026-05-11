// app/property-filters/page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function PropertyFiltersPage() {

  const router = useRouter();

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

  // Redirect desktop users
  useEffect(() => {

    if (
      typeof window !== "undefined" &&
      window.innerWidth >= 768
    ) {
      router.replace("/properties");
    }

  }, [router]);

  const applyFilters = () => {

    const params =
      new URLSearchParams();

    if (location) {
      params.append(
        "location",
        location
      );
    }

    if (minPrice) {
      params.append(
        "minPrice",
        minPrice
      );
    }

    if (maxPrice) {
      params.append(
        "maxPrice",
        maxPrice
      );
    }

    if (listingType) {
      params.append(
        "listingType",
        listingType
      );
    }

    if (sort) {
      params.append(
        "sort",
        sort
      );
    }

    router.push(
      `/properties?${params.toString()}`
    );
  };

  const clearFilters = () => {

    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setListingType("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-gray-50 md:hidden">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">

        <div className="flex items-center justify-between px-4 py-4">

          <h1 className="text-lg font-bold text-gray-800">
            Filters
          </h1>

          <button
            onClick={() =>
              router.back()
            }
            className="text-sm font-medium text-orange-500"
          >
            Close
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-5">

        {/* Location */}
        <div>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            City / Locality
          </label>

          <input
            type="text"
            placeholder="Enter city"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
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
              onChange={(e) =>
                setMinPrice(
                  e.target.value
                )
              }
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Buy / Rent */}
        <div>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Listing Type
          </label>

          <select
            value={listingType}
            onChange={(e) =>
              setListingType(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
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
        </div>

        {/* Sort */}
        <div>

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={sort}
            onChange={(e) =>
              setSort(
                e.target.value
              )
            }
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-orange-400"
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
          onClick={clearFilters}
          className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="w-2/3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white py-3 rounded-2xl font-semibold shadow-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}