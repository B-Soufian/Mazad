import React, { useState, useEffect } from 'react';
import { ticketApi } from '../../../../api/ticketApi';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketApi.getMyTickets();
      setTickets(data.data || data);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setCreating(true);
    try {
      await ticketApi.createTicket({ subject, message });
      setSubject(''); setMessage('');
      await fetchTickets();
    } catch (err) {
      console.error('Create ticket failed', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="pt-4 text-gray-500 animate-pulse">Loading tickets...</div>;

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Support Tickets</h2>
          <p className="text-[#64748b] text-[15px]">Create a ticket or view responses from our support team.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="mb-6">
        <div className="grid grid-cols-1 gap-3">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full p-3 border rounded-lg" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue" className="w-full p-3 border rounded-lg h-28" />
          <div className="text-right">
            <button type="submit" disabled={creating} className="bg-[#d71939] text-white px-4 py-2 rounded-lg font-bold">{creating ? 'Creating...' : 'Create Ticket'}</button>
          </div>
        </div>
      </form>

      {tickets.length === 0 ? (
        <div className="text-center py-12 border-t border-gray-100">
          <p className="text-gray-500">You have no tickets yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg">{ticket.subject}</div>
                  <div className="text-sm text-gray-500">{new Date(ticket.created_at).toLocaleString()}</div>
                </div>
                <div className="text-sm font-bold uppercase text-[#64748b]">{ticket.status}</div>
              </div>

              <div className="mt-3 text-gray-700 whitespace-pre-wrap">{ticket.message}</div>

              {ticket.admin_reply && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <div className="text-sm font-semibold text-gray-700">Response:</div>
                  <div className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{ticket.admin_reply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;
