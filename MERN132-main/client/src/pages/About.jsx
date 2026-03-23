import { Link } from 'react-router-dom';

const About = () => (
    <div className="min-h-screen bg-gray-50">

        {/* ── Hero ── */}
        <div className="relative bg-primary py-32 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-[70%] h-[120%] bg-secondary/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-1/2 -left-1/4 w-[60%] h-[100%] bg-accent/6 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(rgba(14,165,233,0.8) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }} />
            </div>
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 text-secondary font-bold tracking-widest uppercase text-xs mb-6 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full animate-fade-in-up">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up delay-100 leading-tight" style={{ letterSpacing: '-0.025em' }}>
                        Built on one belief.<br />
                        <span className="text-shimmer">Every patient matters.</span>
                    </h1>
                    <p className="text-lg text-blue-200/70 font-light leading-relaxed animate-fade-in-up delay-200 max-w-xl">
                        15 years. 200+ medicines. 50+ countries. One mission that has never changed.
                    </p>
                </div>
            </div>
        </div>

        {/* ── 4 Big Stats ── */}
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 -mt-12 relative z-20 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { value: '200+', label: 'Medicine Formulations', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path strokeLinecap="round" strokeLinejoin="round" d="m8.5 8.5 7 7"/></svg> },
                    { value: '50+',  label: 'Countries Supplied',     icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
                    { value: '15+',  label: 'Years in Pharma',        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg> },
                    { value: '24/7', label: 'Medical Support',        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover text-center group">
                        <div className="w-10 h-10 bg-secondary/8 text-secondary rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                            {s.icon}
                        </div>
                        <div className="text-3xl font-bold text-primary mb-1" style={{ letterSpacing: '-0.02em' }}>{s.value}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-medium">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 pb-24 space-y-16">

            {/* ── Mission + Vision side by side ── */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Mission */}
                <div className="bg-primary rounded-3xl p-10 relative overflow-hidden group card-hover">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/15 rounded-full blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <p className="text-secondary font-bold tracking-widest uppercase text-xs mb-3">Our Mission</p>
                        <h2 className="text-2xl font-bold text-white mb-5" style={{ letterSpacing: '-0.02em' }}>
                            Make medicines accessible to every patient, everywhere.
                        </h2>
                        <div className="space-y-3">
                            {[
                                'Pharmaceutical-grade quality — no exceptions',
                                'Direct supply to hospitals, pharmacies & distributors',
                                'Affordable pricing on every formulation',
                            ].map(point => (
                                <div key={point} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <p className="text-blue-200/80 text-sm leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vision */}
                <div className="bg-white rounded-3xl p-10 border border-gray-100 relative overflow-hidden group card-hover shadow-sm">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-400/8 rounded-full blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <p className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-3">Our Vision</p>
                        <h2 className="text-2xl font-bold text-primary mb-5" style={{ letterSpacing: '-0.02em' }}>
                            No patient denied treatment due to availability or cost.
                        </h2>
                        <div className="space-y-3">
                            {[
                                'Globally recognised pharmaceutical brand',
                                'Next-gen formulations through R&D investment',
                                'Closing the gap between science and patients',
                            ].map(point => (
                                <div key={point} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Timeline ── */}
            <div>
                <div className="text-center mb-12">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">How We Started</span>
                    <h2 className="text-3xl font-bold text-primary" style={{ letterSpacing: '-0.02em' }}>15 Years of Commitment</h2>
                </div>
                <div className="relative">
                    {/* Center line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent -translate-x-1/2" />

                    <div className="space-y-6">
                        {[
                            { year: '2009', title: 'Founded',          desc: 'Single GMP-certified manufacturing unit, small team of pharmacists with one goal.',         side: 'left',  color: 'bg-secondary text-white' },
                            { year: '2013', title: 'Global Approval',  desc: 'First international regulatory milestone — WHO-GMP and EU certification achieved.',         side: 'right', color: 'bg-green-500 text-white' },
                            { year: '2017', title: 'Expanded Scope',   desc: 'Entered oncology and neurology segments, tripling the formulation portfolio.',               side: 'left',  color: 'bg-purple-500 text-white' },
                            { year: '2021', title: '50+ Countries',    desc: 'Built a cold-chain certified global distribution network reaching 50+ nations.',             side: 'right', color: 'bg-amber-500 text-white' },
                            { year: '2024', title: 'R&D Division',     desc: 'Launched dedicated research unit focused on next-generation pharma formulations.',           side: 'left',  color: 'bg-rose-500 text-white' },
                        ].map((item, i) => (
                            <div key={item.year} className={`relative flex items-center gap-6 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content card */}
                                <div className="flex-1 md:max-w-[calc(50%-2rem)]">
                                    <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm card-hover ${item.side === 'right' ? 'md:text-right' : ''}`}>
                                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${item.color}`}>{item.year}</span>
                                        <h3 className="font-bold text-primary text-lg mb-1">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                                {/* Center dot */}
                                <div className="hidden md:flex w-4 h-4 rounded-full bg-secondary border-4 border-white shadow-lg flex-shrink-0 z-10" />
                                {/* Spacer */}
                                <div className="flex-1 md:max-w-[calc(50%-2rem)] hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Core Values ── */}
            <div>
                <div className="text-center mb-12">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">What Guides Us</span>
                    <h2 className="text-3xl font-bold text-primary" style={{ letterSpacing: '-0.02em' }}>Our Core Values</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { value: 'Patient First',         icon: '❤️', color: 'text-red-500',    border: 'border-red-100',    bg: 'bg-red-50',    desc: 'Every decision guided by what is best for the patient — always.' },
                        { value: 'Scientific Integrity',  icon: '🔬', color: 'text-blue-600',   border: 'border-blue-100',   bg: 'bg-blue-50',   desc: 'Evidence, clinical data, and peer-reviewed science — no shortcuts.' },
                        { value: 'Regulatory Compliance', icon: '📋', color: 'text-purple-600', border: 'border-purple-100', bg: 'bg-purple-50', desc: 'WHO, FDA, EMA standards — non-negotiable, always maintained.' },
                        { value: 'Accessibility',         icon: '🌍', color: 'text-amber-600',  border: 'border-amber-100',  bg: 'bg-amber-50',  desc: 'Responsible pricing so life-saving treatment is never a privilege.' },
                    ].map((item) => (
                        <div key={item.value} className={`bg-white rounded-2xl p-7 border ${item.border} hover:shadow-xl transition-all duration-300 group card-hover`}>
                            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-5 text-xl`}>
                                {item.icon}
                            </div>
                            <h3 className={`text-base font-bold ${item.color} mb-2`}>{item.value}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Certifications ── */}
            <div className="bg-primary rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/8 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'radial-gradient(rgba(14,165,233,0.8) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }} />
                </div>
                <div className="relative z-10 p-12 lg:p-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Globally Recognised</span>
                            <h2 className="text-3xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                                Certified by the world's strictest regulators.
                            </h2>
                            <p className="text-blue-200/60 text-sm leading-relaxed mb-8">
                                Our facilities are audited continuously. Our products are approved in markets with the toughest pharmaceutical standards on the planet.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { cert: 'WHO-GMP',       detail: 'World Health Organisation' },
                                    { cert: 'ISO 9001:2015', detail: 'Quality Management' },
                                    { cert: 'EU GMP',        detail: 'European Medicines Agency' },
                                    { cert: 'FDA Registered',detail: 'US Food & Drug Admin.' },
                                ].map((c) => (
                                    <div key={c.cert} className="bg-white/8 border border-white/10 rounded-2xl p-4 hover:bg-white/12 transition-all duration-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-2.5 h-2.5 text-secondary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                            <p className="text-white text-sm font-bold">{c.cert}</p>
                                        </div>
                                        <p className="text-blue-300/50 text-xs pl-6">{c.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — big stats */}
                        <div className="grid grid-cols-2 gap-5">
                            {[
                                { value: '200+', label: 'Formulations',    sub: 'across 6 therapeutic areas' },
                                { value: '50+',  label: 'Countries',        sub: 'global distribution reach' },
                                { value: '24/7', label: 'Medical Support',  sub: 'emergency helpline always on' },
                                { value: '15+',  label: 'Years',            sub: 'of pharma manufacturing' },
                            ].map((s) => (
                                <div key={s.label} className="bg-white/6 border border-white/8 rounded-2xl p-6 text-center">
                                    <div className="text-4xl font-bold text-secondary mb-1" style={{ letterSpacing: '-0.03em' }}>{s.value}</div>
                                    <div className="text-white text-sm font-semibold mb-1">{s.label}</div>
                                    <div className="text-blue-300/40 text-xs">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-6">Want to work with us or learn more about our products?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/products"
                        className="btn-glow bg-secondary text-white px-10 py-4 rounded-full font-semibold hover:bg-secondary-dark transition"
                        style={{ boxShadow: '0 0 24px rgba(14,165,233,0.25)' }}>
                        View Our Medicines
                    </Link>
                    <Link to="/contact"
                        className="border-2 border-gray-200 text-gray-600 px-10 py-4 rounded-full font-semibold hover:border-secondary hover:text-secondary transition">
                        Get in Touch
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default About;