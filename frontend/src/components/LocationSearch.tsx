"use client";

import { useEffect, useState } from "react";


type Props = {
  city:string;
  locality:string;
  onSelect:(data:{
    city:string;
    locality:string;
  })=>void;
};


export default function LocationSearch({
 city,
 locality,
 onSelect
}:Props){


const [text,setText]=useState("");

const [results,setResults]=useState<any[]>([]);



/*
 Sync value when edit page loads
*/
useEffect(()=>{

if(locality && city){

setText(`${locality}, ${city}`);

}
else if(locality){

setText(locality);

}
else{

setText("");

}

},[locality,city]);





const search=async(value:string)=>{


setText(value);



if(value.length < 2){

setResults([]);

return;

}



try{


const res = await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/location/search?keyword=${value}`

);



const data = await res.json();



setResults(
data.locations || []
);



}catch(error){

console.log(error);

}


};






return (

<div className="relative">


<input

value={text}

onChange={(e)=>
search(e.target.value)
}

placeholder="Search locality"

className="
w-full
h-12
border
rounded-xl
px-4
outline-none
focus:ring-2
focus:ring-orange-400
"

/>



{
results.length > 0 && (

<div

className="
absolute
bg-white
border
rounded-xl
shadow-xl
w-full
z-50
overflow-hidden
"

>


{
results.map((item:any)=>(


<button

key={item._id}

type="button"


onClick={()=>{


const display =
item.locality
?
`${item.locality}, ${item.city}`
:
item.city;



setText(display);


setResults([]);



onSelect({

city:item.city,

locality:item.locality || ""

});


}}


className="
block
w-full
text-left
px-4
py-3
hover:bg-gray-100
"

>


{
item.locality
?
`${item.locality}, ${item.city}`
:
item.city
}


</button>


))

}



</div>

)

}



</div>

);


}