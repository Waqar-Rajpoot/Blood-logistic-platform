// "use client";
// import { useEffect } from "react";
// import { io } from "socket.io-client";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function SmartAlertListener({ userBloodGroup }: { userBloodGroup: string }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (!userBloodGroup) return;

//     // Standardizing room names: "A+" -> "blood_Apos"
//     const roomName = `blood_${userBloodGroup.replace("+", "pos").replace("-", "neg")}`;
    
//     const socket = io();

//     socket.on("connect", () => {
//       console.log("Connected to Real-time Alert System");
//       socket.emit("join-blood-group", roomName);
//     });

//     socket.on("EMERGENCY_ALERT", (data: any) => {
//       // 1. Play alert sound
//       const audio = new Audio("/notification-beep.mp3");
//       audio.play().catch(() => console.log("Audio playback required user interaction first"));

//       // 2. Persist alert data for the Map Page
//       // This allows /urgent-match to read the hospital location and contact info
//       localStorage.setItem("latestEmergency", JSON.stringify(data));

//       // 3. Custom high-priority Toast
//       toast.custom((t) => (
//         <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-8 border-red-600 p-2`}>
//           <div className="flex-1 p-4">
//             <div className="flex items-start">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="relative flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
//                   </span>
//                   <p className="text-xs font-black text-red-600 uppercase tracking-widest">
//                     Live Emergency Alert
//                   </p>
//                 </div>
//                 <p className="text-sm font-bold text-gray-900 leading-tight">
//                   {data.message}
//                 </p>
//                 <div className="mt-4 flex gap-2">
//                   <button 
//                     onClick={() => {
//                       toast.dismiss(t.id);
//                       router.push('/urgent-match');
//                     }}
//                     className="flex-1 py-2 bg-red-600 text-white text-xs rounded-xl font-bold hover:bg-red-700 transition-colors"
//                   >
//                     View Distance & Map
//                   </button>
//                   <button 
//                     onClick={() => toast.dismiss(t.id)}
//                     className="px-4 py-2 bg-gray-100 text-gray-500 text-xs rounded-xl font-bold"
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ), { duration: 15000 }); // Longer duration for emergencies
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [userBloodGroup, router]);

//   return null;
// }