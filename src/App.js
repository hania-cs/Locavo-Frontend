import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/HomePage";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import NotFound from "./pages/Page404";
import BookCars from "./components/BookCars";
import CarDetails from './components/CarDetails';
import AdminPage from './components/AdminPage';
import Cookies from 'js-cookie';
import CookieConsent from "react-cookie-consent";
import { Button } from '@chakra-ui/react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        cookieName="myAwesomeCookieName"
        style={{
          background: "white",
          color: "black",
          textAlign: "center",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          borderRadius: "8px",
        }}
        buttonComponent={(props) => (
          <Button
            size="sm"
            colorScheme="blue"
            variant="solid"
            {...props}
          >
            Accept
          </Button>
        )}
        declineButtonComponent={(props) => (
          <Button
            size="sm"
            colorScheme="red"
            variant="solid"
            ml={2}
            {...props}
          >
            Decline
          </Button>
        )}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{" "}
        <span style={{ fontSize: "10px" }}>
          <a href="/cookie-policy" style={{ color: "yellow", textDecoration: "underline" }}>Learn more</a>
        </span>
      </CookieConsent>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route 
          path="/rent-car" 
          element={isLoggedIn ? <BookCars /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/car-details/:id" 
          element={<CarDetails />} 
        />
        <Route 
          path="/admin" 
          element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="*" 
          element={<NotFound />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
