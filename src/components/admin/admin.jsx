'use client';
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bed, 
  Calendar, 
  Users, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';

const LuxStayAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Real data states
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalBookings: 0,
    revenue: 0,
    checkIns: 0,
    checkOuts: 0,
    totalUsers: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds for real-time updates
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/admin/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch notifications:', errorData.error);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  // Fetch data from API with better error handling
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setDashboardStats({
          totalRooms: statsData.stats.totalRooms || 0,
          occupiedRooms: statsData.stats.checkedInBookings || 0,
          totalBookings: statsData.stats.totalBookings || 0,
          revenue: statsData.stats.totalRevenue || 0,
          checkIns: statsData.stats.checkedInBookings || 0,
          checkOuts: statsData.stats.checkedOutBookings || 0,
          totalUsers: statsData.stats.totalUsers || 0,
          pendingBookings: statsData.stats.pendingBookings || 0
        });
        setRecentBookings(statsData.recentBookings || []);
      } else {
        throw new Error('Failed to fetch dashboard stats');
      }

      // Fetch rooms
      const roomsResponse = await fetch('http://localhost:5000/api/admin/rooms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setRooms(roomsData.rooms || []);
      } else {
        throw new Error('Failed to fetch rooms');
      }

      // Fetch bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      } else {
        throw new Error('Failed to fetch bookings');
      }

      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      } else {
        throw new Error('Failed to fetch users');
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Auto refresh functionality
  useEffect(() => {
    fetchData();
    fetchNotifications();
    
    let interval;
    if (autoRefresh && !showAddModal && !showSettings) {
      interval = setInterval(() => {
        console.log(`Auto-refreshing data every ${refreshInterval/1000} seconds...`);
        fetchData();
        fetchNotifications();
      }, refreshInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, showAddModal, showSettings]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Refresh data when tab changes
  useEffect(() => {
    if (!showAddModal && !showSettings) {
      fetchData();
    }
  }, [activeTab]);

  // Manual refresh function
  const handleRefresh = () => {
    fetchData();
    fetchNotifications();
  };

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Update UI immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Call backend API to mark as read
      const response = await fetch(`http://localhost:5000/api/admin/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // Get unread notification count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Handle delete
  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      switch (type) {
        case 'room':
          endpoint = `http://localhost:5000/api/admin/rooms/${id}`;
          break;
        case 'booking':
          endpoint = `http://localhost:5000/api/admin/bookings/${id}`;
          break;
        case 'user':
          endpoint = `http://localhost:5000/api/admin/users/${id}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Item deleted successfully');
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to delete item: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting item');
    }
  };

  // Handle edit
  const handleEdit = (type, item) => {
    setSelectedItem(item);
    setShowAddModal(type);
  };

  // Handle save (add/edit)
  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let method = 'POST';

      let dataToSend = formData;
      if (showAddModal === 'room') {
        dataToSend = {
          title: formData.name || formData.title,
          type: formData.bedType || formData.type,
          price: Number(formData.price),
          description: formData.description,
          status: formData.status || 'Available'
        };
      }

      if (selectedItem) {
        // Edit mode
        if (showAddModal === 'user') {
          endpoint = `http://localhost:5000/api/admin/users/${selectedItem._id}`;
        } else {
          endpoint = `http://localhost:5000/api/admin/rooms/${selectedItem._id}`;
        }
        method = 'PUT';
      } else {
        // Add mode
        if (showAddModal === 'user') {
          endpoint = 'http://localhost:5000/api/admin/users';
        } else {
          endpoint = 'http://localhost:5000/api/admin/rooms';
        }
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        alert(selectedItem ? 'Item updated successfully' : 'Item added successfully');
        setShowAddModal(false);
        setSelectedItem(null);
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to save item: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error.message);
      alert(`Error saving item: ${error.message}`);
    }
  };

  // Handle booking status update
  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Booking status updated successfully');
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        alert(`Failed to update booking status: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Error updating booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': case 'checked in': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'reserved': case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'off duty': return 'bg-gray-100 text-gray-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add Modal Component
  const AddModal = ({ type, onClose, onSave }) => {
    const [formData, setFormData] = useState(selectedItem || {});

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate required fields for room
      if (type === 'room') {
        if (!formData.name || !formData.bedType || !formData.price || !formData.description) {
          alert('Please fill all required fields');
          return;
        }
        if (isNaN(formData.price) || formData.price <= 0) {
          alert('Please enter a valid price');
          return;
        }
      }
      
      // Only save when form is explicitly submitted
      onSave(formData);
    };

    const getFormFields = () => {
      switch (type) {
        case 'room':
          return (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deluxe Room"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.bedType || ''}
                    onChange={(e) => setFormData({...formData, bedType: e.target.value})}
                    required
                  >
                    <option value="">Select Bed Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Queen">Queen</option>
                    <option value="King">King</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="199"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Room description..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
            </>
          );
        case 'user':
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              {!selectedItem && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!selectedItem}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          );
        default:
          return <div>Form not implemented for this type</div>;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {selectedItem ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {getFormFields()}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {selectedItem ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Settings Modal Component
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Dashboard Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Auto Refresh Data</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">Automatically refresh dashboard data</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={!autoRefresh}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value={5000}>5 seconds (Real-time)</option>
              <option value={10000}>10 seconds</option>
              <option value={15000}>15 seconds</option>
              <option value={30000}>30 seconds</option>
              <option value={60000}>1 minute</option>
              <option value={300000}>5 minutes</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">System Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Backend Status:</span>
                <span className={error ? 'text-red-600' : 'text-green-600'}>
                  {error ? 'Disconnected' : 'Connected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{lastRefresh.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Data Points:</span>
                <span>{rooms.length + bookings.length + users.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => setShowSettings(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={() => {
              handleRefresh();
              setShowSettings(false);
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Refresh Now
          </button>
        </div>
      </div>
    </div>
  );

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">LuxStay Admin</h1>
        <p className="text-gray-600">Hotel Management System</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: Home },
            { id: 'rooms', name: 'Rooms', icon: Bed },
            { id: 'bookings', name: 'Bookings', icon: Calendar },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'guests', name: 'Guests', icon: Users },
            { id: 'staff', name: 'Staff', icon: UserCheck }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          {autoRefresh && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Live</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded text-sm">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            title="Refresh Data"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="relative notification-dropdown">
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-gray-400 hover:text-gray-600 relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount()}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.time).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('userId');
              localStorage.removeItem('userRole');
              window.location.href = '/login';
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalRooms}</p>
              <p className="text-xs text-gray-500 mt-1">Available: {dashboardStats.totalRooms - dashboardStats.occupiedRooms}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bed className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalBookings}</p>
              <p className="text-xs text-gray-500 mt-1">Pending: {dashboardStats.pendingBookings}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardStats.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">From all bookings</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-ins Today</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.checkIns}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Check-outs Today</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.checkOuts}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {dashboardStats.totalRooms > 0 
                  ? Math.round((dashboardStats.occupiedRooms / dashboardStats.totalRooms) * 100) 
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{booking.roomTitle}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">${booking.totalAmount}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setSelectedItem(null);
                setShowAddModal('room');
              }}
              className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Room
            </button>
            <button 
              onClick={() => {
                setSelectedItem(null);
                setShowAddModal('user');
              }}
              className="w-full p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Add New User
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View All Bookings
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className="w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Rooms Tab Component
  const RoomsTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setShowAddModal('room');
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading rooms...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms
                .filter(room => 
                  room.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (statusFilter === 'all' || room.status?.toLowerCase() === statusFilter)
                )
                .map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{room.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${room.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status || 'Available'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit('room', room)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete('room', room._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Bookings Tab Component
  const BookingsTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings
                .filter(booking => 
                  `${booking.guestInfo?.firstName} ${booking.guestInfo?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (statusFilter === 'all' || booking.status?.toLowerCase() === statusFilter)
                )
                .map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{booking.guestInfo?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.roomTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => handleBookingStatusUpdate(booking._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(booking.status)}`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${booking.totalAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setSelectedBooking(booking); setShowBookingDetailModal(true); }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete('booking', booking._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Guests Tab Component
  const GuestsTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Room</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings
              .filter(booking => 
                `${booking.guestInfo?.firstName} ${booking.guestInfo?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.guestInfo?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.guestInfo?.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.roomTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Users Tab Component
  const UsersTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setShowAddModal('user');
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users
              .filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit('user', user)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <a
                      href={`/admin/users/${user._id}`}
                      className="text-blue-600 hover:text-blue-900 underline"
                      style={{ display: 'inline-block', marginLeft: '8px' }}
                    >
                      View Details
                    </a>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDelete('user', user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Staff Tab Component
  const StaffTab = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal('staff')}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Administrator</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Full Time</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // BookingDetailModal Component
  const BookingDetailModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        <button
          onClick={() => setShowBookingDetailModal(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
        >×</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Booking Details</h2>
        <div className="space-y-2">
          <div><b>Guest:</b> {selectedBooking.guestInfo?.firstName} {selectedBooking.guestInfo?.lastName}</div>
          <div><b>Email:</b> {selectedBooking.guestInfo?.email}</div>
          <div><b>Phone:</b> {selectedBooking.guestInfo?.phone}</div>
          <div><b>Room:</b> {selectedBooking.roomTitle}</div>
          <div><b>Check-in:</b> {new Date(selectedBooking.checkIn).toLocaleDateString()}</div>
          <div><b>Check-out:</b> {new Date(selectedBooking.checkOut).toLocaleDateString()}</div>
          <div><b>Status:</b> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span></div>
          <div><b>Amount:</b> ${selectedBooking.totalAmount}</div>
          {/* Add more details if needed */}
        </div>
        <div className="flex space-x-3 pt-6">
          <button
            onClick={() => setShowBookingDetailModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
          >Close</button>
          {/* You can add more actions here if needed */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'rooms' && <RoomsTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'guests' && <GuestsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'staff' && <StaffTab />}
        </main>
      </div>

      {showAddModal && (
        <AddModal
          type={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
        />
      )}

      {showSettings && (
        <SettingsModal />
      )}

      {showBookingDetailModal && selectedBooking && (
        <BookingDetailModal />
      )}
    </div>
  );
};

export default LuxStayAdminPanel; 