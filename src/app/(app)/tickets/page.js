'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
          console.log(response.data.data);
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
    return <div className="text-center">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  // Render tickets
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Ticket Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-white shadow-lg rounded-lg p-4">
          <h1 className="text-xl font-bold">{ticket.name}</h1>
            <h2 className="text-xl font-semibold">{ticket.message}</h2>
            <p className="text-gray-600">
              <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tickets;
