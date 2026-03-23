import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled,    setScrolled]    = useState(false);
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location  = useLocation();
    const navigate  = useNavigate();
    const { user, logout } = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const navLinks = [
        { name: 'Home',     path: '/' },
        { name: 'About',    path: '/about' },
        { name: 'Products', path: '/products' },
        { name: 'Careers',  path: '/careers' },
        { name: 'Contact',  path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-primary/95 backdrop-blur-md shadow-lg py-3' : 'bg-primary py-4'
        }`}>
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 bg-gradient-to-br from-primary-light to-primary-dark border border-secondary/30 group-hover:border-secondary/60 transition-all duration-300">
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                                <path d="M8 3C8 3 10 6 13 6C16 6 18 3 18 3" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round"/>
                                <path d="M8 23C8 23 10 20 13 20C16 20 18 23 18 23" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
                                <path d="M9.5 3.5 C7 7 7 10 9.5 13 C12 16 12 19 9.5 22.5" stroke="#0EA5E9" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                <path d="M16.5 3.5 C19 7 19 10 16.5 13 C14 16 14 19 16.5 22.5" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                                <line x1="9" y1="7.5" x2="17" y2="7.5" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                <line x1="8.2" y1="11" x2="17.8" y2="11" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                <line x1="8.2" y1="15" x2="17.8" y2="15" stroke="rgba(14,165,233,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                                <line x1="9" y1="18.5" x2="17" y2="18.5" stroke="rgba(245,158,11,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-white font-serif font-bold text-xl tracking-wide group-hover:text-secondary-light transition-colors">James Brown</span>
                            <span className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase -mt-0.5">Life Sciences</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-7">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path}
                                className={`text-sm font-medium transition-all duration-300 relative group py-2 ${
                                    isActive(link.path) ? 'text-secondary-light' : 'text-gray-300 hover:text-white'
                                }`}>
                                {link.name}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-accent rounded-full transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        ))}
                    </div>

                    {/* Auth buttons — changes based on login state */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            // ── Logged in: show avatar + dropdown ──────────
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-full pl-3 pr-4 py-2 hover:bg-white/12 transition-all duration-200">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-white text-sm font-medium">{user.firstName}</span>
                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-primary-light border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
                                            <p className="text-blue-300/50 text-xs mt-0.5">{user.email}</p>
                                            <span className="inline-block mt-1.5 text-xs bg-secondary/15 text-secondary px-2 py-0.5 rounded-full">{user.role}</span>
                                        </div>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // ── Not logged in: show Login + Sign Up ────────
                            <>
                                <Link to="/login"
                                    className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-300 ${
                                        isActive('/login') ? 'border-secondary text-secondary-light' :
                                        'border-white/20 text-gray-300 hover:border-white/50 hover:text-white'}`}>
                                    Log In
                                </Link>
                                <Link to="/register"
                                    className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-md shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white hover:text-accent transition p-2">
                            {mobileOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-primary/98 backdrop-blur-md border-t border-white/10 px-6 pt-4 pb-6 space-y-1">
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive(link.path) ? 'bg-secondary/10 text-secondary-light' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-3 flex flex-col space-y-2">
                        {user ? (
                            <>
                                <div className="px-4 py-3 bg-white/5 rounded-xl">
                                    <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
                                    <p className="text-blue-300/50 text-xs">{user.email}</p>
                                </div>
                                <button onClick={handleLogout} className="block text-center px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-center px-4 py-3 rounded-xl border border-white/20 text-gray-300 text-sm font-semibold hover:border-white/40 hover:text-white transition-all">Log In</Link>
                                <Link to="/register" className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-dark text-white text-sm font-bold">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;