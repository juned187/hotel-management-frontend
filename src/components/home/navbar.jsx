'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Hotel,
  Phone,
  Mail,
  User,
  Home,
  BedDouble,
  ConciergeBell,
  CalendarCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            
            setIsLoggedIn(true);
            setUserName(userData.name);
            setUserEmail(userData.email);
          } else {
            handleLogout();
          }
        } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserEmail('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        handleLogout();
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setIsUserMenuOpen(false);
    
    router.push('/');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Lux Stay Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-800">Lux Stay</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/room" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
              <BedDouble className="h-5 w-5" />
              <span>Rooms</span>
            </Link>
            <Link href="/facilities" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
              <ConciergeBell className="h-5 w-5" />
              <span>Facilities</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
              <Phone className="h-5 w-5" />
              <span>Contact</span>
            </Link>
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-3 space-y-2">
          <Link href="/" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link href="/room" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <BedDouble className="h-5 w-5" />
            Rooms
          </Link>
          <Link href="/facilities" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <ConciergeBell className="h-5 w-5" />
            Facilities
          </Link>
          <Link href="/contact" onClick={toggleMenu} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Phone className="h-5 w-5" />
            Contact
          </Link>
          {isLoggedIn ? (
            <div className="flex flex-col space-y-2 px-3 py-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">
                    {userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userEmail}
                  </span>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              onClick={toggleMenu} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-md"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          )}
          <Link href="/booking" onClick={toggleMenu} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700">
            <CalendarCheck className="h-4 w-4" />
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
