import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

import hostelAnimation from '../assets/hostel-animation.json';
import delhi from '../assets/delhi.jpeg';
import mumbai from '../assets/mumbai.jpeg';
import hyd from '../assets/hyd.jpeg';
import vizag from '../assets/vizag.jpeg';
import chennai from '../assets/chennai.jpeg';
import bangalore from '../assets/bangalore.jpeg';

const cities = [
    { name: "Mumbai", image: mumbai },
    { name: "Chennai", image: chennai },
    { name: "Vizag", image: vizag },
    { name: "Hyderabad", image: hyd },
    { name: "Bangalore", image: bangalore },
    { name: "Delhi", image: delhi },
];

export default function Home() {
    const navigate = useNavigate();
    const headerControls = useAnimation();
    const featureControls = useAnimation();
    const citiesControls = useAnimation();
    const testimonialControls = useAnimation();

    const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [animationRef, animationInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [citiesRef, citiesInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [testimonialRef, testimonialInView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (headerInView) headerControls.start({ opacity: 1, y: 0 });
        if (animationInView) animationControls.start({ opacity: 1, scale: 1 });
        if (citiesInView) citiesControls.start({ opacity: 1, y: 0 });
        if (featuresInView) featureControls.start({ opacity: 1, y: 0 });
        if (testimonialInView) testimonialControls.start({ opacity: 1, y: 0 });
    }, [headerInView, animationInView, citiesInView, featuresInView, testimonialInView]);

    const animationControls = useAnimation();

    const gotoHostel = () => {
        navigate('/hostels');
    };

    function subscribe() {
        alert("Subscribed")
    }

    function gotoAbout() {
        navigate('/about')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12 lg:py-24">
            {/* Header Section */}
            <motion.div
                ref={headerRef}
                className="max-w-5xl mx-auto text-center"
                initial={{ opacity: 0, y: -30 }}
                animate={headerControls}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                    Welcome to Dorm Quest
                </h1>
                <p className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                    Find and book the best hostels near you. Comfortable stays, budget-friendly prices,
                    and hassle-free booking—all in one place.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <motion.button
                        className="px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
                        onClick={gotoHostel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Explore Hostels
                    </motion.button>
                    <motion.button
                        className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 text-lg font-medium rounded-lg shadow-md hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={gotoAbout}
                    >
                        Learn More
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                ref={animationRef}
                className="flex justify-center items-center mt-12 md:mt-16 lg:mt-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={animationControls}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <div className="w-full max-w-4xl">
                    <Lottie
                        animationData={hostelAnimation}
                        loop={true}
                        className="w-full h-full"
                        style={{ minHeight: '300px' }}
                    />
                </div>
            </motion.div>

            {/* Cities Sec*/}
            <motion.div
                ref={citiesRef}
                className="mt-24 md:mt-32"
                initial={{ opacity: 0, y: 40 }}
                animate={citiesControls}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    <span className="border-b-4 border-indigo-500 pb-2">We Are Available In</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto px-2">
                    {cities.map((city, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="relative">
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-32 sm:h-40 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <h5 className="absolute bottom-2 left-0 right-0 text-center text-white text-lg font-medium">
                                    {city.name}
                                </h5>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                ref={featuresRef}
                className="mt-24 md:mt-32 max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={featureControls}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
                    <span className="border-b-4 border-indigo-500 pb-2">Why Choose Us</span>
                </h2>
                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            icon: '🏨',
                            title: 'Wide Selection',
                            desc: 'Browse hundreds of hostels across major cities with detailed information and amenities.'
                        },
                        {
                            icon: '💰',
                            title: 'Best Prices',
                            desc: 'Affordable options for every budget with exclusive discounts and seasonal offers.'
                        },
                        {
                            icon: '⭐',
                            title: 'Verified Reviews',
                            desc: 'Make informed decisions with genuine feedback and ratings from verified guests.'
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
                            whileHover={{
                                y: -10,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                            }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <div className="text-4xl md:text-5xl mb-4 bg-indigo-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-semibold mb-3 text-center text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-center">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Testimonials*/}
            <motion.div
                ref={testimonialRef}
                className="mt-24 md:mt-32 max-w-4xl mx-auto text-center px-4 mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialControls}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12">
                    <span className="border-b-4 border-indigo-500 pb-2">What Our Users Say</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        {
                            quote: "Dorm Quest made finding a hostel so easy! The booking process took just minutes, and the hostel was even better than I expected. Highly recommend!",
                            author: "Alex Thompson",
                            role: "Student Traveler"
                        },
                        {
                            quote: "As someone who travels frequently for internships, Dorm Quest has been a lifesaver. Their verified reviews helped me find safe and affordable accommodations.",
                            author: "Priya Sharma",
                            role: "Design Intern"
                        }
                    ].map((testimonial, index) => (
                        <motion.div
                            key={index}
                            className="p-6 md:p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-md border border-indigo-100"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-2xl text-indigo-300 mb-4">"</div>
                            <p className="text-gray-700 italic mb-6">
                                {testimonial.quote}
                            </p>
                            <div className="flex items-center justify-center">
                                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div className="ml-3 text-left">
                                    <p className="font-semibold text-indigo-600">{testimonial.author}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Newsletter Signup */}
            <div className="mt-16 bg-indigo-600 py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Stay Updated with Exclusive Offers
                    </h3>
                    <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                        Subscribe to our newsletter and be the first to know about new hostels, special discounts, and travel tips.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="px-4 py-3 rounded-lg w-full sm:w-auto sm:flex-1 max-w-md mx-auto sm:mx-0"
                            required
                        />
                        <motion.button
                            className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-indigo-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={subscribe}
                        >
                            Subscribe
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}