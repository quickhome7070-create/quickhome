require("dotenv").config();

const connectDB =
require("../config/db");

const Location =
require("../models/Location");


const locations=[

{
country:"India",
state:"Maharashtra",
city:"Pune",
locality:"Wakad"
},

{
country:"India",
state:"Maharashtra",
city:"Pune",
locality:"Baner"
},

{
country:"India",
state:"Maharashtra",
city:"Pune",
locality:"Kharadi"
},

{
country:"India",
state:"Maharashtra",
city:"Pune",
locality:"Hinjewadi"
},


{
country:"India",
state:"Maharashtra",
city:"Mumbai",
locality:"Andheri"
},

{
country:"India",
state:"Karnataka",
city:"Bangalore",
locality:"Whitefield"
}

];



async function seed(){

await connectDB();


await Location.deleteMany();


await Location.insertMany(
locations
);


console.log(
"Locations inserted"
);


process.exit();

}


seed();