"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PropertyForm from "@/src/components/PropertyForm";
import Loader from "@/src/components/Loader";


export default function EditPropertyPage() {

  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);


  useEffect(() => {

    const loadProperty = async () => {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/property/${id}`,
        {
          credentials: "include",
        }
      );


      const data = await res.json();

      setProperty(data);

    };


    if(id){
      loadProperty();
    }


  }, [id]);



  if(!property){
    return <Loader />;
  }



  return (

    <PropertyForm
      mode="edit"
      property={property}
    />

  );

}