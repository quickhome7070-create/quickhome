"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import PropertiesClient from "../properties/PropertiesClient";

export default function FavoritesPage() {

  const router = useRouter();

  const { user, loading } = useAuth();

  const [properties, setProperties] = useState([]);


  // 🔒 Protect page
  useEffect(() => {

    if (!loading && !user) {
      router.push("/login");
    }

  }, [user, loading, router]);



  // Fetch favorites only after login
  useEffect(() => {

    if (!user) return;


    const fetchFavorites = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`,
          {
            credentials: "include",
          }
        );


        if (res.ok) {

          const data = await res.json();

          setProperties(data);

        }


      } catch(error) {

        console.log(error);

      }

    };


    fetchFavorites();


  }, [user]);



  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        My Favorites
      </h1>


      {/* <div className="grid md:grid-cols-3 gap-5">

        {properties.map((property:any)=>(

          <div key={property._id}>
            {property.propertyType}
          </div>

        ))}

      </div> */}

  <PropertiesClient
  initialProperties={properties}
/>

    </div>
  );

}