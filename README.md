🏠 DormQuest – Hostel Management Platform

DormQuest is a full-stack web application designed to help students easily explore nearby hostels/PGs.  
It focuses on providing clear information, location-based search, and a smooth user experience for discovering accommodation options.

-->What the App Does

DormQuest allows users to:

- 🔍 Search and explore nearby hostels/PGs  
- 📍 View hostel locations on an interactive map  
- 🏠 Check room details like dimensions, accommodation type, and available space  
- ⭐ View and give ratings for hostels  
- 👤 Register, login, and manage their profile  

-->Key Features

- 🔐 User Authentication (Register / Login / Logout)  
- 🏘️ Explore hostels with detailed information  
- 📍 Integrated **Leaflet Maps API** for location-based visualization  
- 🛏️ View room details including size, accommodation type, and images  
- ⭐ Ratings system for hostels  
- 🛠️ Admin functionality to manage hostel data  
- 👤 User profile management  
- 📱 Fully responsive design  

-->Tech Stack

-->Frontend
- React (Vite)
- React Router DOM
- Context API (state management)
- React Hook Form
- Tailwind CSS

-->Backend
- Node.js
- Express.js

-->Database
-MongoDB  

--> Other Tools
-Leaflet Maps API  


🗂️ Data Models (Core Highlight)

The application is structured around two main schemas:

👤 User Schema
- Stores user details (username, email, password)
- Handles authentication and session management  
- Enables personalized access to the platform  

🏠 Hostel Schema
- Stores hostel details such as:
  - Name, location, and images  
  - Room types and accommodation details  
  - Room dimensions and available space  
  - Ratings and reviews  
- Supports efficient search and filtering  

-->How It Works (Flow)

1. User registers or logs in  
2. User browses available hostels/PGs  
3. Locations are displayed using Leaflet Maps  
4. User selects a hostel to view:
   - Room details  
   - Images  
   - Accommodation information  
   - Ratings  
5. Admin can manage hostel data and updates  

-->Purpose of the Project

-->DormQuest aims to:

- Simplify hostel discovery for students  
- Provide clear and structured accommodation details  
- Improve usability through maps and filtering  
- Demonstrate full-stack development with real-world features  

📌 Future Improvements

- 💳 Payment gateway integration  
