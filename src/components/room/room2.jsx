'use client';
import React, { useState, useEffect } from 'react';
import { X, Wifi, Car, Coffee, Tv, Bath, Shield, Wind, MapPin, Users, Snowflake, Wine, Bell, Lock, Sun, User, Sofa, Utensils, Briefcase, Monitor } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RoomsPage2 = () => {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const rooms = [
    {
      id: 1,
      title: "Deluxe Ocean View Suite",
      description: "Experience luxury with our spacious ocean view suite featuring a private balcony, king-size bed, and premium amenities.",
      price: "$299",
      originalPrice: "$399",
      size: "65 m²",
      maxGuests: 2,
      bedType: "King Size",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
      amenities: [
        { name: "Free WiFi", icon: Wifi },
        { name: "Air Conditioning", icon: Snowflake },
        { name: "Mini Bar", icon: Wine },
        { name: "Room Service", icon: Bell },
        { name: "Safe", icon: Lock },
        { name: "TV", icon: Tv }
      ],
      features: [
        "Private Balcony",
        "Ocean View",
        "Premium Toiletries",
        "Coffee Maker",
        "Work Desk",
        "Iron & Board"
      ]
    },
    {
      id: 2,
      title: "Executive Business Suite",
      description: "Perfect for business travelers, featuring a dedicated workspace, high-speed internet, and premium business amenities.",
      price: "$249",
      originalPrice: "$329",
      size: "55 m²",
      maxGuests: 2,
      bedType: "Queen Size",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop",
      amenities: [
        { name: "High-Speed WiFi", icon: Wifi },
        { name: "Business Center", icon: Briefcase },
        { name: "Coffee Maker", icon: Coffee },
        { name: "Work Desk", icon: Monitor },
        { name: "Safe", icon: Lock },
        { name: "TV", icon: Tv }
      ],
      features: [
        "City View",
        "Business Services",
        "Express Check-in",
        "Premium Toiletries",
        "Mini Bar",
        "Room Service"
      ]
    },
    {
      id: 3,
      title: "Family Suite",
      description: "Spacious family suite with separate living area, perfect for families seeking comfort and convenience.",
      price: "$399",
      originalPrice: "$499",
      size: "85 m²",
      maxGuests: 4,
      bedType: "2 Queen Size",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
      amenities: [
        { name: "Free WiFi", icon: Wifi },
        { name: "Kitchenette", icon: Utensils },
        { name: "Sofa Bed", icon: Sofa },
        { name: "TV", icon: Tv },
        { name: "Safe", icon: Lock },
        { name: "Air Conditioning", icon: Snowflake }
      ],
      features: [
        "Separate Living Area",
        "Kitchenette",
        "Family-friendly",
        "Extra Space",
        "City View",
        "Room Service"
      ]
    },
    {
      id: 4,
      title: "Presidential Suite",
      description: "Our most luxurious suite featuring panoramic views, private terrace, and exclusive amenities for the ultimate luxury experience.",
      price: "$599",
      originalPrice: "$799",
      size: "120 m²",
      maxGuests: 4,
      bedType: "King Size + Sofa Bed",
      image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2074&auto=format&fit=crop",
      amenities: [
        { name: "Private Terrace", icon: Sun },
        { name: "Butler Service", icon: User },
        { name: "Jacuzzi", icon: Bath },
        { name: "Mini Bar", icon: Wine },
        { name: "Safe", icon: Lock },
        { name: "TV", icon: Tv }
      ],
      features: [
        "Panoramic Views",
        "Private Terrace",
        "Butler Service",
        "Premium Toiletries",
        "Jacuzzi",
        "Room Service"
      ]
    },
    {
      id: 5,
      title: "Garden View Room",
      description: "Peaceful room overlooking our beautiful gardens, perfect for a relaxing stay with nature views.",
      price: "$199",
      originalPrice: "$249",
      size: "45 m²",
      maxGuests: 2,
      bedType: "Queen Size",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
      amenities: [
        { name: "Free WiFi", icon: Wifi },
        { name: "Air Conditioning", icon: Snowflake },
        { name: "Mini Bar", icon: Wine },
        { name: "Room Service", icon: Bell },
        { name: "Safe", icon: Lock },
        { name: "TV", icon: Tv }
      ],
      features: [
        "Garden View",
        "Premium Toiletries",
        "Coffee Maker",
        "Work Desk",
        "Iron & Board",
        "Room Service"
      ]
    },
    {
      id: 6,
      title: "Honeymoon Suite",
      description: "Romantic suite with special amenities for newlyweds, featuring a king-size bed and premium services.",
      price: "$349",
      originalPrice: "$449",
      size: "60 m²",
      maxGuests: 2,
      bedType: "King Size",
      image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
      amenities: [
        { name: "Free WiFi", icon: Wifi },
        { name: "Air Conditioning", icon: Snowflake },
        { name: "Mini Bar", icon: Wine },
        { name: "Room Service", icon: Bell },
        { name: "Safe", icon: Lock },
        { name: "TV", icon: Tv }
      ],
      features: [
        "Romantic Decor",
        "Premium Toiletries",
        "Coffee Maker",
        "Work Desk",
        "Iron & Board",
        "Room Service"
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

export default RoomsPage2;