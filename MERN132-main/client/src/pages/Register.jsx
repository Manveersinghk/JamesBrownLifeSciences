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

    // ── Success ───────────────────────────────────────────────────────────────
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
                    <p className="text-blue-300/60 text-sm mt-3 font-light">Create your researcher account</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 transition-all duration-300 ${step >= s ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                    step > s  ? 'bg-secondary text-white' :
                                    step === s ? 'bg-secondary/20 border-2 border-secondary text-secondary' :
                                    'bg-white/5 border border-white/10 text-blue-300'}`}>
                                    {step > s
                                        ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                                        : s}
                                </div>
                                <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-blue-300/40'}`}>
                                    {s === 1 ? 'Account' : 'Profile'}
                                </span>
                            </div>
                            {s < 2 && <div className={`w-12 h-px transition-all duration-500 ${step > 1 ? 'bg-secondary' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">

                    {/* Error banner */}
                    {status === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-red-300 text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* ── Step 1 ── */}
                    {step === 1 && (
                        <>
                            {/* Google signup */}
                            <button onClick={() => handleGoogleSignup()} disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg mb-6 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
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
                                {status === 'google-loading' ? 'Signing up with Google...' : 'Sign up with Google'}
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-blue-300/40 text-xs font-medium tracking-widest uppercase">or with email</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <form onSubmit={handleNextStep} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {[['firstName','First Name','Jane'],['lastName','Last Name','Smith']].map(([name,label,ph]) => (
                                        <div key={name}>
                                            <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === name ? 'text-secondary-light' : 'text-blue-300/60'}`}>{label}</label>
                                            <input type="text" name={name} value={formData[name]} onChange={handleChange}
                                                onFocus={() => setFocused(name)} onBlur={() => setFocused('')}
                                                required placeholder={ph}
                                                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all" />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === 'email' ? 'text-secondary-light' : 'text-blue-300/60'}`}>Work Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                        required placeholder="jane@university.edu"
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all" />
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === 'password' ? 'text-secondary-light' : 'text-blue-300/60'}`}>Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                                            onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                                            required placeholder="Min. 6 characters"
                                            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/35 hover:text-blue-200" tabIndex={-1}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">{[1,2,3,4].map(i => <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)' }} />)}</div>
                                            <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === 'confirmPassword' ? 'text-secondary-light' : 'text-blue-300/60'}`}>Confirm Password</label>
                                    <div className="relative">
                                        <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                            onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')}
                                            required placeholder="Re-enter password"
                                            className={`w-full bg-white/5 border text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 transition-all ${
                                                formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500/50 focus:ring-red-500/20' :
                                                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500/50 focus:ring-green-500/20' :
                                                'border-white/10 focus:border-secondary/60 focus:ring-secondary/20'}`} />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/35 hover:text-blue-200" tabIndex={-1}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </button>
                                    </div>
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && <p className="text-xs text-red-400 mt-1.5">Passwords don't match</p>}
                                </div>

                                <button type="submit" disabled={formData.password !== formData.confirmPassword || !formData.password || isLoading}
                                    className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide mt-2">
                                    Continue to Profile →
                                </button>
                            </form>
                        </>
                    )}

                    {/* ── Step 2 ── */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="mb-2">
                                <h3 className="text-white font-semibold text-lg mb-1">Almost there!</h3>
                                <p className="text-blue-300/50 text-sm">Tell us a bit about your role.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-widest uppercase mb-3 text-blue-300/60">Your Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((r) => (
                                        <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })}
                                            className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 border ${
                                                formData.role === r
                                                    ? 'bg-secondary/15 border-secondary/50 text-secondary-light'
                                                    : 'bg-white/5 border-white/8 text-blue-300/60 hover:bg-white/8 hover:border-white/15 hover:text-blue-200'}`}>
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-xs font-semibold tracking-widest uppercase mb-2 transition-colors ${focused === 'organization' ? 'text-secondary-light' : 'text-blue-300/60'}`}>Organization / Institution</label>
                                <input type="text" name="organization" value={formData.organization} onChange={handleChange}
                                    onFocus={() => setFocused('organization')} onBlur={() => setFocused('')}
                                    placeholder="e.g. MIT, Pfizer, Stanford Medical"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-blue-300/25 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all" />
                            </div>

                            <div onClick={() => setAgreed(!agreed)}
                                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${agreed ? 'bg-secondary/8 border-secondary/25' : 'bg-white/3 border-white/8'}`}>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${agreed ? 'bg-secondary border-secondary' : 'border-white/20 bg-white/5'}`}>
                                    {agreed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                                </div>
                                <p className="text-sm text-blue-200/60 leading-relaxed select-none">
                                    I agree to the <a href="#" className="text-secondary-light hover:text-white transition-colors" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="#" className="text-secondary-light hover:text-white transition-colors" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                                </p>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => { setStep(1); setStatus(''); setErrorMsg(''); }}
                                    className="flex-1 bg-white/5 border border-white/10 text-blue-200 font-semibold py-4 rounded-xl hover:bg-white/8 transition-all duration-200 text-sm">← Back</button>
                                <button type="submit" disabled={!agreed || isLoading}
                                    className="flex-[2] bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide">
                                    {status === 'loading' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                            Creating account...
                                        </span>
                                    ) : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-sm text-blue-300/40 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary-light hover:text-white font-semibold transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;