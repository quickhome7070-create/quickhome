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

  const [locationText,setLocationText] =
useState("");

const [locationResults,setLocationResults] =
useState<any[]>([]);

const [selectedCity,setSelectedCity] =
useState("");

const [selectedLocality,setSelectedLocality] =
useState("");

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

  const searchLocation = async(
value:string
)=>{


setLocationText(value);


if(value.length < 2){

setLocationResults([]);

return;

}



try{


const res =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/location/search?keyword=${value}`

);



const data =
await res.json();



setLocationResults(
data.locations || []
);



}
catch(error){

console.log(
"LOCATION SEARCH ERROR",
error
);

}


};

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

   if(selectedCity){

params.append(
"city",
selectedCity
);

}


if(selectedLocality){

params.append(
"locality",
selectedLocality
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
  <div className="min-h-screen bg-[#f8fafc] pb-28">

    {/* Header */}
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm"
        >
          ←
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            Filter Properties
          </h1>
          <p className="text-xs text-gray-500">
            Find homes that match your needs
          </p>
        </div>
      </div>
    </div>

    <div className="p-4 space-y-6">

      {/* Search city */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
        <label className="text-sm font-semibold text-gray-800 mb-2 block">
          City / Locality
        </label>

       <div className="relative">


<input

type="text"

value={locationText}

onChange={(e)=>
searchLocation(
e.target.value
)
}

placeholder="Search city or locality"

className="
w-full
h-12
border
rounded-2xl
px-4
outline-none
focus:ring-2
focus:ring-orange-400
"

/>



{
locationResults.length > 0 && (

<div
className="
absolute
top-14
left-0
right-0
bg-white
rounded-2xl
shadow-xl
border
z-50
overflow-hidden
"
>


{
locationResults.map((item)=>(


<button

key={item._id}

type="button"

onClick={()=>{


setLocationText(
`${item.locality} ${item.city}`
);


setSelectedCity(
item.city
);


setSelectedLocality(
item.locality
);


setLocationResults([]);


}}


className="
w-full
text-left
px-5
py-3
hover:bg-gray-100
text-sm
"

>


 {item.locality} {item.city}


</button>


))

}


</div>

)

}



</div>
      </div>

      {/* Buy / Rent */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
        <label className="text-sm font-semibold text-gray-800 mb-3 block">
          Listing Type
        </label>

        <div className="grid grid-cols-2 gap-3">
          {["buy", "rent"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setListingType(type)}
              className={`h-12 rounded-2xl text-sm font-semibold border transition-all ${
                listingType === type
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {type === "buy" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Property types */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
        <label className="text-sm font-semibold text-gray-800 mb-3 block">
          Property Type
        </label>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {propertyTabs.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handlePropertyType(item.name)}
                className={`flex flex-col items-center justify-center min-w-[96px] h-24 px-3 rounded-2xl border transition-all ${
                  propertyType === item.name
                    ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <Icon size={22} />
                <span className="mt-2 text-[11px] font-medium text-center leading-tight">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
        <label className="text-sm font-semibold text-gray-800 mb-3 block">
          Budget
        </label>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-12 rounded-2xl border border-gray-200 px-4 text-[15px] outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-12 rounded-2xl border border-gray-200 px-4 text-[15px] outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Seller */}
      <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
        <label className="text-sm font-semibold text-gray-800 mb-3 block">
          Posted By
        </label>

        <div className="grid grid-cols-2 gap-3">
          {["owner", "agent"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSeller(type)}
              className={`h-12 rounded-2xl text-sm font-semibold border transition-all ${
                seller === type
                  ? "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white border-orange-400 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {type === "owner" ? "Owner" : "Agent"}
            </button>
          ))}
        </div>
      </div>

    </div>

    {/* Sticky bottom actions */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 safe-area-pb shadow-[0_-6px_24px_rgba(15,23,42,0.08)]">
      <div className="flex gap-3">
        <button
          onClick={clearFilters}
          className="flex-1 h-12 rounded-2xl border border-gray-300 bg-white text-gray-700 font-semibold active:scale-[0.98] transition"
        >
          Reset
        </button>

        <button
          onClick={applyFilters}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 text-white font-semibold shadow-md active:scale-[0.98] transition"
        >
          Show Results
        </button>
      </div>
    </div>

  </div>
);
}