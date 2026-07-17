"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { API } from "@/src/lib/api";


const AuthContext =
createContext<any>(null);



export function AuthProvider({
children
}:{
children:React.ReactNode
}){


const [user,setUser]=useState(null);

const [loading,setLoading]=useState(true);





const fetchUser = async()=>{


try{


const res =
await fetch(
API.me,
{
credentials:"include"
}
);


const data =
await res.json();



if(res.ok){

setUser(data.user);

}
else{

setUser(null);

}


}
catch(error){

console.log(error);

setUser(null);

}

finally{

setLoading(false);

}


};





useEffect(()=>{

fetchUser();

},[]);





const logout = async()=>{


await fetch(

API.logout,

{

method:"POST",

credentials:"include"

}

);


setUser(null);


};




return (

<AuthContext.Provider

value={{

user,

setUser,

fetchUser,

logout,

loading

}}

>


{children}


</AuthContext.Provider>


);


}





export function useAuth(){

return useContext(AuthContext);

}