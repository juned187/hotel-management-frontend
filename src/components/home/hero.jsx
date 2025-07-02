'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, Star, MapPin, Calendar, Users, Wifi, Car, Coffee, Utensils, Dumbbell, Waves, ArrowLeft, Check, Heart, Share2, X, ChevronLeft, ChevronRight, Camera, Image, Play } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of 3 different hotel background images
  const backgroundImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  // Sample gallery images
  const categories = [
    { id: 'all', name: 'All Photos', icon: Image },
    { id: 'rooms', name: 'Rooms & Suites', icon: Camera },
    { id: 'dining', name: 'Dining', icon: Utensils },
    { id: 'facilities', name: 'Facilities', icon: Dumbbell },
    { id: 'exterior', name: 'Hotel & Views', icon: Star },
    { id: 'virtual', name: 'Virtual Tours', icon: Play }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-slide functionality
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [backgroundImages.length]);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const nextImage = () => {
    const filteredImages = activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    const filteredImages = activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);
    setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const getFilteredImages = () => {
    return activeCategory === 'all' ? galleryImages : galleryImages.filter(img => img.category === activeCategory);
  };

  const HomePage = () => {
    return (
      <>
        <section className="relative h-screen overflow-hidden">
          {/* Sliding Background Images */}
          <div className="absolute inset-0">
            <div 
              className="flex h-full transition-transform duration-1000 ease-in-out"
              style={{
                width: `${backgroundImages.length * 100}%`,
                transform: `translateX(-${currentSlide * (100 / backgroundImages.length)}%)`
              }}
            >
              {backgroundImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full bg-cover bg-center bg-no-repeat flex-shrink-0"
                  style={{
                    backgroundImage: `url(${image})`,
                    width: `${100 / backgroundImages.length}%`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-white scale-125 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4 max-w-6xl mx-auto">
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-2xl">
                  Welcome to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
                    LuxStay
                  </span>
                </h1>
              </div>
              
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-xl md:text-2xl lg:text-3xl mb-4 max-w-4xl mx-auto font-light drop-shadow-lg">
                  Experience luxury and comfort like never before
                </p>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90 drop-shadow-lg">
                  Your perfect getaway awaits in our world-class accommodations
                </p>
              </div>

              <div className={`transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="mt-12 bg-white/20 backdrop-blur-md rounded-2xl p-6 max-w-4xl mx-auto border border-white/30 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs opacity-80">Check-in</p>
                        <input 
                          type="date" 
                          value={checkIn} 
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="bg-transparent border-none text-white font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs opacity-80">Check-out</p>
                        <input 
                          type="date" 
                          value={checkOut} 
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="bg-transparent border-none text-white font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (checkIn && checkOut) {
                          router.push('/room');
                        } else {
                          // Scroll to navbar and highlight rooms link
                          const navbar = document.querySelector('nav');
                          if (navbar) {
                            navbar.scrollIntoView({ behavior: 'smooth' });
                            // Add a small delay to ensure the scroll completes
                            setTimeout(() => {
                              const roomsLink = navbar.querySelector('a[href="/rooms"]');
                              if (roomsLink) {
                                roomsLink.classList.add('text-blue-600', 'font-bold');
                                // Remove the highlight after 2 seconds
                                setTimeout(() => {
                                  roomsLink.classList.remove('text-blue-600', 'font-bold');
                                }, 2000);
                              }
                            }, 500);
                          }
                        }
                      }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 p-3 shadow-lg"
                    >
                      Search Rooms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  const GalleryPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hotel Gallery
              </h1>
              <Link 
                href="/rooms"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                View Rooms
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                Explore Our Beautiful Spaces
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Take a visual journey through our stunning hotel, from luxurious rooms to world-class amenities
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 shadow-md'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredImages().map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-white/50"
                  onClick={() => openImageModal(index)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${image.url})` }}
                  ></div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                    <div className="flex items-center gap-2">
                      {image.type === 'video' ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
                      <span className="text-sm opacity-90 capitalize">{image.category}</span>
                    </div>
                  </div>

                  {/* Video Indicator */}
                  {image.type === 'video' && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full w-full">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image or Video */}
              <div className="flex flex-col items-center justify-center">
                {getFilteredImages()[selectedImageIndex]?.type === 'video' ? (
                  <video
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    controls
                    autoPlay
                    className="rounded-2xl max-h-[70vh] w-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={getFilteredImages()[selectedImageIndex]?.url}
                    alt={getFilteredImages()[selectedImageIndex]?.title}
                    className="rounded-2xl max-h-[70vh] w-full object-contain bg-black"
                  />
                )}
                <div className="mt-4 text-center text-white">
                  <h4 className="text-2xl font-bold">{getFilteredImages()[selectedImageIndex]?.title}</h4>
                  <p className="text-sm opacity-80 capitalize">{getFilteredImages()[selectedImageIndex]?.category}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main App with Next.js routing
  return (
    <>
      <HomePage />
    </>
  );
};

export default Hero;