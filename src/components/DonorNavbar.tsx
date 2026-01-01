// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { 
//   LayoutDashboard, 
//   Bell, 
//   History, 
//   User, 
//   Menu, 
//   X, 
//   Droplets,
//   LogOut,
//   HeartHandshake
// } from "lucide-react";

// export default function DonorNavbar() {
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/login" });
//   };

//   const navItems = [
//     { name: "Dashboard", href: "/donor", icon: <LayoutDashboard size={18} /> },
//     { name: "Alerts", href: "/donor/alerts", icon: <Bell size={18} /> },
//     { 
//       name: "Donate Blood", 
//       href: "/donor/volunteer", 
//       icon: <HeartHandshake size={18} />,
//       special: true // Highlight for voluntary donation
//     },
//     { name: "History", href: "/donor/history", icon: <History size={18} /> },
//     { name: "Profile", href: "/donor/profile", icon: <User size={18} /> },
//   ];

//   return (
//     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
          
//           {/* Logo Section */}
//           <div className="flex items-center">
//             <Link href="/donor" className="flex items-center gap-2 group">
//               <div className="bg-red-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
//                 <Droplets className="text-white" size={20} />
//               </div>
//               <span className="font-black text-xl text-gray-800 tracking-tight">LifeFlow</span>
//             </Link>
//             <span className="text-sm font-bold pt-3 text-red-400 ml-1">Donor</span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-2">
//             {navItems.map((item) => {
//               const isActive = pathname === item.href;
              
//               // // Emerald theme for "Donate Blood", Red theme for others
//               // const activeClass = item.special 
//               //   ? "bg-emerald-50 text-emerald-600" 
//               //   : "bg-red-50 text-red-600";
              
//               // const hoverClass = item.special 
//               //   ? "" 
//               //   : "hover:bg-red-50 hover:text-red-800 text-gray-500";

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
//                     isActive ? "bg-red-50 text-red-600" : "hover:text-red-600"
//                   }`}
//                 >
//                   {item.icon}
//                   {item.name}
//                 </Link>
//               );
//             })}
            
//             <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            
//             {/* Desktop Logout Button */}
//             <button 
//               onClick={handleLogout}
//               className="p-2 text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 font-bold text-sm"
//               title="Logout"
//             >
//               <LogOut size={20} />
//               <span>Logout</span>
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button 
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation Drawer */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
//           {navItems.map((item) => {
//             const isActive = pathname === item.href;
            
//             const activeBg = item.special ? "bg-emerald-600" : "bg-red-600";

//             return (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
//                   isActive 
//                     ? `${activeBg} text-white` 
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {item.icon}
//                 {item.name}
//               </Link>
//             );
//           })}
          
//           {/* Mobile Logout Button */}
//           <button 
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-bold border-t border-gray-100 mt-2 active:bg-red-50 transition-colors"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }





"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Bell, 
  History, 
  User, 
  Menu, 
  X, 
  Droplets,
  LogOut,
  HeartHandshake,
  ChevronDown,
} from "lucide-react";

export default function DonorNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Main links that stay visible
  const mainNavItems = [
    { name: "Dashboard", href: "/donor", icon: <LayoutDashboard size={18} /> },
    { name: "Alerts", href: "/donor/alerts", icon: <Bell size={18} /> },
    { name: "Donate Blood", href: "/donor/volunteer", icon: <HeartHandshake size={18} />, special: true },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Reduced max-width and tighter padding to fix margins */}
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/donor" className="flex items-center gap-2 group">
              <div className="bg-red-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
                <Droplets className="text-white" size={18} />
              </div>
              <span className="font-black text-lg text-gray-800 tracking-tight">LifeFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-red-50 text-red-600" 
                      : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
            
            <div className="h-6 w-[1px] bg-gray-100 mx-2" />
            
            {/* Nested Profile & Logout Step */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                  isProfileOpen ? "border-red-200 bg-red-50" : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white">
                  <User size={14} />
                </div>
                <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Step 2: Nested Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Donor Account</p>
                  </div>
                  
                  <Link 
                    href="/donor/profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} /> Upate Profile
                  </Link>
                  
                  <Link 
                    href="/donor/history" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-red-600"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <History size={16} /> Donation History
                  </Link>

                  <div className="h-[1px] bg-gray-50 my-1" />
                  
                  {/* Step 3: Nested Logout Action */}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-1 shadow-2xl">
          {[...mainNavItems, { name: "History", href: "/donor/history", icon: <History size={18} /> }, { name: "Profile", href: "/donor/profile", icon: <User size={18} /> }].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${
                pathname === item.href ? "bg-red-600 text-white" : "text-gray-600 active:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 font-bold border-t border-gray-100 mt-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}