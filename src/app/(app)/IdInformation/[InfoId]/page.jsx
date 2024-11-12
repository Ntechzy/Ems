"use client";
import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";

import { rescueUser } from '@/components/empl_dashboard_function/FetchUserDetail';

const page = ({params}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = params?.InfoId;  
  useEffect(() => {
    if (userId) { 
      const loadUserData = async () => {
        try {
          const data = await rescueUser(userId); // Call the function with userId
          setUserData(data); // Set the data in the state
        } catch (err) {
          setError("Failed to fetch user details"); // Set error if fetch fails
        } finally {
          setLoading(false); // Set loading state to false once the request is completed
        }
      };

      loadUserData(); // Fetch user data on component mount
    }
  }, [userId]); // Re-run the effect whenever userId changes

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message if fetching fails
 
  const qrData = userData ? {
    name: userData.name,
    phone: userData.phone,
    companyName: userData.companyName,
    imageUrl: userData.profilePicture
  } : '';
  return (
    <div>
      {userData ? (
        <div>
          <h2>User QR Code</h2>
          {/* QR Code with user data */}
          <QRCode value={JSON.stringify(qrData)} size={256} />
        </div>
      ) : (
        <div>No user data available</div> // If no data is available, show this message
      )}
    </div>
  )
}

export default page 