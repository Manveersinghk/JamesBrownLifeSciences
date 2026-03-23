import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Data ────────────────────────────────────────────────────────────────────

const openings = [
    {
        id: 1,
        title: 'Senior Pharmacist – Quality Assurance',
        department: 'Quality & Regulatory',
        location: 'San Francisco, CA',
        type: 'Full-Time',
        experience: '5+ Years',
        description: 'Lead QA batch-release activities, SOPs, and regulatory filing support across our GMP manufacturing facility.',
        tags: ['GMP', 'QA', 'Regulatory Affairs'],
    },
    {
        id: 2,
        title: 'Formulation Scientist – Oral Dosage',
        department: 'R&D',
        location: 'San Francisco, CA',
        type: 'Full-Time',
        experience: '3–6 Years',
        description: 'Develop and optimise tablet, capsule, and suspension formulations from concept through stability and scale-up.',
        tags: ['Formulation', 'Oral Dosage', 'Stability Studies'],
    },
    {
        id: 3,
        title: 'Regulatory Affairs Specialist',
        department: 'Quality & Regulatory',
        location: 'Remote (US)',
        type: 'Full-Time',
        experience: '3+ Years',
        description: 'Prepare and submit dossiers for FDA, EMA, and WHO-PQ registrations. Manage product lifecycle regulatory activities.',
        tags: ['FDA', 'EMA', 'CTD Dossiers'],
    },
    {
        id: 4,
        title: 'Medical Science Liaison',
        department: 'Medical Affairs',
        location: 'New York, NY',
        type: 'Full-Time',
        experience: '4+ Years',
        description: 'Build relationships with KOLs and HCPs, communicate clinical evidence, and support medical education activities in assigned territory.',
        tags: ['KOL Engagement', 'Clinical Evidence', 'MSL'],
    },
    {
        id: 5,
        title: 'Supply Chain Analyst – Pharma Logistics',
        department: 'Operations',
        location: 'Chicago, IL',
        type: 'Full-Time',
        experience: '2+ Years',
        description: 'Manage end-to-end pharmaceutical supply chain, cold-chain compliance, and distribution partner coordination across 50+ markets.',
        tags: ['Cold Chain', 'GDP', 'Supply Planning'],
    },
    {
        id: 6,
        title: 'Clinical Data Manager',
        department: 'Clinical Development',
        location: 'Remote (Global)',
        type: 'Contract',
        experience: '3+ Years',
        description: 'Oversee data collection, cleaning, and validation for Phase II–III clinical trials in compliance with ICH E6 GCP guidelines.',
        tags: ['Clinical Trials', 'GCP', 'EDC Systems'],
    },
];

const BenefitIconHealth  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const BenefitIconChart   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><rect x="1" y="1" width="22" height="22" rx="3" ry="3" opacity="0"/></svg>;
const BenefitIconLearn   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const BenefitIconGlobe   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const BenefitIconHeart   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const BenefitIconFamily  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

const benefits = [
    { icon: <BenefitIconHealth />, color: 'text-red-500',    bg: 'bg-red-50',    hoverBg: 'group-hover:bg-red-500',    title: 'Comprehensive Health Cover', desc: 'Medical, dental, and vision insurance for you and your family — from day one.' },
    { icon: <BenefitIconChart />,  color: 'text-green-600',  bg: 'bg-green-50',  hoverBg: 'group-hover:bg-green-500',  title: 'Stock & Bonus Plans',         desc: 'Competitive base salary plus performance bonuses and employee stock options.' },
    { icon: <BenefitIconLearn />,  color: 'text-purple-600', bg: 'bg-purple-50', hoverBg: 'group-hover:bg-purple-500', title: 'Continuous Learning',         desc: 'Annual learning budget, access to pharma conferences, and paid certifications.' },
    { icon: <BenefitIconGlobe />,  color: 'text-blue-600',   bg: 'bg-blue-50',   hoverBg: 'group-hover:bg-blue-500',   title: 'Global Mobility',            desc: 'Opportunities to work across our offices in India, Europe, and Asia-Pacific.' },
    { icon: <BenefitIconHeart />,  color: 'text-pink-600',   bg: 'bg-pink-50',   hoverBg: 'group-hover:bg-pink-500',   title: 'Wellbeing Programme',        desc: 'Mental health support, gym reimbursement, and flexible wellness days.' },
    { icon: <BenefitIconFamily />, color: 'text-amber-600',  bg: 'bg-amber-50',  hoverBg: 'group-hover:bg-amber-500',  title: 'Family Leave',               desc: '20 weeks fully paid parental leave for primary caregivers, 10 weeks for secondary.' },
];

