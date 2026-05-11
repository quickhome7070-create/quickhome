// app/properties/PropertiesClient.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import Loader from "@/src/components/Loader";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images?: string[];
  listingType?: "buy" | "rent";
  propertyType?:string;
};

type Props = {
  searchParams: {
    keyword?: string;
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

  const params = useSearchParams();

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [loading, setLoading] =
    useState(false);

    const [propertyType, setPropertyType] =
  useState("");

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

  useEffect(() => {

    const keywordParam =
      params.get("keyword") || "";

    const locationParam =
      params.get("location") || "";

      const propertyTypeParam =
  params.get("propertyType") || "";

setPropertyType(propertyTypeParam);

    const minPriceParam =
      params.get("minPrice") || "";

    const maxPriceParam =
      params.get("maxPrice") || "";

    const listingTypeParam =
      params.get("listingType") || "";

    const sortParam =
      params.get("sort") || "";

    setSearch(keywordParam);

    setLocation(locationParam);

    setMinPrice(minPriceParam);

    setMaxPrice(maxPriceParam);

    setListingType(listingTypeParam);

    setSort(sortParam);

    loadProperties({
      keyword: keywordParam,
      location: locationParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      listingType: listingTypeParam,
      propertyType: propertyTypeParam,
      sort: sortParam,
    });

  }, [params]);

  const loadProperties = async (
    filters?: any
  ) => {

    try {

      setLoading(true);
      if (loading) {
  return <Loader/>;
}

      const finalFilters =
        filters || {
          keyword: search,
          location,
          minPrice,
          maxPrice,
          listingType,
          sort,
          propertyType,
        };

      const query =
        new URLSearchParams();

      if (finalFilters.keyword) {
        query.append(
          "keyword",
          finalFilters.keyword
        );
      }

      if (finalFilters.location) {
        query.append(
          "location",
          finalFilters.location
        );
      }

      if (finalFilters.propertyType) {
  query.append(
    "propertyType",
    finalFilters.propertyType
  );
}

      if (finalFilters.minPrice) {
        query.append(
          "minPrice",
          finalFilters.minPrice
        );
      }

      if (finalFilters.maxPrice) {
        query.append(
          "maxPrice",
          finalFilters.maxPrice
        );
      }

      if (finalFilters.listingType) {
        query.append(
          "listingType",
          finalFilters.listingType
        );
      }

      if (finalFilters.sort) {
        query.append(
          "sort",
          finalFilters.sort
        );
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property?${query.toString()}`
      );

      const data =
        await res.json();

      setProperties(
        data.properties || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
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
      <div className="hidden md:grid bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 grid-cols-7 gap-3">

        {/* <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        /> */}

      {/* DESKTOP DROPDOWN */}


  <select
    value={propertyType}
    onChange={(e) =>
      setPropertyType(
        e.target.value
      )
    }
    className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
  >
    <option value="">
      Property Type
    </option>

    <option value="Flat">
      Flat
    </option>

    <option value="House">
      House
    </option>

    <option value="Plot">
      Plot
    </option>

    <option value="Office Space">
      Office Space
    </option>

    <option value="Shop">
      Shop
    </option>
  </select>


        <input
          type="text"
          placeholder="City"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
          className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
        />

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
            Buy/Rent
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

        <button
          onClick={() => {

  const query =
    new URLSearchParams();

  if (propertyType) {
    query.append(
      "propertyType",
      propertyType
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

  if (sort) {
    query.append(
      "sort",
      sort
    );
  }

  router.push(
    `/properties?${query.toString()}`
  );
}}
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

                {/* <Image
                  src={
                    property.images?.[0] ||
                    "/no-image.png"
                  }
                  alt={property.title}
                  width={500}
                  height={300}                   
                  className="w-full h-52 object-cover"
                /> */}
                <Image
  src={
    property.images?.[0]
      ?.replace(
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
    🏠 {property.propertyType}
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