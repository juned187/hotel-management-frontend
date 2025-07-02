'use client';
import { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Shield, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Star,
  Tag,
  Gift
} from "lucide-react";

export default function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Sample booking data (would come from URL params or state in real app)
  const [bookingData, setBookingData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    room_type: "deluxe",
    check_in: "2025-06-20",
    check_out: "2025-06-22",
    guests: 2,
    nights: 2,
    subtotal: 4400,
    taxes: 792,
    serviceFee: 200,
    discount: 0,
    couponCode: '',
    total: 5392
  });

  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
  });

  const [upiForm, setUpiForm] = useState({
    upiId: ''
  });

  const [netBankingForm, setNetBankingForm] = useState({
    bank: ''
  });

  const [walletForm, setWalletForm] = useState({
    provider: ''
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    isApplied: false,
    isValidating: false,
    error: ''
  });

  // Sample coupon codes
  const validCoupons = {
    'SAVE10': { discount: 10, type: 'percentage', description: '10% off on total amount' },
    'WELCOME200': { discount: 200, type: 'fixed', description: '₹200 off on your booking' },
    'FIRST500': { discount: 500, type: 'fixed', description: '₹500 off for first-time users' },
    'HOTEL15': { discount: 15, type: 'percentage', description: '15% off on room charges' }
  };

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
    'IDBI Bank', 'Indian Bank', 'Central Bank of India', 'Yes Bank'
  ];

  const walletProviders = [
    { name: 'Paytm', logo: '🔵', color: 'bg-blue-100 text-blue-600' },
    { name: 'PhonePe', logo: '🟣', color: 'bg-purple-100 text-purple-600' },
    { name: 'Google Pay', logo: '🔴', color: 'bg-red-100 text-red-600' },
    { name: 'Amazon Pay', logo: '🟠', color: 'bg-orange-100 text-orange-600' },
    { name: 'MobiKwik', logo: '🔵', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'FreeCharge', logo: '⚡', color: 'bg-yellow-100 text-yellow-600' }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: (
        <div className="flex space-x-1">
          <div className="w-8 h-5 bg-blue-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">VISA</div>
          <div className="w-8 h-5 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">MC</div>
          <div className="w-8 h-5 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">RU</div>
        </div>
      ),
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: (
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₹</div>
          <span className="text-xs font-semibold text-orange-600">UPI</span>
        </div>
      ),
      description: 'Pay using UPI ID or QR Code'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: (
        <div className="flex items-center space-x-1">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-600">Bank</span>
        </div>
      ),
      description: 'Pay through your bank account'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: (
        <div className="flex items-center space-x-1">
          <Wallet className="w-5 h-5 text-green-600" />
          <span className="text-xs font-semibold text-green-600">Wallet</span>
        </div>
      ),
      description: 'Pay using digital wallets'
    }
  ];

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    // Remove non-digits and limit to 4 characters
    const cleaned = value.replace(/\D/g, '').substring(0, 4);
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    setCardForm({ ...cardForm, cardNumber: formatCardNumber(value) });
  };

  const handleExpiryChange = (e) => {
    const value = formatExpiry(e.target.value);
    setCardForm({ ...cardForm, expiry: value });
  };

  const calculateDiscount = (coupon) => {
    const baseAmount = bookingData.subtotal + bookingData.serviceFee + bookingData.taxes;
    if (coupon.type === 'percentage') {
      return Math.round((baseAmount * coupon.discount) / 100);
    } else {
      return Math.min(coupon.discount, baseAmount);
    }
  };

  const applyCoupon = async () => {
    if (!couponForm.code.trim()) {
      setCouponForm({ ...couponForm, error: 'Please enter a coupon code' });
      return;
    }

    setCouponForm({ ...couponForm, isValidating: true, error: '' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const coupon = validCoupons[couponForm.code.toUpperCase()];
    
    if (coupon) {
      const discountAmount = calculateDiscount(coupon);
      const newTotal = Math.max(0, bookingData.subtotal + bookingData.serviceFee + bookingData.taxes - discountAmount);
      
      setBookingData({
        ...bookingData,
        discount: discountAmount,
        couponCode: couponForm.code.toUpperCase(),
        total: newTotal
      });
      
      setCouponForm({
        ...couponForm,
        isApplied: true,
        isValidating: false,
        error: ''
      });
    } else {
      setCouponForm({
        ...couponForm,
        isValidating: false,
        error: 'Invalid coupon code. Please try again.'
      });
    }
  };

  const removeCoupon = () => {
    const originalTotal = bookingData.subtotal + bookingData.serviceFee + bookingData.taxes;
    setBookingData({
      ...bookingData,
      discount: 0,
      couponCode: '',
      total: originalTotal
    });
    setCouponForm({
      code: '',
      isApplied: false,
      isValidating: false,
      error: ''
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your booking has been confirmed</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Booking ID:</strong> SH{Date.now().toString().slice(-6)}</p>
              <p><strong>Amount Paid:</strong> ₹{bookingData.total}</p>
              {bookingData.discount > 0 && (
                <p><strong>Discount Applied:</strong> -₹{bookingData.discount}</p>
              )}
              <p><strong>Check-in:</strong> {bookingData.check_in}</p>
              <p><strong>Check-out:</strong> {bookingData.check_out}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Download Receipt
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800 mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Booking
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Complete Your Payment</h1>
            <p className="text-gray-600">SecureStay Hotel - Safe & Secure Payment</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            {/* Coupon Code Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Have a Coupon Code?</h3>
              </div>
              
              {!couponForm.isApplied ? (
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase(), error: '' })}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={couponForm.isValidating}
                    />
                    {couponForm.error && (
                      <p className="text-red-500 text-sm mt-1">{couponForm.error}</p>
                    )}
                  </div>
                  <button
                    onClick={applyCoupon}
                    disabled={couponForm.isValidating || !couponForm.code.trim()}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponForm.isValidating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Applying...
                      </div>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Gift className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Coupon Applied: {bookingData.couponCode}</p>
                        <p className="text-sm text-green-600">You saved ₹{bookingData.discount}!</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              {/* Sample Coupons */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Try these codes:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(validCoupons).map(([code, coupon]) => (
                    <button
                      key={code}
                      onClick={() => setCouponForm({ ...couponForm, code: code, error: '' })}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
                      disabled={couponForm.isApplied}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Payment Method</h2>
              
              {/* Payment Method Selection */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-blue-600 mt-1">{method.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedPaymentMethod === method.id}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Forms */}
              {selectedPaymentMethod === 'card' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardForm.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength="19"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardForm.cardholderName}
                        onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={cardForm.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="password"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your card information is encrypted and secure</span>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'upi' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">UPI Payment</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter UPI ID *
                    </label>
                    <input
                      type="text"
                      value={upiForm.upiId}
                      onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                      placeholder="yourname@paytm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Popular UPI Apps</h4>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-2 mx-auto text-white font-bold text-sm">Pe</div>
                        <span className="text-xs text-blue-800">PhonePe</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-2 mx-auto text-white font-bold text-sm">G</div>
                        <span className="text-xs text-blue-800">Google Pay</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2 mx-auto text-white font-bold text-sm">Py</div>
                        <span className="text-xs text-blue-800">Paytm</span>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-2 mx-auto text-white font-bold text-sm">B</div>
                        <span className="text-xs text-blue-800">BHIM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'netbanking' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Net Banking</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Bank *
                    </label>
                    <select
                      value={netBankingForm.bank}
                      onChange={(e) => setNetBankingForm({ ...netBankingForm, bank: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose your bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You will be redirected to your bank's secure website to complete the payment.
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'wallet' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Digital Wallet</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {walletProviders.map((provider) => (
                      <div
                        key={provider.name}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${
                          walletForm.provider === provider.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setWalletForm({ ...walletForm, provider: provider.name })}
                      >
                        <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-xl font-bold">{provider.logo}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{provider.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Secure Payment</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Safe & secure transactions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Booking Summary</h3>
              
              {/* Guest Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{bookingData.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{bookingData.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{bookingData.phone}</span>
                </div>
              </div>

              <hr className="mb-6" />

              {/* Room Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Room Type</span>
                  <span className="font-medium capitalize">{bookingData.room_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium">{bookingData.check_in}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium">{bookingData.check_out}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{bookingData.guests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{bookingData.nights} night{bookingData.nights > 1 ? 's' : ''}</span>
                </div>
              </div>

              <hr className="mb-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room charges</span>
                  <span>₹{bookingData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>₹{bookingData.serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span>₹{bookingData.taxes}</span>
                </div>
                {bookingData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({bookingData.couponCode})</span>
                    <span>-₹{bookingData.discount}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{bookingData.total}</span>
                </div>
                {bookingData.discount > 0 && (
                  <div className="text-sm text-green-600 text-right">
                    You saved ₹{bookingData.discount}!
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay ₹${bookingData.total}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms & Conditions and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}