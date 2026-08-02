"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const FavoriteContext = createContext<any>(null);


export function FavoriteProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [favorites, setFavorites] = useState<string[]>([]);


  const loadFavorites = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/favorites`,
        {
          credentials: "include",
        }
      );


      if(res.ok){

        const data = await res.json();

        setFavorites(
          data.map(
            (item:any)=>item._id
          )
        );

      }

    } catch(error){

      console.log(error);

    }

  };


  useEffect(()=>{

    loadFavorites();

  },[]);



  const toggleFavorite = async (
    propertyId:string
  )=>{

    try{

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/favorite/${propertyId}`,
        {
          method:"POST",
          credentials:"include",
        }
      );


      if(res.ok){

        setFavorites(prev =>
          prev.includes(propertyId)
          ? prev.filter(id=>id!==propertyId)
          : [...prev,propertyId]
        );

      }


    }catch(error){

      console.log(error);

    }

  };


  const isFavorite = (
    propertyId:string
  ) =>
    favorites.includes(propertyId);



  return (

    <FavoriteContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >

      {children}

    </FavoriteContext.Provider>

  );

}


export function useFavorite(){

  return useContext(
    FavoriteContext
  );

}