import React, { useContext, useRef, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { loginContextObj } from "../contexts/LoginContext";
import SingleRoom from "./SingleRoom";
import DoubleRoom from "./DoubleRoom";
import TripleRoom from "./TripleRoom";

const HostelDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { hostelUrl } = state || {};
  const { loginStatus } = useContext(loginContextObj);

  const [hostel, setHostel] = useState(null);
  const [error, setError] = useState("");
  const roomTypeRefs = useRef({});

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await fetch(`http://localhost:4000/hostels/${id}`);
        if (!res.ok) throw new Error("Failed to load hostel data");
        const data = await res.json();
        setHostel(data);

        // create a ref for each roomType string
        const refs = {};
        data.roomTypes.forEach((type) => {
          refs[type] = React.createRef();
        });
        roomTypeRefs.current = refs;
      } catch (e) {
        console.error(e);
        setError("Unable to fetch hostel details. Please try again later.");
      }
    };
    fetchHostel();
  }, [id]);

  const handleBooking = () => {
    if (loginStatus) {
      navigate("/booking", {
        state: {
          hostelId: id,
          hostelName: hostel.name,
          price: hostel.pricePerNight,
        },
      });
    } else {
      navigate("/login", { state: { from: `/hostels/${id}` } });
    }
  };

  const handleRoomClick = (type) => {
    const ref = roomTypeRefs.current[type];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (error)
    return <div className="text-red-600 text-center mt-4">{error}</div>;
  if (!hostel) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-blue-100 via-white to-blue-50 min-h-screen py-10 px-5">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto mb-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <img
            src={hostelUrl || hostel.image}
            alt={hostel.name}
            className="w-full rounded-xl shadow-lg object-cover"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {hostel.name}
            </h2>
            <p className="text-gray-600 text-lg">{hostel.description}</p>
            <p className="mt-4 text-gray-500">
              <strong>Address:</strong> {hostel.address}
            </p>
            <p className="mt-2 text-gray-500">
              <strong>Amenities:</strong> {hostel.amenities.join(", ")}
            </p>
            <p className="mt-2 text-gray-500">
              <strong>Room Types:</strong>{" "}
              {hostel.roomTypes.map((type, idx) => (
                <span key={type}>
                  <button
                    onClick={() => handleRoomClick(type)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {type}
                  </button>
                  {idx < hostel.roomTypes.length - 1 && ", "}
                </span>
              ))}
            </p>
            <div className="mt-6">
              <button
                className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition"
                onClick={handleBooking}
              >
                Book Now
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hostel.location.latitude},${hostel.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition ml-4"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-semibold text-primary">Why Choose Us?</h3>
        <p className="text-lg text-gray-600">
          We offer the best services to make your stay comfortable.
        </p>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          {
            title: "Cozy Rooms",
            desc: "Warm and welcoming environment for all guests.",
            img: "https://plus.unsplash.com/premium_photo-1682093002327-087f25034765?w=500",
          },
          {
            title: "Top Amenities",
            desc: "Wi-Fi, laundry, kitchen, and more.",
            img: "https://plus.unsplash.com/premium_photo-1663061414669-bb34bcd3ff2f?w=500",
          },
          {
            title: "24/7 Security",
            desc: "Safety with round-the-clock monitoring.",
            img: "https://plus.unsplash.com/premium_photo-1681487394066-fbc71a037573?w=500",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <img
              src={f.img}
              alt={f.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <h5 className="mt-4 text-xl font-semibold">{f.title}</h5>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-12"
      >
        <h3 className="text-2xl font-semibold text-primary">What Our Guests Say</h3>
        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {[
            "Amazing experience, friendly staff, and comfortable rooms!",
            "Great value for money. Perfect for students and travelers.",
            "Clean rooms and excellent amenities. Highly recommend!",
          ].map((quote, i) => (
            <div key={i} className="max-w-sm p-4 bg-white rounded-xl shadow-lg">
              <blockquote className="italic text-gray-600">"{quote}"</blockquote>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Room Details Sections */}
      {hostel.roomTypes.map((type) => {
        const price = hostel.roomPrices[type];
        const ref = roomTypeRefs.current[type];

        if (type === "Single")
          return (
            <SingleRoom
              key={type}
              ref={ref}
              roomDetails={{ type, price }}
              hostelName={hostel.name}
            />
          );
        if (type === "Double")
          return <DoubleRoom key={type} ref={ref} roomDetails={{ type, price }} />;
        if (type === "Triple")
          return <TripleRoom key={type} ref={ref} roomDetails={{ type, price }} />;

        return null;
      })}

      {/* Location Map */}
      <div className="mb-12">
        <h3 className="text-center text-2xl font-semibold text-primary">Location</h3>
        <MapContainer
          center={[hostel.location.latitude, hostel.location.longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="mt-6 rounded-xl shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker
            position={[hostel.location.latitude, hostel.location.longitude]}
          >
            <Popup>{hostel.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default HostelDetails;
