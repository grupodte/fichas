import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("secret-key-authenticated");

    const handleLogout = () => {
        localStorage.removeItem("secret-key-authenticated");
        navigate("/login");
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <header>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
