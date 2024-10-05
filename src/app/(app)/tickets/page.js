'use client';
import Loader from '@/components/Loader';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

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

  // Loading state
  if (loading) {
    return <div className="min-h-screen w-full flex justify-center items-center">
      <Loader/>
    </div>;
  }

  // Error state
  if (error) {
    return <div className="text-red-500 min-h-screen w-full flex justify-center items-center">Error: {error}</div>;
  }

  // Render tickets
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Ticket Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets?.length ? tickets.map(ticket => (
          <div key={ticket._id} className="bg-orange-100 shadow-lg rounded-lg p-4 md:p-6 lg:p-8 cursor-pointer hover:shadow-2xl">
            <p className="text-2xl font-semibold flex items-center mb-4 gap-2">
              <FaUser   className="mr-2 text-orange-400" /> 
              <Link href={ticket.user ? `/employee/${ticket.user._id}` : "#"}>
                {ticket?.user?.name}
              </Link>
              <span className='text-base p-1 bg-orange-400'>{ticket?.user?.employee_id}</span>
            </p>
            <h2 className="text-xl font-medium mb-2 text-blue-600">{ticket.message}</h2>
            <p className="text-gray-100 text-sm bg-gray-400 p-2 rounded-lg">
              <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
            </p>
        </div>
        )): 
        <div className='text-center text-xl'>
          No Ticket
        </div>
        }
      </div>
    </div>
  );
};

export default Tickets;
