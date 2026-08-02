"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage(){

   
const { user, loading } = useAuth();
     const router = useRouter();

      
  useEffect(() => {

    if (!loading && !user) {
      router.replace("/");
    }

  }, [user, loading, router]);


  if (loading) {
    return null; // or your Loader component
  }


  if (!user) {
    return null;
  }


  

       const deleteAccount = async () => {       

  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );


  if (!confirmDelete) return;


  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );


    const data = await res.json();


    if (res.ok) {

      alert(data.message);

      router.push("/");

      window.location.reload();

    } else {

      alert(data.message || "Failed to delete account");

    }


  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

};

return (

<div className="max-w-3xl mx-auto p-6">

<h1 className="text-3xl font-bold">
Settings
</h1>


<div className="mt-6 border rounded-lg p-4">

<h2 className="font-semibold">
Account
</h2>


<p className="text-gray-600 mt-2">
Manage your account settings.
</p>

 <button
        onClick={deleteAccount}
        className="
        w-full
        text-left
        px-4
        py-2
        text-red-600
        hover:bg-red-50
        "
      >
        Delete Account
      </button>


</div>


</div>

);

}