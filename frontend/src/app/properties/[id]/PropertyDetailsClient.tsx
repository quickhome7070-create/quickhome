// app/properties/[id]/PropertyDetailsClient.tsx

"use client";

import {

  ShieldCheck,
  Dumbbell,
  Trees,
  Waves,
  Car,
  Zap,
  Camera,
  Baby,
  Wifi,
  CircleParking,
  Store,
} from "lucide-react";
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
  Heart
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
import { useFavorite } from "@/src/context/FavoriteContext";
import ImageCarousel from "@/src/components/ImageCarousel";

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

  amenities?:[];
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

  

  const [contact, setContact] =
    useState<Contact | null>(null);
    
const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingContact, setLoadingContact] =
    useState(false);
      const whatsappUrl = contact?.phone
    ? `https://wa.me/91${contact.phone.replace(/\D/g, "").replace(/^91/, "")}?text=${encodeURIComponent(
        `Hi ${contact.name}, I'm interested in your property on GharDestiny. Is it still available?`
      )}`
    : "";

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

const {
 isFavorite,
 toggleFavorite
}=useFavorite();
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

const handleChat = async () => {

  // Already have contact
  if (contact?.phone) {
    window.location.href = whatsappUrl;
    return;
  }

  // Need to get contact first
  await handleViewContact();

};



    

return (
<div className="min-h-screen bg-white pb-24">


{/* IMAGE */}

<div className="relative w-full h-[280px] md:h-[450px]">
  <ImageCarousel
    images={property.images}
    title={property.title}
  />

  {/* Favorite */}
  <Heart
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(id);
    }}
    size={28}
    className={`
      absolute
      top-4
      right-4
      z-10
      cursor-pointer
      drop-shadow-md
      transition-all
      duration-200
      ${
        isFavorite(id)
          ? "fill-red-500 text-red-500"
          : "text-red-500"
      }
    `}
  />

  {/* Back Button */}
  <button
    onClick={() => router.back()}
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
      z-10
    "
  >
    ←
  </button>


  {/* Image Count */}
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
      <Home
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        strokeWidth={1.8}
      />
      <span className="ml-3 text-gray-700 truncate">
        {property.propertyType}
      </span>
    </div>


    {/* BHK - only Flat / House / Villa */}
    {["Flat", "House", "Villa"].includes(
      property.propertyType ?? ""
    ) && property.bhkType && (
      <div className="flex items-center">
        <Building2
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          strokeWidth={1.8}
        />
        <span className="ml-3 text-gray-700">
          {property.bhkType}
        </span>
      </div>
    )}


    <div className="flex items-center">
      <IndianRupee
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        strokeWidth={1.8}
      />
      <span className="ml-3 text-gray-700">
        ₹ {Number(property.price).toLocaleString("en-IN")}
      </span>
    </div>


    <div className="flex items-center">
      <KeyRound
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        strokeWidth={1.8}
      />
      <span className="ml-3 text-gray-700 capitalize">
        {property.listingType}
      </span>
    </div>


    <div className="flex items-center">
      <MapPin
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        strokeWidth={1.8}
      />
      <span className="ml-3 text-gray-700 truncate">
        {property.locality}, {property.city}
      </span>
    </div>


    <div className="flex items-center">
      <User
        className="w-4 h-4 text-gray-400 flex-shrink-0"
        strokeWidth={1.8}
      />
      <span className="ml-3 text-gray-700 capitalize">
        {property.seller}
      </span>
    </div>

  </div>

</div>


<div className="border-t border-gray-100 mx-4"></div>


<div className="px-4 py-4">

  <div className="grid grid-cols-4 gap-x-8 gap-y-4">

    {/* AREA */}

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Ruler
          size={18}
          className="text-gray-400"
          strokeWidth={1.8}
        />
      </div>

      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.area} {property.areaUnit}
      </p>
    </div>


    {/* BATHROOMS */}

    {["Flat", "House", "Villa", "Office Space", "Shop"].includes(
      property.propertyType ?? ""
    ) && Number(property.bathrooms) > 0 && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <Bath
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          {property.bathrooms}{" "}
          {Number(property.bathrooms) === 1
            ? "Bathroom"
            : "Bathrooms"}
        </p>
      </div>

    )}


    {/* FLOOR */}

    {["Flat", "Office Space", "Shop"].includes(
      property.propertyType ?? ""
    ) && Number(property.floor) > 0 && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <Building2
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          Floor {property.floor}
          {/* /{property.totalFloors}  */}
        </p>
      </div>

    )}


    {/* PROPERTY AGE */}

    {property.propertyAge && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <CalendarDays
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          {property.propertyAge}
        </p>
      </div>

    )}


    {/* FURNISHING */}

    {["Flat", "House", "Villa", "Office Space", "Shop"].includes(
      property.propertyType ?? ""
    ) && property.furnishing && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <Sofa
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          {property.furnishing}
        </p>
      </div>

    )}


    {/* PLOT TYPE */}

    {property.propertyType === "Plot" &&
      property.plotType && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <Trees
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          {property.plotType}
        </p>
      </div>

    )}


    {/* SHOP TYPE */}

    {property.propertyType === "Shop" &&
      property.shopType && (

      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
          <Store
            size={18}
            className="text-gray-400"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-2 text-xs text-gray-700 text-center">
          {property.shopType}
        </p>
      </div>

    )}


    {/* LISTING TYPE */}

    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-transparent">
        <Home
          size={18}
          className="text-gray-400"
          strokeWidth={1.8}
        />
      </div>

      <p className="mt-2 text-xs text-gray-700 text-center">
        {property.listingType === "rent"
          ? "Rent"
          : "Sale"}
      </p>
    </div>

  </div>

</div>


{/* Amenities Section */}

{property.amenities && property.amenities.length > 0 && (

  <div className="mt-6 border-t border-gray-100 pt-5 ">

    <p className="text-sm text-gray-800 mb-2">
      Amenities
    </p>


    <div className="grid grid-cols-4 gap-x-6 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

      {property.amenities.map(
        (amenity: string, index: number) => {

          let Icon = Home;

          switch (amenity) {

            case "Security":
              Icon = ShieldCheck;
              break;

            case "Lift":
              Icon = Building2;
              break;

            case "Children Play Area":
              Icon = Baby;
              break;

            case "Gym":
              Icon = Dumbbell;
              break;

            case "Garden":
              Icon = Trees;
              break;

            case "Swimming Pool":
              Icon = Waves;
              break;

            case "Parking":
              Icon = CircleParking;
              break;

            case "Power Backup":
              Icon = Zap;
              break;

            case "CCTV":
              Icon = Camera;
              break;

            case "WiFi":
              Icon = Wifi;
              break;

            case "Club House":
              Icon = Home;
              break;

            default:
              Icon = Home;
          }


          return (

            <div
              key={`${amenity}-${index}`}
              className="flex flex-col items-center"
            >

              {/* Transparent Icon */}

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-transparent">

                <Icon
                  size={18}
                  className="text-gray-400"
                  strokeWidth={1.8}
                />

              </div>


              {/* Amenity Name */}

              <p className="mt-2 text-center text-xs text-gray-700">
                {amenity}
              </p>

            </div>

          );

        }
      )}

    </div>

  </div>

)}


<div className="border-t border-gray-100 mt-6"></div>


{/* DESCRIPTION */}

<div className=" mt-4">

  <p className="text-sm text-gray-800 mb-2">
    Property Description
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

    <div className=" mt-4">

      <p className="
        text-sm
        text-gray-800
        mb-4
      ">
        Similar Properties
      </p>


      <div className="grid grid-cols-2 gap-4">

        {
          similar.map((item) => (

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


                  {/* <button
                    onClick={toggleFavorite}
                    className="
                      absolute
                      top-4
                      right-4
                      w-10
                      h-10
                      rounded-full
                      bg-white
                      shadow-md
                      flex
                      items-center
                      justify-center
                      z-10
                    "
                  >

                    <Heart
                      size={22}
                      className={
                        isFavorite
                          ? "fill-[#ffb224] text-[#ffb224]"
                          : "text-gray-500"
                      }
                    />

                  </button> */}

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
    bottom-0
    left-0
    right-0
    bg-white
    border-t
    border-gray-200
    px-4
    py-3
    z-40
    shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
  "
>

  <div className="flex gap-2 max-w-md mx-auto">

    <button
      onClick={handleViewContact}
      disabled={loadingContact}
      className="
        flex-1
        h-11
        rounded-full
        bg-[#ffb224]
        text-gray-900
        text-sm
        font-medium
      "
    >
      Contact
    </button>


    <button
      onClick={handleChat}
      className="
        flex-1
        h-11
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
          onClick={() => {
            if (user?.subscription?.status === "premium") {
              window.open(whatsappUrl, "_blank");
            } else {
              router.push("/plans");
            }
          }}
          className="
            flex-1
            h-11
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

  </>

)}

</div>
);
}