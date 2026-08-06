"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import LocationSearch from "@/src/components/LocationSearch";
import ImageCarousel from "@/src/components/ImageCarousel";
import AISearchBox from "@/src/components/AISearchBox";

import {
  Heart,
  MapPin,
} from "lucide-react";

import { useFavorite } from "@/src/context/FavoriteContext";

type PropertyResponse = {
  properties: Property[];
  pages: number;
};


type Property = {
  _id:string;
  title:string;
  price:number;
  location:string;
  city?:string;
  locality?:string;
  images?:string[];
  listingType?: "buy" | "rent";
  seller?: "owner" | "agent";
  propertyType?:string;
  bhkType?:string;
  plotType?:string;
  furnishing?:string;
  shopType?:string;
  area?:number;
  areaUnit?:string;
  bathrooms?:string;
  propertyAge?:string;
  floor?:number;
  totalFloors?:number;
  createdAt?:string;
};


type Props = {
 initialProperties?:Property[];
 totalProperties?:number;
 showFavoriteCount?:boolean;
 showFavoriteIcon?:boolean;

 searchParams?:{
  ai?:string;
  city?:string;
  locality?:string;
  location?:string;
  minPrice?:string;
  maxPrice?:string;
  listingType?:string;
  sort?:string;
  propertyType?:string;
  seller?:string;
  bhkType?:string;
  plotType?:string;
  furnishing?:string;
  shopType?:string;
  area?:string;
  bathrooms?:string;
  propertyAge?:string;
  floor?:string;
  availableFrom?:string;
 };
};



const PROPERTY_TYPES=[
 "Flat",
 "House",
 "Plot",
 "Office Space",
 "Shop"
];


const BHK_TYPES=[
 "1BHK",
 "2BHK",
 "3BHK",
 "4BHK"
];


const SHOP_TYPES=[
 "Hotel",
 "Saloon",
 "Grocery",
 "Medical",
 "Clothing",
 "Mobile Shop"
];



