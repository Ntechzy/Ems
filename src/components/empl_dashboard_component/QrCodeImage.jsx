"use client";
import React, { useEffect, useState } from 'react';
import { rescueUser } from '@/components/empl_dashboard_function/FetchUserDetail';
import QRCode from 'react-qr-code';

const QrCodeImage = ({ qrData }) => {
  // If no QR data is provided, display a message
  if (!qrData) return <div>No QR data available</div>;

  return (
    <div>
      <QRCode value={JSON.stringify(qrData)} size={256} />
    </div>
  );
};

const QrCodeCmp = ({ id }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(id, "here check user id");

    if (id) {
      const loadUserData = async () => {
        try {
          const data = await rescueUser(id); // Use `id` instead of `userId`
          setUserData(data); // Set the fetched data to the state
          setError(null); // Clear error if data is fetched successfully
        } catch (err) {
          setError('Failed to fetch user details');
          console.error('Error fetching user data:', err);
        } finally {
          setLoading(false);
        }
      };

      loadUserData();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Destructure the user data to extract necessary fields for the QR code
  const { name, phone, companyName, profilePicture } = userData || {};
  const qrData = userData ? { name, phone, companyName, imageUrl: profilePicture } : null;

  return (
    <div className="dashboard-container">
      {/* If user data exists, display the QR code and user information */}
      {userData ? (
        <div>
          <h2>User QR Code</h2>
          {/* Render QR code if qrData is available */}
          <QrCodeImage qrData={qrData} />
        </div>
      ) : (
        <div>No user data available</div>
      )}
    </div>
  );
};

export default QrCodeCmp;
