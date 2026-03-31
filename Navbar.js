import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Responsive navigation bar with links to all application pages.
 * Highlights the currently active route.
 */
const Navbar = () => {
    const location = useLocation();

    // Helper to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">ETPMS</span>
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} id="nav-dashboard">
                        <span className="nav-icon">🏠</span>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/employees" className={`nav-link ${isActive('/employees') ? 'active' : ''}`} id="nav-employees">
                        <span className="nav-icon">👥</span>
                        Employees
                    </Link>
                </li>
                <li>
                    <Link to="/tasks" className={`nav-link ${isActive('/tasks') ? 'active' : ''}`} id="nav-tasks">
                        <span className="nav-icon">📋</span>
                        Tasks
                    </Link>
                </li>
                <li>
                    <Link to="/reviews" className={`nav-link ${isActive('/reviews') ? 'active' : ''}`} id="nav-reviews">
                        <span className="nav-icon">⭐</span>
                        Reviews
                    </Link>
                </li>
                <li>
                    <Link to="/ai-analytics" className={`nav-link ${isActive('/ai-analytics') ? 'active' : ''}`} id="nav-ai">
                        <span className="nav-icon">🤖</span>
                        AI Analytics
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
