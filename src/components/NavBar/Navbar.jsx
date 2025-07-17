import { NavLink } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import './NavBar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <SparklesIcon className="h-4 w-4 text-white" />
                    Fichas App
                </NavLink>

                <div className="navbar-links">
                    <NavLink to="/" className="nav-link">
                        Formulario
                    </NavLink>
                    <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
