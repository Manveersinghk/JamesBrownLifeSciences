import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const IqPill     = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
const IqHandshake= () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-1"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>;
const IqStethoscope=()=><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6h0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
const IqClipboard = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>;
const IqAlert    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const IqChat     = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

const inquiryTypes = [
    { id: 'order',       icon: <IqPill />,       iconBg: 'bg-blue-50',   iconColor: 'text-blue-600',   label: 'Product Order / Supply',    desc: 'Bulk orders, pricing, availability' },
    { id: 'partner',     icon: <IqHandshake />,  iconBg: 'bg-amber-50',  iconColor: 'text-amber-600',  label: 'Distribution Partnership',   desc: 'Become a regional distributor' },
    { id: 'medical',     icon: <IqStethoscope />,iconBg: 'bg-green-50',  iconColor: 'text-green-600',  label: 'Medical / Clinical Query',   desc: 'Healthcare professional enquiries' },
    { id: 'regulatory',  icon: <IqClipboard />,  iconBg: 'bg-purple-50', iconColor: 'text-purple-600', label: 'Regulatory & Compliance',    desc: 'Dossiers, registrations, audits' },
    { id: 'pharmacovig', icon: <IqAlert />,       iconBg: 'bg-red-50',    iconColor: 'text-red-600',    label: 'Pharmacovigilance / ADR',   desc: 'Adverse drug reaction reporting' },
    { id: 'general',     icon: <IqChat />,        iconBg: 'bg-gray-50',   iconColor: 'text-gray-600',   label: 'General Enquiry',            desc: 'Anything else' },
];

const inputCls = (focused, field) =>
    `w-full px-4 py-3.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400 ${
        focused === field
            ? 'border-secondary ring-2 ring-secondary/15'
            : 'border-gray-200 hover:border-gray-300'
    }`;

