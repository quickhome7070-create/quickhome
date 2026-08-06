const Property = require("../models/Property");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


exports.generatePropertyDescription = async (req,res)=>{

try{

const {
propertyType,
bhkType,
city,
locality,
area,
areaUnit,
furnishing,
propertyAge,
amenities,
listingType

}=req.body;


const prompt = `
You are a professional real estate writer.

Generate an attractive property description between 80-120 words.

Details:

Property Type: ${propertyType}
Configuration: ${bhkType}
Location: ${locality}, ${city}
Area: ${area} ${areaUnit}
Furnishing: ${furnishing}
Age: ${propertyAge}
Listing Type: ${listingType}
Amenities: ${amenities?.join(", ")}

Rules:
- Use only provided information.
- Do not create fake details.
- Professional marketing tone.
- End with an attractive invitation.
`;


const completion = await groq.chat.completions.create({

model:"llama-3.3-70b-versatile",

messages:[
{
role:"system",
content:`
You are a real estate search assistant.

Convert user query into JSON only.

Rules:
- Extract Indian property prices correctly.
- 1 lakh = 100000
- 1 crore = 10000000
- Convert lakh/crore values into numbers.
- Example:
  "70 lakh" => 7000000
  "1 crore" => 10000000
  "50L" => 5000000

Return ONLY JSON.
No markdown.

JSON format:

{
 "city": null,
 "locality": null,
 "propertyType": null,
 "bhkType": null,
 "listingType": null,
 "furnishing": null,
 "minPrice": null,
 "maxPrice": null
}
`
},
{
role:"user",
content:prompt
}
],

temperature:0.7,

});


res.json({

description:
completion.choices[0].message.content

});


}
catch(error){

console.error(
"Groq Error:",
error
);


res.status(500).json({

message:"Failed to generate description"

});

}

};

exports.aiPropertySearch = async (req, res) => {

try {

const { query } = req.body;


const completion =
await groq.chat.completions.create({

model:"llama-3.3-70b-versatile",

messages:[

{
role:"system",
content:`

You are a real estate search assistant.

Convert user query into JSON only.

Return:

{
 "city": null,
 "locality": null,
 "propertyType": null,
 "bhkType": null,
 "listingType": null,
 "furnishing": null,
 "minPrice": null,
 "maxPrice": null
}


Rules:

Property Types:
Flat
House
Villa
Plot
Office Space
Shop


Listing:

sale,purchase,resale,buy = buy

rent,lease,rental = rent


BHK:
Return:
1BHK
2BHK
3BHK
4BHK

For:
Plot
Shop
Office Space

bhkType must be null


Price:

70 lakh = 7000000

1 crore = 10000000


Return JSON only.
No explanation.
No markdown.

`
},

{
role:"user",
content:query
}

],

temperature:0

});



// Clean AI response

let aiResponse =
completion.choices[0].message.content;


aiResponse =
aiResponse
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();



const filters =
JSON.parse(aiResponse);



// Empty values cleanup

Object.keys(filters).forEach(key=>{

if(
filters[key]==="" ||
filters[key]==="null"
){
filters[key]=null;
}

});




// Normalize property type

if(filters.propertyType){

filters.propertyType =
filters.propertyType
.charAt(0)
.toUpperCase()
+
filters.propertyType.slice(1).toLowerCase();

}



// Normalize BHK

if(filters.bhkType){

filters.bhkType =
filters.bhkType
.replace(/\s+/g," ")
.toUpperCase();

}



// Remove BHK for non residential

if(
[
"Plot",
"Shop",
"Office Space"
]
.includes(filters.propertyType)
){

filters.bhkType=null;

}



// Listing type normalize

const listing =
(filters.listingType || "")
.toLowerCase();


if(
[
"sale",
"purchase",
"resale",
"buy"
].includes(listing)
){

filters.listingType="buy";

}


if(
[
"rent",
"lease",
"rental"
].includes(listing)
){

filters.listingType="rent";

}



// default listing

if(!filters.listingType){

filters.listingType = null;

}



// Furnishing normalize

const furnishingMap={

"furnished":"Furnished",

"semi furnished":
"Semi Furnished",

"fully furnished":
"Fully Furnished",

"unfurnished":
"Unfurnished"

};


if(filters.furnishing){

filters.furnishing =
furnishingMap[
filters.furnishing.toLowerCase()
]
||
null;

}




// Price detection from query

const lowerQuery =
query.toLowerCase();



const lakh =
lowerQuery.match(
/(\d+(\.\d+)?)\s*(lakh|lac|l)/
);


const crore =
lowerQuery.match(
/(\d+(\.\d+)?)\s*(crore|cr)/
);



if(lakh){

filters.maxPrice =
Number(lakh[1])*100000;

}



if(crore){

filters.maxPrice =
Number(crore[1])*10000000;

}




// Mongo Query

// ===============================
// BUILD MONGO QUERY
// ===============================

const baseQuery = {

status:"active",
approvalStatus:"approved"

};


if(filters.city){

baseQuery.city = {
$regex: filters.city,
$options:"i"
};

}


if(filters.locality){

baseQuery.locality = {
$regex: filters.locality,
$options:"i"
};

}


if(filters.propertyType){

baseQuery.propertyType = {
$regex: filters.propertyType,
$options:"i"
};

}


if(filters.bhkType){

baseQuery.bhkType = {
$regex: filters.bhkType.replace("BHK"," BHK"),
$options:"i"
};

}


if(filters.listingType){

baseQuery.listingType =
filters.listingType;

}


if(filters.furnishing){

baseQuery.furnishing =
filters.furnishing;

}


if(filters.maxPrice){

baseQuery.price={
$lte:Number(filters.maxPrice)
};

}


if(filters.minPrice){

baseQuery.price={
...(baseQuery.price || {}),
$gte:Number(filters.minPrice)
};

}



console.log(
"FINAL QUERY",
JSON.stringify(baseQuery,null,2)
);



let properties =
await Property.find(baseQuery)
.select(
"title price location propertyType bhkType plotType furnishing area areaUnit images listingType seller city locality"
);



// ===============================
// SMART FALLBACK
// ===============================


if(properties.length===0){


const relaxedQuery={

status:"active",

approvalStatus:"approved"

};



if(filters.locality){

relaxedQuery.locality={
$regex:filters.locality,
$options:"i"
};

}


if(filters.city){

relaxedQuery.city={
$regex:filters.city,
$options:"i"
};

}


properties =
await Property.find(relaxedQuery)
.select(
"title price location propertyType bhkType plotType furnishing area areaUnit images listingType seller city locality"
);


}



return res.json({

filters,

count:properties.length,

properties

});

res.json({

filters,

count:properties.length,

properties

});


}
catch(error){

console.log(
"AI Search Error:",
error
);


res.status(500).json({

message:error.message

});

}

};