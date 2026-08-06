"use client";

import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    SpeechRecognition:any;
    webkitSpeechRecognition:any;
  }
}

export default function AISearchBox() {


  const router = useRouter();


  const [query,setQuery] = useState("");
  const [loading,setLoading] = useState(false);
  const [listening,setListening] = useState(false);



  const searchAI = (searchText?:string)=>{


    const text =
    searchText || query;


    if(!text.trim())
    return;


  


    router.push(
      `/properties?ai=${encodeURIComponent(text)}`
    );


  };




  const startVoiceSearch = ()=>{


    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;



    if(!SpeechRecognition){

      alert(
        "Voice search not supported"
      );

      return;

    }



    const recognition =
    new SpeechRecognition();



    recognition.lang="en-IN";

    recognition.continuous=false;

    recognition.interimResults=false;



    recognition.onstart=()=>{

      setListening(true);

    };




    recognition.onresult=(event:any)=>{


      const text =
      event.results[0][0].transcript;



      setQuery(text);


      searchAI(text);


    };



    recognition.onend=()=>{

      setListening(false);

    };



    recognition.start();


  };





return (

<div className="w-full max-w-3xl mx-auto relative mb-2">


<input

value={query}

onChange={(e)=>
setQuery(e.target.value)
}

onKeyDown={(e)=>{

if(e.key==="Enter")
searchAI();

}}

placeholder="AI Search: 2 BHK flat in Wakad Pune"

className="
w-full
h-14
rounded-full
border
px-6
pr-24
shadow-sm
"

/>



<button

onClick={()=>
searchAI()
}



className="
absolute
right-14
top-2
h-10
w-10
rounded-full
bg-green-600
text-white
flex
items-center
justify-center
"

>


{
loading
?
"..."
:
<Search size={20}/>
}


</button>




<button

onClick={startVoiceSearch}

className={`
absolute
right-2
top-2
h-10
w-10
rounded-full
border
flex
items-center
justify-center

${listening ? "bg-red-500 text-white":""}

`}

>


<Mic size={20}/>


</button>


</div>


);


}