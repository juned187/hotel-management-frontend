'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch user info, bookings, and payments in one call
        const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error('Failed to fetch user details');
        setUser(data.user);
        setBookings(data.bookings || []);
        setPayments(data.payments || []);
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <div className="bg-white rounded shadow p-4 mb-8">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>ID:</b> {user._id}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Bookings</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Check In</th>
              <th className="px-4 py-2">Check Out</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td className="border px-4 py-2">{b.roomId?.title || b.roomId}</td>
                <td className="border px-4 py-2">{new Date(b.checkIn).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(b.checkOut).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{b.status}</td>
                <td className="border px-4 py-2">${b.totalAmount}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={5} className="text-center py-4">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-semibold mb-2">Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td className="border px-4 py-2">${p.amount}</td>
                <td className="border px-4 py-2">{p.method}</td>
                <td className="border px-4 py-2">{p.status}</td>
                <td className="border px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={4} className="text-center py-4">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetailsPage;     