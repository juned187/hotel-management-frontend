import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Hotel,
  Clock,
  Wifi,
  Car
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Hotel className="h-8 w-8 text-blue-400" />
              <h3 className="text-xl font-bold">Hotel Management System</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Experience luxury and comfort at our premium hotel with world-class amenities. 
              We provide exceptional hospitality services with modern facilities and personalized care 
              to make your stay memorable.
            </p>
            <div className="flex space-x-4">
              <Facebook 
                size={24} 
                className="hover:text-blue-400 cursor-pointer transition-colors duration-300" 
              />
              <Twitter 
                size={24} 
                className="hover:text-blue-400 cursor-pointer transition-colors duration-300" 
              />
              <Instagram 
                size={24} 
                className="hover:text-blue-400 cursor-pointer transition-colors duration-300" 
              />
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-blue-400" />
                <span className="text-gray-300">info@hotelmanagement.com</span>
              </div>
              <div className="flex items-start">
                <MapPin size={16} className="mr-3 mt-1 text-blue-400" />
                <span className="text-gray-300">
                  123 Luxury Avenue<br />
                  Downtown City, DC 12345
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-3 text-blue-400" />
                <span className="text-gray-300">24/7 Reception</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
            <div className="space-y-2">
              <Link 
                href="/rooms" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Rooms & Suites
              </Link>
              <Link 
                href="/facilities" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Facilities
              </Link>
              <Link 
                href="/booking" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Online Booking
              </Link>
              <Link 
                href="/about" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Contact Us
              </Link>
              <Link 
                href="/gallery" 
                className="block text-gray-300 hover:text-blue-400 transition-colors duration-300"
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <h4 className="text-lg font-semibold mb-4 text-blue-400">Our Services</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Wifi size={16} className="mr-2 text-blue-400" />
              <span className="text-gray-300">Free WiFi</span>
            </div>
            <div className="flex items-center">
              <Car size={16} className="mr-2 text-blue-400" />
              <span className="text-gray-300">Free Parking</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-blue-400" />
              <span className="text-gray-300">Room Service</span>
            </div>
            <div className="flex items-center">
              <Hotel size={16} className="mr-2 text-blue-400" />
              <span className="text-gray-300">Concierge</span>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Hotel Management System. All rights reserved. | 
            <Link href="/privacy" className="hover:text-blue-400 ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-blue-400 ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}