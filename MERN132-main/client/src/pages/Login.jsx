import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const [formData,     setFormData]     = useState({ email: '', password: '' });
    const [focused,      setFocused]      = useState('');
    const [status,       setStatus]       = useState('');
    const [errorMsg,     setErrorMsg]     = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // ── Email / Password login ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    // ── Google OAuth login ────────────────────────────────────────────────────
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setStatus('google-loading');
            setErrorMsg('');
            try {
                // Fetch user info from Google using the access token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                // Send to our backend
                await googleLogin({
                    googleId:  userInfo.sub,
                    email:     userInfo.email,
                    firstName: userInfo.given_name,
                    lastName:  userInfo.family_name,
                    avatar:    userInfo.picture,
                });

                navigate('/');
            } catch (err) {
                setStatus('error');
                setErrorMsg(err.message || 'Google login failed. Please try again.');
            }
        },
        onError: () => {
            setStatus('error');
            setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
        },
    });

    const isLoading = status === 'loading' || status === 'google-loading';

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="min-h-screen bg-primary flex items-center justify-center px-4 py-24 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.8) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

            <div className="relative z-10 w-full max-w-md animate-fade-in-up">

                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/30 group-hover:scale-105 transition-transform duration-300">
                            JB
                        </div>
                        <span className="text-white font-serif font-bold text-2xl tracking-wide group-hover:text-secondary-light transition-colors">
                            James Brown LS
                        </span>
                    </Link>
                    <p className="text-blue-300/60 text-sm mt-3 font-light">Researcher portal — sign in to continue</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">

                    {/* Google button */}
                    <button
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg mb-6 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {status === 'google-loading' ? (
                            <svg className="animate-spin w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.9 13.3l7.8 6C12.5 13 17.8 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 6.9-10.1 6.9-17z"/>
                                <path fill="#FBBC05" d="M10.7 28.7A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 000 24c0 3.9.9 7.5 2.5 10.7l8.2-6z"/>
                                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-8.2 6C6.7 42.6 14.7 48 24 48z"/>
                            </svg>
                        )}
                        {status === 'google-loading' ? 'Signing in with Google...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-blue-300/40 text-xs font-medium tracking-widest uppercase">or sign in with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Error banner */}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-red-300 text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* Email / password form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === 'email' ? 'text-secondary-light' : 'text-blue-300/60'}`}>
                                Email Address
                            </label>
                            <input type="email" name="email" value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                required placeholder="you@example.com" disabled={isLoading}
                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all disabled:opacity-60" />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className={`text-xs font-semibold tracking-widest uppercase transition-colors ${focused === 'password' ? 'text-secondary-light' : 'text-blue-300/60'}`}>
                                    Password
                                </label>
                                <a href="#" className="text-xs text-secondary/70 hover:text-secondary transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                                    required placeholder="••••••••" disabled={isLoading}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all disabled:opacity-60" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-blue-200 transition-colors" tabIndex={-1}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded accent-secondary cursor-pointer" />
                            <label htmlFor="remember" className="text-sm text-blue-200/60 cursor-pointer select-none">Keep me signed in</label>
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide">
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-blue-300/40 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-secondary-light hover:text-white font-semibold transition-colors">
                            Request Access
                        </Link>
                    </p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-8 text-blue-400/30">
                    <div className="flex items-center gap-1.5 text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        SSL Encrypted
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5 text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        SOC 2
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1.5 text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
                        GDPR Ready
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;