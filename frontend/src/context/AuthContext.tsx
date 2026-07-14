"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";


const AuthContext = createContext<any>(null);


const API =
process.env.NEXT_PUBLIC_API_URL;



export const AuthProvider = ({
children
}:any)=>{


const router =
useRouter();



const [user,setUser] =
useState<any>(null);



const [loading,setLoading] =
useState(true);





useEffect(()=>{


const loadUser = async()=>{


try{


const res =
await fetch(
`${API}/auth/me`,
{
credentials:"include",
}
);



const data =
await res.json();



console.log(
"AUTH ME RESPONSE:",
data
);



if(res.ok){

setUser(data.user);

}
else{

setUser(null);

}



}
catch(error){

console.log(
"AUTH ERROR:",
error
);

setUser(null);

}


finally{

setLoading(false);

}


};



loadUser();



},[]);






const logout = async()=>{


try{


await fetch(
`${API}/auth/logout`,
{
method:"POST",
credentials:"include",
}
);



setUser(null);


router.push("/login");



}
catch(error){

console.log(error);

}



};





return (

<AuthContext.Provider
value={{

user,

setUser,

loading,

logout

}}
>

{children}

</AuthContext.Provider>

);


};




export const useAuth =
()=>useContext(AuthContext);