const departments = ['All', 'Quality & Regulatory', 'R&D', 'Medical Affairs', 'Operations', 'Clinical Development'];

const inputCls = (focused, field) =>
    `w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400 ${
        focused === field
            ? 'border-secondary ring-2 ring-secondary/15'
            : 'border-gray-200 hover:border-gray-300'
    }`;

// ── Component ────────────────────────────────────────────────────────────────

const Careers = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('openings');   // openings | apply
    const [selectedJob, setSelectedJob] = useState(null);
    const [filterDept, setFilterDept] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [focused, setFocused] = useState('');
    const [status, setStatus] = useState('');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        position: '', department: '', experience: '',
        currentCompany: '', noticePeriod: '',
        resumeLink: '', linkedIn: '', portfolio: '',
        whyUs: '', rightFit: '',
        relocate: '', workAuth: '', referral: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setFormData((f) => ({ ...f, position: job.title, department: job.department }));
        setActiveTab('apply');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/careers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const filtered = openings.filter((j) => {
        const deptMatch = filterDept === 'All' || j.department === filterDept;
        const typeMatch = filterType === 'All' || j.type === filterType;
        return deptMatch && typeMatch;
    });

    // ── Success screen ──────────────────────────────────────────────────────
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
                <div className="max-w-lg w-full text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-3">Application Submitted!</h2>
                    <p className="text-gray-500 leading-relaxed mb-2">
                        Thank you for applying to <strong className="text-primary">{formData.position}</strong> at James Brown Life Sciences.
                    </p>
                    <p className="text-gray-400 text-sm mb-8">
                        Our talent team reviews every application carefully. You'll hear from us within <strong>5–7 business days</strong>. Check your inbox (and spam folder) for a confirmation email.
                    </p>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left mb-8">
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">What Happens Next</p>
                        {['Application review by our talent team', 'Initial HR screening call (30 min)', 'Technical / panel interview', 'Offer & onboarding'].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-blue-100 last:border-b-0">
                                <div className="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                                <p className="text-sm text-gray-600">{step}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => { setStatus(''); setActiveTab('openings'); }}
                        className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-dark transition"
                    >
                        View More Openings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero ── */}
            <div className="relative bg-primary py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-secondary/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-1/3 -left-1/4 w-2/3 h-full bg-accent/5 rounded-full blur-[120px]" />
                </div>
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-secondary font-bold tracking-widest uppercase text-xs mb-4 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full animate-fade-in-up">
                            We're Hiring
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in-up delay-100 leading-tight">
                            Build a Career That<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-white">
                                Matters to Patients
                            </span>
                        </h1>
                        <p className="text-xl text-blue-200/70 font-light leading-relaxed max-w-xl animate-fade-in-up delay-200">
                            Join a team of scientists, clinicians, and innovators dedicated to making high-quality medicines accessible to people who need them most.
                        </p>
                        <div className="flex flex-wrap gap-6 mt-10 animate-fade-in-up delay-300">
                            {[
                                { value: `${openings.length}`, label: 'Open Positions' },
                                { value: '12+', label: 'Departments' },
                                { value: '50+', label: 'Countries' },
                            ].map((s) => (
                                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[100px]">
                                    <div className="text-2xl font-bold text-secondary">{s.value}</div>
                                    <div className="text-blue-200/60 text-xs uppercase tracking-widest mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Benefits ── */}
            <section className="py-20 bg-white">
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                    <div className="text-center mb-12">
                        <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Why Join Us</span>
                        <h2 className="text-3xl font-serif font-bold text-primary">Benefits & Culture</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((b) => (
                            <div key={b.title} className="p-6 rounded-2xl border border-gray-100 hover:border-secondary/20 hover:shadow-xl transition-all duration-300 group card-hover bg-white">
                                <div className={`w-12 h-12 ${b.bg} ${b.color} ${b.hoverBg} group-hover:text-white rounded-2xl flex items-center justify-center mb-4 transition-all duration-300`}>
                                    {b.icon}
                                </div>
                                <h3 className="font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{b.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tabs ── */}
            <section className="py-16 bg-gray-50">
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Tab switcher */}
                    <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 w-fit mb-10 shadow-sm">
                        {[
                            { key: 'openings', label: `Open Positions (${openings.length})` },
                            { key: 'apply', label: 'Apply Now' },
                        ].map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    activeTab === t.key
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-500 hover:text-primary'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ── JOB LISTINGS ── */}
                    {activeTab === 'openings' && (
                        <div>
                            {/* Filters */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Department</label>
                                    <div className="flex flex-wrap gap-2">
                                        {departments.map((d) => (
                                            <button key={d} onClick={() => setFilterDept(d)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                    filterDept === d
                                                        ? 'bg-secondary text-white border-secondary'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-secondary/50 hover:text-secondary'
                                                }`}>
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Type</label>
                                    <div className="flex gap-2">
                                        {['All', 'Full-Time', 'Contract'].map((t) => (
                                            <button key={t} onClick={() => setFilterType(t)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                    filterType === t
                                                        ? 'bg-accent text-white border-accent'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-accent/50 hover:text-accent'
                                                }`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Job cards */}
                            <div className="space-y-4">
                                {filtered.length === 0 && (
                                    <div className="text-center py-16 text-gray-400">
                                        <p className="text-lg font-medium">No positions match your filters.</p>
                                        <button onClick={() => { setFilterDept('All'); setFilterType('All'); }} className="mt-3 text-secondary text-sm font-semibold hover:underline">Clear filters</button>
                                    </div>
                                )}
                                {filtered.map((job) => (
                                    <div key={job.id} className="bg-white rounded-2xl border border-gray-100 hover:border-secondary/25 hover:shadow-xl transition-all duration-300 p-6 md:p-8 group">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        {job.department}
                                                    </span>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                                        job.type === 'Full-Time'
                                                            ? 'bg-green-50 text-green-600'
                                                            : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-2xl">{job.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {job.tags.map((tag) => (
                                                        <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                                        {job.experience} experience
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button
                                                    onClick={() => user ? handleApplyClick(job) : window.location.href = '/login'}
                                                    className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary-light hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                                                >
                                                    {user ? 'Apply Now →' : 'Log In to Apply'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* General application nudge */}
                            <div className="mt-8 bg-primary/5 border border-primary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-bold text-primary text-lg mb-1">Don't see a role that fits?</h3>
                                    <p className="text-gray-500 text-sm">Submit a general application and we'll reach out when a relevant position opens.</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedJob(null); setActiveTab('apply'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-light transition whitespace-nowrap flex-shrink-0"
                                >
                                    General Application
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── APPLICATION FORM ── */}
                    {activeTab === 'apply' && (
                        <div className="max-w-4xl">

                            {/* ── Not logged in wall ── */}
                            {!user && (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm px-8">
                                    <div className="w-20 h-20 bg-secondary/10 border-2 border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-primary mb-3">Sign in to Apply</h2>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                                        You need to be logged in to submit a job application. This helps our HR team track your application and get back to you directly.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link to="/login"
                                            className="bg-secondary text-white px-8 py-3.5 rounded-full font-bold hover:bg-secondary-dark hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-secondary/20">
                                            Log In to Apply
                                        </Link>
                                        <Link to="/register"
                                            className="border-2 border-gray-200 text-gray-600 px-8 py-3.5 rounded-full font-bold hover:border-secondary hover:text-secondary transition-all duration-200">
                                            Create an Account
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* ── Form — only shown when logged in ── */}
                            {user && (<>
                            {/* Selected role banner */}
                            {selectedJob && (
                                <div className="bg-secondary/8 border border-secondary/20 rounded-2xl px-6 py-4 mb-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-secondary font-bold uppercase tracking-widest mb-0.5">Applying for</p>
                                        <p className="font-bold text-primary">{selectedJob.title}</p>
                                        <p className="text-xs text-gray-500">{selectedJob.department} · {selectedJob.location}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('openings')} className="text-xs text-gray-400 hover:text-secondary transition font-semibold underline">
                                        Change role
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">

                                {/* Section 1 — Personal Info */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-8 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">1</div>
                                        <div>
                                            <h3 className="text-white font-bold">Personal Information</h3>
                                            <p className="text-blue-200/60 text-xs">Your basic contact details</p>
                                        </div>
                                    </div>
                                    <div className="p-8 grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'firstName' ? 'text-secondary' : 'text-gray-500'}`}>First Name *</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                                onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')}
                                                required placeholder="Jane" className={inputCls(focused, 'firstName')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'lastName' ? 'text-secondary' : 'text-gray-500'}`}>Last Name *</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                                onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')}
                                                required placeholder="Smith" className={inputCls(focused, 'lastName')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'email' ? 'text-secondary' : 'text-gray-500'}`}>Email Address *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                                required placeholder="jane@example.com" className={inputCls(focused, 'email')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'phone' ? 'text-secondary' : 'text-gray-500'}`}>Phone Number *</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                                onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
                                                required placeholder="+1 (555) 000-0000" className={inputCls(focused, 'phone')} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 — Role Details */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-8 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">2</div>
                                        <div>
                                            <h3 className="text-white font-bold">Role & Experience</h3>
                                            <p className="text-blue-200/60 text-xs">Position you're applying for and your background</p>
                                        </div>
                                    </div>
                                    <div className="p-8 grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'position' ? 'text-secondary' : 'text-gray-500'}`}>Position Applied For *</label>
                                            <input type="text" name="position" value={formData.position} onChange={handleChange}
                                                onFocus={() => setFocused('position')} onBlur={() => setFocused('')}
                                                required placeholder="e.g. Senior Pharmacist" className={inputCls(focused, 'position')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'department' ? 'text-secondary' : 'text-gray-500'}`}>Department</label>
                                            <select name="department" value={formData.department} onChange={handleChange}
                                                onFocus={() => setFocused('department')} onBlur={() => setFocused('')}
                                                className={inputCls(focused, 'department')}>
                                                <option value="">Select department</option>
                                                {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'experience' ? 'text-secondary' : 'text-gray-500'}`}>Total Years of Experience *</label>
                                            <select name="experience" value={formData.experience} onChange={handleChange}
                                                onFocus={() => setFocused('experience')} onBlur={() => setFocused('')}
                                                required className={inputCls(focused, 'experience')}>
                                                <option value="">Select range</option>
                                                {['0–1 year', '1–3 years', '3–5 years', '5–8 years', '8–12 years', '12+ years'].map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'currentCompany' ? 'text-secondary' : 'text-gray-500'}`}>Current / Most Recent Employer</label>
                                            <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange}
                                                onFocus={() => setFocused('currentCompany')} onBlur={() => setFocused('')}
                                                placeholder="Company name" className={inputCls(focused, 'currentCompany')} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'noticePeriod' ? 'text-secondary' : 'text-gray-500'}`}>Notice Period / Availability</label>
                                            <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange}
                                                onFocus={() => setFocused('noticePeriod')} onBlur={() => setFocused('')}
                                                className={inputCls(focused, 'noticePeriod')}>
                                                <option value="">Select</option>
                                                {['Immediately', '2 weeks', '1 month', '2 months', '3 months', 'To be discussed'].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3 — Links */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-8 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">3</div>
                                        <div>
                                            <h3 className="text-white font-bold">Resume & Profiles</h3>
                                            <p className="text-blue-200/60 text-xs">Share your resume link and professional profiles</p>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-5">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'resumeLink' ? 'text-secondary' : 'text-gray-500'}`}>Resume / CV Link *</label>
                                            <input type="url" name="resumeLink" value={formData.resumeLink} onChange={handleChange}
                                                onFocus={() => setFocused('resumeLink')} onBlur={() => setFocused('')}
                                                required placeholder="https://drive.google.com/your-resume" className={inputCls(focused, 'resumeLink')} />
                                            <p className="text-xs text-gray-400 mt-1.5">Upload your CV to Google Drive, Dropbox, or OneDrive and paste the shareable link.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'linkedIn' ? 'text-secondary' : 'text-gray-500'}`}>LinkedIn Profile</label>
                                                <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange}
                                                    onFocus={() => setFocused('linkedIn')} onBlur={() => setFocused('')}
                                                    placeholder="https://linkedin.com/in/yourname" className={inputCls(focused, 'linkedIn')} />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'portfolio' ? 'text-secondary' : 'text-gray-500'}`}>Portfolio / Publications (optional)</label>
                                                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange}
                                                    onFocus={() => setFocused('portfolio')} onBlur={() => setFocused('')}
                                                    placeholder="https://yoursite.com or PubMed link" className={inputCls(focused, 'portfolio')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4 — Screening Questions */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-8 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">4</div>
                                        <div>
                                            <h3 className="text-white font-bold">Screening Questions</h3>
                                            <p className="text-blue-200/60 text-xs">Help us understand you better — be specific</p>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'whyUs' ? 'text-secondary' : 'text-gray-500'}`}>
                                                Why do you want to work at James Brown Life Sciences? *
                                            </label>
                                            <textarea name="whyUs" rows={4} value={formData.whyUs} onChange={handleChange}
                                                onFocus={() => setFocused('whyUs')} onBlur={() => setFocused('')}
                                                required placeholder="Tell us what draws you to our mission and this role specifically..."
                                                className={`${inputCls(focused, 'whyUs')} resize-none`} />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'rightFit' ? 'text-secondary' : 'text-gray-500'}`}>
                                                Describe a key achievement in your pharma career that makes you the right fit *
                                            </label>
                                            <textarea name="rightFit" rows={4} value={formData.rightFit} onChange={handleChange}
                                                onFocus={() => setFocused('rightFit')} onBlur={() => setFocused('')}
                                                required placeholder="Specific examples with measurable outcomes are always impressive..."
                                                className={`${inputCls(focused, 'rightFit')} resize-none`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5 — Logistics */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-primary px-8 py-5 flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold">5</div>
                                        <div>
                                            <h3 className="text-white font-bold">Additional Details</h3>
                                            <p className="text-blue-200/60 text-xs">A few quick questions to complete your application</p>
                                        </div>
                                    </div>
                                    <div className="p-8 grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'relocate' ? 'text-secondary' : 'text-gray-500'}`}>Open to Relocation?</label>
                                            <select name="relocate" value={formData.relocate} onChange={handleChange}
                                                onFocus={() => setFocused('relocate')} onBlur={() => setFocused('')}
                                                className={inputCls(focused, 'relocate')}>
                                                <option value="">Select</option>
                                                <option>Yes — fully open</option>
                                                <option>Yes — within country only</option>
                                                <option>No</option>
                                                <option>Would consider for the right role</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'workAuth' ? 'text-secondary' : 'text-gray-500'}`}>Work Authorisation</label>
                                            <select name="workAuth" value={formData.workAuth} onChange={handleChange}
                                                onFocus={() => setFocused('workAuth')} onBlur={() => setFocused('')}
                                                className={inputCls(focused, 'workAuth')}>
                                                <option value="">Select</option>
                                                <option>Citizen / Permanent Resident</option>
                                                <option>Valid Work Visa</option>
                                                <option>Requires Sponsorship</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors ${focused === 'referral' ? 'text-secondary' : 'text-gray-500'}`}>How did you hear about this role?</label>
                                            <select name="referral" value={formData.referral} onChange={handleChange}
                                                onFocus={() => setFocused('referral')} onBlur={() => setFocused('')}
                                                className={inputCls(focused, 'referral')}>
                                                <option value="">Select</option>
                                                {['Company Website', 'LinkedIn', 'Employee Referral', 'Job Board (Indeed / Glassdoor)', 'Industry Conference', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Consent + submit */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                    <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <input type="checkbox" id="consent" required className="mt-1 w-4 h-4 accent-secondary flex-shrink-0 cursor-pointer" />
                                        <label htmlFor="consent" className="text-sm text-gray-500 leading-relaxed cursor-pointer">
                                            I confirm that the information provided is accurate and complete. I consent to James Brown Life Sciences processing my personal data for recruitment purposes in accordance with our <a href="#" className="text-secondary hover:underline">Privacy Policy</a>.
                                        </label>
                                    </div>
                                    <button type="submit" disabled={status === 'sending'}
                                        className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {status === 'sending' ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting Application...
                                            </span>
                                        ) : 'Submit Application'}
                                    </button>
                                    {status === 'error' && (
                                        <p className="text-red-500 text-center text-sm mt-4">Something went wrong. Please try again.</p>
                                    )}
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Applications are reviewed within 5–7 business days. You will receive a confirmation email shortly after submission.
                                    </p>
                                </div>
                            </form>
                            </>)} {/* end user && */}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Careers;