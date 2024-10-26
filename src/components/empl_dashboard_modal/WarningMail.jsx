'use client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const WarningMail = ({ toggleHandleWarning }) => {
  const [warningMessage, setWarningMessage] = useState('');
const { data: session } = useSession();
const userId = session?.user?.id;
  
const handleSendWarning = async () => {
    try {
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const response = await axios.post("/api/admin-actions/warning", {
            userId,
            warningMessage: warningMessage.trim(),
        });

        console.log(response);
        

        if (response.status) {
            toast.success("Warning sent successfully");
        } else {
            toast.error("Failed to send warning");
        }

        setWarningMessage('');
        toggleHandleWarning(); 
    } catch (error) {
        console.error("Error sending warning:", error);
        toast.error("An error occurred while sending the warning");
    }
};

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-96 p-4 z-[999] border-2 border-gray-300 rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-center">Send Warning Letter</h2>
        <button
        //   onClick={toggleHandleWarning}
          className="text-gray-600 hover:text-red-600 focus:outline-none"
        >
          &times; {/* Cross icon */}
        </button>
      </div>
      <textarea
        className="border rounded-md p-2 w-full h-32 mb-4"
        placeholder="Enter warning message..."
        value={warningMessage}
        onChange={(e) => setWarningMessage(e.target.value)}
      />
      <button
        onClick={handleSendWarning}
        className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 w-full"
      >
        Send Warning
      </button>
    </div>
  );
};

export default WarningMail;
