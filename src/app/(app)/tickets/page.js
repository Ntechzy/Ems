'use client';
import Loader from '@/components/Loader';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaUser, FaTrashAlt } from 'react-icons/fa';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets from the backend API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/resources/ticket');
        if (response.data.status) {
          setTickets(response.data.data);  
        } else {
          setError('Failed to fetch tickets');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Function to delete a ticket
  const handleDelete = async (ticketId) => {
    if (confirm("Are you sure you want to delete this ticket?")) {
      try {
        const response = await axios.delete(`/api/resources/ticket/?ticketId=${ticketId}`);
        if (response.data.status) {
          setTickets(tickets.filter(ticket => ticket._id !== ticketId));
          alert("Ticket deleted successfully");
        } else {
          alert('Failed to delete ticket');
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 min-h-screen w-full flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  // Render tickets 
  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Ticket Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets?.length ? tickets.map(ticket => (
          <div key={ticket._id} className="bg-gray-200 shadow-md rounded-lg p-4 md:p-6 lg:p-8 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => handleDelete(ticket._id)}
            >
              <FaTrashAlt />
            </button>
            <p className="text-lg font-medium flex items-center mb-2 gap-2 text-gray-800">
              <FaUser className="mr-2 text-gray-600" /> 
              <Link href={ticket.user ? `/employee/${ticket.user._id}` : "#"} className="text-gray-800 hover:underline">
                {ticket?.user?.name}
              </Link>
            </p>
            <p className="text-sm text-gray-500 p-1 rounded mb-2">
              {ticket?.user?.employee_id}
            </p> 
            <h2 className="text-lg font-normal mb-2 text-gray-700 bg-gray-300 p-1 rounded">{ticket.message}</h2>
            <p className="text-gray-500 text-xs bg-gray-200 p-1 rounded-lg mt-4 text-right">
              <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        )) : 
        <div className="text-center text-xl text-gray-600">
          No Tickets Available
        </div>
        }
      </div>
    </div>
  );
};

export default Tickets;
