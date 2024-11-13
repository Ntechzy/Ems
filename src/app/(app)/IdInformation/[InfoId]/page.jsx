  // "use client";
  // import React, { useEffect, useState } from 'react';
  // import { rescueUser } from '@/components/empl_dashboard_function/FetchUserDetail';
  // import QrCodeImage from '@/components/empl_dashboard_component/QrCodeImage';

  // const Page = ({ params }) => {
  //   const [userData, setUserData] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   const userId = params?.InfoId;

  //   useEffect(() => {
  //     if (userId) {
  //       const loadUserData = async () => {
  //         try {
  //           const data = await rescueUser(userId);
  //           setUserData(data);
  //         } catch (err) {
  //           setError("Failed to fetch user details");
  //           console.error("Error fetching user data:", err); // Optional logging for debugging
  //         } finally {
  //           setLoading(false);
  //         }
  //       };

  //       loadUserData();
  //     }
  //   }, [userId]);

  //   if (loading) return <div>Loading...</div>;
  //   if (error) return <div>{error}</div>;

  //   const { name, phone, companyName, profilePicture } = userData || {};
  //   const qrData = userData ? { name, phone, companyName, imageUrl: profilePicture } : null;

  //   return (
  //     <div>
  //       {userData ? (
  //         <div>
  //           <h2>User QR Code</h2>
  //           <QrCodeImage qrData={qrData} />
  //         </div>
  //       ) : (
  //         <div>No user data available</div>
  //       )}
  //     </div>
  //   );
  // };

  // export default Page;


  import React from 'react'
  
  const Page = () => {
    return (
      <div>Nothing</div>
    )
  }
  
  export default Page