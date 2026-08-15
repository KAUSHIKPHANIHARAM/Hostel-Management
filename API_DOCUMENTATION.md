# 📚 DormQuest Backend REST API Documentation

This document describes all REST API endpoints available in the **DormQuest – Hostel Management Platform** backend.

**Base URL**: `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication Endpoints (`/api/auth`)](#1-authentication-endpoints-apiauth)
   - [Register User](#post-apiauthregister)
   - [Login User](#post-apiauthlogin)
   - [Get Current Authenticated User](#get-apiauthme)
2. [Hostel Endpoints (`/api/hostels`)](#2-hostel-endpoints-apihostels)
   - [Get All Hostels & Filtering](#get-apihostels)
   - [Get Hostel by ID](#get-apihostelsid)
   - [Create Hostel](#post-apihostels)
3. [Booking Endpoints (`/api/bookings`)](#3-booking-endpoints-apibookings)
   - [Create Booking](#post-apibookings)
   - [Get Bookings](#get-apibookings)
   - [Get Booking by ID](#get-apibookingsid)
   - [Cancel / Delete Booking](#delete-apibookingsid)
4. [User Profile Endpoints (`/api/users`)](#4-user-profile-endpoints-apiusers)
   - [Get User Profile](#get-apiusersid)
   - [Update User Profile](#patch-apiusersid)
   - [Delete User Account](#delete-apiusersid)
5. [Health Check](#5-health-check)
6. [Status Codes & Error Responses](#6-status-codes--error-responses)

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Register a new user account with hashed password and receive a JWT.

- **Authentication Required**: No
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "username": "KaushikP",
  "email": "kaushik@example.com",
  "password": "kaushik@123",
  "name": "Kaushik",
  "phone": "9848012345",
  "address": "Hyderabad, India"
}
```
- **Response (201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67b0c39f1e1a8a21f4a9b201",
    "username": "KaushikP",
    "email": "kaushik@example.com",
    "name": "Kaushik",
    "phone": "9848012345",
    "address": "Hyderabad, India",
    "bio": "",
    "dob": "",
    "gender": "",
    "createdAt": "2026-08-15T16:55:00.000Z",
    "updatedAt": "2026-08-15T16:55:00.000Z"
  }
}
```

---

### `POST /api/auth/login`
Authenticate an existing user using username or email and password.

- **Authentication Required**: No
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "username": "KaushikP",
  "password": "kaushik@123"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67b0c39f1e1a8a21f4a9b201",
    "username": "KaushikP",
    "email": "kaushik@example.com",
    "name": "Kaushik",
    "phone": "9848012345",
    "address": "Hyderabad, India",
    "bio": "",
    "dob": "",
    "gender": ""
  }
}
```
- **Response (401 Unauthorized)**:
```json
{
  "message": "UserName or password not correct"
}
```

---

### `GET /api/auth/me`
Retrieve currently logged-in user profile from JWT token.

- **Authentication Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "id": "67b0c39f1e1a8a21f4a9b201",
  "username": "KaushikP",
  "email": "kaushik@example.com",
  "name": "Kaushik",
  "phone": "9848012345",
  "address": "Hyderabad, India",
  "bio": "",
  "dob": "",
  "gender": ""
}
```

---

## 2. Hostel Endpoints (`/api/hostels`)

### `GET /api/hostels`
Retrieve all hostels or filter by query parameters.

- **Authentication Required**: No
- **Optional Query Parameters**:
  - `search` or `searchTerm` (e.g. `?searchTerm=Miyapur`)
  - `minRating` (e.g. `?minRating=4.0`)
  - `maxPrice` (e.g. `?maxPrice=80`)
  - `amenities` (e.g. `?amenities=WiFi,Gym`)
  - `location` (e.g. `?location=Hyderabad`)
- **Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Miyapur Hostels",
    "description": "A cozy hostel located in the heart of the city, ideal for solo travelers and small groups.",
    "location": {
      "latitude": 17.4933,
      "longitude": 78.3925
    },
    "roomTypes": ["Single", "Double", "Triple"],
    "roomPrices": {
      "Single": 500,
      "Double": 800,
      "Triple": 1000
    },
    "amenities": ["WiFi", "Laundry", "Gym", "Kitchen"],
    "address": "123 Main St, Miyapur, Hyderabad",
    "pricePerNight": 50,
    "rating": 4.3,
    "reviews": 128,
    "image": "https://media.istockphoto.com/id/1045047954/photo/young-backpackers-in-hostel.webp?..."
  }
]
```

---

### `GET /api/hostels/:id`
Retrieve details of a single hostel by its numeric ID (e.g. `1`, `2`) or MongoDB ObjectId.

