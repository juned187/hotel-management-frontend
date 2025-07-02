'use client';
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Bed, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  Settings, 
  User, 
  Home, 
  BookOpen, 
  ClipboardList, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  Waves,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const HotelManagementIndex = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dashboardStats = [
    { icon: Bed, label: 'Total Rooms', value: 150, change: '+5%', color: 'bg-blue-500' },
    { icon: Users, label: 'Current Guests', value: 89, change: '+12%', color: 'bg-green-500' },
    { icon: DollarSign, label: 'Revenue Today', value: '$12,450', change: '+8%', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Occupancy Rate', value: '78%', change: '+3%', color: 'bg-orange-500' }
  ];

  const coreFeatures = [
    {
      icon: BookOpen,
      title: 'Reservation Management',
      description: 'Handle bookings, cancellations, and modifications',
      features: ['Online booking integration', 'Room allocation', 'Waitlist management', 'Group reservations']
    },
    {
      icon: Bed,
      title: 'Room Management',
      description: 'Monitor room status and housekeeping',
      features: ['Real-time room status', 'Housekeeping schedules', 'Maintenance tracking', 'Room type management']
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Comprehensive guest profiles and history',
      features: ['Guest profiles', 'Stay history', 'Preferences tracking', 'VIP management']
    },
    {
      icon: CreditCard,
      title: 'Billing & Payment',
      description: 'Complete financial transaction management',
      features: ['Invoice generation', 'Payment processing', 'Expense tracking', 'Tax management']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Business intelligence and performance metrics',
      features: ['Occupancy reports', 'Revenue analytics', 'Guest satisfaction', 'Performance dashboards']
    },
    {
      icon: Settings,
      title: 'System Administration',
      description: 'User management and system configuration',
      features: ['User roles & permissions', 'System settings', 'Backup management', 'Security controls']
    }
  ];

  const extraProvisions = [
    {
      category: 'Guest Services',
      icon: Coffee,
      items: [
        { icon: Utensils, name: 'Restaurant Integration', desc: 'Table reservations and menu management' },
        { icon: Dumbbell, name: 'Spa & Fitness', desc: 'Facility booking and membership tracking' },
        { icon: Car, name: 'Valet Services', desc: 'Parking management and vehicle tracking' },
        { icon: Bell, name: 'Concierge Services', desc: 'Guest requests and local recommendations' }
      ]
    },
    {
      category: 'Technology',
      icon: Wifi,
      items: [
        { icon: Phone, name: 'Communication Hub', desc: 'Internal messaging and notifications' },
        { icon: Shield, name: 'Security Integration', desc: 'Access control and surveillance' },
        { icon: Wifi, name: 'Smart Room Controls', desc: 'IoT integration for room automation' },
        { icon: Star, name: 'Mobile App', desc: 'Guest mobile check-in and services' }
      ]
    },
    {
      category: 'Business Intelligence',
      icon: TrendingUp,
      items: [
        { icon: BarChart3, name: 'Predictive Analytics', desc: 'Demand forecasting and pricing optimization' },
        { icon: Users, name: 'CRM Integration', desc: 'Customer relationship management' },
        { icon: Mail, name: 'Marketing Automation', desc: 'Email campaigns and loyalty programs' },
        { icon: MapPin, name: 'Multi-property Management', desc: 'Chain hotel administration' }
      ]
    }
  ];

  const recentActivities = [
    { icon: CheckCircle, text: 'Room 205 checked out', time: '2 mins ago', type: 'success' },
    { icon: Bell, text: 'New reservation for Suite 301', time: '5 mins ago', type: 'info' },
    { icon: AlertCircle, text: 'Maintenance request for Room 150', time: '12 mins ago', type: 'warning' },
    { icon: Users, text: 'VIP guest arriving at 3 PM', time: '1 hour ago', type: 'info' },
    { icon: XCircle, text: 'Cancellation for Room 120', time: '2 hours ago', type: 'error' }
  ];

  const getActivityColor = (type) => {
    switch(type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">HotelPro Manager</h1>
                <p className="text-gray-600">Complete Hotel Management Solution</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-gray-600">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Core Features */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Management Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedFeature(selectedFeature === index ? null : index)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  {selectedFeature === index && (
                    <div className="border-t pt-4 animate-in slide-in-from-top-2 duration-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activities</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Extra Provisions */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Additional Service Provisions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {extraProvisions.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{category.category}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <item.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'New Booking' },
              { icon: Users, label: 'Check-in Guest' },
              { icon: ClipboardList, label: 'Room Status' },
              { icon: BarChart3, label: 'View Reports' }
            ].map((action, index) => (
              <button 
                key={index}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <action.icon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManagementIndex;