"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {

  const menuRef = useRef<HTMLDivElement>(null);

const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { user, logout, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const router = useRouter();

const handlePostProperty = () => {
  if (!user) {
    router.push("/login");
    return;
  }

  router.push("/addproperty");
};
  useEffect(() => {

  const handleClickOutside = (
    event: MouseEvent
  ) => {

    const target = event.target as Node;

    if (
      menuOpen &&
      menuRef.current &&
      !menuRef.current.contains(target) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(target)
    ) {

      setMenuOpen(false);

    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, [menuOpen]);
useEffect(() => {

  const handleScroll = () => {

    if (menuOpen) {
      setMenuOpen(false);
    }

  };

  window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
  );

  return () => {

    window.removeEventListener(
      "scroll",
      handleScroll
    );

  };

}, [menuOpen]);

  
  
   const deleteAccount = async () => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone."
  );


  if (!confirmDelete) return;


  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );


    const data = await res.json();


    if (res.ok) {

      alert(data.message);

      router.push("/");

      window.location.reload();

    } else {

      alert(data.message || "Failed to delete account");

    }


  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

};



  return (
<header
className="
sticky top-0 z-50 w-full
bg-white/80
backdrop-blur-xl
border-b border-gray-200
shadow-sm
"
>
 <div className="h-[3px] bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        {/* Left Side */}
<div className="flex items-center gap-8">

  <div className="flex items-center gap-4">

  {/* Mobile Menu Button */}
  <button
   ref={menuButtonRef}
    className="md:hidden text-2xl"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </button>


  {/* Logo */}
  <Link
    href="/"
    className="
      text-xl
      sm:text-2xl
      font-extrabold
      bg-gradient-to-r
      from-blue-600
      via-purple-600
      to-pink-500
      bg-clip-text
      text-transparent
    "
  >
    Ghar Destiny
  </Link>

</div>




  
</div>

 {/* Mobile Post Property Button */}
 <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden">

<div className="relative inline-flex md:hidden">
  <button
    onClick={handlePostProperty}
    className="
      bg-white
      rounded-full
      px-3
      py-1.5
      text-sm
      font-semibold
      shadow-md
    "
  >
    Post Property
  </button>

  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">
    FREE
  </span>
</div> 
</div>
{/* Desktop Nav */}
<nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-900">

  <Link
    href="/properties"
    className="hover:text-black transition-all duration-300"
  >
    Properties
  </Link>

  {!loading && !user && (
    <>
      <Link
        href="/login"
        className="hover:text-black transition-all duration-300"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="hover:text-black transition-all duration-300"
      >
        Register
      </Link>
    </>
  )}
  <div className="relative inline-flex ">

  <button
    onClick={handlePostProperty}
    className="
      bg-white
      rounded-full
      px-3
      py-1.5
      text-sm
      font-semibold
      shadow-md
      hover:shadow-lg
      transition-all
    "
  >
    Post Property
  </button>

  <span
    className="
      absolute
      -top-2
      -right-2
      bg-green-600
      text-white
      text-[10px]
      font-bold
      px-2
      py-0.5
      rounded-full
      shadow-lg
    "
  >
    FREE
  </span>

</div>

  {!loading && user && (
    <>
      <div className="relative">

  <button
    onClick={() => setSettingsOpen(!settingsOpen)}
    className="flex items-center gap-2 hover:opacity-80"
  >

    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
      {user?.name?.charAt(0)?.toUpperCase()}
    </div>

    <span>
      {user?.name}
    </span>

    <span>
      ▼
    </span>

  </button>


  {settingsOpen && (

    <div className="
      absolute
      right-0
      mt-3
      w-48
      bg-white
      rounded-lg
      shadow-lg
      border
      py-2
      z-50
    ">

      <Link
        href="/profile"
        className="
        block
        px-4
        py-2
        hover:bg-gray-100
        "
      >
        Profile
      </Link>


      <Link
        href="/settings"
        className="
        block
        px-4
        py-2
        hover:bg-gray-100
        "
      >
        Settings
      </Link>


      <button
        onClick={deleteAccount}
        className="
        w-full
        text-left
        px-4
        py-2
        text-red-600
        hover:bg-red-50
        "
      >
        Delete Account
      </button>

    </div>

  )}

</div>

   

      <Link
        href="/dashboard/my-properties"
        className="hover:text-black transition-all duration-300"
      >
        My Property
      </Link>

      <button
onClick={async()=>{

await logout();

window.location.href="/";

}}

className="text-red-600"
>
Logout
</button>
    </>
  )}
</nav>
       
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
  ref={menuRef}
  className="
    md:hidden
    fixed
    top-[64px]
    left-0
    w-[75%]
    h-screen
    bg-white
    border-r
    shadow-xl
    px-5
    py-5
    space-y-3
    z-50
  "
>

         

        

          {!loading && user && (
            <>
              <div className="flex items-center gap-2 py-2 border-b">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-semibold">{user?.name}</span>
              </div>
              </>
          )}
           <Link href="/properties" onClick={() => setMenuOpen(false)}>
            <div className="py-2 border-b">Properties</div>
          </Link>

       
          
  {!loading && user && (
    <>
              <Link  href="/dashboard/my-properties" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b">My Property</div>
              </Link>

              <Link 
  href="/settings" 
  onClick={() => setMenuOpen(false)}
>
  <div className="py-2 border-b">
    Settings
  </div>
</Link>


<button
  onClick={() => {
    deleteAccount();
    setMenuOpen(false);
  }}
  className="
    text-600    
    py-2
    border-b
    w-full
    text-left
  "
>
  Delete Account
</button>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-500  py-2"
              >
                Logout
              </button>
            </>
          )}
            {!loading && !user && (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b">Login</div>
              </Link>

              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <div className="py-2 border-b text-blue-600 font-semibold">
                  Register
                </div>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}