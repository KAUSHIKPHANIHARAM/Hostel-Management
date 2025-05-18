import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-indigo-600 text-white py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* About */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">About Dorm Quest</h3>
                    <p className="text-gray-200">
                        Dorm Quest simplifies hostel booking for travelers worldwide. Browse verified listings,
                        compare prices, and book instantly.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                    <ul className="space-y-1">
                        <li><NavLink to="/" className="hover:underline">Home</NavLink></li>
                        <li><NavLink to="/hostels" className="hover:underline">Hostels</NavLink></li>
                        <li><NavLink to="/about" className="hover:underline">About Us</NavLink></li>
                        <li><NavLink to="/contact" className="hover:underline">Contact</NavLink></li>
                    </ul>
                </div>
                {/* Contact */}
                <div>
                    <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
                    <p>Email: support@dormquest.com</p>
                    <p>Phone: +91 12345 67890</p>
                    <p>Address: VNRVJIET, Hyderabad, India</p>
                </div>
            </div>
            <div className="text-center mt-6 text-gray-200">
                &copy; {new Date().getFullYear()} Dorm Quest. All rights reserved.
            </div>
        </footer>
    );
}