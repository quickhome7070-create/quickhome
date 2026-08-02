// app/properties/[id]/PropertyDetailsClient.tsx

"use client";


import {
  MapPin,
  BedDouble,
  IndianRupee,
  KeyRound,
  Bath,
  Ruler,
  Building2,
  Sofa,
  Layers,
  User,
  CalendarDays,
  Home,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/src/context/AuthContext";

type Property = {
  _id: string;

  title: string;
  price: number;

  location: string;
  city?: string;
  locality?: string;

  description: string;

  images: string[];

  listingType?: "buy" | "rent";

  seller?: "owner" | "agent";

  propertyType?: string;

  bhkType?: string;

  plotType?: string;

  furnishing?: string;

  shopType?: string;

  area?: number;

  areaUnit?: string;

  bathrooms?: string;

  propertyAge?: string;

  floor?: number;

  totalFloors?: number;

  createdAt?: string;
};
type Contact = {
  name: string;
  phone: string;
  email: string;
  premium?: boolean;
   contactsRemaining?: number;
};

type Props = {
  property: Property;
  similar: Property[];
};

export default function PropertyDetailsClient({
  property,
  similar,
}: Props) {

  const { id } =
    useParams();

  const router =
    useRouter();

  const { user } =
    useAuth();

  const sliderRef =
    useRef<HTMLDivElement>(null);
    const [showContactSheet, setShowContactSheet] = useState(false);

    const [showFullDescription, setShowFullDescription] = useState(false);

const [showGallery, setShowGallery] =
  useState(false);

  const [activeImage, setActiveImage] =
    useState(0);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [contact, setContact] =
    useState<Contact | null>(null);

  const [loadingContact, setLoadingContact] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const slider =
      sliderRef.current;

    if (!slider) return;

    const handleScroll =
      () => {

        const index =
          Math.round(
            slider.scrollLeft /
            slider.clientWidth
          );

        setActiveImage(index);
      };

    slider.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      slider.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  const handleViewContact = async () => {
    
  if (!user) {
    router.push("/login");
    return;
  }

  setLoadingContact(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property/contact/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("CONTACT API:", data);

    // Free contacts exhausted
    if (response.status === 403) {
      router.push("/plans");
      return;
    }

    // Unauthorized
    if (response.status === 401) {
      router.push("/login");
      return;
    }

    // Other errors
    if (!response.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

setContact(data);
setShowContactSheet(true);
  } catch (error) {
    console.error(error);
    setError("Something went wrong");
  } finally {
    setLoadingContact(false);
  }
};

  const toggleFavorite =
    async () => {

      try {

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/favorite/${id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        setIsFavorite(
          (prev) => !prev
        );

      } catch (error) {

        console.log(error);
      }
    };

return (
<div className="min-h-screen bg-white pb-24">


{/* IMAGE */}

<div className="relative w-full h-[280px] md:h-[450px]">

<Image
src={
property.images?.[0]?.replace(
"/upload/",
"/upload/f_auto,q_auto,w_1400/"
)
|| "/no-image.png"
}
alt={property.title}
fill
priority
className="object-cover"
/>


<button
onClick={()=>router.back()}
className="
absolute
top-4
left-4
w-9
h-9
rounded-full
bg-white/90
text-gray-700
shadow
"
>
←
</button>


<div
className="
absolute
bottom-4
right-4
bg-black/60
text-white
text-xs
px-3
py-1
rounded-full
"
>
1 / {property.images.length}
</div>


</div>





<div className="px-4 py-4">

  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">

    <div className="flex items-center">
      <Home className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700 truncate">
        {property.propertyType}
      </span>
    </div>

    <div className="flex items-center">
      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700">
        {property.bhkType}
      </span>
    </div>

    <div className="flex items-center">
      <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700">
        ₹ {Number(property.price).toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex items-center">
      <KeyRound className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700 capitalize">
        {property.listingType}
      </span>
    </div>

    <div className="flex items-center">
      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700 truncate">
        {property.locality}, {property.city}
      </span>
    </div>

    <div className="flex items-center">
      <User className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <span className="ml-3 text-gray-700 capitalize">
        {property.seller}
      </span>
    </div>

  </div>

</div>

<div className="border-t border-gray-100 mx-4"></div>

<div className="px-4 py-4">

  <div className="grid grid-cols-3 gap-y-6">

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Ruler size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.area} {property.areaUnit}
      </p>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Bath size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.bathrooms}
      </p>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Building2 size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.floor}/{property.totalFloors}
      </p>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <CalendarDays size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.propertyAge}
      </p>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Sofa size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.furnishing}
      </p>
    </div>

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Home size={18} className="text-gray-400" strokeWidth={1.8} />
      </div>
      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.listingType === "rent" ? "Rent" : "Sale"}
      </p>
    </div>

  </div>

