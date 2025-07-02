'use client';

import { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiUser, FiStar, FiMinimize2, FiMaximize2, FiPhone, FiMail } from 'react-icons/fi';
import './chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Good day! Welcome to Lux Stay - your premier luxury destination. I'm your personal concierge assistant, here to provide exceptional service 24/7. Whether you need assistance with reservations, amenities, or local recommendations, I'm at your service. How may I assist you today?",
      isBot: true,
      timestamp: new Date(),
      aiPowered: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use enhanced endpoint with conversation history
      const response = await fetch('http://localhost:5000/api/chatbot/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          conversationHistory: currentMessages.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isBot: true,
          timestamp: new Date(),
          category: data.category,
          data: data.data,
          aiPowered: data.aiPowered
        };

        setMessages(prev => [...prev, botMessage]);

        // If there's additional data (like rooms or pricing), show it
        if (data.data) {
          setTimeout(() => {
            const dataMessage = createDataMessage(data.data, data.category);
            if (dataMessage) {
              setMessages(prev => [...prev, dataMessage]);
            }
          }, 1000);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I sincerely apologize for the inconvenience. Our system is experiencing temporary difficulties. Please allow me a moment to reconnect, or feel free to contact our front desk directly at +1 (555) 123-4567 for immediate assistance.",
        isBot: true,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createDataMessage = (data, category) => {
    if (category === 'rooms' && data.rooms) {
      return {
        id: Date.now() + 2,
        text: '',
        isBot: true,
        timestamp: new Date(),
        isRoomData: true,
        rooms: data.rooms
      };
    }

    if (category === 'pricing' && data.pricing) {
      return {
        id: Date.now() + 2,
        text: '',
        isBot: true,
        timestamp: new Date(),
        isPricingData: true,
        pricing: data.pricing
      };
    }

    if (category === 'booking' && data.availableRooms) {
      return {
        id: Date.now() + 2,
        text: '',
        isBot: true,
        timestamp: new Date(),
        isBookingData: true,
        availableRooms: data.availableRooms
      };
    }

    return null;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => {
    if (message.isRoomData && message.rooms) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">★</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Premium Accommodations Available</span>
          </div>
          {message.rooms.map((room) => (
            <div key={room.id} className="luxury-room-card group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Available</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">
                    ${room.price}
                    <span className="text-sm font-normal text-gray-500">/night</span>
                  </div>
                  {room.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{room.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>🛏️</span>
                      <span>Luxury Bedding</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📶</span>
                      <span>Free WiFi</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🍽️</span>
                      <span>Room Service</span>
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <button className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (message.isPricingData && message.pricing) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💰</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Current Rates & Pricing</span>
          </div>
          {message.pricing.map((item, index) => (
            <div key={index} className="pricing-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">
                      {item.type.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.type}</div>
                    <div className="text-xs text-gray-500">Per night, taxes included</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-600">${item.price}</div>
                  <div className="text-xs text-gray-500">Best Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (message.isBookingData && message.availableRooms) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Ready for Immediate Booking</span>
          </div>
          {message.availableRooms.map((room) => (
            <div key={room.id} className="booking-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">🛏️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{room.type}</div>
                    <div className="text-xs text-green-600 font-medium">✓ Instant Confirmation</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">${room.price}/night</div>
                  <button className="mt-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{message.text}</div>;
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          {/* Pulse Ring Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-18 h-18 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center transform hover:scale-110 ${
              isOpen 
                ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } text-white group`}
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            {isOpen ? <FiX size={32} /> : <FiMessageCircle size={32} />}
          </button>
        </div>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`fixed bottom-28 right-8 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col transition-all duration-500 luxury-chat-window ${
          isMinimized ? 'w-96 h-20' : 'w-[28rem] h-[36rem]'
        }`}>
          {/* Premium Header */}
          <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-black text-white p-6 rounded-t-3xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FiStar size={24} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-sm pulse-green"></div>
                </div>
                <div>
                  <div className="font-bold text-xl text-white">Lux Stay</div>
                  <div className="text-amber-200 text-sm font-medium">Concierge Service</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-200 text-xs font-medium">Available 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <FiMaximize2 size={18} /> : <FiMinimize2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200 group"
                  title="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white luxury-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} message-slide-in`}
                  >
                    <div className={`flex items-start space-x-4 max-w-[85%] ${
                      message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                    }`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                        message.isBot 
                          ? 'bg-gradient-to-br from-slate-600 to-gray-700' 
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        {message.isBot ? <FiStar size={18} /> : <FiUser size={18} />}
                      </div>
                      <div className={`rounded-2xl p-5 shadow-sm border ${
                        message.isBot 
                          ? message.isError 
                            ? 'bg-red-50 text-red-800 border-red-200' 
                            : 'bg-white text-gray-800 border-gray-200 luxury-message-bot'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white luxury-message-user'
                      }`}>
                        {renderMessage(message)}
                        <div className={`text-xs mt-3 flex items-center justify-between ${
                          message.isBot ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          <span className="font-medium">{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start message-slide-in">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center text-white shadow-lg">
                        <FiStar size={18} />
                      </div>
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 luxury-message-bot">
                        <div className="flex space-x-3 items-center">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">Processing your request...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Premium Input Area */}
              <div className="p-6 bg-white border-t border-gray-100 rounded-b-3xl">
                <div className="flex space-x-4 items-end">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300 bg-gray-50 hover:bg-white luxury-input text-gray-800 placeholder-gray-500"
                      disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-lg">Enter ↵</span>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none luxury-send-button"
                  >
                    <FiSend size={22} />
                  </button>
                </div>
                
                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Secure & Private</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>⚡</span>
                      <span>Professional Service</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <FiPhone size={12} />
                      <span>Call</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <FiMail size={12} />
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;