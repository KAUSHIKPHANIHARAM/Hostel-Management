import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/About.css';

function About() {
    return (
        <div className="container py-5 about-container">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-primary display-5">About Dorm Quest</h2>
                <p className="text-muted lead mt-3">
                    Your trusted companion in finding the perfect hostel – easily, quickly, and reliably.
                </p>
            </div>

            <div className="row align-items-center">
                <div className="col-md-6 mb-4">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
                        alt="About Dorm Quest"
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6">
                    <h4 className="fw-semibold mb-3">Why Choose Dorm Quest?</h4>
                    <p className="text-muted">
                        Dorm Quest streamlines hostel discovery and booking by offering you a centralized platform to browse, compare, and reserve the best accommodations around you. Our intuitive interface ensures that students and travelers alike can make well-informed decisions with confidence.
                    </p>

                    <div className="about-features mt-4">
                        <h5 className="fw-semibold text-dark mb-3">Key Features:</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">✅ Comprehensive hostel listings with location-based filters</li>
                            <li className="list-group-item">✅ Real-time room availability and sharing types</li>
                            <li className="list-group-item">✅ Detailed layouts, amenities, and images</li>
                            <li className="list-group-item">✅ Integrated route maps for easy navigation</li>
                            <li className="list-group-item">✅ Seamless online booking with instant confirmation</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center mt-5">
                <h4 className="text-success fw-bold">Empowering Hostel Management</h4>
                <p className="text-muted">
                    Our mission is to bring clarity, efficiency, and transparency to hostel booking and management through smart technology and user-friendly design.
                </p>
            </div>
        </div>
    );
}

export default About;
