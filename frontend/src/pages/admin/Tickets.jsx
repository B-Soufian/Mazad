import React, { useEffect, useState } from 'react';
import { ticketApi } from '../../api/ticketApi';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyValues, setReplyValues] = useState({});

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await ticketApi.adminGetTickets();
      setTickets(data.data || data);
    } catch (err) {
      console.error('Failed to fetch admin tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleReplyChange = (id, value) => {
    setReplyValues(v => ({ ...v, [id]: value }));
  };

  const handleReply = async (id) => {
    const reply = replyValues[id];
    if (!reply) return;
    try {
      await ticketApi.adminReply(id, reply);
      await fetch();
    } catch (err) {
      console.error('Reply failed', err);
    }
  };

  const handleClose = async (id) => {
    try {
      await ticketApi.adminClose(id);
      await fetch();
    } catch (err) {
      console.error('Close failed', err);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading tickets...</div>;

  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
      {tickets.length === 0 ? (
        <div className="text-gray-500">No tickets found.</div>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => (
            <div key={t.id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <div className="font-bold">{t.subject}</div>
                  <div className="text-sm text-gray-500">From: {t.user?.display_name || t.user?.email || 'User #' + t.user_id}</div>
                </div>
                <div className="text-sm font-bold uppercase">{t.status}</div>
              </div>

              <div className="mt-2 text-gray-700 whitespace-pre-wrap">{t.message}</div>

              <div className="mt-3">
                <textarea
                  value={replyValues[t.id] || ''}
                  onChange={(e) => handleReplyChange(t.id, e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Type your reply here"
                />

                <div className="flex gap-2">
                  <button onClick={() => handleReply(t.id)} className="bg-[#d71939] text-white px-4 py-2 rounded">Reply</button>
                  <button onClick={() => handleClose(t.id)} className="bg-gray-100 px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