- **Authentication Required**: No
- **Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Miyapur Hostels",
  "description": "A cozy hostel located in the heart of the city...",
  "location": {
    "latitude": 17.4933,
    "longitude": 78.3925
  },
  "roomTypes": ["Single", "Double", "Triple"],
  "roomPrices": {
    "Single": 500,
    "Double": 800,
    "Triple": 1000
  },
  "amenities": ["WiFi", "Laundry", "Gym", "Kitchen"],
  "address": "123 Main St, Miyapur, Hyderabad",
  "pricePerNight": 50,
  "rating": 4.3,
  "reviews": 128,
  "image": "https://media.istockphoto.com/..."
}
```
- **Response (404 Not Found)**:
```json
{
  "message": "Hostel not found"
}
```

---

## 3. Booking Endpoints (`/api/bookings`)

### `POST /api/bookings`
Create a new hostel room reservation.

- **Authentication Required**: Optional (Associates `userId` if Bearer token is passed)
- **Request Body**:
```json
{
  "hostelId": "2",
  "hostelName": "Bachupally Hostels",
  "name": "Deva",
  "email": "Deva@example.com",
  "roomType": "Double",
  "guests": 2,
  "arrivalDate": "2026-09-10",
  "departureDate": "2026-09-15",
  "specialRequests": "Quiet floor",
  "nights": 5,
  "totalPrice": 200
}
```
- **Response (201 Created)**:
```json
{
  "id": "67b0c39f1e1a8a21f4a9b305",
  "userId": "67b0c39f1e1a8a21f4a9b201",
  "hostelId": "2",
  "hostelName": "Bachupally Hostels",
  "name": "Deva",
  "email": "Deva@example.com",
  "roomType": "Double",
  "guests": 2,
  "arrivalDate": "2026-09-10",
  "departureDate": "2026-09-15",
  "specialRequests": "Quiet floor",
  "nights": 5,
  "totalPrice": 200,
  "status": "confirmed",
  "createdAt": "2026-08-15T16:56:00.000Z"
}
```

---

### `GET /api/bookings`
Retrieve bookings for the authenticated user or by email query.

- **Authentication Required**: Optional (`Authorization: Bearer <token>` filters by logged-in user)
- **Response (200 OK)**:
```json
[
  {
    "id": "67b0c39f1e1a8a21f4a9b305",
    "hostelName": "Bachupally Hostels",
    "roomType": "Double",
    "guests": 2,
    "arrivalDate": "2026-09-10",
    "departureDate": "2026-09-15",
    "totalPrice": 200,
    "status": "confirmed"
  }
]
```

---

### `DELETE /api/bookings/:id`
Cancel an existing booking.

- **Authentication Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "message": "Booking cancelled successfully"
}
```

---

## 4. User Profile Endpoints (`/api/users`)

### `GET /api/users/:id` or `GET /api/users/me`
Retrieve user profile data.

- **Authentication Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "id": "67b0c39f1e1a8a21f4a9b201",
  "username": "Deva",
  "email": "Deva@123",
  "phone": "9848765633",
  "address": "Vnr boys hostel",
  "bio": "hi friends",
  "dob": "2025-05-14",
  "gender": "female"
}
```

---

### `PATCH /api/users/:id` or `PUT /api/users/me`
Update profile details for the authenticated user.

- **Authentication Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "username": "Deva",
  "email": "Deva@123",
  "phone": "9848765633",
  "address": "Vnr boys hostel, Bachupally",
  "bio": "Full stack developer & traveler",
  "dob": "2005-05-14",
  "gender": "female"
}
```
- **Response (200 OK)**:
```json
{
  "id": "67b0c39f1e1a8a21f4a9b201",
  "username": "Deva",
  "email": "Deva@123",
  "phone": "9848765633",
  "address": "Vnr boys hostel, Bachupally",
  "bio": "Full stack developer & traveler",
  "dob": "2005-05-14",
  "gender": "female"
}
```

---

### `DELETE /api/users/:id`
Delete user account.

- **Authentication Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "message": "User deleted successfully"
}
```

---

## 5. Health Check

### `GET /api/health`
Check if server is active.

- **Response (200 OK)**:
```json
{
  "status": "ok",
  "message": "DormQuest Backend API is running"
}
```

---

## 6. Status Codes & Error Responses

| Status Code | Description |
| :--- | :--- |
| **200 OK** | The request was successful. |
| **201 Created** | A new resource was successfully created. |
| **400 Bad Request** | Missing or invalid request body/parameters. |
| **401 Unauthorized** | Missing, invalid, or expired JWT token, or incorrect credentials. |
| **404 Not Found** | The requested resource (hostel/booking/user/route) does not exist. |
| **500 Server Error** | Unexpected internal server error. |

All error responses return a standardized JSON structure:
```json
{
  "message": "Detailed error description"
}
```
