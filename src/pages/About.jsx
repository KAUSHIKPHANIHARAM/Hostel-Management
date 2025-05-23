import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, Shield, Users, Wifi, Coffee, Car, Star, CheckCircle, ArrowRight, Bed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function About() {
    const [isVisible, setIsVisible] = useState({});
    const navigate = useNavigate()
    const [counters, setCounters] = useState({
        hostels: 0,
        students: 0,
        cities: 0,
        satisfaction: 0
    });

    function gotoHostels() {
        navigate('/hostels')
    }

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[id^="animate-"]');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Counter animation
    useEffect(() => {
        const animateCounter = (target, key) => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                setCounters(prev => ({
                    ...prev,
                    [key]: Math.floor(current)
                }));
            }, 20);
        };

        if (isVisible['animate-stats']) {
            animateCounter(25, 'hostels');
            animateCounter(1000, 'students');
            animateCounter(10, 'cities');
            animateCounter(85, 'satisfaction');
        }
    }, [isVisible['animate-stats']]);

    const features = [
        {
            icon: Building2,
            title: "Comprehensive Listings",
            description: "Browse through verified hostel listings with detailed information",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: MapPin,
            title: "Location-Based Search",
            description: "Find hostels near your preferred locations with interactive maps",
            color: "from-green-500 to-green-600"
        },
        {
            icon: Calendar,
            title: "Real-Time Availability",
            description: "Check live room availability and book instantly",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Shield,
            title: "Secure Booking",
            description: "Safe and secure payment processing with instant confirmation",
            color: "from-red-500 to-red-600"
        }
    ];

    const amenities = [
        { icon: Wifi, name: "High-Speed WiFi" },
        { icon: Coffee, name: "Common Areas" },
        { icon: Car, name: "Parking Available" },
        { icon: Users, name: "Study Rooms" },
        { icon: Bed, name: "Furnished Rooms" },
        { icon: Shield, name: "24/7 Security" }
    ];

    const benefits = [
        "Comprehensive hostel listings with location-based filters",
        "Real-time room availability and sharing types",
        "Detailed layouts, amenities, and high-quality images",
        "Integrated route maps for easy navigation",
        "Seamless online booking with instant confirmation",
        "24/7 customer support and assistance"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        <Building2 size={20 + Math.random() * 20} className="text-indigo-400" />
                    </div>
                ))}
            </div>

            <div className="container py-5 relative">
                {/* Hero Section */}
                <div
                    id="animate-hero"
                    className={`text-center mb-5 transition-all duration-1000 ${isVisible['animate-hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="fw-bold display-4 mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                        About Dorm Quest
                    </h2>
                    <p className="text-muted lead mt-3 max-w-3xl mx-auto">
                        Your trusted companion in finding the perfect hostel – easily, quickly, and reliably.
                        We're revolutionizing how students find their home away from home.
                    </p>
                </div>

                {/* Stats Section */}
                <div
                    id="animate-stats"
                    className={`row text-center mb-5 transition-all duration-1000 delay-200 ${isVisible['animate-stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="col-6 col-md-3 mb-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 h-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl font-bold text-indigo-600">{counters.hostels}+</div>
                            <div className="text-sm text-gray-600">Verified Hostels</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 mb-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 h-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl font-bold text-green-600">{counters.students.toLocaleString()}+</div>
                            <div className="text-sm text-gray-600">Happy Students</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 mb-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 h-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl font-bold text-purple-600">{counters.cities}+</div>
                            <div className="text-sm text-gray-600">Cities Covered</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3 mb-4">
                        <div className="bg-white rounded-lg shadow-lg p-4 h-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl font-bold text-yellow-600">{counters.satisfaction}%</div>
                            <div className="text-sm text-gray-600">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="row align-items-center mb-5">
                    <div
                        id="animate-image"
                        className={`col-md-6 mb-4 transition-all duration-1000 delay-300 ${isVisible['animate-image'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                    >
                        <div className="relative group">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
                                alt="Modern Student Hostel Interior"
                                className="img-fluid rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Floating Stats on Image */}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                                <div className="flex items-center text-sm">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="font-semibold">4.9/5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        id="animate-content"
                        className={`col-md-6 transition-all duration-1000 delay-400 ${isVisible['animate-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                            }`}
                    >
                        <h4 className="fw-semibold mb-3 text-dark">Why Choose Dorm Quest?</h4>
                        <p className="text-muted mb-4">
                            Dorm Quest streamlines hostel discovery and booking by offering you a centralized platform to browse, compare, and reserve the best accommodations. Our intuitive interface ensures that students and travelers alike can make well-informed decisions with confidence.
                        </p>

                        <div className="space-y-3">
                            <h5 className="fw-semibold text-dark mb-3">Key Benefits:</h5>
                            <div className="space-y-2">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div
                    id="animate-features"
                    className={`mb-5 transition-all duration-1000 delay-500 ${isVisible['animate-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h4 className="text-center fw-bold mb-4 text-dark">Our Core Features</h4>
                    <div className="row">
                        {features.map((feature, index) => (
                            <div key={index} className="col-md-6 col-lg-3 mb-4">
                                <div className="bg-white rounded-lg shadow-lg p-4 h-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h6 className="fw-semibold mb-2">{feature.title}</h6>
                                    <p className="text-muted small mb-0">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Amenities Section */}
                <div
                    id="animate-amenities"
                    className={`mb-5 transition-all duration-1000 delay-600 ${isVisible['animate-amenities'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="bg-white rounded-lg shadow-xl p-5">
                        <h4 className="text-center fw-bold mb-4 text-dark">Common Hostel Amenities</h4>
                        <div className="row">
                            {amenities.map((amenity, index) => (
                                <div key={index} className="col-6 col-md-4 col-lg-2 mb-3">
                                    <div className="text-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                                        <amenity.icon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                        <div className="text-sm text-gray-700">{amenity.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div
                    id="animate-cta"
                    className={`text-center transition-all duration-1000 delay-700 ${isVisible['animate-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-xl p-5 text-white">
                        <h4 className="fw-bold mb-3">Empowering Hostel Management</h4>
                        <p className="mb-4 opacity-90">
                            Our mission is to bring clarity, efficiency, and transparency to hostel booking and management through smart technology and user-friendly design.
                        </p>
                        <button className="btn btn-light btn-lg px-4 py-2 hover:shadow-lg transition-shadow duration-200" onClick={gotoHostels}>
                            <span className="fw-semibold"  >Get Started Today</span>
                            <ArrowRight className="w-5 h-5 ml-2 inline" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .bg-clip-text {
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .space-y-2 > * + * {
                    margin-top: 0.5rem;
                }
                
                .space-y-3 > * + * {
                    margin-top: 0.75rem;
                }
            `}</style>
        </div>
    );
}

export default About;