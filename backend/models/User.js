const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
{

name:{
    type:String,
    required:true,
    trim:true
},


phone:{
    type:String,
    required:true,
    unique:true,
    trim:true
},


email:{
    type:String,
    lowercase:true,
    trim:true,
    unique:true,
    sparse:true
},


password:{
    type:String,
    required:false
},



subscription:{

    status:{
        type:String,
        enum:[
            "free",
            "premium"
        ],
        default:"free"
    },


    freeContactsRemaining:{
        type:Number,
        default:3
    },


    viewedProperties:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Property"
        }
    ],


    expiresAt:{
        type:Date,
        default:null
    }

},



isPhoneVerified:{
    type:Boolean,
    default:false
},



isEmailVerified:{
    type:Boolean,
    default:false
},



authMethods:{
    type:[
        String
    ],
    enum:[
        "otp",
        "password",
        "google"
    ],
    default:[
        "otp"
    ]
},



role:{
    type:String,
    enum:[
        "user",
        "admin"
    ],
    default:"user"
},



favorites:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property"
    }
],



recentlyViewed:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property"
    }
]

},
{
timestamps:true
}

);



module.exports =
mongoose.model(
    "User",
    userSchema
);