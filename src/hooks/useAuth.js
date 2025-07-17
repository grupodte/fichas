import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('secret-key-authenticated');
        if (loggedIn) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    const login = (key) => {
        if (key === import.meta.env.VITE_SECRET_KEY) {
            localStorage.setItem('secret-key-authenticated', 'true');
            setIsAuthenticated(true);
            navigate('/');
        } else {
            alert('Invalid secret key');
        }
    };

    const logout = () => {
        localStorage.removeItem('secret-key-authenticated');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, login, logout };
};

export default useAuth;
