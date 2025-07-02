'use client';
import { useRouter } from 'next/navigation';
import { BedDouble, Users, Wifi, Coffee, Bath, Tv, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Static room data
const rooms = [
  {
    id: '1',
    name: 'Deluxe Suite',
    description: 'Spacious and elegant suite with premium amenities and city views',
    price: 299,
    capacity: 2,
    bedType: 'King Size Bed',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Free Wi-Fi', 'Smart TV', 'Mini Bar', 'Private Bath'],
    size: '45 sqm'
  },
  {
    id: '2',
    name: 'Executive Deluxe',
    description: 'Enhanced deluxe experience with executive lounge access and premium services',
    price: 399,
    capacity: 3,
    bedType: 'King Size Bed + Sofa Bed',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Free Wi-Fi', 'Smart TV', 'Executive Lounge', 'Private Bath'],
    size: '55 sqm'
  },
  {
    id: '3',
    name: 'Presidential Villa',
    description: 'Ultimate luxury experience with private amenities and personalized service',
    price: 799,
    capacity: 4,
    bedType: 'Master Suite + Guest Room',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Premium Wi-Fi', 'Entertainment System', 'Private Kitchen', 'Spa Bathroom'],
    size: '120 sqm'
  },
  {
    id: '4',
    name: 'Classic Room',
    description: 'Comfortable and stylish accommodation perfect for business or leisure travelers',
    price: 199,
    capacity: 2,
    bedType: 'Queen Size Bed',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Free Wi-Fi', 'Smart TV', 'Work Desk', 'Private Bath'],
    size: '32 sqm'
  },
  {
    id: '5',
    name: 'Family Suite',
    description: 'Spacious suite designed for families with connecting rooms and kid-friendly amenities',
    price: 449,
    capacity: 4,
    bedType: '2 Queen Size Beds',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Free Wi-Fi', 'Smart TV', 'Family Lounge', '2 Bathrooms'],
    size: '65 sqm'
  },
  {
    id: '6',
    name: 'Penthouse Suite',
    description: 'Exclusive top-floor accommodation with panoramic views and luxury appointments',
    price: 1299,
    capacity: 4,
    bedType: 'Master Suite + Guest Room',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    amenities: ['Premium Wi-Fi', 'Private Terrace', 'Butler Service', 'Spa Bathroom'],
    size: '180 sqm'
  }
];

export default function Rooms() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleViewDetails = (roomId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    router.push('/room');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rooms & Suites</h2>
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
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${room.price}/night
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <BedDouble className="h-5 w-5 mr-2" />
                    <span>{room.bedType}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Up to {room.capacity} guests</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Wifi className="h-5 w-5 mr-2" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span>{room.size}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Bath className="h-3 w-3 mr-1" />
                      Private Bath
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tv className="h-3 w-3 mr-1" />
                      Smart TV
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(room.id)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}