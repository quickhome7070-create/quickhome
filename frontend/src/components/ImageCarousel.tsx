"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images?: string[];
  title: string;
};

export default function ImageCarousel({
  images = [],
  title,
}: Props) {

  const [index, setIndex] = useState(0);

  const [open, setOpen] = useState(false);

  const [disableTransition, setDisableTransition] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);


  if (!images.length) {
    return null;
  }


  // Clone first image for infinite loop

  const sliderImages = [
    ...images,
    images[0],
  ];



  // Auto slide

  useEffect(() => {

    if(open) return;

    if(images.length <= 1) return;


    const timer = setInterval(() => {

      setIndex(prev => prev + 1);

    },3000);


    return () => clearInterval(timer);


  },[
    images.length,
    open
  ]);


useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [open]);


  // Reset after cloned first image

  useEffect(()=>{


    if(index === images.length){


      const timer = setTimeout(()=>{


        setDisableTransition(true);


        setIndex(0);


        setTimeout(()=>{

          setDisableTransition(false);

        },50);


      },700);



      return ()=>clearTimeout(timer);

    }


  },[
    index,
    images.length
  ]);






  // Swipe start

  const handleTouchStart = (
    e:React.TouchEvent
  )=>{

    setTouchStart(
      e.targetTouches[0].clientX
    );

  };





  // Swipe move

  const handleTouchMove = (
    e:React.TouchEvent
  )=>{

    setTouchEnd(
      e.targetTouches[0].clientX
    );

  };





  // Swipe end

  const handleTouchEnd = ()=>{


    if(!touchStart || !touchEnd)
      return;


    const distance =
      touchStart - touchEnd;



    // left swipe

    if(distance > 50){

      setIndex(prev => prev + 1);

    }



    // right swipe

    if(distance < -50){


      if(index === 0){

        setDisableTransition(true);

        setIndex(images.length);


        setTimeout(()=>{

          setDisableTransition(false);

          setIndex(images.length - 1);

        },50);


      }
      else{

        setIndex(prev => prev - 1);

      }


    }



    setTouchStart(0);
    setTouchEnd(0);

  };





return (

<>


{/* IMAGE CAROUSEL */}

<div

className="
relative
w-full
h-72
overflow-hidden
rounded-2xl
"

onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}

>


<div

className={`
flex
h-full
${
disableTransition
?
""
:
"transition-transform duration-700 ease-in-out"
}
`}

style={{

transform:
`translateX(-${index * 100}%)`

}}

>


{
sliderImages.map((img,i)=>(


<div

key={i}

className="
relative
min-w-full
h-full
"

onClick={()=>setOpen(true)}

>


<Image

src={
img.replace(
"/upload/",
"/upload/f_auto,q_auto,w_1400/"
)
}

alt={title}

fill

priority={i===0}

className="
object-cover
"

/>


</div>


))

}


</div>


</div>






{/* FULL SCREEN */}

{
open &&

<div
  className="
    fixed
    inset-0
    z-50
    bg-black
    overflow-y-scroll
    overscroll-contain
    no-scrollbar
    snap-y
    snap-mandatory
  "
>

<button
className="
fixed
top-5
right-5
z-[60]
text-white
text-4xl
"
onClick={() => setOpen(false)}
>
×
</button>

{images.map((img, i) => (

<div
  key={i}
  className="
    relative
    w-full
    h-screen
    flex
    items-center
    justify-center
    bg-black
    snap-start
  "
>
  <Image
    src={img.replace("/upload/", "/upload/f_auto,q_auto/")}
    alt={title}
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>

))}

</div>

}


</>

);

}