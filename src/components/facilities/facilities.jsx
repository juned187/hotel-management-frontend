

'use client';
import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Car, 
  Utensils, 
  Dumbbell, 
  Waves, 
  Coffee, 
  Shield, 
  Users, 
  Baby, 
  Briefcase, 
  Sparkles, 
  Clock,
  Star
} from 'lucide-react';

const Services = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      id: 1,
      title: 'Luxury Suites & Rooms',
      description: 'Elegantly appointed rooms with premium amenities, stunning views, and personalized service that exceeds expectations.',
      icon: Shield,
      category: 'accommodation',
      features: ['24/7 Room Service', 'Premium Bedding', 'City/Ocean Views', 'Climate Control'],
      color: 'from-blue-500 to-purple-600',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Fine Dining Restaurant',
      description: 'Award-winning cuisine crafted by renowned chefs using locally sourced ingredients and innovative techniques.',
      icon: Utensils,
      category: 'dining',
      features: ['Michelin-Star Chef', 'Wine Pairing', 'Private Dining', 'Seasonal Menu'],
      color: 'from-orange-500 to-red-600',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Infinity Pool & Spa',
      description: 'Rejuvenate in our world-class spa with therapeutic treatments, infinity pool, and holistic wellness programs.',
      icon: Waves,
      category: 'wellness',
      features: ['Infinity Pool', 'Massage Therapy', 'Yoga Classes', 'Meditation Garden'],
      color: 'from-teal-500 to-cyan-600',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'State-of-the-Art Fitness',
      description: 'Modern fitness center with personal trainers, cutting-edge equipment, and comprehensive wellness programs.',
      icon: Dumbbell,
      category: 'wellness',
      features: ['Personal Training', '24/7 Access', 'Group Classes', 'Recovery Zone'],
      color: 'from-green-500 to-emerald-600',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Valet & Concierge',
      description: 'Premium valet parking and concierge services providing seamless assistance for all your travel needs.',
      icon: Car,
      category: 'services',
      features: ['Valet Parking', 'Airport Transfer', 'Tour Booking', 'Restaurant Reservations'],
      color: 'from-indigo-500 to-blue-600',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      title: 'Business Center',
      description: 'Fully equipped business facilities and meeting rooms designed for productivity and professional excellence.',
      icon: Briefcase,
      category: 'business',
      features: ['Meeting Rooms', 'Video Conferencing', 'Printing Services', 'High-Speed WiFi'],
      color: 'from-gray-600 to-gray-800',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 7,
      title: 'Coffee Lounge',
      description: 'Artisan coffee bar with specialty drinks, fresh pastries, and a welcoming atmosphere for relaxation.',
      icon: Coffee,
      category: 'dining',
      features: ['Artisan Coffee', 'Fresh Pastries', 'WiFi Lounge', 'Outdoor Seating'],
      color: 'from-amber-500 to-yellow-600',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 8,
      title: 'Kids Club',
      description: 'Safe and fun environment for children with supervised activities, educational programs, and creative play.',
      icon: Baby,
      category: 'family',
      features: ['Supervised Care', 'Educational Games', 'Arts & Crafts', 'Outdoor Play'],
      color: 'from-pink-500 to-rose-600',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 9,
      title: 'High-Speed WiFi',
      description: 'Complimentary enterprise-grade internet access throughout the property with dedicated tech support.',
      icon: Wifi,
      category: 'services',
      features: ['High-Speed Internet', 'Business Grade', 'Secure Connection', 'Tech Support'],
      color: 'from-violet-500 to-purple-600',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 10,
      title: 'Event Planning',
      description: 'Professional event coordination for weddings, conferences, and celebrations with meticulous attention to detail.',
      icon: Users,
      category: 'business',
      features: ['Wedding Planning', 'Corporate Events', 'Catering Service', 'A/V Equipment'],
      color: 'from-fuchsia-500 to-pink-600',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 11,
      title: 'Housekeeping',
      description: 'Daily housekeeping service with meticulous attention to detail and premium amenities for ultimate comfort.',
      icon: Sparkles,
      category: 'services',
      features: ['Daily Service', 'Turndown Service', 'Laundry & Dry Cleaning', 'Premium Toiletries'],
      color: 'from-emerald-500 to-teal-600',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 12,
      title: '24/7 Front Desk',
      description: 'Round-the-clock assistance and support with multilingual staff and local expertise for exceptional service.',
      icon: Clock,
      category: 'services',
      features: ['24/7 Availability', 'Multilingual Staff', 'Local Expertise', 'Emergency Support'],
      color: 'from-slate-500 to-gray-600',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'accommodation', name: 'Accommodation', count: services.filter(s => s.category === 'accommodation').length },
    { id: 'dining', name: 'Dining', count: services.filter(s => s.category === 'dining').length },
    { id: 'wellness', name: 'Wellness', count: services.filter(s => s.category === 'wellness').length },
    { id: 'services', name: 'Services', count: services.filter(s => s.category === 'services').length },
    { id: 'business', name: 'Business', count: services.filter(s => s.category === 'business').length },
    { id: 'family', name: 'Family', count: services.filter(s => s.category === 'family').length }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = activeFilter === 'all' || service.category === activeFilter;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 py-20 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 leading-tight">
            Premium Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Experience luxury and comfort with our comprehensive range of world-class services 
            designed to exceed your expectations.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  {/* Service Image */}
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Gradient fallback */}
                  <div className={`w-full h-full bg-gradient-to-br ${service.color} opacity-80 hidden items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-white opacity-50" />
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{service.rating}</span>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon - smaller since we have image now */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-xs text-gray-500 mt-2 ml-5">
                        +{service.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;