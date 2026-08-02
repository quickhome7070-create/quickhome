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