import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { SparklesIcon } from '@heroicons/react/24/outline'; // Necesitás Heroicons o tu logo SVG

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    <SparklesIcon className="h-5 w-5 text-white" />
                    Fichas App
                </NavLink>
                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Formulario
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Dashboard
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
