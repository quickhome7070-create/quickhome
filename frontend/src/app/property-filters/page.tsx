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

const BHK_TYPES = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
];

const SHOP_TYPES = [
  "Hotel",
  "Saloon",
  "Grocery",
  "Medical",
  "Clothing",
  "Mobile Shop",
];

export default function PropertyFiltersPage() {

  const router = useRouter();

  const [propertyType, setPropertyType] =
    useState("");

  const [bhkType, setBhkType] =
    useState("");

  const [plotType, setPlotType] =
    useState("");

  const [furnishing, setFurnishing] =
    useState("");

  const [shopType, setShopType] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [listingType, setListingType] =
    useState("");

  const [seller, setSeller] =
    useState("");

  const [sort, setSort] =
    useState("");

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

  const handlePropertyType = (
    type: string
  ) => {

    setPropertyType(type);

    // reset dynamic filters
    setBhkType("");
    setPlotType("");
    setFurnishing("");
    setShopType("");
  };

  const applyFilters = () => {

    const params =
      new URLSearchParams();

    if (propertyType) {
      params.append(
        "propertyType",
        propertyType
      );
    }

    if (bhkType) {
      params.append(
        "bhkType",
        bhkType
      );
    }

    if (plotType) {
      params.append(
        "plotType",
        plotType
      );
    }

    if (furnishing) {
      params.append(
        "furnishing",
        furnishing
      );
    }

    if (shopType) {
      params.append(
        "shopType",
        shopType
      );
    }

    if (location.trim()) {
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

    if (seller) {
      params.append(
        "seller",
        seller
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

    setPropertyType("");
    setBhkType("");
    setPlotType("");
    setFurnishing("");
    setShopType("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setListingType("");
    setSeller("");
    setSort("");
  };

  return (

    <div className="min-h-screen bg-gray-50 p-4 space-y-5">

      {/* CITY */}
      <input
        type="text"
        placeholder="Search City"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
        className="w-full h-12 border border-gray-200 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* BUY / RENT */}
      <div className="grid grid-cols-2 gap-3">

        {["buy", "rent"].map((type) => (

          <button
            key={type}
            type="button"
            onClick={() =>
              setListingType(type)
            }
            className={`h-12 rounded-2xl text-sm font-medium border transition ${
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

      {/* PROPERTY TYPES */}
      <div
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >

        {propertyTabs.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.name}
              type="button"
              onClick={() =>
                handlePropertyType(
                  item.name
                )
              }
              className={`flex flex-col items-center justify-center min-w-[100px] h-24 px-4 rounded-2xl border transition ${
                propertyType === item.name
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              <Icon size={22} />

              <span className="mt-2 text-xs text-center">
                {item.name}
              </span>
            </button>

          );
        })}

      </div>

      {/* DYNAMIC FILTERS */}
      {["Flat", "House"].includes(
        propertyType
      ) && (

        <div className="flex gap-3 overflow-x-auto scrollbar-hide">

          {BHK_TYPES.map((bhk) => (

            <button
              key={bhk}
              type="button"
              onClick={() =>
                setBhkType(bhk)
              }
              className={`px-5 h-12 rounded-2xl text-sm font-medium border whitespace-nowrap transition ${
                bhkType === bhk
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {bhk}
            </button>

          ))}

        </div>

      )}

      {propertyType === "Plot" && (

        <div className="grid grid-cols-2 gap-3">

          {[
            "Residential",
            "Commercial",
          ].map((type) => (

            <button
              key={type}
              type="button"
              onClick={() =>
                setPlotType(type)
              }
              className={`h-12 rounded-2xl text-sm font-medium border transition ${
                plotType === type
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {type}
            </button>

          ))}

        </div>

      )}

      {propertyType ===
        "Office Space" && (

        <div className="grid grid-cols-2 gap-3">

          {[
            "Furnished",
            "Unfurnished",
          ].map((type) => (

            <button
              key={type}
              type="button"
              onClick={() =>
                setFurnishing(type)
              }
              className={`h-12 rounded-2xl text-sm font-medium border transition ${
                furnishing === type
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {type}
            </button>

          ))}

        </div>

      )}

      {propertyType === "Shop" && (

        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {SHOP_TYPES.map((type) => (

            <button
              key={type}
              type="button"
              onClick={() =>
                setShopType(type)
              }
              className={`px-5 h-12 rounded-2xl text-sm font-medium border whitespace-nowrap transition ${
                shopType === type
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {type}
            </button>

          ))}

        </div>

      )}

      {/* PRICE */}
      <div className="grid grid-cols-2 gap-3">

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
          className="h-12 border border-gray-200 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
          className="h-12 border border-gray-200 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
        />

      </div>

      {/* SELLER */}
      <div className="grid grid-cols-2 gap-3">

        {["owner", "agent"].map((type) => (

          <button
            key={type}
            type="button"
            onClick={() =>
              setSeller(type)
            }
            className={`h-12 rounded-2xl text-sm font-medium border transition ${
              seller === type
                ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {type === "owner"
              ? "Owner"
              : "Agent"}
          </button>

        ))}

      </div>

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
        className="w-full h-12 border border-gray-200 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-orange-400"
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

      {/* BUTTONS */}
      <div className="grid grid-cols-2 gap-3 pt-2">

        <button
          onClick={clearFilters}
          className="h-12 border border-gray-300 rounded-2xl font-medium bg-white"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="h-12 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white rounded-2xl font-medium shadow-md"
        >
          Search
        </button>

      </div>

    </div>
  );
}