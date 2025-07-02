'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Users, MapPin, Star, Phone, Mail, Clock, CreditCard, Banknote, Building2, Smartphone, Check, AlertCircle } from 'lucide-react';

const BookingPage = () => {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    room_id: searchParams?.get('roomId') || '',
    room_title: searchParams?.get('title') || 'Deluxe Room',
    room_price: searchParams?.get('price') || '$150',
    check_in: '',
    check_out: '',
    guests: 1,
    nights: 0
  });

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [cashPayment, setCashPayment] = useState({
    paymentType: 'full', // 'full', 'partial', 'arrival'
    advanceAmount: 0
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
  const [cancelError, setCancelError] = useState({});
  const [cancelSuccess, setCancelSuccess] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (bookingData.check_in && bookingData.check_out) {
      const checkIn = new Date(bookingData.check_in);
      const checkOut = new Date(bookingData.check_out);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setBookingData(prev => ({
        ...prev,
        nights: nights > 0 ? nights : 0
      }));
    }
  };

  const getTotalAmount = () => {
    if (bookingData.room_price && bookingData.nights > 0) {
      return parseInt(bookingData.room_price.replace('$', '')) * bookingData.nights;
    }
    return parseInt(bookingData.room_price?.replace('$', '') || '0');
  };

  const getAdvanceAmount = () => {
    const total = getTotalAmount();
    if (paymentMethod === 'cash') {
      if (cashPayment.paymentType === 'partial') {
        return Math.max(cashPayment.advanceAmount, total * 0.3); // Minimum 30%
      } else if (cashPayment.paymentType === 'arrival') {
        return total * 0.5; // 50% advance for pay at arrival
      }
    }
    return total;
  };

  useEffect(() => {
    calculateNights();
  }, [bookingData.check_in, bookingData.check_out]);

  // Fetch user bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setUserBookings(data.bookings);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!bookingData.check_in || !bookingData.check_out || !bookingData.nights) {
        alert('Please select check-in and check-out dates');
        return;
      }
    } else if (currentStep === 2) {
      if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
        alert('Please fill in all required guest information (First Name, Last Name, Email, Phone)');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to complete your booking');
        return;
      }

      // Validate required fields
      if (!bookingData.check_in || !bookingData.check_out || !bookingData.nights) {
        alert('Please select check-in and check-out dates');
        return;
      }

      if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
        alert('Please fill in all required guest information (First Name, Last Name, Email, Phone)');
        return;
      }

      // Prepare booking data
      const bookingDataToSend = {
        roomId: bookingData.room_id,
        roomTitle: bookingData.room_title,
        roomPrice: bookingData.room_price.replace('$', ''),
        checkIn: bookingData.check_in,
        checkOut: bookingData.check_out,
        nights: bookingData.nights,
        guests: bookingData.guests,
        totalAmount: getTotalAmount() + Math.round(getTotalAmount() * 0.12), // Including taxes
        guestInfo: {
          firstName: guestInfo.firstName,
          lastName: guestInfo.lastName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          address: guestInfo.address,
          city: guestInfo.city,
          zipCode: guestInfo.zipCode,
          country: guestInfo.country
        },
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardholderName: cardDetails.cardholderName
        } : paymentMethod === 'cash' ? {
          paymentType: cashPayment.paymentType,
          advanceAmount: getAdvanceAmount()
        } : {}
      };

      // Debug: Log the data being sent
      console.log('Sending booking data:', JSON.stringify(bookingDataToSend, null, 2));

      // Send booking to backend
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingDataToSend)
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (response.ok) {
        // Show success message
        setShowSuccess(true);
        
        // Store booking reference for display
        localStorage.setItem('lastBookingReference', result.booking.bookingReference);
        
        setTimeout(() => {
          setShowSuccess(false);
          // Redirect to home page after successful booking
          window.location.href = '/';
        }, 5000);
      } else {
        // Handle error
        alert(`Booking failed: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to complete booking. Please try again.');
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelLoading(prev => ({ ...prev, [bookingId]: true }));
    setCancelError(prev => ({ ...prev, [bookingId]: null }));
    setCancelSuccess(prev => ({ ...prev, [bookingId]: null }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
        setCancelSuccess(prev => ({ ...prev, [bookingId]: 'Booking cancelled.' }));
      } else {
        setCancelError(prev => ({ ...prev, [bookingId]: data.error || 'Failed to cancel.' }));
      }
    } catch (err) {
      setCancelError(prev => ({ ...prev, [bookingId]: 'Failed to cancel.' }));
    } finally {
      setCancelLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (showSuccess) {
    const bookingReference = localStorage.getItem('lastBookingReference');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your reservation has been successfully processed.</p>
          {bookingReference && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Booking Reference:</strong> {bookingReference}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-4">A confirmation email has been sent to your email address.</p>
          <p className="text-sm text-blue-600">You will be redirected to the home page in a few seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 font-medium ${
                  step <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Booking Details' : step === 2 ? 'Guest Information' : 'Payment'}
                </span>
                {step < 3 && <div className="w-16 h-1 bg-gray-300 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Step 1: Booking Details */}
            {currentStep === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>
                
                {/* Booking Form */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        name="check_in"
                        value={bookingData.check_in}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        name="check_out"
                        value={bookingData.check_out}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                      min="1"
                      max="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Booking Summary */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in</span>
                        <span className="font-medium">{bookingData.check_in || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out</span>
                        <span className="font-medium">{bookingData.check_out || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests</span>
                        <span className="font-medium">{bookingData.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{bookingData.nights} night{bookingData.nights > 1 ? 's' : ''}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-blue-600">
                            ${getTotalAmount()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {currentStep === 2 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Guest Information</h1>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={guestInfo.firstName}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={guestInfo.lastName}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={guestInfo.email}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={guestInfo.phone}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={guestInfo.address}
                      onChange={handleGuestInfoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={guestInfo.city}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={guestInfo.zipCode}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={guestInfo.country}
                        onChange={handleGuestInfoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="IN">India</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Details</h1>
                
                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Banknote className="w-8 h-8 mx-auto mb-2" />
                      <span className="font-medium">Cash Payment</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'bank' 
                          ? 'border-purple-500 bg-purple-50 text-purple-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-2" />
                      <span className="font-medium">Bank Transfer</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('digital')}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        paymentMethod === 'digital' 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Smartphone className="w-8 h-8 mx-auto mb-2" />
                      <span className="font-medium">Digital Wallet</span>
                    </button>
                  </div>
                </div>

                {/* Payment Forms */}
                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  {/* Credit Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="p-6 border rounded-xl">
                      <h4 className="text-lg font-semibold mb-4">Card Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardholderName"
                            value={cardDetails.cardholderName}
                            onChange={handleCardDetailsChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formatCardNumber(cardDetails.cardNumber)}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              cardNumber: e.target.value.replace(/\s/g, '')
                            }))}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formatExpiryDate(cardDetails.expiryDate)}
                              onChange={(e) => setCardDetails(prev => ({
                                ...prev,
                                expiryDate: e.target.value
                              }))}
                              placeholder="MM/YY"
                              maxLength="5"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardDetailsChange}
                              placeholder="123"
                              maxLength="4"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash Payment Form */}
                  {paymentMethod === 'cash' && (
                    <div className="p-6 border rounded-xl bg-green-50">
                      <h4 className="text-lg font-semibold mb-4 text-green-800">Cash Payment Options</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="cashPaymentType"
                              value="full"
                              checked={cashPayment.paymentType === 'full'}
                              onChange={(e) => setCashPayment(prev => ({
                                ...prev,
                                paymentType: e.target.value
                              }))}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="font-medium">Pay Full Amount at Check-in</span>
                          </label>
                          <p className="text-sm text-gray-600 ml-7">
                            Pay the complete amount (${getTotalAmount()}) when you arrive at the hotel
                          </p>
                        </div>
                        
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="cashPaymentType"
                              value="partial"
                              checked={cashPayment.paymentType === 'partial'}
                              onChange={(e) => setCashPayment(prev => ({
                                ...prev,
                                paymentType: e.target.value
                              }))}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="font-medium">Pay Advance Amount</span>
                          </label>
                          <p className="text-sm text-gray-600 ml-7">
                            Pay a portion now, remaining at check-in (Minimum 30% advance required)
                          </p>
                          {cashPayment.paymentType === 'partial' && (
                            <div className="ml-7 mt-2">
                              <input
                                type="number"
                                value={cashPayment.advanceAmount}
                                onChange={(e) => setCashPayment(prev => ({
                                  ...prev,
                                  advanceAmount: parseInt(e.target.value) || 0
                                }))}
                                min={getTotalAmount() * 0.3}
                                max={getTotalAmount()}
                                className="w-32 px-3 py-1 border border-gray-300 rounded-lg"
                              />
                              <span className="text-sm text-gray-600 ml-2">
                                (Min: ${Math.round(getTotalAmount() * 0.3)})
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="cashPaymentType"
                              value="arrival"
                              checked={cashPayment.paymentType === 'arrival'}
                              onChange={(e) => setCashPayment(prev => ({
                                ...prev,
                                paymentType: e.target.value
                              }))}
                              className="w-4 h-4 text-green-600"
                            />
                            <span className="font-medium">50% Advance + 50% at Arrival</span>
                          </label>
                          <p className="text-sm text-gray-600 ml-7">
                            Pay ${Math.round(getTotalAmount() * 0.5)} now, ${Math.round(getTotalAmount() * 0.5)} at check-in
                          </p>
                        </div>
                        
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <div className="flex items-start">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="ml-3">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Cash payments require advance confirmation. 
                                Please bring exact change or be prepared for change to be provided.
                                Receipt will be provided upon payment.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {paymentMethod === 'bank' && (
                    <div className="p-6 border rounded-xl bg-purple-50">
                      <h4 className="text-lg font-semibold mb-4 text-purple-800">Bank Transfer Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Bank Name:</span>
                            <p>Hotel International Bank</p>
                          </div>
                          <div>
                            <span className="font-medium">Account Name:</span>
                            <p>Hotel Reservations Ltd.</p>
                          </div>
                          <div>
                            <span className="font-medium">Account Number:</span>
                            <p>1234567890123456</p>
                          </div>
                          <div>
                            <span className="font-medium">Routing Number:</span>
                            <p>123456789</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-100 rounded">
                          <p className="text-purple-800">
                            <strong>Reference:</strong> Please use your booking reference in the transfer description
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Digital Wallet */}
                  {paymentMethod === 'digital' && (
                    <div className="p-6 border rounded-xl bg-orange-50">
                      <h4 className="text-lg font-semibold mb-4 text-orange-800">Digital Wallet</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button type="button" className="p-4 border rounded-lg hover:bg-orange-100 transition-colors">
                          <span className="font-medium">PayPal</span>
                        </button>
                        <button type="button" className="p-4 border rounded-lg hover:bg-orange-100 transition-colors">
                          <span className="font-medium">Apple Pay</span>
                        </button>
                        <button type="button" className="p-4 border rounded-lg hover:bg-orange-100 transition-colors">
                          <span className="font-medium">Google Pay</span>
                        </button>
                        <button type="button" className="p-4 border rounded-lg hover:bg-orange-100 transition-colors">
                          <span className="font-medium">Venmo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${getTotalAmount()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-medium">${Math.round(getTotalAmount() * 0.12)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                          <span className="text-lg font-bold text-blue-600">
                            ${getTotalAmount() + Math.round(getTotalAmount() * 0.12)}
                          </span>
                        </div>
                      </div>
                      {paymentMethod === 'cash' && cashPayment.paymentType !== 'full' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-blue-800">Amount to Pay Now</span>
                            <span className="font-bold text-blue-600">${getAdvanceAmount()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-blue-600">Remaining at Check-in</span>
                            <span className="text-sm text-blue-600">
                              ${(getTotalAmount() + Math.round(getTotalAmount() * 0.12)) - getAdvanceAmount()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous Step
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    currentStep === 1 ? 'ml-auto' : ''
                  }`}
                  disabled={
                    (currentStep === 1 && (!bookingData.check_in || !bookingData.check_out)) ||
                    (currentStep === 2 && (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone))
                  }
                >
                  Continue to {currentStep === 1 ? 'Guest Info' : 'Payment'}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmitBooking}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {paymentMethod === 'cash' && cashPayment.paymentType === 'full' 
                    ? 'Confirm Booking (Pay at Hotel)' 
                    : 'Complete Booking & Pay'}
                </button>
              )}
            </div>

            {/* Security Notice */}
            {currentStep === 3 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-sm text-green-800">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
                    We use industry-standard security measures to protect your data.
                  </p>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            {currentStep === 3 && (
              <div className="mt-4 text-xs text-gray-500">
                <p>
                  By completing this booking, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  Cancellation policies apply based on room type and booking date.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-gray-600">support@hotel.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Available</p>
                <p className="text-gray-600">24/7 Customer Service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Bookings</h2>
          {loadingBookings ? (
            <div className="text-gray-500">Loading bookings...</div>
          ) : userBookings.length === 0 ? (
            <div className="text-gray-500">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 text-left">Room</th>
                    <th className="py-3 px-4 text-left">Check-in</th>
                    <th className="py-3 px-4 text-left">Check-out</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userBookings.map(booking => (
                    <tr key={booking._id} className="border-b">
                      <td className="py-2 px-4">{booking.roomTitle}</td>
                      <td className="py-2 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="py-2 px-4 capitalize">{booking.status}</td>
                      <td className="py-2 px-4">
                        {booking.status === 'cancelled' ? (
                          <span className="text-red-500 font-semibold">Cancelled</span>
                        ) : (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancelLoading[booking._id]}
                            className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                          >
                            {cancelLoading[booking._id] ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        {cancelError[booking._id] && (
                          <div className="text-xs text-red-600 mt-1">{cancelError[booking._id]}</div>
                        )}
                        {cancelSuccess[booking._id] && (
                          <div className="text-xs text-green-600 mt-1">{cancelSuccess[booking._id]}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;