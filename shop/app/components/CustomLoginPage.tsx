// "use client";
// import { signIn, useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { UserRole } from "@/types";

// const CustomLoginPage = () => {
//   const { data: session, status } = useSession();
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         if (session) {
//           const res = await fetch("http://localhost:3000/api/users", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               name: session.user!.name,
//               email: session.user!.email,
//               img: session.user!.image,
//             }),
//           });

//           if (res.ok) {
//             const data = await res.json();
//             console.log(data);

//           }

//         }
//       } catch (error) {
//         console.error("Error in fetchData:", error);
//         setError("Er is iets misgegaan, probeer het later opnieuw");
//         return;
//       }
//     }

//     fetchData();
//   }, [status, session]);

//   const handleSignin = () => {
//     signIn("google");
//   };

//   return (
//     <>
//       {status === "unauthenticated" && (
//         <div className="flex items-center justify-center w-full h-screen bg-[#E4E9F0]">
//           <div className="flex flex-col items-center justify-center w-3/6 h-3/6 bg-white">

//             <>
//               <div className="bg-[#E4E9F0] rounded-lg shadow-md p-4 mt-5">
//                 <button
//                   onClick={handleSignin}
//                   className="text-2xl flex items-center"
//                 >
//                   Verdergaan met Google
//                 </button>
//               </div>
//               {error && <p className="text-red-500">{error}</p>}
//             </>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CustomLoginPage;
