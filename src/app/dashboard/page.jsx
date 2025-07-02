'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUser(userData);

        // If admin, fetch stats
        if (userData.role === 'admin') {
          const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData.stats);
            setRecentBookings(statsData.recentBookings || []);
          }
        } else {
          // Fetch user bookings
          const bookingsResponse = await fetch('http://localhost:5000/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setBookings(bookingsData.bookings || []);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Navbar */}
      <nav className="bg-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-white">Hotel Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-4 text-white font-medium">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
              >Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Admin Stats */}
        {user?.role === 'admin' && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-6 flex items-center border-t-4 border-blue-600">
                <Users className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.totalUsers}</div>
                  <div className="text-gray-500">Total Users</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center border-t-4 border-blue-600">
                <Calendar className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.totalRooms}</div>
                  <div className="text-gray-500">Total Rooms</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center border-t-4 border-blue-600">
                <Calendar className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.roomsBooked}</div>
                  <div className="text-gray-500">Rooms Booked</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center border-t-4 border-blue-600">
                <Calendar className="w-10 h-10 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.roomsOccupied}</div>
                  <div className="text-gray-500">Rooms Occupied</div>
                </div>
              </div>
            </div>
            {/* Recent Bookings Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-10">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Recent Bookings</h2>
              {recentBookings.length === 0 ? (
                <div className="text-gray-500">No recent bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">Guest</th>
                        <th className="px-4 py-2 text-left">Room</th>
                        <th className="px-4 py-2 text-left">Check In</th>
                        <th className="px-4 py-2 text-left">Check Out</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map(b => (
                        <tr key={b._id}>
                          <td className="border px-4 py-2">{b.userId?.name || 'N/A'}</td>
                          <td className="border px-4 py-2">{b.roomTitle}</td>
                          <td className="border px-4 py-2">{new Date(b.checkIn).toLocaleDateString()}</td>
                          <td className="border px-4 py-2">{new Date(b.checkOut).toLocaleDateString()}</td>
                          <td className={`border px-4 py-2 ${getStatusColor(b.status)}`}>{b.status}</td>
                          <td className="border px-4 py-2">${b.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* User Bookings */}
        {user?.role !== 'admin' && (
          <>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Bookings</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-blue-300 mb-4">
                  <Calendar className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start by exploring our rooms and making a reservation.</p>
                <button
                  onClick={() => router.push('/room')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >Browse Rooms</button>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700">{booking.roomTitle}</h3>
                        <p className="text-sm text-gray-500">Booking Reference: {booking.bookingReference}</p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium">${booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 