import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginContextObj } from '../contexts/LoginContext';
import { Menu } from 'lucide-react';

export default function Header() {
    const { loginStatus, userLogout, currentUser } = useContext(loginContextObj);
    const [open, setOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600';

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <NavLink to="/" className="text-2xl font-bold text-indigo-600">
                    Dorm Quest
                </NavLink>
                <button className="lg:hidden" onClick={() => setOpen(!open)}>
                    <Menu size={24} />
                </button>
                <ul className={`${open ? 'block' : 'hidden'} lg:flex space-y-2 lg:space-y-0 lg:space-x-6 text-gray-700`}>
                    <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
                    <li><NavLink to="/hostels" className={linkClass}>Hostels</NavLink></li>
                    {loginStatus ? (
                        <>
                            <li><NavLink to="/booking" className={linkClass}>Bookings</NavLink></li>
                            <li><NavLink to="/user-profile" className={linkClass}>Profile</NavLink></li>
                            <li><NavLink to="/" onClick={userLogout} className={linkClass}>Logout</NavLink></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
                            <li><NavLink to="/register" className={linkClass}>Register</NavLink></li>
                            <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
