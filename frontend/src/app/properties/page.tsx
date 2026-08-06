import PropertiesClient from "./PropertiesClient";


type SearchParams = {

ai?:string;

keyword?:string;
city?:string;
locality?:string;
location?:string;

minPrice?:string;
maxPrice?:string;

listingType?:string;
sort?:string;

propertyType?:string;
seller?:string;

bhkType?:string;
plotType?:string;

furnishing?:string;
shopType?:string;

};



type Props={

searchParams:
Promise<SearchParams>;

};





export default async function PropertiesPage({

searchParams

}:Props){



const params =
await searchParams;



console.log(
"PAGE PARAMS",
params
);



let data:any={

properties:[],
count:0

};





if(params.ai){



const response =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/ai/ai-search`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

query:params.ai

}),

cache:"no-store"

}

);




data =
await response.json();



console.log(
"AI SERVER RESULT",
data
);



}

else {



const query =
new URLSearchParams();



Object.entries(params)
.forEach(([key,value])=>{


if(value){

query.append(
key,
value
);

}


});




const response =
await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/property?${query.toString()}`,

{

cache:"no-store"

}

);



data =
await response.json();


}





return (

<main className="min-h-screen bg-gray-50 p-4">


<div className="max-w-7xl mx-auto">


<PropertiesClient


initialProperties={
data.properties || []
}



totalProperties={
data.count || 0
}



searchParams={
params
}



/>


</div>


</main>

);


}