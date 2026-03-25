import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const roles = ['Researcher', 'Clinician', 'Lab Technician', 'Student', 'Industry Partner', 'Other'];

const passwordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
        { label: '',       color: '' },
        { label: 'Weak',   color: '#EF4444' },
        { label: 'Fair',   color: '#F59E0B' },
        { label: 'Good',   color: '#0EA5E9' },
        { label: 'Strong', color: '#10B981' },
    ];
    return { score, ...map[score] };
};

const Register = () => {
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const [step,         setStep]         = useState(1);
    const [formData,     setFormData]     = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: '', organization: '' });
    const [focused,      setFocused]      = useState('');
    const [status,       setStatus]       = useState('');
    const [errorMsg,     setErrorMsg]     = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm,  setShowConfirm]  = useState(false);
    const [agreed,       setAgreed]       = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const strength = passwordStrength(formData.password);
    const isLoading = status === 'loading' || status === 'google-loading';

    // ── Google sign up ────────────────────────────────────────────────────────
    const handleGoogleSignup = useGoogleLogin({
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
                setErrorMsg(err.message || 'Google sign-up failed. Please try again.');
            }
        },
        onError: () => {
            setStatus('error');
            setErrorMsg('Google sign-up was cancelled or failed.');
        },
    });

    const handleNextStep = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return;
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) return;
        setStatus('loading');
        setErrorMsg('');
        try {
            await register({
                firstName:    formData.firstName,
                lastName:     formData.lastName,
                email:        formData.email,
                password:     formData.password,
                role:         formData.role || 'Researcher',
                organization: formData.organization,
            });
            setStatus('success');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
            setStep(1);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 text-center animate-fade-in-up max-w-sm w-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white mb-3">You're in!</h2>
                    <p className="text-blue-200/70 mb-4">Account created. Redirecting you home...</p>
                </div>
            </div>
        );
    }

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

            <div className="relative z-10 w-full max-w-lg animate-fade-in-up">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/30 group-hover:scale-105 transition-transform duration-300">JB</div>
                        <span className="text-white font-serif font-bold text-2xl tracking-wide group-hover:text-secondary-light transition-colors">James Brown LS</span>
                    </Link>
                    <p className="text-blue-300/50 text-sm mt-3 font-light tracking-wide">Create your researcher account</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 transition-all duration-300 ${step >= s ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                    step > s  ? 'bg-secondary text-white' :
                                    step === s ? 'bg-secondary/20 border-2 border-secondary text-secondary' :
                                    'bg-gray-100 border border-gray-200 text-gray-500'}`}>
                                    {step > s
                                        ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                        : s}
                                </div>
                                <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-gray-500'}`}>
                                    {s === 1 ? 'Account' : 'Profile'}
                                </span>
                            </div>
                            {s < 2 && <div className={`w-12 h-px transition-all duration-500 ${step > 1 ? 'bg-secondary' : 'bg-white/15'}`} />}
                        </div>
                    ))}
                </div>

                {/* Floating card */}
                <div className="relative bg-white rounded-3xl p-8"
                    style={{ boxShadow: '0 32px 80px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.3)' }}>

                    {/* Top accent bar */}
                    <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent rounded-full" />

                    {/* Error banner */}
                    {status === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-red-600 text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* ── Step 1 ── */}
                    {step === 1 && (
                        <>
                            {/* Google signup — teal themed */}
                            <button onClick={() => handleGoogleSignup()} disabled={isLoading}
                                className="google-btn w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-xl mb-6 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)', boxShadow: '0 4px 16px rgba(14,165,233,0.28)' }}>
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
                                {status === 'google-loading' ? 'Signing up with Google...' : 'Sign up with Google'}
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">or with email</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            <form onSubmit={handleNextStep} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[['firstName','First Name','Jane'],['lastName','Last Name','Smith']].map(([name,label,ph]) => (
                                        <div key={name}>
                                            <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === name ? 'text-secondary' : 'text-gray-400'}`}>{label}</label>
                                            <input type="text" name={name} value={formData[name]} onChange={handleChange}
                                                onFocus={() => setFocused(name)}
                                                onBlur={() => setFocused('')}
                                                autoComplete="off"
                                                required placeholder={ph}
                                                className="light-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200" />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === 'email' ? 'text-secondary' : 'text-gray-400'}`}>Work Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                        autoComplete="off"
                                        required placeholder="jane@university.edu"
                                        className="light-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200" />
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === 'password' ? 'text-secondary' : 'text-gray-400'}`}>Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused('')}
                                            autoComplete="new-password"
                                            required placeholder="Min. 6 characters"
                                            className="light-input w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors" tabIndex={-1}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">{[1,2,3,4].map(i => <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : '#e5e7eb' }} />)}</div>
                                            <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === 'confirmPassword' ? 'text-secondary' : 'text-gray-400'}`}>Confirm Password</label>
                                    <div className="relative">
                                        <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                            onFocus={() => setFocused('confirmPassword')}
                                            onBlur={() => setFocused('')}
                                            autoComplete="new-password"
                                            required placeholder="Re-enter password"
                                            className={`light-input w-full border rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                                                formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 focus:ring-red-400/20' :
                                                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-400 focus:ring-green-400/20' :
                                                'border-gray-200 focus:border-secondary/50 focus:ring-secondary/15'}`} />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors" tabIndex={-1}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && <p className="text-xs text-red-500 mt-1.5 font-medium">Passwords don't match</p>}
                                </div>

                                {/* Continue button with gradient ring */}
                                <div className="pt-1">
                                    <div className="p-[2px] rounded-xl bg-gradient-to-r from-sky-400 via-secondary to-cyan-400">
                                        <button type="submit" disabled={formData.password !== formData.confirmPassword || !formData.password || isLoading}
                                            className="submit-btn w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-3.5 rounded-[10px] text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                                            Continue to Profile →
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}

                    {/* ── Step 2 ── */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="mb-2">
                                <h3 className="text-gray-900 font-semibold text-lg mb-1">Almost there!</h3>
                                <p className="text-gray-400 text-sm">Tell us a bit about your role.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest uppercase mb-3 text-gray-400">Your Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((r) => (
                                        <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 border ${
                                                formData.role === r
                                                    ? 'bg-secondary/10 border-secondary/50 text-secondary font-semibold'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-sky-50 hover:border-secondary/30 hover:text-secondary'}`}>
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors duration-200 ${focused === 'organization' ? 'text-secondary' : 'text-gray-400'}`}>Organization / Institution</label>
                                <input type="text" name="organization" value={formData.organization} onChange={handleChange}
                                    onFocus={() => setFocused('organization')}
                                    onBlur={() => setFocused('')}
                                    autoComplete="off"
                                    placeholder="e.g. MIT, Pfizer, Stanford Medical"
                                    className="light-input w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/15 transition-all duration-200" />
                            </div>

                            <div onClick={() => setAgreed(!agreed)}
                                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${agreed ? 'bg-sky-50 border-secondary/30' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${agreed ? 'bg-secondary border-secondary' : 'border-gray-300 bg-white'}`}>
                                    {agreed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed select-none">
                                    I agree to the <a href="#" className="text-secondary hover:text-secondary-dark font-medium transition-colors" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="#" className="text-secondary hover:text-secondary-dark font-medium transition-colors" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                                </p>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => { setStep(1); setStatus(''); setErrorMsg(''); }}
                                    className="flex-1 bg-gray-100 border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm">
                                    ← Back
                                </button>
                                {/* Create Account with gradient ring */}
                                <div className="flex-[2] p-[2px] rounded-xl bg-gradient-to-r from-sky-400 via-secondary to-cyan-400">
                                    <button type="submit" disabled={!agreed || isLoading}
                                        className="submit-btn w-full h-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-3.5 rounded-[10px] text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                                        {status === 'loading' ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                                Creating account...
                                            </span>
                                        ) : 'Create Account'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary hover:text-secondary-dark font-semibold transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;