export default function PropertiesClient({
  

initialProperties=[],
totalProperties=0,
searchParams={},
showFavoriteIcon=true

}:Props){


const router=useRouter();



const pageRef=useRef(1);

const loadingRef=useRef(false);

const loaderRef =
useRef<HTMLDivElement|null>(null);



const [properties,setProperties] =
useState<Property[]>([]);



const [hasMore,setHasMore]=
useState(true);



const [loadingMore,setLoadingMore]=
useState(false);



const [propertyType,setPropertyType]=
useState(
 searchParams.propertyType || "Flat"
);



const [bhkType,setBhkType]=
useState(
 searchParams.bhkType || ""
);


const [plotType,setPlotType]=
useState("");


const [furnishing,setFurnishing]=
useState("");


const [shopType,setShopType]=
useState("");


const [city,setCity]=
useState(
 searchParams.city || ""
);


const [locality,setLocality]=
useState(
 searchParams.locality || ""
);



const [minPrice,setMinPrice]=
useState("");


const [maxPrice,setMaxPrice]=
useState("");


const [listingType,setListingType]=
useState("");


const [seller,setSeller]=
useState("");


const [sort,setSort]=
useState("");



const [area,setArea]=
useState("");

const [bathrooms,setBathrooms]=
useState("");

const [propertyAge,setPropertyAge]=
useState("");

const [floor,setFloor]=
useState("");

const [availableFrom,setAvailableFrom]=
useState("");



useEffect(()=>{





setProperties(
 initialProperties || []
);



if(searchParams?.ai){

 setHasMore(false);

}
else{

 setHasMore(true);

}


pageRef.current=1;


},[
initialProperties,
searchParams?.ai
]);
/*
 AI SEARCH RESULT HANDLER
*/


/*
 NORMAL FILTER SYNC
*/

useEffect(()=>{


setCity(
 searchParams.city || ""
);


setLocality(
 searchParams.locality || ""
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



},[
searchParams
]);





useEffect(() => {


setProperties(initialProperties);


if(searchParams?.ai){

 setHasMore(false);

}
else{

 setHasMore(true);

}


pageRef.current=1;


},[
initialProperties,
searchParams?.ai
]);

const {

isFavorite,
toggleFavorite

}=useFavorite();





const handlePropertyTypeChange=
(value:string)=>{


setPropertyType(value);


setBhkType("");

setPlotType("");

setFurnishing("");

setShopType("");

};








const handleSearch=()=>{


const query =
new URLSearchParams();



if(propertyType)
query.append(
"propertyType",
propertyType
);


if(bhkType)
query.append(
"bhkType",
bhkType
);



if(plotType)
query.append(
"plotType",
plotType
);



if(furnishing)
query.append(
"furnishing",
furnishing
);



if(shopType)
query.append(
"shopType",
shopType
);



if(city)
query.append(
"city",
city
);



if(locality)
query.append(
"locality",
locality
);



if(minPrice)
query.append(
"minPrice",
minPrice
);



if(maxPrice)
query.append(
"maxPrice",
maxPrice
);



if(listingType)
query.append(
"listingType",
listingType
);



if(seller)
query.append(
"seller",
seller
);






router.push(
`/properties?${query.toString()}`
);


};








/*
 INFINITE SCROLL
*/

const loadMoreProperties=
async()=>{
if(searchParams.ai){
  return;
}
if(
loadingRef.current ||
!hasMore
)
return;



loadingRef.current=true;


try{


setLoadingMore(true);



const query =
new URLSearchParams();



Object.entries(searchParams)
.forEach(([key,value])=>{


if(value){

query.append(
key,
String(value)
);

}


});



const nextPage =
pageRef.current+1;



query.set(
"page",
String(nextPage)
);



query.set(
"limit",
"6"
);



const res =
await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/property?${query.toString()}`,
{
cache:"no-store"
}
);



const data:
PropertyResponse =
await res.json();



if(
data.properties.length===0
){

setHasMore(false);

return;

}



setProperties(prev=>[

...prev,

...data.properties.filter(
item =>
!prev.some(
p=>p._id===item._id
)
)

]);



pageRef.current=
nextPage;



if(
nextPage>=data.pages
){

setHasMore(false);

}



}

catch(error){




}

finally{


loadingRef.current=false;

setLoadingMore(false);


}


};





useEffect(()=>{




const element =
loaderRef.current;



if(!element)
return;



const observer =
new IntersectionObserver(
(entries)=>{


if(
entries[0].isIntersecting
){

loadMoreProperties();

}


},
{
threshold:1
}
);



observer.observe(element);



return()=>{

observer.disconnect();

};


},[
hasMore,

]);







const getPostedDate=
(date?:string)=>{


if(!date)
return "";



const createdDate =
new Date(date);



return `Posted on ${
createdDate.toLocaleDateString(
"en-IN",
{
day:"numeric",
month:"short",
year:"numeric"
}
)
}`;

};


  return (
    <div>

      <AISearchBox/>

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
            Manual Search...
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
    <LocationSearch
  city={city}
  locality={locality}
  onSelect={({ city, locality }) => {
    setCity(city);
    setLocality(locality);
  }}
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

<div className="flex justify-end items-center flex-wrap gap-1 mb-5">
  <span className="text-lg font-bold text-gray-800">
    {properties.length}
  </span>
  <span className="text-sm text-gray-500">
    Properties Found
  </span>
</div>

      {/* PROPERTY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* properties{properties.length} */}
        { properties.map((property) => (
      

          <Link
            key={property._id}
            href={`/properties/${property._id}`}
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">
<div className="relative">

  <ImageCarousel
   images={property.images}
   title={property.title}
 />


  {/* Favorite Button */}
 {showFavoriteIcon && (
  <Heart
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(property._id);
    }}
    size={28}
    strokeWidth={2}
    className={`
      absolute
      top-4
      right-4
      z-10
      cursor-pointer
      transition-all
      duration-200

      ${
        isFavorite(property._id)
          ? "fill-red-500 text-red-500"
          : "text-red-500"
      }
    `}
  />
)}

</div>
             <div className="p-5">

  {/* Property Header */}

<div className="flex justify-between items-start">

  <div>

    <h2 className="text-xl font-bold text-gray-900">
      {property.propertyType}
      {property.bhkType && (
        <span className="text-gray-500 font-medium">
          {" "}• {property.bhkType}
        </span>
      )}
    </h2>


    <p className="text-sm text-gray-500 mt-1">
      {property.furnishing && property.furnishing}
      
      {property.propertyAge && (
        <>
          {" "} • {" "}
          {property.propertyAge}
        </>
      )}
    </p>


  </div>


  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      property.listingType === "rent"
      ? "bg-gray-100 text-gray-700"
      : "bg-gray-100 text-gray-700"
    }`}
  >
    {property.listingType === "rent"
      ? "RENT"
      : "SALE"}
  </span>


</div>


{/* Price Secondary */}

<div className="mt-3">

  <p className="text-md font-semibold text-gray-900">
    ₹ {Number(property.price).toLocaleString("en-IN")}
  </p>

</div>

  {/* Title */}
  {/* <h3 className="mt-4 text-lg font-semibold text-gray-900 line-clamp-1">
    {property.title}
  </h3> */}

  {/* Property Type */}
  <div className="mt-1 flex items-center gap-2">

    <span className="text-sm font-medium text-600">
      {property.propertyType}
    </span>

    {property.furnishing && (
      <>
        <span className="text-gray-300">•</span>

        <span className="text-sm text-gray-500">
          {property.furnishing}
        </span>
      </>
    )}

  </div>

  {/* Location */}
  <div className="flex items-center gap-2 mt-4">

    <MapPin size={16} className="text-gray-400"/>

    <p className="text-sm text-gray-600">
      {property.locality}, {property.city}
    </p>

  </div>

  {/* Features */}
  <div className="grid grid-cols-2 gap-3 mt-5">

    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">
        Area
      </p>

      <p className="font-semibold">
        {property.area} {property.areaUnit}
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">
        Bathrooms
      </p>

      <p className="font-semibold">
        {property.bathrooms}{" "}
  {Number(property.bathrooms) === 1 ? "Bathroom" : "Bathrooms"}
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">
        Floor
      </p>

      <p className="font-semibold">
        {property.floor}/{property.totalFloors} 
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">
        Age
      </p>

      <p className="font-semibold">
        {property.propertyAge}
      </p>
    </div>

  </div>

  {/* Footer */}
  <div className="flex justify-between items-center mt-5 pt-4 border-t">

    <span className="text-sm font-medium text-gray-700 capitalize">
      {property.seller}
    </span>

    <span className="text-xs text-gray-500">
      {getPostedDate(property.createdAt)}
    </span>

  </div>

</div>

            </div>

          </Link>

        ))}

      </div>

      <div
ref={loaderRef}
className="py-10 text-center"
>

{
loadingMore &&
(
<p>
Loading more properties...
</p>
)
}


{
!hasMore &&
(
<p>
No more properties
</p>
)
}

</div>

    </div>
  );
}