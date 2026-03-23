import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconHeart  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconDna    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m10 21 .5.5"/><path d="M2 9c6.667 6 13.333 0 20 6"/></svg>;
const IconBrain  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z"/></svg>;
const IconVirus  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4m-14.07-5.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>;
const IconWind   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>;
const IconFlask  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 3h6"/><path d="M10 3v6.379a2 2 0 0 1-.553 1.382l-5.894 6.514A1 1 0 0 0 4.276 19h15.448a1 1 0 0 0 .723-1.705l-5.894-6.514A2 2 0 0 1 14 9.38V3"/><line x1="6.5" y1="16" x2="17.5" y2="16"/></svg>;
const IconPill   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
const IconBaby   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 12h.01M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const IconGlobe  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;

// ── Animated Canvas Hero Background ──────────────────────────────────────────
const HeroCanvas = () => {
    const ref    = useRef(null);
    const animId = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        let W, H, particles, t = 0;

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            particles = Array.from({ length: 100 }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                r: Math.random() * 1.4 + 0.3,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                a: Math.random() * 0.45 + 0.1,
                p: Math.random() * Math.PI * 2,
            }));
        };

        const frame = () => {
            t++;
            // Background
            ctx.fillStyle = '#020817';
            ctx.fillRect(0, 0, W, H);

            // Moving orbs
            const tm = t * 0.007;
            [
                { x: W*(0.5+Math.sin(tm*.7)*.22), y: H*(0.3+Math.cos(tm*.5)*.18), r: W*.5,  a: 0.13 },
                { x: W*(0.15+Math.cos(tm*.6)*.12),y: H*(0.65+Math.sin(tm*.8)*.18),r: W*.38, a: 0.1  },
                { x: W*(0.85+Math.sin(tm*.9)*.1), y: H*(0.4+Math.cos(tm*.7)*.18), r: W*.32, a: 0.08 },
            ].forEach(o => {
                const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
                g.addColorStop(0,`rgba(14,165,233,${o.a})`);
                g.addColorStop(1,'transparent');
                ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
            });

            // Top beam
            const b = ctx.createRadialGradient(W/2,0,0,W/2,0,H*.75);
            b.addColorStop(0,'rgba(14,165,233,0.18)'); b.addColorStop(.4,'rgba(14,165,233,0.05)'); b.addColorStop(1,'transparent');
            ctx.fillStyle = b; ctx.fillRect(0,0,W,H);

            // Grid
            ctx.strokeStyle='rgba(14,165,233,0.055)'; ctx.lineWidth=.5;
            const s=36;
            for(let x=0;x<=W;x+=s){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
            for(let y=0;y<=H;y+=s){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
            const fade=ctx.createRadialGradient(W/2,H/2,H*.18,W/2,H/2,H*.75);
            fade.addColorStop(0,'transparent'); fade.addColorStop(1,'rgba(2,8,23,0.94)');
            ctx.fillStyle=fade; ctx.fillRect(0,0,W,H);

            // DNA helix
            const cx=W/2, amp=Math.min(W*.16,160), spd=0.016;
            const pts1=[], pts2=[];
            for(let i=0;i<64;i++){
                const prog=i/63, y=H*.06+prog*H*.88;
                const xO=Math.sin(prog*Math.PI*3.2+t*spd)*amp;
                pts1.push({x:cx+xO,y}); pts2.push({x:cx-xO,y});
            }
            [pts1,pts2].forEach(pts=>{
                ctx.beginPath();
                pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
                const g=ctx.createLinearGradient(0,H*.06,0,H*.94);
                g.addColorStop(0,'rgba(14,165,233,0)'); g.addColorStop(.15,'rgba(14,165,233,0.2)');
                g.addColorStop(.5,'rgba(56,189,248,0.28)'); g.addColorStop(.85,'rgba(14,165,233,0.2)'); g.addColorStop(1,'rgba(14,165,233,0)');
                ctx.strokeStyle=g; ctx.lineWidth=1.4; ctx.stroke();
            });
            for(let i=2;i<62;i+=4){
                const p1=pts1[i],p2=pts2[i];
                if(Math.abs(p1.x-p2.x)>16){
                    ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
                    ctx.strokeStyle=`rgba(14,165,233,${.1+.05*Math.sin(i+t*spd)})`; ctx.lineWidth=.8; ctx.stroke();
                    [p1,p2].forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,Math.PI*2);ctx.fillStyle='rgba(56,189,248,0.4)';ctx.fill();});
                }
            }

            // Particles
            particles.forEach(p=>{
                p.x+=p.vx; p.y+=p.vy; p.p+=.018;
                if(p.x<-4)p.x=W+4; if(p.x>W+4)p.x=-4;
                if(p.y<-4)p.y=H+4; if(p.y>H+4)p.y=-4;
                ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
                ctx.fillStyle=`rgba(56,189,248,${p.a*(0.6+0.4*Math.sin(p.p))})`;
                ctx.fill();
            });
            for(let i=0;i<particles.length;i++){
                for(let j=i+1;j<particles.length;j++){
                    const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
                    const d=Math.sqrt(dx*dx+dy*dy);
                    if(d<85){
                        ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
                        ctx.strokeStyle=`rgba(14,165,233,${.13*(1-d/85)})`; ctx.lineWidth=.5; ctx.stroke();
                    }
                }
            }

            // Scan line
            const sy=((t*.55)%(H+50))-25;
            const sg=ctx.createLinearGradient(0,sy-30,0,sy+30);
            sg.addColorStop(0,'transparent'); sg.addColorStop(.5,'rgba(14,165,233,0.035)'); sg.addColorStop(1,'transparent');
            ctx.fillStyle=sg; ctx.fillRect(0,sy-30,W,60);

            animId.current = requestAnimationFrame(frame);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();
        frame();
        return () => { cancelAnimationFrame(animId.current); ro.disconnect(); };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
};

// ── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => (
    <div className="bg-gray-50 min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: '#020817' }}>
            <HeroCanvas />
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-32">
                <div className="max-w-4xl mx-auto text-center">

                    <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in-up tracking-wider uppercase"
                        style={{ background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.22)', color:'#38BDF8' }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:'#22c55e' }} />
                        Trusted by 500+ Healthcare Providers Worldwide
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight animate-fade-in-up delay-100"
                        style={{ letterSpacing:'-0.025em' }}>
                        Medicines That{' '}
                        <span className="text-shimmer">Heal. Protect. Restore.</span>
                    </h1>

                    <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200"
                        style={{ color:'rgba(148,163,184,0.85)' }}>
                        James Brown Life Sciences manufactures and supplies pharmaceutical-grade medicines — formulated with precision, tested to the highest standards, and delivered to patients who need them most.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
                        <Link to="/products" className="btn-glow px-10 py-4 rounded-full font-semibold text-base text-white"
                            style={{ background:'linear-gradient(135deg,#0EA5E9,#0284C7)', boxShadow:'0 0 28px rgba(14,165,233,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                            View Our Medicines
                        </Link>
                        <Link to="/contact" className="px-10 py-4 rounded-full font-semibold text-base text-white transition-all duration-300 hover:-translate-y-1"
                            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(12px)' }}>
                            Contact Us
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 mt-20 pt-12 animate-fade-in-up delay-400 max-w-lg mx-auto"
                        style={{ borderTop:'1px solid rgba(14,165,233,0.12)' }}>
                        {[
                            { value:'200+', label:'Formulations'   },
                            { value:'50+',  label:'Countries'      },
                            { value:'15+',  label:'Years in Pharma'},
                        ].map((s,i) => (
                            <div key={s.label} className="text-center relative"
                                style={i>0?{borderLeft:'1px solid rgba(14,165,233,0.1)'}:{}}>
                                <div className="text-3xl font-bold mb-1" style={{ color:'#38BDF8', letterSpacing:'-0.025em' }}>{s.value}</div>
                                <div className="text-xs uppercase tracking-widest font-medium" style={{ color:'rgba(148,163,184,0.5)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* ── Image Gallery ── */}
        <ImageGallery />

        {/* ── Why Choose Us ── */}
        <section className="py-28 bg-white">
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">Why Choose Us</span>
                    <h2 className="text-4xl font-bold text-primary mb-5" style={{ letterSpacing:'-0.02em' }}>Pharmaceutical Excellence at Every Step</h2>
                    <div className="w-12 h-1 bg-secondary mx-auto rounded-full mb-6" />
                    <p className="text-lg text-gray-500 leading-relaxed font-light">From formulation to final packaging, every medicine we produce meets stringent international pharmaceutical standards.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { bg:'bg-blue-50',  iconBg:'bg-blue-100',  iconColor:'text-blue-600',  hoverBg:'group-hover:bg-blue-600',  title:'GMP Certified Manufacturing', desc:'Every batch produced under strict Good Manufacturing Practices — ensuring consistent purity, potency, and safety.',            icon:<IconShield /> },
                        { bg:'bg-green-50', iconBg:'bg-green-100', iconColor:'text-green-600', hoverBg:'group-hover:bg-green-600', title:'Clinically Validated Formulas', desc:'Our medicines are developed through rigorous clinical trials and validated by independent regulatory bodies.',           icon:<IconFlask />  },
                        { bg:'bg-sky-50',   iconBg:'bg-sky-100',   iconColor:'text-sky-600',   hoverBg:'group-hover:bg-sky-600',   title:'Global Distribution Network',  desc:'Cold-chain certified logistics and partnerships with distributors across 50+ countries keep our medicines moving.', icon:<IconGlobe />  },
                    ].map(item => (
                        <div key={item.title} className={`p-10 rounded-3xl bg-white border border-gray-100 hover:border-secondary/20 hover:shadow-2xl transition-all duration-300 group text-center card-hover`}>
                            <div className={`w-16 h-16 ${item.iconBg} ${item.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-6 ${item.hoverBg} group-hover:text-white transition-all duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Therapeutic Areas ── */}
        <section className="py-20 bg-gray-50">
            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16">
                <div className="text-center mb-12">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-3 block">What We Treat</span>
                    <h2 className="text-3xl font-bold text-primary" style={{ letterSpacing:'-0.02em' }}>Therapeutic Areas We Serve</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { area:'Cardiovascular',      icon:<IconHeart /> },
                        { area:'Oncology',            icon:<IconDna />   },
                        { area:'Neurology',           icon:<IconBrain /> },
                        { area:'Infectious Diseases', icon:<IconVirus /> },
                        { area:'Respiratory',         icon:<IconWind />  },
                        { area:'Endocrinology',       icon:<IconFlask /> },
                        { area:'Dermatology',         icon:<IconPill />  },
                        { area:'Paediatrics',         icon:<IconBaby />  },
                    ].map(item => (
                        <div key={item.area} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 group card-hover">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-secondary/8 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                {item.icon}
                            </div>
                            <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors">{item.area}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="relative overflow-hidden py-24" style={{ background:'#020817' }}>
            <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 65%)' }} />
            <div className="absolute inset-0" style={{
                backgroundImage:'radial-gradient(rgba(14,165,233,0.12) 1px, transparent 1px)',
                backgroundSize:'28px 28px',
                maskImage:'radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent)',
                WebkitMaskImage:'radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent)',
            }} />
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ letterSpacing:'-0.02em' }}>
                    Looking to partner or place an order?
                </h2>
                <p className="mb-8 max-w-xl mx-auto leading-relaxed font-light" style={{ color:'rgba(148,163,184,0.7)' }}>
                    Whether you're a hospital, pharmacy chain, or distribution partner — we'd love to work with you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/contact" className="btn-glow px-10 py-4 rounded-full font-semibold text-white"
                        style={{ background:'linear-gradient(135deg,#0EA5E9,#0284C7)', boxShadow:'0 0 24px rgba(14,165,233,0.3)' }}>
                        Get in Touch
                    </Link>
                    <Link to="/products" className="px-10 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-1"
                        style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(12px)' }}>
                        Browse Our Medicines
                    </Link>
                </div>
            </div>
        </section>
    </div>
);

export default Home;