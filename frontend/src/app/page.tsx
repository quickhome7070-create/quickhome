"use client";

import { useEffect, useState } from "react";
import { getAllProperties } from "../services/property";
import {PropertyCard} from "../components/PropertyCard";
import PropertiesPage from "./properties/page";

export default function HomePage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/property`
    );
    const resp = await data.json();
   // setProperties(Array.isArray(resp) ? resp : []);
   setProperties(resp.properties);         
      } catch (error) {
        console.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);


  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading... </div>
    );

  if (!properties.length)
    return (
      <div className="p-10 text-center text-gray-500">
        No properties found
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to the fastest home search destination.</h1>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> */}
        {/* {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))} */}
        <PropertiesPage/>
      {/* </div> */}
    </div>
  );
}
