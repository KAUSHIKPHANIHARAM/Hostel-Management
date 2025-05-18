import React from 'react';

const cities = [
    {
        name: "Mumbai",
        image: "https://source.unsplash.com/300x200/?mumbai,city",
    },
    {
        name: "Chennai",
        image: "https://source.unsplash.com/300x200/?chennai,city",
    },
    {
        name: "Vizag",
        image: "https://source.unsplash.com/300x200/?vizag,beach",
    },
    {
        name: "Hyderabad",
        image: "https://source.unsplash.com/300x200/?hyderabad,city",
    },
    {
        name: "Bangalore",
        image: "https://source.unsplash.com/300x200/?bangalore,urban",
    },
    {
        name: "Delhi",
        image: "https://source.unsplash.com/300x200/?delhi,india",
    },
];

const AvailableCities = () => {
    return (
        <div className="bg-white py-4 shadow-sm">
            <h3 className="text-center text-primary text-2xl font-semibold mb-4">We Are Available In</h3>

            <div className="flex overflow-x-auto space-x-4 px-4 pb-2">
                {cities.map((city, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-48 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <img
                            src={city.image}
                            alt={city.name}
                            className="w-full h-28 object-cover rounded-t-lg"
                        />
                        <div className="p-2 text-center">
                            <h5 className="text-md font-medium text-gray-800">{city.name}</h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableCities;
