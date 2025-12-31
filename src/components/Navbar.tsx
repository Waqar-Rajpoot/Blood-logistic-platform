// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Info, Droplets, Home, Search, Menu, X } from "lucide-react";

// export default function PublicNavbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const pathname = usePathname();

//   // Close mobile menu whenever the route changes
//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   const navLinks = [
//     { name: "Home", href: "/", icon: <Home size={18} /> },
//     { name: "About Us", href: "/about", icon: <Info size={18} /> },
//     { name: "Search", href: "/search", icon: <Search size={18} /> },
//   ];

//   return (
//     <nav className="bg-white border-b sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
          
//           {/* LOGO */}
//           <Link href="/" className="flex items-center gap-2 font-black text-2xl text-gray-800 shrink-0">
//             <Droplets className="text-red-600" size={28} /> 
//             <span>LifeFlow</span>
//           </Link>

//           {/* DESKTOP NAV */}
//           <div className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`flex items-center gap-1 font-bold transition-colors ${
//                   pathname === link.href ? "text-red-600" : "text-gray-600 hover:text-red-600"
//                 }`}
//               >
//                 {link.icon}
//                 {link.name}
//               </Link>
//             ))}
//             <Link 
//               href="/login" 
//               className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-red-100"
//             >
//               Login
//             </Link>
//           </div>

//           {/* MOBILE TOGGLE BUTTON */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-600 hover:text-red-600 p-2 transition-colors"
//               aria-label="Toggle Menu"
//             >
//               {isOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE MENU DROPDOWN */}
//       <div className={`
//         md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t
//         ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
//       `}>
//         <div className="px-4 pt-2 pb-6 space-y-2">
//           {navLinks.map((link) => (
//             <Link
//               key={link.name}
//               href={link.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
//                 pathname === link.href ? "bg-red-50 text-red-600" : "text-gray-600"
//               }`}
//             >
//               {link.icon}
//               {link.name}
//             </Link>
//           ))}
//           <div className="pt-2">
//             <Link
//               href="/login"
//               className="flex justify-center bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-md"
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }







"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Droplets, Home, Search, Menu, X, ArrowRight } from "lucide-react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "About Us", href: "/about", icon: <Info size={18} /> },
    { name: "Search", href: "/search", icon: <Search size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO SECTION */}
          <Link href="/" className="group flex items-center gap-2 shrink-0">
            <div className="bg-red-100 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Droplets className="text-red-600" size={26} fill="currentColor" /> 
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">
              Life<span className="text-red-600">Flow</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
                      isActive 
                        ? "bg-white text-red-600 shadow-sm ring-1 ring-slate-200/50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <Link 
              href="/login" 
              className="group flex items-center gap-2 bg-slate-900 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-red-200 hover:-translate-y-0.5"
            >
              Login
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                isOpen ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`
        md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "max-h-[400px] opacity-100 visible" : "max-h-0 opacity-0 invisible"}
      `}>
        <div className="px-4 pt-2 pb-8 space-y-2 bg-white border-t border-slate-50 shadow-inner">
          <div className="grid gap-1 pt-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? "bg-red-50 text-red-600" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className={`${isActive ? "text-red-600" : "text-slate-400"}`}>
                    {link.icon}
                  </div>
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-[0.98] transition-transform"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}