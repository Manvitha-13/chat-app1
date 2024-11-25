import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Chat from './components/Chat';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after auth state changes
    });

    return () => unsubscribe(); // Clean up on component unmount
  }, []);

  if (loading) return <div className="loading">Loading...</div>; // Optional loading indicator

  return (
    <Router>
      <Routes>
        {/* Route for the Login Page */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

        {/* Route for the Signup Page */}
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />

        {/* Protected Route for the Chat Page */}
        <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
