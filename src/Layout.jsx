import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Asegúrate de que esta ruta sea correcta

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
        <div className="flex min-h-screen bg-gray-100">
            {/* Barra lateral */}
            <Sidebar onLogout={handleLogout} />

            {/* Contenido principal */}
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