export default function Contact() {
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState('');
    const [focused,      setFocused]      = useState('');
    const [status,       setStatus]       = useState('');

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        company: '', country: '', jobTitle: '',
        subject: '', message: '', urgent: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedType) return;
        setStatus('sending');
        try {
            const res = await fetch(`${API}/api/contact`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ ...form, inquiryType: selectedType }),
            });
            setStatus(res.ok ? 'success' : 'error');
            if (res.ok) setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', country: '', jobTitle: '', subject: '', message: '', urgent: false });
        } catch {
            setStatus('error');
        }
    };

    // ── Success ───────────────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
                <div className="max-w-lg w-full text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-3">Message Received</h2>
                    <p className="text-gray-500 leading-relaxed mb-2">
                        Thank you for reaching out to <strong className="text-primary">James Brown Life Sciences</strong>.
                    </p>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Our team will review your enquiry and respond within <strong>1–2 business days</strong>. For urgent matters please call us directly.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {[
                            { label: 'General Enquiries',     sla: '1–2 business days', color: 'bg-blue-50 border-blue-100 text-blue-700' },
                            { label: 'Medical / ADR Reports', sla: 'Within 24 hours',    color: 'bg-amber-50 border-amber-100 text-amber-700' },
                            { label: 'Partnership Requests',  sla: '3–5 business days',  color: 'bg-purple-50 border-purple-100 text-purple-700' },
                            { label: 'Order Enquiries',       sla: 'Same business day',  color: 'bg-green-50 border-green-100 text-green-700' },
                        ].map((s) => (
                            <div key={s.label} className={`${s.color} border rounded-xl p-4 text-left`}>
                                <p className="text-xs font-bold mb-1">{s.label}</p>
                                <p className="text-xs opacity-75">{s.sla}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => setStatus('')}
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-light transition text-sm">
                            Send Another Message
                        </button>
                        <Link to="/"
                            className="border border-gray-200 text-gray-600 px-8 py-3 rounded-full font-bold hover:border-secondary hover:text-secondary transition text-sm">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero ── */}
            <div className="relative bg-primary overflow-hidden py-24">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[120%] bg-secondary/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[100%] bg-accent/8 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(rgba(14,165,233,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                </div>
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-secondary font-bold tracking-widest uppercase text-xs mb-5 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full animate-fade-in-up">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                            Get In Touch
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up delay-100 leading-tight">
                            How Can We<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-white">
                                Help You Today?
                            </span>
                        </h1>
                        <p className="text-lg text-blue-200/70 font-light leading-relaxed max-w-xl animate-fade-in-up delay-200">
                            Whether you're a healthcare provider, distributor, or patient — our team is here to help. Select your enquiry type and we'll get back to you promptly.
                        </p>

                        {/* Quick action pills */}
                        <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up delay-300">
                            <a href="tel:+919799832489"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200">
                                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call +91 97998 32489
                            </a>
                            <a href="mailto:dbsingh490@rediffmail.com"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200">
                                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Us
                            </a>
                            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 text-sm font-semibold px-5 py-2.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                                Emergency: +91 97998 32489
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Office Info Strip ── */}
            <section className="py-14 bg-white border-b border-gray-100">
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-px bg-secondary" />
                        <span className="text-secondary font-bold tracking-widest uppercase text-xs">Our Office</span>
                    </div>

                    {/* Single office — full width, beautiful layout */}
                    <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid md:grid-cols-2">

                            {/* Left — address + map feel */}
                            <div className="p-10 lg:p-14 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-4xl">🇮🇳</span>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-white">Jaipur</h3>
                                            <p className="text-secondary text-sm font-bold uppercase tracking-widest">Headquarters</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-300/50 uppercase tracking-widest font-semibold mb-1">Address</p>
                                                <p className="text-white font-medium leading-relaxed">Khatipura, Jaipur<br />Rajasthan 302012, India</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-300/50 uppercase tracking-widest font-semibold mb-1">Phone</p>
                                                <a href="tel:+919799832489" className="text-white font-medium hover:text-secondary transition-colors">
                                                    +91 97998 32489
                                                </a>
                                                <p className="text-blue-300/40 text-xs mt-0.5">Orders, partnerships, emergencies</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-300/50 uppercase tracking-widest font-semibold mb-1">Email</p>
                                                <a href="mailto:dbsingh490@rediffmail.com" className="text-white font-medium hover:text-secondary transition-colors">
                                                    dbsingh490@rediffmail.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-300/50 uppercase tracking-widest font-semibold mb-1">Business Hours</p>
                                                <p className="text-white font-medium">Mon – Sat, 9 am – 6 pm IST</p>
                                                <p className="text-blue-300/40 text-xs mt-0.5">Emergency line available 24/7</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — quick contact cards */}
                            <div className="bg-white/5 p-10 lg:p-14 flex flex-col justify-center gap-5">
                                <p className="text-blue-200/60 text-sm font-medium mb-2">Reach us directly for any of these:</p>

                                {[
                                    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>, label: 'Place a Bulk Order',        detail: 'Call or WhatsApp +91 97998 32489', color: 'bg-secondary/10 border-secondary/20',   iconBg: 'bg-secondary/20 text-secondary' },
                                    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-1"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>, label: 'Distribution Partnership',  detail: 'dbsingh490@rediffmail.com',         color: 'bg-amber-500/10 border-amber-400/20',  iconBg: 'bg-amber-500/20 text-amber-400' },
                                    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>, label: 'Medical Emergency / ADR',   detail: '+91 97998 32489 — available 24/7', color: 'bg-red-500/10 border-red-400/20',       iconBg: 'bg-red-500/20 text-red-400' },
                                    { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>, label: 'Regulatory Queries',        detail: 'dbsingh490@rediffmail.com',         color: 'bg-purple-500/10 border-purple-400/20', iconBg: 'bg-purple-500/20 text-purple-400' },
                                ].map((item) => (
                                    <div key={item.label} className={`flex items-center gap-4 p-4 rounded-2xl border ${item.color} transition-all duration-200 hover:scale-[1.01]`}>
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.label}</p>
                                            <p className="text-blue-300/50 text-xs mt-0.5">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact Form ── */}
            <section className="py-20">
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* ── Not logged in wall ── */}
                    {!user && (
                        <div className="max-w-2xl mx-auto text-center py-16">
                            <div className="w-20 h-20 bg-secondary/10 border-2 border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-primary mb-3">Sign in to Send a Message</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                You need to be logged in to contact us. This helps us respond to you directly and keeps track of your enquiries.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/login"
                                    className="bg-secondary text-white px-8 py-3.5 rounded-full font-bold hover:bg-secondary-dark hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-secondary/20">
                                    Log In to Continue
                                </Link>
                                <Link to="/register"
                                    className="border-2 border-gray-200 text-gray-600 px-8 py-3.5 rounded-full font-bold hover:border-secondary hover:text-secondary transition-all duration-200">
                                    Create an Account
                                </Link>
                            </div>
                            <p className="text-gray-400 text-sm mt-6">
                                For urgent matters, call us directly at{' '}
                                <a href="tel:+919799832489" className="text-secondary font-semibold hover:underline">+91 97998 32489</a>
                            </p>
                        </div>
                    )}

                    {/* ── Form — only shown when logged in ── */}
                    {user && (
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">

                        {/* Left sidebar */}
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div>
                                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Send a Message</span>
                                <h2 className="text-3xl font-serif font-bold text-primary mb-4 leading-tight">
                                    Talk to the Right Team
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Fill in the form and we'll make sure your enquiry reaches the right person — whether that's for orders, distribution, medical queries, or regulatory information.
                                </p>
                            </div>

                            {/* Response SLAs */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Response Times</p>
                                {[
                                    { type: 'General Enquiry',  time: '1–2 business days', dot: 'bg-blue-400' },
                                    { type: 'Order / Supply',   time: 'Same business day',  dot: 'bg-green-400' },
                                    { type: 'Medical / ADR',    time: 'Within 24 hours',    dot: 'bg-amber-400' },
                                    { type: 'Partnership',      time: '3–5 business days',  dot: 'bg-purple-400' },
                                    { type: 'Regulatory',       time: '2–3 business days',  dot: 'bg-secondary' },
                                ].map((s) => (
                                    <div key={s.type} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                                            <span className="text-sm text-gray-600">{s.type}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400">{s.time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ADR Notice */}
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 mb-1">Adverse Drug Reaction (ADR)?</p>
                                        <p className="text-xs text-red-500 leading-relaxed">
                                            For suspected adverse reactions call immediately:
                                        </p>
                                        <a href="tel:+919799832489" className="text-sm font-bold text-red-600 hover:text-red-700 mt-1 block">
                                            +91 97998 32489
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Form */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Step 1 — Inquiry type */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-7 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                                        <div>
                                            <h3 className="text-white font-bold">Nature of Enquiry</h3>
                                            <p className="text-blue-200/60 text-xs">Select the category that best describes your message</p>
                                        </div>
                                    </div>
                                    <div className="p-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {inquiryTypes.map((type) => (
                                            <button key={type.id} type="button" onClick={() => setSelectedType(type.id)}
                                                className={`p-4 rounded-xl border text-left transition-all duration-200 group ${
                                                    selectedType === type.id
                                                        ? 'bg-secondary/8 border-secondary/40 shadow-sm'
                                                        : 'border-gray-100 hover:border-secondary/20 hover:shadow-md bg-white'
                                                }`}>
                                                <div className={`w-9 h-9 ${type.iconBg} ${type.iconColor} rounded-xl flex items-center justify-center mb-3 transition-all duration-200 ${selectedType === type.id ? 'bg-secondary text-white' : ''}`}>
                                                    {type.icon}
                                                </div>
                                                <p className={`text-sm font-bold mb-0.5 transition-colors ${selectedType === type.id ? 'text-secondary' : 'text-primary group-hover:text-secondary'}`}>
                                                    {type.label}
                                                </p>
                                                <p className="text-xs text-gray-400">{type.desc}</p>
                                                {selectedType === type.id && (
                                                    <div className="mt-2 flex items-center gap-1 text-secondary text-xs font-bold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                        Selected
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {!selectedType && (
                                        <p className="px-7 pb-5 text-xs text-amber-500 font-medium flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Please select an enquiry type to continue
                                        </p>
                                    )}
                                </div>

                                {/* Step 2 — Contact details */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-7 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                                        <div>
                                            <h3 className="text-white font-bold">Your Details</h3>
                                            <p className="text-blue-200/60 text-xs">So we know who to get back to</p>
                                        </div>
                                    </div>
                                    <div className="p-7 grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'firstName' ? 'text-secondary' : 'text-gray-500'}`}>First Name *</label>
                                            <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                                                onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                                                required placeholder="Rajesh" className={inputCls(focused, 'firstName')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'lastName' ? 'text-secondary' : 'text-gray-500'}`}>Last Name *</label>
                                            <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                                                onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                                                required placeholder="Sharma" className={inputCls(focused, 'lastName')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'email' ? 'text-secondary' : 'text-gray-500'}`}>Email Address *</label>
                                            <input type="email" name="email" value={form.email} onChange={handleChange}
                                                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                                required placeholder="rajesh@hospital.in" className={inputCls(focused, 'email')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'phone' ? 'text-secondary' : 'text-gray-500'}`}>Phone Number</label>
                                            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                                                onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                                                placeholder="+91 98765 43210" className={inputCls(focused, 'phone')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'company' ? 'text-secondary' : 'text-gray-500'}`}>Organisation / Hospital</label>
                                            <input type="text" name="company" value={form.company} onChange={handleChange}
                                                onFocus={() => setFocused('company')} onBlur={() => setFocused('')}
                                                placeholder="Hospital, Pharmacy, Distributor..." className={inputCls(focused, 'company')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'jobTitle' ? 'text-secondary' : 'text-gray-500'}`}>Your Role</label>
                                            <input type="text" name="jobTitle" value={form.jobTitle} onChange={handleChange}
                                                onFocus={() => setFocused('jobTitle')} onBlur={() => setFocused('')}
                                                placeholder="e.g. Procurement Manager, Doctor" className={inputCls(focused, 'jobTitle')} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'country' ? 'text-secondary' : 'text-gray-500'}`}>Country *</label>
                                            <select name="country" value={form.country} onChange={handleChange}
                                                onFocus={() => setFocused('country')} onBlur={() => setFocused('')}
                                                required className={inputCls(focused, 'country')}>
                                                <option value="">Select your country</option>
                                                {['India', 'United States', 'United Kingdom', 'UAE', 'Saudi Arabia', 'Singapore', 'Australia', 'Canada', 'Germany', 'France', 'Japan', 'South Africa', 'Brazil', 'Other'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 — Message */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-7 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                                        <div>
                                            <h3 className="text-white font-bold">Your Message</h3>
                                            <p className="text-blue-200/60 text-xs">Be as detailed as possible — it helps us respond faster</p>
                                        </div>
                                    </div>
                                    <div className="p-7 space-y-5">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'subject' ? 'text-secondary' : 'text-gray-500'}`}>Subject *</label>
                                            <input type="text" name="subject" value={form.subject} onChange={handleChange}
                                                onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                                                required placeholder="Brief subject line for your enquiry" className={inputCls(focused, 'subject')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'message' ? 'text-secondary' : 'text-gray-500'}`}>Message *</label>
                                            <textarea name="message" rows={6} value={form.message} onChange={handleChange}
                                                onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                                                required placeholder="Provide as much detail as possible — medicine names, quantities, timelines, delivery location, etc."
                                                className={`${inputCls(focused, 'message')} resize-none`} />
                                            <div className="flex justify-between mt-1.5">
                                                <p className="text-xs text-gray-400">Include medicine names, quantities and delivery location.</p>
                                                <p className="text-xs text-gray-400">{form.message.length} chars</p>
                                            </div>
                                        </div>

                                        {/* Urgent toggle */}
                                        <div onClick={() => setForm(f => ({ ...f, urgent: !f.urgent }))}
                                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                form.urgent ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 hover:border-amber-200'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">⚡</span>
                                                <div>
                                                    <p className={`text-sm font-bold ${form.urgent ? 'text-amber-700' : 'text-gray-600'}`}>Mark as Urgent</p>
                                                    <p className="text-xs text-gray-400">Flag for priority response — use only when genuinely time-sensitive</p>
                                                </div>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${form.urgent ? 'bg-amber-400' : 'bg-gray-200'}`}>
                                                <div className={`bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${form.urgent ? 'left-[calc(100%-20px)]' : 'left-0.5'}`} style={{ width: '18px', height: '18px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Consent + Submit */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                                    <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <input type="checkbox" id="consent" required className="mt-1 w-4 h-4 accent-secondary flex-shrink-0 cursor-pointer" />
                                        <label htmlFor="consent" className="text-sm text-gray-500 leading-relaxed cursor-pointer">
                                            I consent to James Brown Life Sciences processing my personal data to handle this enquiry, in accordance with our{' '}
                                            <a href="#" className="text-secondary hover:underline font-medium">Privacy Policy</a>.
                                        </label>
                                    </div>
                                    <button type="submit" disabled={status === 'sending' || !selectedType}
                                        className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                                        {status === 'sending' ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                                Sending Message...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Send Message
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                    {status === 'error' && (
                                        <p className="text-red-500 text-center text-sm mt-4 flex items-center justify-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Something went wrong. Please try again or call us directly.
                                        </p>
                                    )}
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Your message is handled securely and in compliance with data protection standards.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                    )} {/* end user && */}
                </div>
            </section>
        </div>
    );
}