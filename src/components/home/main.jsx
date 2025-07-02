'use client';
import React, { useState } from 'react';
import { Calendar, Users, MapPin, Star, Phone, Mail, Clock, Wifi, Car, Coffee, Utensils, Dumbbell, Search, Menu, X } from 'lucide-react';

export default function HotelHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

  const handleBooking = (e) => {
    e.preventDefault();
    alert('Booking functionality would be implemented here!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LuxStay</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Rooms</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <a href="#" className="block py-2 text-gray-700">Home</a>
              <a href="#" className="block py-2 text-gray-700">Rooms</a>
              <a href="#" className="block py-2 text-gray-700">Services</a>
              <a href="#" className="block py-2 text-gray-700">About</a>
              <a href="#" className="block py-2 text-gray-700">Contact</a>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2">
                Book Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">LuxStay</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience luxury and comfort like never before. Your perfect getaway awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Explore Rooms
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="bg-white shadow-xl rounded-xl mx-4 md:mx-8 -mt-20 relative z-20 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Check-in</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Check-out</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Guests</span>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Rooms</span>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleBooking}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search Rooms
          </button>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Featured Rooms</h3>
            <p className="text-xl text-gray-600">Discover our most popular accommodations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Deluxe Suite', price: '$299', image: 'bg-gradient-to-br from-blue-400 to-purple-500', features: ['Ocean View', 'King Bed', 'Balcony'] },
              { name: 'Executive Room', price: '$199', image: 'bg-gradient-to-br from-green-400 to-blue-500', features: ['City View', 'Queen Bed', 'Work Desk'] },
              { name: 'Presidential Suite', price: '$499', image: 'bg-gradient-to-br from-purple-400 to-pink-500', features: ['Penthouse', 'Master Suite', 'Private Terrace'] }
            ].map((room, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className={`h-48 ${room.image} flex items-center justify-center`}>
                  <span className="text-white text-xl font-semibold">Room Image</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h4>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <ul className="text-gray-600 mb-4">
                    {room.features.map((feature, i) => (
                      <li key={i} className="flex items-center mb-1">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{room.price}<span className="text-sm text-gray-500">/night</span></span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">World-Class Amenities</h3>
            <p className="text-xl text-gray-600">Everything you need for a perfect stay</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Wifi, name: 'Free WiFi', desc: 'High-speed internet' },
              { icon: Car, name: 'Parking', desc: 'Free valet parking' },
              { icon: Coffee, name: 'Room Service', desc: '24/7 availability' },
              { icon: Utensils, name: 'Restaurant', desc: 'Fine dining experience' },
              { icon: Dumbbell, name: 'Fitness Center', desc: 'Modern equipment' },
              { icon: Clock, name: '24/7 Concierge', desc: 'Personal assistance' },
              { icon: MapPin, name: 'Prime Location', desc: 'City center access' },
              { icon: Star, name: 'Luxury Spa', desc: 'Relaxation services' }
            ].map((amenity, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <amenity.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{amenity.name}</h4>
                <p className="text-gray-600">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h3>
            <p className="text-xl text-gray-600">Real experiences from real guests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', rating: 5, comment: 'Absolutely amazing experience! The staff was incredibly friendly and the room was spotless.' },
              { name: 'Mike Chen', rating: 5, comment: 'Perfect location and fantastic amenities. Will definitely be staying here again on my next visit.' },
              { name: 'Emma Wilson', rating: 5, comment: 'The attention to detail is remarkable. Every aspect of our stay exceeded our expectations.' }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                <p className="font-semibold text-gray-900">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <h4 className="text-xl font-bold">LuxStay</h4>
              </div>
              <p className="text-gray-400">Experience luxury hospitality at its finest. Your comfort is our priority.</p>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rooms & Suites</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Amenities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Restaurant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spa & Wellness</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conference Rooms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Event Planning</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>info@luxstay.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>123 Luxury Ave, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LuxStay Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}