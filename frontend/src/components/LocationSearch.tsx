"use client";

import {useState} from "react";


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


const [text, setText] = useState(
  locality && city ? `${locality}, ${city}` : ""
);

const [results,setResults]=useState<any[]>([]);



const search=async(value:string)=>{


setText(value);


if(value.length<2){

setResults([]);

return;

}


const res =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/location/search?keyword=${value}`

);


const data =
await res.json();


setResults(
data.locations || []
);


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
"

/>



{
results.length>0 &&

<div
className="
absolute
bg-white
border
rounded-xl
shadow-xl
w-full
z-50
"
>


{
results.map((item)=>(


<button

key={item._id}

type="button"

onClick={() => {
  if (item.locality) {
    setText(`${item.locality}, ${item.city}`);
  } else {
    setText(item.city);
  }

  setResults([]);

  onSelect({
    city: item.city,
    locality: item.locality,
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

{item.locality}, {item.city}

</button>


))

}


</div>

}



</div>

);


}