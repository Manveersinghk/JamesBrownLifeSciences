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
  { label: '💊  Our medicines',       query: 'What medicines do you offer?' },
  { label: '📦  Bulk orders',          query: 'How to place a bulk order?' },
  { label: '🏅  Certifications',       query: 'What are your certifications?' },
  { label: '📍  Location & contact',   query: 'Where are you located and how can I contact you?' },
  { label: '🌍  Export countries',     query: 'Which countries do you export to?' },
  { label: '⚕️  Therapeutic areas',   query: 'What therapeutic areas do you cover?' },
];

const TypingDots = () => (
  <span className="jbls-dots">
    <span /><span /><span />
  </span>
);

const BotAvatar = () => (
  <div className="jbls-avatar">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
    </svg>
  </div>
);

export default function ChatBot() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState([{ role: 'bot', text: "Hello! I'm the JBLS Assistant. How can I help you today?" }]);
  const [input,   setInput]   = useState('');
  const [busy,    setBusy]    = useState(false);
  const [unread,  setUnread]  = useState(0);
  const [mounted, setMounted] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setMounted(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = async (txt) => {
    const text = (txt || input).trim();
    if (!text || busy) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text }]);
    setBusy(true);
    try {
      const key = import.meta.env.VITE_GROQ_API_KEY;
      if (!key) throw new Error('no key');

      const history = msgs.filter(m => m.text).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: text },
          ],
          temperature: 0.6,
          max_tokens: 280,
        }),
      });

      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content
        || 'Having trouble right now. Please call +91 97998 32489.';
      setMsgs(p => [...p, { role: 'bot', text: reply }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMsgs(p => [...p, { role: 'bot', text: 'Connection issue. Call us at +91 97998 32489 or email dbsingh490@rediffmail.com.' }]);
    } finally {
      setBusy(false);
    }
  };

  const showChips = msgs.length === 1 && !busy;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .jbls-root {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          font-family: 'Sora', -apple-system, sans-serif;
        }

        /* ── Window ── */
        .jbls-window {
          position: absolute;
          bottom: 76px;
          right: 0;
          width: 375px;
          max-width: calc(100vw - 32px);
          display: flex;
          flex-direction: column;
          border-radius: 26px;
          overflow: hidden;
          background: #080d1a;
          border: 1px solid rgba(99,179,237,0.11);
          box-shadow:
            0 40px 80px rgba(0,0,0,0.72),
            0 0 0 1px rgba(99,179,237,0.05),
            inset 0 1px 0 rgba(255,255,255,0.035);
          transform-origin: bottom right;
          transition: opacity 0.26s cubic-bezier(0.16,1,0.3,1),
                      transform 0.26s cubic-bezier(0.16,1,0.3,1);
        }
        .jbls-window.open   { opacity:1; transform:scale(1) translateY(0); pointer-events:auto; }
        .jbls-window.closed { opacity:0; transform:scale(0.9) translateY(14px); pointer-events:none; }

        /* ── Header ── */
        .jbls-header {
          padding: 18px 18px 15px;
          background: linear-gradient(135deg,rgba(14,165,233,0.09) 0%,rgba(6,182,212,0.03) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.045);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .jbls-header::after {
          content:'';
          position:absolute;
          top:-50px; right:-50px;
          width:140px; height:140px;
          background:radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 70%);
          pointer-events:none;
        }
        .jbls-logo {
          width:42px; height:42px;
          border-radius:13px;
          background:#fff;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 22px rgba(14,165,233,0.28), 0 4px 14px rgba(0,0,0,0.35);
          flex-shrink:0;
          overflow:hidden;
          padding:4px;
        }
        .jbls-header-text { margin-left:12px; }
        .jbls-header-name {
          color:#f0f6ff;
          font-weight:600;
          font-size:13.5px;
          letter-spacing:-0.01em;
        }
        .jbls-status-row {
          display:flex; align-items:center; gap:5px; margin-top:3px;
        }
        .jbls-status-dot {
          width:6px; height:6px; border-radius:50%;
          background:#22d3ee;
          animation:jbls-statusPulse 2.2s infinite;
        }
        @keyframes jbls-statusPulse {
          0%,100%{opacity:1;transform:scale(1);}
          50%{opacity:0.55;transform:scale(0.78);}
        }
        .jbls-status-txt {
          font-size:11px; color:rgba(148,163,184,0.58); font-weight:400;
        }
        .jbls-close {
          width:30px; height:30px; border-radius:9px;
          border:none; background:transparent; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:rgba(148,163,184,0.4);
          transition:background 0.14s, color 0.14s;
          flex-shrink:0;
        }
        .jbls-close:hover { background:rgba(255,255,255,0.07); color:rgba(148,163,184,0.85); }

        /* ── Messages ── */
        .jbls-msgs {
          flex:1; overflow-y:auto;
          padding:18px 15px 10px;
          display:flex; flex-direction:column; gap:13px;
          max-height:330px; min-height:190px;
          scrollbar-width:thin;
          scrollbar-color:rgba(14,165,233,0.14) transparent;
        }
        .jbls-msgs::-webkit-scrollbar{width:3px;}
        .jbls-msgs::-webkit-scrollbar-track{background:transparent;}
        .jbls-msgs::-webkit-scrollbar-thumb{background:rgba(14,165,233,0.14);border-radius:3px;}

        .jbls-row {
          display:flex; align-items:flex-end; gap:8px;
          animation:jbls-pop 0.2s ease-out;
        }
        .jbls-row.user { justify-content:flex-end; }
        .jbls-row.bot  { justify-content:flex-start; }
        @keyframes jbls-pop {
          from{opacity:0;transform:translateY(7px);}
          to  {opacity:1;transform:translateY(0);}
        }

        .jbls-avatar {
          width:27px; height:27px; border-radius:8px;
          background:linear-gradient(135deg,rgba(14,165,233,0.15),rgba(6,182,212,0.1));
          border:1px solid rgba(14,165,233,0.16);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; color:#38BDF8;
        }

        .jbls-bubble {
          max-width:79%; padding:10px 14px;
          font-size:13px; line-height:1.65; border-radius:17px;
          letter-spacing:0.005em;
        }
        .jbls-bubble.user {
          background:linear-gradient(135deg,#0EA5E9,#0284C7);
          color:#fff; border-bottom-right-radius:4px;
          box-shadow:0 4px 14px rgba(14,165,233,0.22), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .jbls-bubble.bot {
          background:rgba(255,255,255,0.048);
          border:1px solid rgba(255,255,255,0.065);
          color:rgba(220,232,245,0.88);
          border-bottom-left-radius:4px;
        }

        /* Typing dots */
        .jbls-dots{display:inline-flex;align-items:center;gap:4px;padding:2px 0;}
        .jbls-dots span{
          display:block;width:6px;height:6px;border-radius:50%;
          background:rgba(56,189,248,0.6);
          animation:jbls-bounce 0.85s infinite ease-in-out;
        }
        .jbls-dots span:nth-child(1){animation-delay:0ms;}
        .jbls-dots span:nth-child(2){animation-delay:140ms;}
        .jbls-dots span:nth-child(3){animation-delay:280ms;}
        @keyframes jbls-bounce{
          0%,80%,100%{transform:translateY(0);opacity:0.45;}
          40%{transform:translateY(-5px);opacity:1;}
        }

        /* ── Chips ── */
        .jbls-chips-section {
          padding:10px 15px 14px;
        }
        .jbls-chips-label {
          font-size:10px; font-weight:600; letter-spacing:0.08em;
          color:rgba(148,163,184,0.38); text-transform:uppercase;
          margin-bottom:8px;
        }
        .jbls-chips {
          display:flex; flex-wrap:wrap; gap:6px;
        }
        .jbls-chip {
          font-size:11.5px; font-family:'Sora',sans-serif; font-weight:500;
          padding:5px 12px; border-radius:99px;
          border:1px solid rgba(14,165,233,0.18);
          background:rgba(14,165,233,0.055);
          color:rgba(125,211,252,0.88);
          cursor:pointer; transition:all 0.17s;
          letter-spacing:0.01em;
        }
        .jbls-chip:hover {
          background:rgba(14,165,233,0.13);
          border-color:rgba(14,165,233,0.35);
          transform:translateY(-1px);
          box-shadow:0 4px 10px rgba(14,165,233,0.1);
          color:#7dd3fc;
        }

        /* ── Divider ── */
        .jbls-line {
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.046) 30%,rgba(255,255,255,0.046) 70%,transparent);
          margin:0 15px;
        }

        /* ── Input ── */
        .jbls-input-area { padding:11px 13px 15px; }
        .jbls-input-box {
          display:flex; align-items:center; gap:8px;
          padding:7px 7px 7px 15px;
          border-radius:16px;
          background:rgba(255,255,255,0.97);
          border:1.5px solid #dde3ec;
          transition:border-color 0.18s, box-shadow 0.18s;
        }
        .jbls-input-box:focus-within {
          border-color:rgba(14,165,233,0.48);
          box-shadow:0 0 0 3px rgba(14,165,233,0.07);
        }
        .jbls-input {
          flex:1; background:transparent;
          border:none; outline:none;
          color:#111827; font-size:13px;
          font-family:'Sora',sans-serif;
          caret-color:#0EA5E9; letter-spacing:0.005em;
        }
        .jbls-input::placeholder{color:#9ca3b0;}
        .jbls-input:-webkit-autofill,
        .jbls-input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0 9999px rgba(255,255,255,0.97) inset !important;
          -webkit-text-fill-color:#111827 !important;
        }
        .jbls-send {
          width:33px; height:33px; border-radius:11px;
          border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:all 0.18s;
        }
        .jbls-send.on  { background:linear-gradient(135deg,#0EA5E9,#0284C7); box-shadow:0 3px 10px rgba(14,165,233,0.28); }
        .jbls-send.off { background:#e5eaf2; cursor:default; opacity:0.48; }
        .jbls-send.on:hover  { transform:scale(1.09); box-shadow:0 5px 14px rgba(14,165,233,0.36); }
        .jbls-send.on:active { transform:scale(0.94); }

        .jbls-note {
          text-align:center; margin-top:8px;
          font-size:10.5px; color:rgba(100,116,139,0.4);
          letter-spacing:0.01em;
        }
        .jbls-note a {
          color:rgba(100,116,139,0.58); text-decoration:none;
          transition:color 0.14s;
        }
        .jbls-note a:hover{color:#38BDF8;}

        /* ── FAB ── */
        .jbls-fab {
          position:relative;
          width:54px; height:54px; border-radius:17px;
          border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          outline:none;
          transition:all 0.24s cubic-bezier(0.16,1,0.3,1);
        }
        .jbls-fab.closed {
          background:#fff;
          box-shadow:0 0 30px rgba(14,165,233,0.38), 0 8px 22px rgba(0,0,0,0.32);
          padding:10px;
        }
        .jbls-fab.opened {
          background:rgba(255,255,255,0.065);
          border:1px solid rgba(255,255,255,0.08);
          padding:0;
        }
        .jbls-fab:hover  { transform:scale(1.07); }
        .jbls-fab:active { transform:scale(0.93); }

        .jbls-ping {
          position:absolute; inset:0; border-radius:17px;
          background:rgba(14,165,233,0.42);
          animation:jbls-pingAnim 2.4s cubic-bezier(0,0,0.2,1) infinite;
          opacity:0;
        }
        @keyframes jbls-pingAnim{
          0%{transform:scale(1);opacity:0.28;}
          80%,100%{transform:scale(1.58);opacity:0;}
        }

        .jbls-badge {
          position:absolute; top:-5px; right:-5px;
          min-width:18px; height:18px; border-radius:99px;
          background:#ef4444; color:#fff;
          font-size:10px; font-weight:700;
          display:flex; align-items:center; justify-content:center;
          border:2px solid #080d1a; padding:0 4px;
          font-family:'Sora',sans-serif;
        }
      `}</style>

      <div className="jbls-root">

        {/* Chat Window */}
        <div className={`jbls-window ${open ? 'open' : 'closed'}`}>

          {/* Header */}
          <div className="jbls-header">
            <div style={{ display:'flex', alignItems:'center' }}>
              <div className="jbls-logo">
                <img src="/logojb.svg" alt="JBLS Logo" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
              </div>
              <div className="jbls-header-text">
                <div className="jbls-header-name">JBLS Assistant</div>
                <div className="jbls-status-row">
                  <span className="jbls-status-dot" />
                  <span className="jbls-status-txt">Online · Replies instantly</span>
                </div>
              </div>
            </div>
            <button className="jbls-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="jbls-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`jbls-row ${m.role}`}>
                {m.role === 'bot' && <BotAvatar />}
                <div className={`jbls-bubble ${m.role}`}>{m.text}</div>
              </div>
            ))}
            {busy && (
              <div className="jbls-row bot">
                <BotAvatar />
                <div className="jbls-bubble bot" style={{ padding:'11px 15px' }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick-access chips */}
          {showChips && (
            <>
              <div className="jbls-line" />
              <div className="jbls-chips-section">
                <div className="jbls-chips-label">Quick questions</div>
                <div className="jbls-chips">
                  {CHIPS.map(c => (
                    <button key={c.query} className="jbls-chip" onClick={() => send(c.query)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="jbls-line" />

          {/* Input */}
          <div className="jbls-input-area">
            <div className="jbls-input-box">
              <input
                ref={inputRef}
                type="text"
                className="jbls-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything about JBLS…"
                autoComplete="off"
                disabled={busy}
              />
              <button
                className={`jbls-send ${input.trim() && !busy ? 'on' : 'off'}`}
                onClick={() => send()}
                disabled={!input.trim() || busy}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/>
                </svg>
              </button>
            </div>
            <p className="jbls-note">
              Not medical advice ·{' '}
              <a href="tel:+919799832489">+91 97998 32489</a>
              {' '}for emergencies
            </p>
          </div>
        </div>

        {/* FAB */}
        <button
          className={`jbls-fab ${open ? 'opened' : 'closed'}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle chat"
        >
          {!open && <span className="jbls-ping" />}
          {unread > 0 && !open && (
            <span className="jbls-badge">{unread}</span>
          )}
          {open ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.8)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          ) : (
            <img src="/logojb.svg" alt="JBLS" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
          )}
        </button>
      </div>
    </>
  );
}