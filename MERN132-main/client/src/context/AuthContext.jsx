import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null);
    const [loading, setLoading] = useState(true); // true while checking stored token

    // ── On mount: check if token exists and is still valid ───────────────────
    useEffect(() => {
        const token = localStorage.getItem('jbls_token');
        if (token) {
            fetchMe(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async (token) => {
        try {
            const res = await fetch(`${API}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                localStorage.removeItem('jbls_token');
            }
        } catch {
            localStorage.removeItem('jbls_token');
        } finally {
            setLoading(false);
        }
    };

    // ── Register ─────────────────────────────────────────────────────────────
    const register = async (formData) => {
        const res = await fetch(`${API}/api/auth/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        localStorage.setItem('jbls_token', data.token);
        setUser(data.user);
        return data.user;
    };

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (email, password) => {
        const res = await fetch(`${API}/api/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('jbls_token', data.token);
        setUser(data.user);
        return data.user;
    };

    // ── Google login ──────────────────────────────────────────────────────────
    const googleLogin = async (googleData) => {
        const res = await fetch(`${API}/api/auth/google`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(googleData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google login failed');
        localStorage.setItem('jbls_token', data.token);
        setUser(data.user);
        return data.user;
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        localStorage.removeItem('jbls_token');
        setUser(null);
    };

    // ── Get token for API calls ───────────────────────────────────────────────
    const getToken = () => localStorage.getItem('jbls_token');

    return (
        <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};