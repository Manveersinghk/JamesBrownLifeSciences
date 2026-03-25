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
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();
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

            <style>{`
                .light-input {
                    background-color: #f8fafc !important;
                    color: #111827 !important;
                    caret-color: #0EA5E9;
                }
                .light-input::placeholder { color: #9ca3af !important; }
                .light-input:focus, .light-input:active, .light-input:hover {
                    background-color: #f8fafc !important;
                    color: #111827 !important;
                }
                .light-input:-webkit-autofill,
                .light-input:-webkit-autofill:hover,
                .light-input:-webkit-autofill:focus,
                .light-input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 9999px #f8fafc inset !important;
                    -webkit-text-fill-color: #111827 !important;
                    caret-color: #0EA5E9 !important;
                    transition: background-color 9999s ease-in-out 0s !important;
                }
                .google-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .google-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(14,165,233,0.35) !important; }
                .google-btn:not(:disabled):active { transform: scale(0.98); }
                .submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .submit-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(14,165,233,0.40); }
                .submit-btn:not(:disabled):active { transform: scale(0.98); }
            `}</style>

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
                    <p className="text-blue-300/50 text-sm mt-3 font-light tracking-wide">Researcher portal — sign in to continue</p>
                </div>

                {/* Floating card — deep shadow + subtle ring */}
                <div className="relative bg-white rounded-3xl p-8"
                    style={{ boxShadow: '0 32px 80px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.3)' }}>

                    {/* Top accent bar */}
                    <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent rounded-full" />

                    {/* Google button — teal to match site theme */}
                    <button
                        onClick={() => handleGoogleLogin()}
                        disabled={isLoading}
                        className="google-btn w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-xl mb-6 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', boxShadow: '0 4px 16px rgba(14,165,233,0.28)' }}
                    >
                        {status === 'google-loading' ? (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        ) : (
                            <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                                <svg width="14" height="14" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.9 13.3l7.8 6C12.5 13 17.8 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 6.9-10.1 6.9-17z"/>
                                    <path fill="#FBBC05" d="M10.7 28.7A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 000 24c0 3.9.9 7.5 2.5 10.7l8.2-6z"/>
                                    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-8.2 6C6.7 42.6 14.7 48 24 48z"/>
                                </svg>
                            </span>
                        )}
                        {status === 'google-loading' ? 'Signing in with Google...' : 'Continue with Google'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Error banner */}
                    {status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-red-600 text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === 'email' ? 'text-secondary' : 'text-gray-400'}`}>
                                Email Address
                            </label>
                            <input type="email" name="email" value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocused('email')}
                                onBlur={() => setFocused('')}
                                autoComplete="off"
                                required placeholder="you@example.com" disabled={isLoading}
                                className="light-input w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200 disabled:opacity-60" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${focused === 'password' ? 'text-secondary' : 'text-gray-400'}`}>
                                    Password
                                </label>
                                <a href="#" className="text-xs text-secondary/60 hover:text-secondary font-medium transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused('')}
                                    autoComplete="current-password"
                                    required placeholder="••••••••" disabled={isLoading}
                                    className="light-input w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200 disabled:opacity-60" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors" tabIndex={-1}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded accent-secondary cursor-pointer" />
                            <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">Keep me signed in</label>
                        </div>

                        {/* Submit with gradient ring */}
                        <div className="pt-1">
                            <div className="p-[2px] rounded-xl bg-gradient-to-r from-sky-400 via-secondary to-cyan-400">
                                <button type="submit" disabled={isLoading}
                                    className="submit-btn w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-3.5 rounded-[10px] text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed">
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
                            </div>
                        </div>
                    </form>

                    {/* Bottom link */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-secondary hover:text-secondary-dark font-semibold transition-colors">
                            Request Access
                        </Link>
                    </p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mt-8 text-blue-300/30">
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