import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./component/LoginForm";
import RegisterForm from "./component/RegisterForm";
import Dashboard from "./component/Dashboard";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state

    const checkLoginStatus = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Invalid token or session expired");
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        }
        setLoading(false); // Login check is done
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLoginSuccess = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
    };

    if (loading) {
        // Show a loading spinner or some placeholder while checking login status
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            {!isLoggedIn ? (
                isRegistering ? (
                    <RegisterForm switchToLogin={() => setIsRegistering(false)} />
                ) : (
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                )
            ) : (
                <Dashboard user={user} onLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;
