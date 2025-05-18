import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../Style/Payment.css';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        name,
        email,
        roomType,
        guests,
        arrivalDate,
        departureDate,
        specialRequests,
        pricePerNight,
        nights,
        totalPrice,
        hostelName,
        hostelImage
    } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        nameOnCard: name || '',
        expiryDate: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [errors, setErrors] = useState({});

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific error when user updates that field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Credit card validation
        if (paymentMethod === 'card') {
            if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.length < 16) {
                newErrors.cardNumber = 'Please enter a valid card number';
            }

            if (!cardDetails.nameOnCard.trim()) {
                newErrors.nameOnCard = 'Please enter the name on card';
            }

            if (!cardDetails.expiryDate.trim() || !cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/)) {
                newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
            }

            if (!cardDetails.cvv.trim() || cardDetails.cvv.length < 3) {
                newErrors.cvv = 'Please enter a valid CVV';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Simulate payment processing
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaymentComplete(true);

            // Redirect after successful payment animation
            setTimeout(() => {
                navigate('/booking-confirmation', {
                    state: {
                        name,
                        email,
                        roomType,
                        guests,
                        arrivalDate,
                        departureDate,
                        nights,
                        totalPrice,
                        hostelName
                    }
                });
            }, 2000);
        }, 2000);
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Render booking step indicator
    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                <div className="flex items-center relative">
                    <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-indigo-600 text-white"
                        whileHover={{ scale: 1.1 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                    <div className="text-xs absolute -bottom-6 w-20 text-center">
                        Details
                    </div>
                </div>
                <motion.div
                    className="h-1 w-24 sm:w-32 bg-indigo-600"
                ></motion.div>
                <div className="flex items-center relative">
                    <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-indigo-600 text-white"
                        whileHover={{ scale: 1.1 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                    <div className="text-xs absolute -bottom-6 w-20 text-center">
                        Review
                    </div>
                </div>
                <motion.div
                    className="h-1 w-24 sm:w-32 bg-indigo-600"
                ></motion.div>
                <div className="flex items-center relative">
                    <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center z-10 bg-indigo-600 text-white"
                        whileHover={{ scale: 1.1 }}
                        initial={false}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                    >
                        3
                    </motion.div>
                    <div className="text-xs absolute -bottom-6 w-20 text-center">
                        Payment
                    </div>
                </div>
            </div>
        </div>
    );

    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4 }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Hostel image preview - if available */}
                {hostelImage && (
                    <motion.div
                        className="mb-6 rounded-lg overflow-hidden shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img
                            src={hostelImage}
                            alt={hostelName || "Hostel"}
                            className="w-full h-48 object-cover"
                        />
                    </motion.div>
                )}

                {/* Progress Steps */}
                {renderStepIndicator()}

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Hostel Info Header */}
                    <div className="bg-indigo-600 text-white p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold">{hostelName || 'Complete Your Payment'}</h2>
                        <p className="opacity-90 text-sm sm:text-base">
                            Total: ₹{totalPrice}
                        </p>
                    </div>

                    {/* Success Animation */}
                    {isPaymentComplete && (
                        <motion.div
                            className="flex flex-col items-center justify-center py-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </motion.div>
                            <motion.p
                                className="text-xl font-medium text-gray-800"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Payment Successful!
                            </motion.p>
                            <motion.p
                                className="text-gray-600 mt-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Redirecting to confirmation...
                            </motion.p>
                            <motion.div
                                className="mt-4 w-12 h-1 bg-indigo-300 rounded-full overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: 200 }}
                                transition={{ duration: 1 }}
                            >
                            </motion.div>
                        </motion.div>
                    )}

                    {!isPaymentComplete && (
                        <motion.div
                            {...pageTransition}
                            className="p-4 sm:p-6"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Booking Summary */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            Booking Summary
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 gap-y-4">
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Guest</p>
                                                <p className="font-medium">{name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Room Type</p>
                                                <p className="font-medium">{roomType}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Check-in</p>
                                                <p className="font-medium">{formatDate(arrivalDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Check-out</p>
                                                <p className="font-medium">{formatDate(departureDate)}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Nights</p>
                                                <p className="font-medium">{nights}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Guests</p>
                                                <p className="font-medium">{guests}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                            Payment Method
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span>Credit Card</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full ${paymentMethod === 'card' ? 'bg-indigo-500' : 'border border-gray-300'}`}></div>
                                            </div>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => setPaymentMethod('upi')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>UPI</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full ${paymentMethod === 'upi' ? 'bg-indigo-500' : 'border border-gray-300'}`}></div>
                                            </div>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => setPaymentMethod('netbanking')}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span>Net Banking</span>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full ${paymentMethod === 'netbanking' ? 'bg-indigo-500' : 'border border-gray-300'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Credit Card Form */}
                                {paymentMethod === 'card' && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={cardDetails.cardNumber}
                                                onChange={(e) => {
                                                    // Format card number as user types
                                                    const formattedValue = formatCardNumber(e.target.value);
                                                    setCardDetails({ ...cardDetails, cardNumber: formattedValue });
                                                    if (errors.cardNumber) {
                                                        setErrors({ ...errors, cardNumber: '' });
                                                    }
                                                }}
                                                className={`w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                maxLength="19"
                                            />
                                            {errors.cardNumber && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.cardNumber}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name on Card
                                            </label>
                                            <input
                                                type="text"
                                                name="nameOnCard"
                                                value={cardDetails.nameOnCard}
                                                onChange={handleCardInputChange}
                                                className={`w-full px-3 py-2 border ${errors.nameOnCard ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                placeholder="John Doe"
                                            />
                                            {errors.nameOnCard && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors.nameOnCard}
                                                </p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={cardDetails.expiryDate}
                                                    onChange={(e) => {
                                                        let value = e.target.value;
                                                        // Format expiry date as MM/YY
                                                        value = value.replace(/\D/g, '');
                                                        if (value.length > 2) {
                                                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                                        }
                                                        setCardDetails({ ...cardDetails, expiryDate: value });
                                                        if (errors.expiryDate) {
                                                            setErrors({ ...errors, expiryDate: '' });
                                                        }
                                                    }}
                                                    className={`w-full px-3 py-2 border ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                />
                                                {errors.expiryDate && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {errors.expiryDate}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    CVV
                                                </label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        setCardDetails({ ...cardDetails, cvv: value });
                                                        if (errors.cvv) {
                                                            setErrors({ ...errors, cvv: '' });
                                                        }
                                                    }}
                                                    className={`w-full px-3 py-2 border ${errors.cvv ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                                    placeholder="XXX"
                                                    maxLength="3"
                                                />
                                                {errors.cvv && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {errors.cvv}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* UPI Payment Option */}
                                {paymentMethod === 'upi' && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                UPI ID
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="example@upi"
                                            />
                                        </div>
                                        <div className="flex justify-center py-4">
                                            <div className="bg-gray-100 p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                                                <div className="text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                    </svg>
                                                    <p className="mt-2 text-sm text-gray-600">QR Code</p>
                                                    <p className="text-xs text-gray-500 mt-1">Scan to pay</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Netbanking Option */}
                                {paymentMethod === 'netbanking' && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Select Bank
                                            </label>
                                            <select
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Choose your bank</option>
                                                <option value="sbi">State Bank of India</option>
                                                <option value="hdfc">HDFC Bank</option>
                                                <option value="icici">ICICI Bank</option>
                                                <option value="axis">Axis Bank</option>
                                                <option value="kotak">Kotak Mahindra Bank</option>
                                                <option value="pnb">Punjab National Bank</option>
                                                <option value="bob">Bank of Baroda</option>
                                                <option value="idbi">IDBI Bank</option>
                                                <option value="yes">Yes Bank</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            <div className="border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-800 font-bold">SBI</span>
                                                </div>
                                                <p className="text-xs mt-2 text-center">State Bank</p>
                                            </div>
                                            <div className="border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">HDFC</span>
                                                </div>
                                                <p className="text-xs mt-2 text-center">HDFC Bank</p>
                                            </div>
                                            <div className="border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">ICICI</span>
                                                </div>
                                                <p className="text-xs mt-2 text-center">ICICI Bank</p>
                                            </div>
                                            <div className="border p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold">AXIS</span>
                                                </div>
                                                <p className="text-xs mt-2 text-center">Axis Bank</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Price Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                                        <span className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                                            </svg>
                                            Payment Summary
                                        </span>
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Room Rate ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                                            <span>₹{pricePerNight} × {nights}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Room Total</span>
                                            <span>₹{pricePerNight * nights}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Taxes & Fees (18%)</span>
                                            <span>₹{Math.round(pricePerNight * nights * 0.18)}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between font-medium">
                                                <span>Total</span>
                                                <span className="text-indigo-600">₹{totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancellation Policy */}
                                <div className="text-sm text-gray-600 border-t pt-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Cancellation Policy:</h4>
                                    <p>Free cancellation until 24 hours before check-in. Cancellations within 24 hours of check-in are subject to a charge of one night's stay.</p>
                                </div>

                                {/* Terms Agreement */}
                                <div className="flex items-start">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                                        I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative overflow-hidden"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            `Pay ₹${totalPrice}`
                                        )}
                                    </button>
                                </div>

                                {/* Security Note */}
                                <div className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Your payment information is secure and encrypted
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>

                {/* Support Contact */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Need help? <a href="#" className="text-indigo-600 font-medium">Contact support</a></p>
                </div>
            </motion.div>
        </div>
    );
}

export default Payment;