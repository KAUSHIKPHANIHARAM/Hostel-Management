import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoIosStar } from "react-icons/io";
import { hostelApi } from "../services/api";

const Hostels = () => {
    const [hostels, setHostels] = useState([]);
    const [filteredHostels, setFilteredHostels] = useState([]);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        minRating: 0,
        maxPrice: 10000,
        amenities: [],
        searchTerm: ""
    });
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Available amenities for filter options
    const availableAmenities = [
        "WiFi", "AC", "TV", "Parking", "Laundry", "Kitchen", "Security",
        "Gym", "Pool", "Study Room", "Common Area", "24/7 Power"
    ];

    useEffect(() => {
        const fetchHostels = async () => {
            setIsLoading(true);
            try {
                const data = await hostelApi.getAll();
                setHostels(data);
                setFilteredHostels(data);
                setError("");
            } catch (err) {
                console.error("Error fetching hostels:", err);
                setError("Unable to load hostels. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHostels();
    }, []);

    // Filter hostels based on current filter criteria
    useEffect(() => {
        let filtered = hostels.filter(hostel => {
            // Rating filter
            if (hostel.rating < filters.minRating) return false;

            // Price filter
            const price = hostel.pricePerNight || hostel.price || 0;
            if (price && price > filters.maxPrice) return false;

            // Search term filter
            if (filters.searchTerm && 
                !hostel.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
                !hostel.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
                !hostel.address?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
                return false;
            }

            // Amenities filter
            if (filters.amenities.length > 0) {
                const hasAllAmenities = filters.amenities.every(amenity =>
                    hostel.amenities?.includes(amenity)
                );
                if (!hasAllAmenities) return false;
            }

            return true;
        });

        setFilteredHostels(filtered);
    }, [hostels, filters]);

    const handleViewDetails = (hostel) => {
        const hostelId = hostel.id !== undefined && hostel.id !== null ? hostel.id : hostel._id;
        navigate(`/hostels/${hostelId}`, { state: { hostelUrl: hostel.image } });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const clearFilters = () => {
        setFilters({
            minRating: 0,
            maxPrice: 10000,
            amenities: [],
            searchTerm: ""
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-50 py-10 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">Available Hostels</h2>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <span className="text-gray-600">
                        Showing {filteredHostels.length} of {hostels.length} hostels
                    </span>
                </div>

                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-xl shadow-md p-6 mb-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Search Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={filters.searchTerm}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                    placeholder="Search hostels..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Rating: {filters.minRating}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={filters.minRating}
                                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Price: ₹{filters.maxPrice}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="1000"
                                    step="10"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>

                        {/* Amenities Filter */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Amenities ({filters.amenities.length} selected)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableAmenities.map((amenity) => (
                                    <button
                                        key={amenity}
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className={`px-3 py-1 rounded-full text-sm transition ${filters.amenities.includes(amenity)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {isLoading && <div className="text-center py-10 text-gray-600">Loading hostels...</div>}
            {error && <div className="text-red-600 text-center py-4">{error}</div>}

            {!isLoading && (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {filteredHostels.map((hostel, index) => {
                        const hostelKey = hostel.id || hostel._id || index;
                        return (
                            <motion.div
                                key={hostelKey}
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
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-semibold text-blue-700">{hostel.name}</h3>
                                        <div className="flex items-center space-x-1 text-yellow-500">
                                            <IoIosStar className="text-lg" />
                                            <p className="text-sm font-medium text-gray-800">{hostel.rating}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mt-1">{hostel.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {hostel.amenities && hostel.amenities.slice(0, 3).map((amenity, i) => (
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
                        );
                    })}
                </div>
            )}

            {/* No results message */}
            {!isLoading && filteredHostels.length === 0 && hostels.length > 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-lg">No hostels match your current filters.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Hostels;