import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are the JBLS Assistant for James Brown Life Sciences, a pharmaceutical company based in Khatipura, Jaipur, Rajasthan 302012, India.

COMPANY FACTS:
- 200+ medicine formulations across 6 therapeutic areas
- Supplies to 50+ countries, 15+ years in pharma manufacturing
- WHO-GMP, ISO 9001:2015, EU GMP, FDA Registered
- Phone: +91 97998 32489 (orders, partnerships, emergencies)
- Email: dbsingh490@rediffmail.com
- Hours: Mon–Sat, 9am–6pm IST. Emergency line 24/7.

THERAPEUTIC AREAS: Cardiovascular, Oncology, Anti-Infective, Neurology/CNS, Respiratory, Paediatrics

ORDERING: Bulk orders accepted. Contact +91 97998 32489 or fill the Contact form on the website.

RULES:
- Be concise, warm, and professional. Max 3 sentences per reply.
- Never make up medicine names or prices — say "contact us for specific pricing"
- For medical emergencies always direct to call +91 97998 32489 immediately
- Never claim to be a doctor or give personal medical advice
- If asked something outside JBLS scope, politely redirect`;

const CHIPS = [
    'What medicines do you offer?',
    'How to place a bulk order?',
    'Your certifications',
    'Contact & location',
];

const Dots = () => (
    <div className="flex items-center gap-1 py-0.5">
        {[0,140,280].map(d => (
            <span key={d} className="block w-2 h-2 rounded-full animate-bounce"
                style={{ background:'rgba(14,165,233,0.7)', animationDelay:`${d}ms`, animationDuration:'0.85s' }} />
        ))}
    </div>
);

export default function ChatBot() {
    const [open,    setOpen]    = useState(false);
    const [msgs,    setMsgs]    = useState([{ role:'bot', text:'Hello! How can I help you today?' }]);
    const [input,   setInput]   = useState('');
    const [busy,    setBusy]    = useState(false);
    const [unread,  setUnread]  = useState(0);
    const bottomRef = useRef(null);
    const inputRef  = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs, busy]);
    useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 250); } }, [open]);

    const send = async (txt) => {
        const text = (txt || input).trim();
        if (!text || busy) return;
        setInput('');
        setMsgs(p => [...p, { role:'user', text }]);
        setBusy(true);
        try {
            const key = import.meta.env.VITE_GEMINI_API_KEY;
            if (!key) throw new Error('no key');
            const history = msgs.filter(m => m.text).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
                {
                    method:'POST',
                    headers:{ 'Content-Type':'application/json' },
                    body: JSON.stringify({
                        system_instruction:{ parts:[{ text:SYSTEM_PROMPT }] },
                        contents:[...history, { role:'user', parts:[{ text }] }],
                        generationConfig:{ temperature:0.6, maxOutputTokens:280 },
                    }),
                }
            );
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
                || 'Having trouble right now. Please call +91 97998 32489.';
            setMsgs(p => [...p, { role:'bot', text:reply }]);
            if (!open) setUnread(n => n+1);
        } catch {
            setMsgs(p => [...p, { role:'bot', text:'Connection issue. Call us at +91 97998 32489 or email dbsingh490@rediffmail.com.' }]);
        } finally { setBusy(false); }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily:'"DM Sans",-apple-system,sans-serif' }}>

            {/* ── Window ── */}
            <div style={{
                position:'absolute', bottom:'72px', right:0,
                width:'360px', maxWidth:'calc(100vw - 24px)',
                display:'flex', flexDirection:'column',
                borderRadius:'24px', overflow:'hidden',
                background:'#030712',
                border:'1px solid rgba(14,165,233,0.16)',
                boxShadow:'0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.08)',
                transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                transformOrigin:'bottom right',
                opacity: open ? 1 : 0,
                transform: open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(8px)',
                pointerEvents: open ? 'auto' : 'none',
            }}>

                {/* Header */}
                <div style={{ padding:'16px 18px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(14,165,233,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#0EA5E9,#0284C7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 18px rgba(14,165,233,0.4)', flexShrink:0 }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p style={{ color:'#fff', fontWeight:600, fontSize:14, lineHeight:1.2 }}>JBLS Assistant</p>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                                <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 1.5s infinite' }} />
                                <span style={{ color:'rgba(148,163,184,0.55)', fontSize:11 }}>Online · Replies instantly</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} style={{ width:32, height:32, borderRadius:10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(148,163,184,0.5)', transition:'background .15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex:1, overflowY:'auto', padding:'14px 14px 8px', display:'flex', flexDirection:'column', gap:10, maxHeight:320, minHeight:200 }}>
                    {msgs.map((m,i) => (
                        <div key={i} style={{ display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:8 }}>
                            {m.role==='bot' && (
                                <div style={{ width:26, height:26, borderRadius:8, background:'rgba(14,165,233,0.14)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#38BDF8' }}>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                </div>
                            )}
                            <div style={{
                                maxWidth:'80%', padding:'10px 14px', fontSize:13, lineHeight:1.6, borderRadius:16,
                                ...(m.role==='user'
                                    ? { background:'linear-gradient(135deg,#0EA5E9,#0284C7)', color:'#fff', borderBottomRightRadius:4, boxShadow:'0 4px 12px rgba(14,165,233,0.2)' }
                                    : { background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.07)', color:'rgba(226,232,240,0.88)', borderBottomLeftRadius:4 }
                                )
                            }}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {busy && (
                        <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                            <div style={{ width:26, height:26, borderRadius:8, background:'rgba(14,165,233,0.14)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#38BDF8' }}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div style={{ padding:'10px 16px', borderRadius:16, borderBottomLeftRadius:4, background:'rgba(255,255,255,0.055)', border:'1px solid rgba(255,255,255,0.07)' }}>
                                <Dots />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick chips */}
                {msgs.length === 1 && !busy && (
                    <div style={{ padding:'0 14px 10px', display:'flex', flexWrap:'wrap', gap:6 }}>
                        {CHIPS.map(c => (
                            <button key={c} onClick={() => send(c)}
                                style={{ fontSize:11, padding:'5px 12px', borderRadius:99, border:'1px solid rgba(14,165,233,0.22)', background:'rgba(14,165,233,0.08)', color:'#38BDF8', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
                                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(14,165,233,0.15)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(14,165,233,0.08)'; e.currentTarget.style.transform='translateY(0)'; }}>
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div style={{ padding:'10px 14px 14px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px 8px 16px', borderRadius:16, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', transition:'border-color .2s' }}
                        onFocusCapture={e => e.currentTarget.style.borderColor='rgba(14,165,233,0.35)'}
                        onBlurCapture={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                    
                        <input ref={inputRef} type="text" className="chatbot-input" value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} }}
                            placeholder="Ask anything about JBLS..."
                            disabled={busy}
                            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'rgba(226,232,240,0.9)', fontSize:13, caretColor:'#0EA5E9', fontFamily:'inherit' }}
                        />
                        <button onClick={() => send()} disabled={!input.trim()||busy}
                            style={{ width:32, height:32, borderRadius:10, border:'none', cursor: input.trim()&&!busy ? 'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s',
                                background: input.trim()&&!busy ? 'linear-gradient(135deg,#0EA5E9,#0284C7)' : 'rgba(255,255,255,0.06)',
                                opacity: input.trim()&&!busy ? 1 : 0.4,
                                transform:'scale(1)',
                            }}
                            onMouseEnter={e=>{ if(input.trim()&&!busy) e.currentTarget.style.transform='scale(1.08)'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; }}>
                            <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
                            </svg>
                        </button>
                    </div>
                    <p style={{ textAlign:'center', marginTop:8, fontSize:10.5, color:'rgba(100,116,139,0.45)' }}>
                        Not medical advice ·{' '}
                        <a href="tel:+919799832489" style={{ color:'rgba(100,116,139,0.6)', textDecoration:'none' }}
                            onMouseEnter={e=>e.currentTarget.style.color='#38BDF8'}
                            onMouseLeave={e=>e.currentTarget.style.color='rgba(100,116,139,0.6)'}>
                            +91 97998 32489
                        </a>{' '}for emergencies
                    </p>
                </div>
            </div>

            {/* ── FAB ── */}
            <button onClick={() => setOpen(o => !o)}
                style={{
                    position:'relative', width:54, height:54, borderRadius:16, border:'none', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background: open ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#0EA5E9,#0284C7)',
                    boxShadow: open ? 'none' : '0 0 28px rgba(14,165,233,0.45), 0 8px 20px rgba(0,0,0,0.3)',
                    transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                    outline:'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
                onMouseDown={e  => { e.currentTarget.style.transform='scale(0.94)'; }}
                onMouseUp={e    => { e.currentTarget.style.transform='scale(1.06)'; }}>

                {/* Ping ring */}
                {!open && (
                    <span style={{ position:'absolute', inset:0, borderRadius:16, background:'rgba(14,165,233,0.5)', animation:'ping 2s cubic-bezier(0,0,.2,1) infinite', opacity:.25 }} />
                )}

                {/* Unread badge */}
                {unread > 0 && !open && (
                    <span style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:'#ef4444', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #020817' }}>
                        {unread}
                    </span>
                )}

                {open ? (
                    <svg width="16" height="16" fill="none" stroke="rgba(148,163,184,0.8)" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                ) : (
                    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                )}
            </button>
        </div>
    );
}