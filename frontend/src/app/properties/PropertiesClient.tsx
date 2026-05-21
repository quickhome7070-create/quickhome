// app/properties/PropertiesClient.tsx

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
  listingType?: "buy" | "rent";
  propertyType?: string;
  seller?: "owner" | "agent";
  bhkType?: string;
   createdAt?: string;
};

type Props = {
  initialProperties: Property[];

  searchParams: {
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    listingType?: string;
    sort?: string;
    propertyType?: string;
    seller?: string;
    bhkType?: string;
    plotType?: string;
    furnishing?: string;
    shopType?: string;
  };
};

const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Plot",
  "Office Space",
  "Shop",
];

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

export default function PropertiesClient({
  initialProperties,
  searchParams,
}: Props) {

  const router = useRouter();

  const properties = initialProperties;

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

  useEffect(() => {

    setPropertyType(
      searchParams.propertyType || ""
    );

    setBhkType(
      searchParams.bhkType || ""
    );

    setPlotType(
      searchParams.plotType || ""
    );

    setFurnishing(
      searchParams.furnishing || ""
    );

    setShopType(
      searchParams.shopType || ""
    );

    setLocation(
      searchParams.location || ""
    );

    setMinPrice(
      searchParams.minPrice || ""
    );

    setMaxPrice(
      searchParams.maxPrice || ""
    );

    setListingType(
      searchParams.listingType || ""
    );

    setSeller(
      searchParams.seller || ""
    );

    setSort(
      searchParams.sort || ""
    );

  }, [searchParams]);

  const handlePropertyTypeChange = (
    value: string
  ) => {

    setPropertyType(value);

    setBhkType("");
    setPlotType("");
    setFurnishing("");
    setShopType("");
  };

  const handleSearch = () => {

    const query =
      new URLSearchParams();

    if (propertyType) {
      query.append(
        "propertyType",
        propertyType
      );
    }

    if (bhkType) {
      query.append(
        "bhkType",
        bhkType
      );
    }

    if (plotType) {
      query.append(
        "plotType",
        plotType
      );
    }

    if (furnishing) {
      query.append(
        "furnishing",
        furnishing
      );
    }

    if (shopType) {
      query.append(
        "shopType",
        shopType
      );
    }

    if (location) {
      query.append(
        "location",
        location
      );
    }

    if (minPrice) {
      query.append(
        "minPrice",
        minPrice
      );
    }

    if (maxPrice) {
      query.append(
        "maxPrice",
        maxPrice
      );
    }

    if (listingType) {
      query.append(
        "listingType",
        listingType
      );
    }

    if (seller) {
      query.append(
        "seller",
        seller
      );
    }

    if (sort) {
      query.append(
        "sort",
        sort
      );
    }

    router.push(
      `/properties?${query.toString()}`
    );
  };

  return (
    <div>

      {/* MOBILE FILTER */}
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
            Search...
          </p>

        </button>

      </div>

 {/* DESKTOP FILTERS */}
<div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6">

  <div className="grid grid-cols-9 gap-4 items-center">

    {/* PROPERTY TYPE */}
    <select
      value={propertyType}
      onChange={(e) =>
        handlePropertyTypeChange(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    >
      <option value="">
        Property Type
      </option>

      {PROPERTY_TYPES.map((type) => (

        <option
          key={type}
          value={type}
        >
          {type}
        </option>

      ))}

    </select>

    {/* DYNAMIC DROPDOWN */}
    {["Flat", "House"].includes(
      propertyType
    ) ? (

      <select
        value={bhkType}
        onChange={(e) =>
          setBhkType(
            e.target.value
          )
        }
        className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">
          Select BHK
        </option>

        {BHK_TYPES.map((type) => (

          <option
            key={type}
            value={type}
          >
            {type}
          </option>

        ))}

      </select>

    ) : propertyType === "Plot" ? (

      <select
        value={plotType}
        onChange={(e) =>
          setPlotType(
            e.target.value
          )
        }
        className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">
          Plot Type
        </option>

        <option value="Residential">
          Residential
        </option>

        <option value="Commercial">
          Commercial
        </option>

      </select>

    ) : propertyType ===
      "Office Space" ? (

      <select
        value={furnishing}
        onChange={(e) =>
          setFurnishing(
            e.target.value
          )
        }
        className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">
          Furnishing
        </option>

        <option value="Furnished">
          Furnished
        </option>

        <option value="Unfurnished">
          Unfurnished
        </option>

      </select>

    ) : propertyType === "Shop" ? (

      <select
        value={shopType}
        onChange={(e) =>
          setShopType(
            e.target.value
          )
        }
        className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">
          Shop Type
        </option>

        {SHOP_TYPES.map((type) => (

          <option
            key={type}
            value={type}
          >
            {type}
          </option>

        ))}

      </select>

    ) : (

      <div />

    )}

    {/* CITY */}
    <input
      type="text"
      placeholder="City"
      value={location}
      onChange={(e) =>
        setLocation(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    />

    {/* MIN PRICE */}
    <input
      type="number"
      placeholder="Min Price"
      value={minPrice}
      onChange={(e) =>
        setMinPrice(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    />

    {/* MAX PRICE */}
    <input
      type="number"
      placeholder="Max Price"
      value={maxPrice}
      onChange={(e) =>
        setMaxPrice(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    />

    {/* SELLER */}
    <select
      value={seller}
      onChange={(e) =>
        setSeller(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    >
      <option value="">
        Seller
      </option>

      <option value="owner">
        Owner
      </option>

      <option value="agent">
        Agent
      </option>

    </select>

    {/* LISTING TYPE */}
    <select
      value={listingType}
      onChange={(e) =>
        setListingType(
          e.target.value
        )
      }
      className="min-w-0 h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-orange-400"
    >
      <option value="">
        Buy/Rent
      </option>

      <option value="buy">
        Buy
      </option>

      <option value="rent">
        Rent
      </option>

    </select>

    {/* SEARCH BUTTON */}
    <button
      onClick={handleSearch}
      className="h-11 px-6 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white rounded-xl font-medium shadow-md"
    >
      Search
    </button>

  </div>

</div>

      {/* PROPERTY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {properties.map((property) => (

          <Link
            key={property._id}
            href={`/properties/${property._id}`}
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">

              <Image
                src={
                  property.images?.[0]?.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_800/"
                  ) || "/no-image.png"
                }
                alt={property.title}
                width={500}
                height={300}
                loading="lazy"
                quality={60}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">

                <h2 className="font-semibold text-lg line-clamp-1">
                  {property.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {property.propertyType}

                  {property.bhkType &&
                    ` • ${property.bhkType}`}
                </p>

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
                  {property.location}
                </p>

                {/* POSTED DATE */}
<p className="text-sm text-gray-500 mt-2">
  {(() => {
    const createdDate = new Date(
      property.createdAt || ""
    );

    const today = new Date();

    const yesterday = new Date();

    yesterday.setDate(
      today.getDate() - 1
    );

    const isToday =
      createdDate.toDateString() ===
      today.toDateString();

    const isYesterday =
      createdDate.toDateString() ===
      yesterday.toDateString();

    if (isToday) {
      return "Posted Today";
    }

    if (isYesterday) {
      return "Posted Yesterday";
    }

    return `Posted on ${createdDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )}`;
  })()}
</p>
                

                <p className="text-sm text-gray-500 mt-2">
                  Posted By{" "}

                  <b className="text-blue-500">
                    {property.seller?.toUpperCase()}
                  </b>
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}