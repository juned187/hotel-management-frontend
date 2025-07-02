'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Wifi, Car, Coffee, Tv, Bath, Shield, Wind, MapPin, Users, Heart, Utensils, Dumbbell } from 'lucide-react';

const RoomsPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const rooms = [
    {
      id: 1,
      title: "Deluxe Suite",
      description: "Spacious and elegant suite with premium amenities and city views",
      price: "$299",
      originalPrice: "$399",
      size: "45 sqm",
      maxGuests: 2,
      bedType: "King Size Bed",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Free Wi-Fi" },
        { icon: Tv, name: "Smart TV" },
        { icon: Coffee, name: "Mini Bar" },
        { icon: Bath, name: "Marble Bathroom" },
        { icon: Shield, name: "Safe" },
        { icon: Wind, name: "Air Conditioning" }
      ],
      features: [
        "24/7 Room Service",
        "City View",
        "Work Desk",
        "Rain Shower",
        "Premium Linens",
        "Coffee Machine"
      ]
    },
    {
      id: 2,
      title: "Executive Deluxe",
      description: "Enhanced deluxe experience with executive lounge access and premium services",
      price: "$399",
      originalPrice: "$499",
      size: "55 sqm",
      maxGuests: 3,
      bedType: "King Size Bed + Sofa Bed",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Free Wi-Fi" },
        { icon: Tv, name: "Smart TV" },
        { icon: Coffee, name: "Executive Lounge" },
        { icon: Bath, name: "Luxury Bathroom" },
        { icon: Car, name: "Valet Parking" },
        { icon: Wind, name: "Climate Control" }
      ],
      features: [
        "Executive Lounge Access",
        "Panoramic Views",
        "Butler Service",
        "Premium Amenities",
        "Separate Living Area",
        "Complimentary Breakfast"
      ]
    },
    {
      id: 3,
      title: "Presidential Villa",
      description: "Ultimate luxury experience with private amenities and personalized service",
      price: "$799",
      originalPrice: "$999",
      size: "120 sqm",
      maxGuests: 4,
      bedType: "Master Suite + Guest Room",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Premium Wi-Fi" },
        { icon: Tv, name: "Entertainment System" },
        { icon: Coffee, name: "Private Kitchen" },
        { icon: Bath, name: "Spa Bathroom" },
        { icon: Car, name: "Private Garage" },
        { icon: Shield, name: "Security System" }
      ],
      features: [
        "Personal Concierge",
        "Private Terrace",
        "Jacuzzi & Sauna",
        "Chef Service Available",
        "Multiple Bedrooms",
        "VIP Airport Transfer"
      ]
    },
    {
      id: 4,
      title: "Classic Room",
      description: "Comfortable and stylish accommodation perfect for business or leisure travelers",
      price: "$199",
      originalPrice: "$249",
      size: "32 sqm",
      maxGuests: 2,
      bedType: "Queen Size Bed",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Free Wi-Fi" },
        { icon: Tv, name: "LED TV" },
        { icon: Coffee, name: "Tea/Coffee Set" },
        { icon: Bath, name: "Modern Bathroom" },
        { icon: Shield, name: "Safe" },
        { icon: Wind, name: "Air Conditioning" }
      ],
      features: [
        "Daily Housekeeping",
        "Garden View",
        "Work Space",
        "Shower/Tub Combo",
        "Quality Linens",
        "Room Service"
      ]
    },
    {
      id: 5,
      title: "Family Suite",
      description: "Spacious suite designed for families with connecting rooms and kid-friendly amenities",
      price: "$449",
      originalPrice: "$549",
      size: "65 sqm",
      maxGuests: 6,
      bedType: "King Bed + 2 Twin Beds",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Free Wi-Fi" },
        { icon: Tv, name: "Multiple TVs" },
        { icon: Coffee, name: "Kitchenette" },
        { icon: Bath, name: "Dual Bathrooms" },
        { icon: Heart, name: "Kid-Safe Features" },
        { icon: Wind, name: "Climate Control" }
      ],
      features: [
        "Connecting Rooms",
        "Play Area",
        "Microwave & Fridge",
        "Baby Crib Available",
        "Childproofing",
        "Family Concierge"
      ]
    },
    {
      id: 6,
      title: "Penthouse Suite",
      description: "Exclusive top-floor accommodation with panoramic views and luxury appointments",
      price: "$1299",
      originalPrice: "$1599",
      size: "180 sqm",
      maxGuests: 6,
      bedType: "2 Master Suites + Living Room",
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        { icon: Wifi, name: "Ultra-Fast Wi-Fi" },
        { icon: Tv, name: "Home Theater" },
        { icon: Utensils, name: "Full Kitchen" },
        { icon: Bath, name: "Master Spa Bath" },
        { icon: Car, name: "Helicopter Pad Access" },
        { icon: Dumbbell, name: "Private Gym" }
      ],
      features: [
        "360° City Views",
        "Private Elevator",
        "Rooftop Terrace",
        "Wine Cellar",
        "Personal Butler",
        "Limousine Service"
      ]
    }
  ];

  const openRoomDetails = (room) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to login page
      router.push('/login');
      return;
    }
    // If logged in, show room details
    setSelectedRoom(room);
  };

  const closeRoomDetails = () => {
    setSelectedRoom(null);
  };

  const handleBookNow = (room) => {
    try {
      // Close the modal first
      closeRoomDetails();
      
      // Construct query parameters
      const queryParams = new URLSearchParams({
        roomId: room.id,
        title: room.title,
        price: room.price.replace('$', '')
      }).toString();
      
      // Navigate to booking page with room details
      router.push(`/booking?${queryParams}`);
    } catch (error) {
      console.error('Error navigating to booking page:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Rooms & Suites
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience luxury and comfort in our carefully designed accommodations, from classic rooms to exclusive penthouses
          </p>
          {!isLoggedIn && (
            <p className="text-sm text-blue-600 mt-2">
              Please login to view room details and make bookings
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {room.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {room.description}
                </p>
                
                {/* Price and Size */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {room.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {room.originalPrice}
                    </span>
                  </div>
                  
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {room.size}
                  </div>
                </div>
                
                {/* View Details Button */}
                <button 
                  onClick={() => openRoomDetails(room)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <button
                onClick={closeRoomDetails}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              
              {/* Room Image Gallery */}
              <div className="h-96 relative overflow-hidden rounded-t-2xl">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Room Title and Basic Info */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    {selectedRoom.title}
                  </h2>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {selectedRoom.price}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {selectedRoom.originalPrice}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">
                  {selectedRoom.description}
                </p>

                {/* Room Specs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{selectedRoom.size}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Up to {selectedRoom.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">{selectedRoom.bedType}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <amenity.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRoom.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleBookNow(selectedRoom)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Book Now
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;