</div>

<div className="border-t border-gray-100 mx-4"></div>

{/* DESCRIPTION */}

<div className="px-4 mt-4">

  <p className="text-sm text-gray-800 mb-2">
    About Property
  </p>


  <p
    className={`
      text-sm
      text-gray-600
      leading-6
      ${
        showFullDescription
          ? ""
          : "line-clamp-3"
      }
    `}
  >
    {property.description}
  </p>


  {property.description.length > 150 && (

    <button
      onClick={() =>
        setShowFullDescription(
          !showFullDescription
        )
      }
      className="
        mt-2
        text-xs
        text-[#c08a00]
        font-medium
      "
    >
      {
        showFullDescription
          ? "Show less"
          : "Read more..."
      }
    </button>

  )}

</div>






{/* SIMILAR PROPERTIES */}

{
similar.length > 0 && (

<div className="px-4 mt-8">

<p className="
text-sm
text-gray-800
mb-4
">
Similar Properties
</p>


<div className="grid grid-cols-2 gap-4">

{
similar.map((item)=>(

<Link
key={item._id}
href={`/properties/${item._id}`}
>

<div>


<div className="
relative
h-36
rounded-xl
overflow-hidden
">

<Image
src={
item.images?.[0] ||
"/no-image.png"
}
alt=""
fill
className="object-cover"
/>

</div>


<div className="mt-2">

<p className="
text-xs
text-gray-800
line-clamp-1
">
{item.propertyType}
{" • "}
{item.bhkType}
</p>


<p className="
text-xs
text-gray-600
mt-1
">
₹ {Number(item.price).toLocaleString("en-IN")}
</p>


<p className="
text-xs
text-gray-500
mt-1
">
📍 {item.location}
</p>


</div>


</div>


</Link>

))
}

</div>

</div>

)
}


{/* STICKY BUTTONS */}

<div
  className="
    fixed
    bottom-3
    left-4
    right-4
    bg-white
    border
    border-gray-200
    rounded-full
    px-3
    py-2
    shadow-md
    z-40
  "
>

  <div className="flex gap-2">

    <button
      onClick={handleViewContact}
      disabled={loadingContact}
      className="
        flex-1
        h-10
        rounded-full
        bg-[#ffb224]
        text-gray-900
        text-sm
        font-medium
      "
    >
      {loadingContact ? "Loading..." : "View Contact"}
    </button>

    <button
      className="
        flex-1
        h-10
        rounded-full
        border
        border-[#ffb224]
        text-sm
        text-gray-800
      "
    >
      Chat
    </button>

  </div>

</div>

{showContactSheet && contact && (

  <>
    {/* BACKDROP */}

    <div
      onClick={() => setShowContactSheet(false)}
      className="
        fixed
        inset-0
        bg-black/40
        z-50
      "
    />

    {/* SHEET */}

    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        rounded-t-3xl
        px-6
        pt-5
        pb-8
        z-50
        animate-in
        slide-in-from-bottom
      "
    >

      {/* HANDLE */}

      <div className="flex justify-center mb-5">

        <div className="w-10 h-1 rounded-full bg-gray-300" />

      </div>

      <p className="text-base text-gray-900 text-center mb-6">
        Owner Details
      </p>

      <div className="space-y-5">

        <div>

          <p className="text-xs text-gray-400">
            Name
          </p>

          <p className="text-sm text-gray-800 mt-1">
            {contact.name}
          </p>

        </div>

        <div>

          <p className="text-xs text-gray-400">
            Phone
          </p>

          <a
            href={`tel:${contact.phone}`}
            className="text-sm text-gray-800 mt-1 block"
          >
            {contact.phone}
          </a>

        </div>

        <div>

          <p className="text-xs text-gray-400">
            Email
          </p>

          <a
            href={`mailto:${contact.email}`}
            className="text-sm text-gray-800 mt-1 break-all block"
          >
            {contact.email}
          </a>

        </div>

      </div>

      <div className="flex items-center justify-center my-10">

  <span
    className="
      text-xs
      text-[#c08a00]
      border
      border-[#f3d27a]
      rounded-full
      px-3
      py-1
    "
  >
    {contact.contactsRemaining} contacts remaining
  </span>

</div>

      <div className="flex gap-3 mt-7">

        <a
          href={`tel:${contact.phone}`}
          className="
            flex-1
            h-11
            rounded-full
            bg-[#ffb224]
            text-gray-900
            flex
            items-center
            justify-center
            text-sm
            font-medium
          "
        >
          Call
        </a>

        <button
          className="
            flex-1
            h-11
            rounded-full
            border
            border-[#ffb224]
            text-sm
          "
        >
          Chat
        </button>

      </div>

    </div>

  </>

)}

</div>
);
}