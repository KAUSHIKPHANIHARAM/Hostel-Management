import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginContextObj } from '../contexts/LoginContext';
import '../Style/Booking.css';

const roomTypes = [
    { value: "Single", label: "Single Room", description: "Cozy room with a single bed, perfect for solo travelers" },
    { value: "Double", label: "Double Room", description: "Comfortable room with a double bed or two single beds" },
    { value: "Triple", label: "Triple Room", description: "Spacious room with three single beds, ideal for small groups" },
];

function Booking() {
    const navigate = useNavigate();
    const location = useLocation();
    const { hostelId, hostelName, pricePerNight, hostelImage } = location.state || {};
    const { currentUser } = useContext(loginContextObj);

    const [formData, setFormData] = useState({
        name: currentUser?.username || '',
        email: currentUser?.email || '',
        roomType: '',
        guests: 1,
        arrivalDate: '',
        departureDate: '',
        specialRequests: ''
    });

    const [bookingDetails, setBookingDetails] = useState({
        nights: 0,
        totalPrice: 0
    });

    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    // Calculate booking details when dates change
    useEffect(() => {
        if (formData.arrivalDate && formData.departureDate) {
            const arrival = new Date(formData.arrivalDate);
            const departure = new Date(formData.departureDate);

            // Check if dates are valid
            if (departure > arrival) {
                const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
                const totalPrice = nights * pricePerNight;

                setBookingDetails({
                    nights,
                    totalPrice
                });

                // Clear date error if it exists
                if (errors.dateError) {
                    setErrors(prev => ({ ...prev, dateError: '' }));
                }
            }
        }
    }, [formData.arrivalDate, formData.departureDate, pricePerNight, errors.dateError]);

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear specific field error when user updates that field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Date validation
        if (formData.arrivalDate && formData.departureDate) {
            if (new Date(formData.arrivalDate) >= new Date(formData.departureDate)) {
                newErrors.dateError = 'Departure date must be after arrival date.';
            }
        }

        // Room type validation based on guests
        if (formData.roomType && formData.guests) {
            const maxGuestsByRoomType = {
                'Single': 1,
                'Double': 2,
                'Triple': 3,
                'Quad': 4
            };

            if (formData.guests > maxGuestsByRoomType[formData.roomType]) {
                newErrors.guestsError = `Maximum ${maxGuestsByRoomType[formData.roomType]} guests allowed for ${formData.roomType} room.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateForm()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    hostelId,
                    hostelName,
                    nights: bookingDetails.nights,
                    totalPrice: bookingDetails.totalPrice
                })
            });

            if (response.ok) {
                // Show success animation before navigating
                setShowSuccessAnimation(true);
                setStep(3); // Update step to 3 for payment
                
                // Delay navigation to allow animation to play
                setTimeout(() => {
                    navigate('/payment', {
                        state: {
                            ...formData,
                            pricePerNight,
                            nights: bookingDetails.nights,
                            totalPrice: bookingDetails.totalPrice,
                            currentStep: 3, // Pass the current step to payment page
                            hostelName,
                            hostelImage
                        }
                    });
                }, 1200);
            } else {
                const errorData = await response.json();
                setErrors({ submitError: errorData.message || 'Failed to create booking. Please try again.' });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setErrors({ submitError: 'Network error. Please check your connection and try again.' });
            setIsLoading(false);
        }
    };

    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4 }
    };

    // Render booking step indicator
    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                <div className="flex items-center relative">
                    <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        whileHover={{ scale: 1.1 }}
                        initial={false}
                        animate={step >= 1 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        {step > 1 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            "1"
                        )}
                    </motion.div>
                    <div className="text-xs absolute -bottom-6 w-20 text-center">
                        Details
                    </div>
                </div>
                <motion.div 
                    className={`h-1 w-24 sm:w-32`}
                    initial={{ backgroundColor: "#E5E7EB" }}
                    animate={{ backgroundColor: step >= 2 ? "#4F46E5" : "#E5E7EB" }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
                <div className="flex items-center relative">
                    <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        whileHover={{ scale: 1.1 }}
                        initial={false}
                        animate={step === 2 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        {step > 2 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            "2"
                        )}
                    </motion.div>
                    <div className="text-xs absolute -bottom-6 w-20 text-center">
                        Review
                    </div>
                </div>
                <motion.div 
                    className={`h-1 w-24 sm:w-32`}
                    initial={{ backgroundColor: "#E5E7EB" }}
                    animate={{ backgroundColor: step >= 3 ? "#4F46E5" : "#E5E7EB" }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
                <div className="flex items-center relative">
                    <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        whileHover={{ scale: 1.1 }}
                        initial={false}
                        animate={step === 3 ? { scale: [1, 1.2, 1] } : {}}
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
                        <h2 className="text-xl sm:text-2xl font-bold">{hostelName || 'Book Your Stay'}</h2>
                        <p className="opacity-90 text-sm sm:text-base">
                            {pricePerNight && `₹${pricePerNight} per night`}
                        </p>
                    </div>

                    {/* Success Animation */}
                    {showSuccessAnimation && (
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
                                Booking Confirmed!
                            </motion.p>
                            <motion.p
                                className="text-gray-600 mt-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Redirecting to payment...
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

                    <AnimatePresence mode="wait">
                        {!showSuccessAnimation && step === 1 && (
                            <motion.div
                                key="step1"
                                {...pageTransition}
                                className="p-4 sm:p-6"
                            >
                                <form className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="border-b pb-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                Personal Information
                                            </span>
                                        </h3>
                                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="border-b pb-4">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                </svg>
                                                Stay Details
                                            </span>
                                        </h3>
                                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Room Type
                                                </label>
                                                <select
                                                    name="roomType"
                                                    value={formData.roomType}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                >
                                                    <option value="">Select Room Type</option>
                                                    {roomTypes.map(room => (
                                                        <option key={room.value} value={room.value}>
                                                            {room.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formData.roomType && (
                                                    <motion.p
                                                        className="mt-1 text-xs text-gray-500"
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {roomTypes.find(r => r.value === formData.roomType)?.description}
                                                    </motion.p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Number of Guests
                                                </label>
                                                <input
                                                    type="number"
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    min="1"
                                                    max="4"
                                                    required
                                                />
                                                {errors.guestsError && (
                                                    <motion.p 
                                                        className="mt-1 text-xs text-red-600"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {errors.guestsError}
                                                    </motion.p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Check-in Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="arrivalDate"
                                                    value={formData.arrivalDate}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    min={getTodayDate()}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Check-out Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="departureDate"
                                                    value={formData.departureDate}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    min={formData.arrivalDate || getTodayDate()}
                                                    required
                                                />
                                                {errors.dateError && (
                                                    <motion.p 
                                                        className="mt-1 text-xs text-red-600"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {errors.dateError}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                                Special Requests (Optional)
                                            </span>
                                        </label>
                                        <textarea
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows="3"
                                            placeholder="Any specific requirements or preferences..."
                                        ></textarea>
                                    </div>

                                    {/* Price Preview */}
                                    {formData.arrivalDate && formData.departureDate && bookingDetails.nights > 0 && (
                                        <motion.div
                                            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <h4 className="font-medium text-gray-800">Price Summary</h4>
                                            <div className="flex justify-between mt-2">
                                                <p>₹{pricePerNight} x {bookingDetails.nights} nights</p>
                                                <p className="font-medium text-indigo-600">₹{bookingDetails.totalPrice}</p>
                                            </div>
                                            <motion.div 
                                                className="mt-2 h-1 bg-indigo-100 rounded-full overflow-hidden"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 0.8 }}
                                            >
                                                <div className="h-1 bg-indigo-500 rounded-full w-1/2"></div>
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="px-8 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 flex items-center"
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.05 }}
                                            disabled={!formData.name || !formData.email || !formData.roomType || !formData.arrivalDate || !formData.departureDate}
                                        >
                                            Continue to Review
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {!showSuccessAnimation && step === 2 && (
                            <motion.div
                                key="step2"
                                {...pageTransition}
                                className="p-4 sm:p-6"
                            >
                                <h3 className="text-lg font-medium text-gray-800 mb-4">
                                    <span className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Review Your Booking
                                    </span>
                                </h3>

                                <div className="space-y-6">
                                    {/* Guest & Room Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                                        <motion.div 
                                            className="space-y-3"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <h4 className="text-sm font-medium text-gray-500">Guest Details</h4>
                                            <div>
                                                <p className="text-gray-800 font-medium">{formData.name}</p>
                                                <p className="text-gray-600 text-sm">{formData.email}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div 
                                            className="space-y-3"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.1 }}
                                        >
                                            <h4 className="text-sm font-medium text-gray-500">Room Details</h4>
                                            <div>
                                                <p className="text-gray-800 font-medium">
                                                    {roomTypes.find(r => r.value === formData.roomType)?.label || "Room"}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Stay Details */}
                                    <div className="space-y-3 border-b pb-4">
                                        <h4 className="text-sm font-medium text-gray-500">Stay Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                            >
                                                <p className="text-sm text-gray-500">Check-in</p>
                                                <p className="text-gray-800 font-medium">
                                                    {new Date(formData.arrivalDate).toLocaleDateString()}
                                                </p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.4, delay: 0.3 }}
                                            >
                                                <p className="text-sm text-gray-500">Check-out</p>
                                                <p className="text-gray-800 font-medium">
                                                    {new Date(formData.departureDate).toLocaleDateString()}
                                                </p>
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.4 }}
                                        >
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="text-gray-800 font-medium">
                                                {bookingDetails.nights} {bookingDetails.nights === 1 ? 'night' : 'nights'}
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Special Requests */}
                                    {formData.specialRequests && (
                                        <motion.div 
                                            className="space-y-2 border-b pb-4"
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.5 }}
                                        >
                                            <h4 className="text-sm font-medium text-gray-500">Special Requests</h4>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                                                {formData.specialRequests}
                                            </p>
                                        </motion.div>
                                    )}
                                    
                                    {/* Price Summary */}
                                    <motion.div 
                                        className="space-y-3"
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.6 }}
                                    >
                                        <h4 className="text-sm font-medium text-gray-500">Price Summary</h4>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <div className="flex justify-between mb-2">
                                                <p className="text-gray-600">Room Rate</p>
                                                <p className="text-gray-800">₹{pricePerNight} per night</p>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <p className="text-gray-600">Duration</p>
                                                <p className="text-gray-800">{bookingDetails.nights} nights</p>
                                            </div>
                                            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                                                <p className="font-medium">Total Amount</p>
                                                <p className="font-bold text-indigo-600">₹{bookingDetails.totalPrice}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Error message if any */}
                                    {errors.submitError && (
                                        <motion.div 
                                            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {errors.submitError}
                                        </motion.div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between pt-4">
                                        <motion.button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="px-5 py-2 border border-gray-300 text-gray-600 font-medium rounded-md shadow-sm hover:bg-gray-50 flex items-center"
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </motion.button>
                                        
                                        <motion.button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="px-8 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 flex items-center"
                                            whileTap={{ scale: 0.95 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm & Pay
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default Booking;