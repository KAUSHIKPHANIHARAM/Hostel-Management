import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Hostels = () => {
    const [hostels, setHostels] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const response = await fetch(`http://localhost:4000/hostels`);
                if (!response.ok) throw new Error("Failed to fetch hostels");
                const data = await response.json();
                setHostels(data);
            } catch (err) {
                console.error("Error fetching hostels:", err);
                setError("Unable to load hostels. Please try again later.");
            }
        };

        fetchHostels();
    }, []);

    const handleViewDetails = (hostel) => {
        navigate(`/hostels/${hostel.id}`, { state: { hostelUrl: hostel.image } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-50 py-10 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">Available Hostels</h2>
            {error && <div className="text-red-600 text-center">{error}</div>}

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {hostels.map((hostel, index) => (
                    <motion.div
                        key={hostel.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                        <img
                            src={hostel.image}
                            alt={hostel.name}
                            className="w-full h-48 object-cover rounded-t-xl"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-blue-700">{hostel.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{hostel.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {hostel.amenities.slice(0, 3).map((amenity, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={() => handleViewDetails(hostel)}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Hostels;
