import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { loginContextObj } from './contexts/LoginContext';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Hostels from './pages/Hostels';
import UserProfile from './pages/UserProfile';
import Booking from './pages/Booking';
import HostelDetails from './pages/HostelDetails';
import RootLayout from './pages/RootLayout';
import ErrorPage from './components/ErrorPage';
import Register from './pages/Register';
import Login from './pages/Login';
import SingleRoom from './pages/SingleRoom';
import DoubleRoom from './pages/DoubleRoom';
import TripleRoom from './pages/TripleRoom';
import Payment from './pages/Payment';

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <Home /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "user-profile", element: <UserProfile /> },
        { path: "hostels", element: <Hostels /> },
        {
          path: "hostels/:id",
          element: <HostelDetails />,
          children: [
            { path: "single", element: <SingleRoom /> },
            { path: "double", element: <DoubleRoom /> },
            { path: "triple", element: <TripleRoom /> },
          ]
        },
        { path: "booking", element: <Booking /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "payment", element: <Payment /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ]
    },
  ]);

  return <RouterProvider router={browserRouterObj} />;
}

export default App;
