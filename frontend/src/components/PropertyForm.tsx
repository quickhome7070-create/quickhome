"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import LocationSearch from "./LocationSearch";


const PROPERTY_TYPES = [
  "Flat",
  "House",
  "Villa",
  "Plot",
  "Shop",
  "Office Space",
  "Warehouse",
];


const BHK_TYPES = [
  "1 RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
];


const SHOP_TYPES = [
  "Retail Shop",
  "Showroom",
  "Commercial Space",
];


const AMENITIES = [
  "Parking",
  "Lift",
  "Security",
  "Power Backup",
  "Garden",
  "Gym",
  "Swimming Pool",
  "Club House",
  "Children Play Area",
];


type Props = {
  mode?: "add" | "edit";
  property?: any;
};


export default function AddProperty({
  mode = "add",
  property,
}: Props) {


const [loading,setLoading] = useState(false);


const [form,setForm] = useState({

title:
property?.title || "",


price:
property?.price || "",


city:
property?.city || "",


locality:
property?.locality || "",


location:
property?.location || "",


seller:
property?.seller || "",


propertyType:
property?.propertyType || "",


bhkType:
property?.bhkType || "",


plotType:
property?.plotType || "",


shopType:
property?.shopType || "",


listingType:
property?.listingType || "buy",


area:
property?.area || "",


areaUnit:
property?.areaUnit || "sqft",


bathrooms:
property?.bathrooms || "",


furnishing:
property?.furnishing || "",


propertyAge:
property?.propertyAge || "",


floor:
property?.floor || "",


totalFloors:
property?.totalFloors || "",


amenities:
property?.amenities || [],


availableFrom:
property?.availableFrom || "",


description:
property?.description || "",


images:
property?.images || [],


});

useEffect(() => {

  if(mode === "edit" && property){

    setForm({

      ...form,

      title: property.title || "",
      price: property.price || "",

      city: property.city || "",
      locality: property.locality || "",
      location: property.location || "",

      description: property.description || "",

      listingType: property.listingType || "buy",

      propertyType: property.propertyType || "",

      seller: property.seller || "",

      bhkType: property.bhkType || "",
      plotType: property.plotType || "",

      furnishing: property.furnishing || "",
      shopType: property.shopType || "",


      // new fields
      area: property.area || "",
      areaUnit: property.areaUnit || "sqft",

      bathrooms: property.bathrooms || "",

      propertyAge: property.propertyAge || "",

      floor: property.floor || "",
      totalFloors: property.totalFloors || "",

      amenities: property.amenities || [],

      availableFrom: property.availableFrom || "",

    });

  }

},[mode, property]);

const [errors,setErrors] = useState<any>({});


const [newImages,setNewImages] = useState<File[]>([]);



// input change

const handleChange = (
e:React.ChangeEvent<
HTMLInputElement |
HTMLSelectElement |
HTMLTextAreaElement
>
)=>{


setForm(prev=>({

...prev,

[e.target.name]:
e.target.value

}));



};



// property type select

const handlePropertyType = (
type:string
)=>{


setForm(prev=>({

...prev,

propertyType:type,

bhkType:"",

plotType:"",

shopType:""

}));


};



// amenities

const toggleAmenity = (
item:string
)=>{


setForm(prev=>({

...prev,


amenities:
prev.amenities.includes(item)

?
prev.amenities.filter(
(a:string)=>a!==item
)

:
[
...prev.amenities,
item
]


}));


};

const [generating,setGenerating] = useState(false);



const generateDescription = async()=>{

try{

if(!form.propertyType || !form.city || !form.locality){
alert("Please fill property type and location first");
return;
}


setGenerating(true);


const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/ai/property-description`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

propertyType: form.propertyType,
bhkType: form.bhkType,
city: form.city,
locality: form.locality,
area: form.area,
areaUnit: form.areaUnit,
furnishing: form.furnishing,
propertyAge: form.propertyAge,
amenities: form.amenities,
listingType: form.listingType

})
}
);


const data = await res.json();


if(!res.ok){
throw new Error(
data.message || "AI generation failed"
);
}


setForm(prev=>({

...prev,

description:data.description

}));


}
catch(error:any){

console.log(error);

alert(error.message);

}
finally{

setGenerating(false);

}

};

// image select

const handleImages = (
files:FileList | null
)=>{


if(!files)
return;


const selected =
Array.from(files);


setNewImages(selected);


};
const handleSubmit = async (
e: React.FormEvent
) => {

e.preventDefault();


try {

setLoading(true);



const formData = new FormData();


// basic fields

formData.append(
"title",
form.title
);


formData.append(
"price",
form.price
);


formData.append(
"city",
form.city
);


formData.append(
"locality",
form.locality
);


formData.append(
"location",
form.location
);


formData.append(
"seller",
form.seller
);


formData.append(
"propertyType",
form.propertyType
);


formData.append(
"listingType",
form.listingType
);



formData.append(
"description",
form.description
);



// conditional fields

formData.append(
"bhkType",
form.bhkType
);


formData.append(
"plotType",
form.plotType
);


formData.append(
"shopType",
form.shopType
);



// new fields

formData.append(
"area",
form.area
);


formData.append(
"areaUnit",
form.areaUnit
);


formData.append(
"bathrooms",
form.bathrooms
);


formData.append(
"furnishing",
form.furnishing
);


formData.append(
"propertyAge",
form.propertyAge
);


formData.append(
"availableFrom",
form.availableFrom
);


formData.append(
"floor",
form.floor
);


formData.append(
"totalFloors",
form.totalFloors
);



// arrays

formData.append(
"amenities",
JSON.stringify(
form.amenities
)
);



// images

newImages.forEach(
(file)=>{

formData.append(
"images",
file
);

});




// API

const API =
process.env.NEXT_PUBLIC_API_URL;



const url =
mode==="edit"

?

`${API}/property/${property._id}`

:

`${API}/property`;



const method =
mode==="edit"
?
"PUT"
:
"POST";



console.log("Property ID:", property?._id);
console.log("Request URL:", url);
const res =
await fetch(
url,
{

method,

credentials:"include",

body:formData

}

);



const data =
await res.json();


if(!res.ok){

throw new Error(
data.message ||
"Something went wrong"
);

}



alert(
mode==="edit"
?
"Edit request sent for approval"
:
"Property created successfully"
);



window.location.href="/properties";



}
catch(error:any){

console.log(error);

alert(
error.message
);


}
finally{

setLoading(false);

}


};

const selectedDate: Date | null =
  form.availableFrom ? new Date(form.availableFrom) : null;

return (

<div className="min-h-screen bg-gray-100 flex justify-center p-4">


{/* <form

onSubmit={handleSubmit}

className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 space-y-5"

>


<h1 className="text-2xl font-bold">

{
mode==="edit"
?
"Edit Property"
:
"Add Property"
}

</h1> */}



    <form
onSubmit={handleSubmit}
className="
w-full
max-w-2xl
bg-white
rounded-3xl
shadow-lg
p-6
space-y-5
"
>

<h1 className="text-2xl font-bold">
{
mode==="edit"
?
"Edit Property"
:
"Add Property"
}
</h1>



{/* TITLE */}

<input
type="text"
name="title"
placeholder="Property Title"
value={form.title}
onChange={handleChange}
className="
w-full
h-12
border
rounded-xl
px-4
"
/>



{/* PRICE */}

<input
type="number"
name="price"
placeholder="Price"
value={form.price}
onChange={handleChange}
className="
w-full
h-12
border
rounded-xl
px-4
"
/>



{/* LOCATION */}

<LocationSearch

city={form.city}

locality={form.locality}

onSelect={({city,locality})=>{

setForm(prev=>({

...prev,

city,

locality,

location:
`${locality}, ${city}`

}));

}}

/>



{/* SELLER */}

<div>

<p className="font-medium mb-3">
Posted By
</p>


<div className="grid grid-cols-2 gap-3">


{
["owner","agent"].map(item=>(


<button

key={item}

type="button"

onClick={()=>setForm(prev=>({

...prev,

seller:item

}))}


className={`
h-12
rounded-xl
border

${
form.seller===item

?
"bg-orange-500 text-white"

:
"bg-white"
}

`}

>

{
item==="owner"
?
"Owner"
:
"Agent"
}

</button>


))
}


</div>

</div>




{/* PROPERTY TYPE */}

<div>

<p className="font-medium mb-3">
Property Type
</p>


<div className="
grid
grid-cols-2
md:grid-cols-4
gap-3
">


{
PROPERTY_TYPES.map(type=>(


<button

type="button"

key={type}

onClick={()=>handlePropertyType(type)}

className={`
p-3
rounded-xl
border

${
form.propertyType===type
?
"bg-orange-500 text-white"
:
"bg-white"
}

`}

>

{type}

</button>


))

}


</div>

</div>





{/* BHK */}

{
["Flat","House","Villa"]
.includes(form.propertyType)

&&

<select

name="bhkType"

value={form.bhkType}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>

<option value="">
Select BHK
</option>


{
BHK_TYPES.map(x=>(

<option
key={x}
value={x}
>

{x}

</option>

))

}


</select>

}




{/* PLOT */}

{

form.propertyType==="Plot"

&&

<select

name="plotType"

value={form.plotType}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>

<option value="">
Plot Type
</option>

<option>
Residential
</option>

<option>
Commercial
</option>


</select>


}





{/* SHOP */}

{

form.propertyType==="Shop"

&&

<select

name="shopType"

value={form.shopType}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>


<option value="">
Shop Type
</option>


{
SHOP_TYPES.map(x=>(

<option
key={x}
value={x}
>
{x}
</option>

))

}


</select>


}





{/* BUY RENT */}

<select

name="listingType"

value={form.listingType}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>

<option value="buy">
Sell
</option>


<option value="rent">
Rent
</option>


</select>





{/* AREA */}

<div className="
grid
grid-cols-2
gap-3
">


<input

type="number"

name="area"

placeholder="Area"

value={form.area}

onChange={handleChange}

className="
h-12
border
rounded-xl
px-4
"

/>



<select

name="areaUnit"

value={form.areaUnit}

onChange={handleChange}

className="
h-12
border
rounded-xl
px-4
"

>

<option value="sqft">
Sq Ft
</option>


<option value="sqm">
Sq Meter
</option>


</select>


</div>





{/* BATHROOM */}

<select

name="bathrooms"

value={form.bathrooms}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>


<option value="">
Bathrooms
</option>

<option>
1
</option>

<option>
2
</option>

<option>
3
</option>

<option>
4+
</option>


</select>





{/* FURNISHING */}

<select

name="furnishing"

value={form.furnishing}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>

<option value="">
Furnishing
</option>


<option>
Fully Furnished
</option>


<option>
Semi Furnished
</option>


<option>
Unfurnished
</option>


</select>





{/* AGE */}

<select

name="propertyAge"

value={form.propertyAge}

onChange={handleChange}

className="
w-full
h-12
border
rounded-xl
px-4
"

>

<option value="">
Property Age
</option>


<option>
New Construction
</option>

<option>
0-5 Years
</option>

<option>
5-10 Years
</option>

<option>
10+ Years
</option>


</select>





{/* FLOOR */}

<div className="
grid
grid-cols-2
gap-3
">


<input

type="number"

name="floor"

placeholder="Floor"

value={form.floor}

onChange={handleChange}

className="
h-12
border
rounded-xl
px-4
"

/>


<input

type="number"

name="totalFloors"

placeholder="Total Floors"

value={form.totalFloors}

onChange={handleChange}

className="
h-12
border
rounded-xl
px-4
"

/>


</div>





{/* AMENITIES */}

<div>

<p className="font-medium mb-3">
Amenities
</p>


<div className="
grid
grid-cols-2
gap-3
">


{
AMENITIES.map(item=>(


<label
key={item}
className="flex gap-2"
>

<input

type="checkbox"

checked={
form.amenities.includes(item)
}

onChange={()=>toggleAmenity(item)}

/>

{item}

</label>


))

}


</div>


</div>





{/* AVAILABLE DATE */}

<div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
  <label className="block text-sm font-semibold text-gray-800 mb-3">
    Available From
  </label>

  <div className="relative">

    <CalendarDays
      size={20}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10"
    />

   <DatePicker
  selected={selectedDate}

  onChange={(date: Date | null) => {
    setForm((prev) => ({
      ...prev,
      availableFrom: date
        ? date.toISOString().split("T")[0]
        : "",
    }));
  }}

  minDate={new Date()}

  placeholderText="Select Available Date"

  dateFormat="dd MMM yyyy"

  className="
    w-full
    h-12
    rounded-xl
    border
    border-gray-300
    bg-white
    pl-12
    pr-4
    outline-none
    focus:border-gray-400
    focus:ring-2
    focus:ring-gray-200
  "

  wrapperClassName="w-full"
/>

  </div>
</div>




{/* DESCRIPTION */}

<label>✨ AI Generated Description</label>
{/* DESCRIPTION */}

<div className="relative">

<textarea
name="description"
placeholder="Description"
value={form.description}
onChange={handleChange}
rows={6}
className="
w-full
min-h-[150px]
border
rounded-xl
p-4
text-sm
leading-6
resize-none
break-words
whitespace-normal
"
/>


{
!form.description && (

<button
  type="button"
  onClick={generateDescription}
  disabled={generating}
  className="
    absolute
    right-3
    bottom-3
    bg-emerald-600
    hover:bg-emerald-700
    text-white
    px-4
    py-2
    rounded-lg
    text-sm
    font-medium
    transition
  "
>
  {
  generating
  ?
  "Generating..."
  :
  "✨ Generate AI"
  }

</button>

)

}


</div>





{/* IMAGES */}

<input

type="file"

multiple

onChange={(e)=>
handleImages(e.target.files)
}

/>





<button

disabled={loading}

className="
w-full
h-12
rounded-xl
text-white
font-medium
bg-gradient-to-r
from-orange-500
via-amber-400
to-yellow-300
"

>

{
loading
?
"Uploading..."
:
mode==="edit"
?
"Send For Approval"
:
"Create Property"
}


</button>



</form>





</div>

);


}