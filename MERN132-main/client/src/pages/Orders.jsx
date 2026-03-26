import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STEPS = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered'];

const STATUS = {
    pending:    { label: 'Pending',    color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
    confirmed:  { label: 'Confirmed',  color: '#0EA5E9', bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.2)'  },
    processing: { label: 'Processing', color: '#A855F7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.2)'  },
    dispatched: { label: 'Dispatched', color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)'  },
    delivered:  { label: 'Delivered',  color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
    cancelled:  { label: 'Cancelled',  color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
};

const fmt     = (n) => n?.toLocaleString('en-IN');
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtShort= (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const getIdx  = (status) => STEPS.indexOf(status);
const getPct  = (status) => { const i = getIdx(status); return i < 0 ? 0 : Math.round((i / (STEPS.length - 1)) * 100); };

/* ─── Badge ── */
const Badge = ({ status }) => {
    const s = STATUS[status] || STATUS.pending;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 9px', borderRadius: 99,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
            {s.label}
        </span>
    );
};

/* ─── BentoCard shell ── */
const BC = ({ children, style = {}, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: '#07111F',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            overflow: 'hidden',
            ...style,
        }}
    >
        {children}
    </div>
);

/* ─── Order Detail Modal ── */
const OrderDetail = ({ order, onClose }) => {
    const s         = STATUS[order.status] || STATUS.pending;
    const cancelled = order.status === 'cancelled';
    const idx       = getIdx(order.status);
    const progress  = getPct(order.status);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 50,
                background: 'rgba(2,8,23,0.88)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '48px 20px', overflowY: 'auto',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 880,
                    background: '#06101C',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 24, overflow: 'hidden',
                    animation: 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
                }}
            >
                <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

                {/* ── Modal header ── */}
                <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)', marginBottom: 4 }}>Order ID</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.035em' }}>#{order.orderNumber}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Badge status={order.status} />
                        <button
                            onClick={onClose}
                            style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.5)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                        >×</button>
                    </div>
                </div>

                {/* ── Bento row 1: progress + date + total ── */}
                <div style={{ padding: '20px 28px 0', display: 'grid', gridTemplateColumns: '1fr 130px 130px', gap: 12 }}>

                    {/* Progress card */}
                    <BC style={{ padding: '20px 22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="15" height="15" fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    {cancelled ? <><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></> : <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m0 0h4l3 3v4h-7V8Z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>}
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(226,232,240,0.85)' }}>
                                    {cancelled ? 'Order Cancelled' : `${s.label}`}
                                </p>
                                <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', marginTop: 1 }}>
                                    {cancelled ? 'Contact support for help' : `Step ${idx + 1} of ${STEPS.length}`}
                                </p>
                            </div>
                        </div>

                        {!cancelled && (
                            <>
                                {/* Bar */}
                                <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.05)', marginBottom: 14, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: 99, width: `${progress}%`, background: `linear-gradient(90deg, #F59E0B, ${s.color})`, transition: 'width 0.6s ease' }} />
                                </div>
                                {/* Steps */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {STEPS.map((step, i) => {
                                        const done = i <= idx; const sc = STATUS[step];
                                        return (
                                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: done ? sc.color : 'rgba(255,255,255,0.08)', border: i === idx ? `2px solid ${sc.color}` : 'none', outline: i === idx ? `3px solid ${sc.color}22` : 'none', transition: 'all 0.3s' }} />
                                                <span style={{ fontSize: 9, fontWeight: 600, color: done ? 'rgba(226,232,240,0.5)' : 'rgba(100,116,139,0.25)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{sc.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {cancelled && (
                            <p style={{ fontSize: 13, color: 'rgba(239,68,68,0.7)' }}>
                                Call <a href="tel:+919799832489" style={{ color: '#EF4444', fontWeight: 700, textDecoration: 'none' }}>+91 97998 32489</a> for assistance.
                            </p>
                        )}
                    </BC>

                    {/* Date */}
                    <BC style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.1)' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Placed on</p>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtShort(order.createdAt)}</p>
                            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.35)', marginTop: 3 }}>{new Date(order.createdAt).getFullYear()}</p>
                        </div>
                    </BC>

                    {/* Total */}
                    <BC style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order Total</p>
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.04em', lineHeight: 1 }}>₹{fmt(order.totalAmount)}</p>
                            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.35)', marginTop: 3 }}>{order.items?.length} items</p>
                        </div>
                    </BC>
                </div>

                {/* ── Bento row 2: timeline + address/help ── */}
                <div style={{ padding: '12px 28px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                    {/* Timeline */}
                    <BC style={{ padding: '18px 20px' }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Timeline</p>
                        <div>
                            {STEPS.slice(0, idx + 1).reverse().map((step, i, arr) => {
                                const sc = STATUS[step]; const isFirst = i === 0;
                                return (
                                    <div key={step} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 12, paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 2, flexShrink: 0, background: isFirst ? sc.color : 'rgba(255,255,255,0.12)', border: isFirst ? `2px solid ${sc.color}` : 'none', outline: isFirst ? `3px solid ${sc.color}20` : 'none' }} />
                                            {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', marginTop: 5 }} />}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 700, color: isFirst ? 'rgba(226,232,240,0.85)' : 'rgba(148,163,184,0.4)' }}>{sc.label}</p>
                                            <p style={{ fontSize: 11, color: 'rgba(100,116,139,0.6)', marginTop: 1 }}>{fmtDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </BC>

                    {/* Address + Help stacked */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <BC style={{ padding: '18px 20px', flex: 1 }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Delivery Address</p>
                            <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.75)', lineHeight: 1.8 }}>
                                {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ''}<br />
                                {order.address?.city}, {order.address?.state} – {order.address?.pincode}<br />
                                {order.address?.country}
                            </p>
                        </BC>
                        <div style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.1)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(226,232,240,0.7)', marginBottom: 2 }}>Need help?</p>
                                <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.65)' }}>We confirm orders by call</p>
                            </div>
                            <a href="tel:+919799832489" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 99, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38BDF8', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* ── Items ── */}
                <div style={{ padding: '12px 28px 28px' }}>
                    <BC>
                        <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Items Ordered</p>
                            <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.3)', fontWeight: 600 }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                        </div>
                        {order.items?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="14" height="14" fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(226,232,240,0.85)', marginBottom: 2 }}>{item.medicineName}</p>
                                    <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.38)' }}>{item.dosageForm} · {item.packSize} · Qty {item.quantity}</p>
                                </div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: '#38BDF8', flexShrink: 0 }}>₹{fmt(item.subtotal)}</p>
                            </div>
                        ))}
                        <div style={{ padding: '13px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(148,163,184,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
                            <span style={{ fontSize: 17, fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.02em' }}>₹{fmt(order.totalAmount)}</span>
                        </div>
                    </BC>
                </div>
            </div>
        </div>
    );
};

/* ─── Order Row ── */
const OrderRow = ({ order, onClick }) => {
    const s         = STATUS[order.status] || STATUS.pending;
    const cancelled = order.status === 'cancelled';
    const progress  = getPct(order.status);
    const medicines = order.items?.slice(0, 2).map(i => i.medicineName).join(', ') + (order.items?.length > 2 ? ` +${order.items.length - 2} more` : '');

    return (
        <div
            onClick={onClick}
            style={{ background: '#080D1A', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}35`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${s.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            {/* Colored progress strip */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: cancelled ? '100%' : `${progress}%`, background: cancelled ? '#EF4444' : `linear-gradient(90deg,${STATUS[STEPS[0]].color}80,${s.color})`, transition: 'width 0.6s ease', borderRadius: '0 2px 2px 0' }} />
            </div>

            <div style={{ padding: '18px 22px' }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        {/* Colored icon box */}
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="16" height="16" fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: '#E2E8F0', letterSpacing: '-0.02em' }}>{order.orderNumber}</span>
                                <Badge status={order.status} />
                            </div>
                            {/* Medicine names preview */}
                            <p style={{ fontSize: 11.5, color: 'rgba(148,163,184,0.75)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>
                                {medicines}
                            </p>
                        </div>
                    </div>

                    {/* Amount + arrow */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 17, fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.03em', lineHeight: 1 }}>₹{fmt(order.totalAmount)}</p>
                            <p style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', marginTop: 3 }}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="11" height="11" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Bottom row — meta chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {/* Date chip */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10.5, color: 'rgba(148,163,184,0.45)', fontWeight: 500 }}>
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {fmtDate(order.createdAt)}
                    </span>
                    {/* City chip */}
                    {order.address?.city && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 10.5, color: 'rgba(148,163,184,0.7)', fontWeight: 500 }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 4.97 7 13 7 13s7-8.03 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                            {order.address.city}, {order.address.state}
                        </span>
                    )}
                    {/* Progress label */}
                    {!cancelled && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, background: `${s.color}0d`, border: `1px solid ${s.color}22`, fontSize: 10.5, color: s.color, fontWeight: 600 }}>
                            {progress}% complete
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ── */
const Orders = () => {
    const { user, getToken } = useAuth();
    const navigate = useNavigate();
    const [orders,   setOrders]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [selected, setSelected] = useState(null);
    const [filter,   setFilter]   = useState('all');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetch(`${API}/api/orders/my`, { headers: { Authorization: `Bearer ${getToken()}` } })
            .then(r => r.json())
            .then(d => { setOrders(d.orders || []); setLoading(false); })
            .catch(() => { setError('Failed to load orders.'); setLoading(false); });
    }, [user]);

    if (!user) return null;

    const filtered   = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'pending',    label: 'Pending'    },
        { key: 'confirmed',  label: 'Confirmed'  },
        { key: 'processing', label: 'Processing' },
        { key: 'dispatched', label: 'Dispatched' },
        { key: 'delivered',  label: 'Delivered'  },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#020817' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* ── Hero + top bento ── */}
            <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 108, paddingBottom: 0 }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 55% 40% at 50% 0%, rgba(14,165,233,0.1) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(14,165,233,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(ellipse 50% 60% at 50% 0%, black, transparent)', WebkitMaskImage: 'radial-gradient(ellipse 50% 60% at 50% 0%, black, transparent)' }} />

                <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

                    {/* ── Top bento: title + stats + CTA ── */}
                    <div style={{ background: '#07111F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '24px 28px', display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                        {/* Title */}
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.13)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38BDF8', marginBottom: 9 }}>
                                <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                My Orders
                            </div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>Order History</h1>
                            <p style={{ fontSize: 12, color: 'rgba(148,163,184,0.65)', marginTop: 5 }}>Real-time delivery tracking for all your orders</p>
                        </div>

                        {/* Orders count */}
                        {!loading && (
                            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 14, padding: '14px 20px', textAlign: 'center', minWidth: 96 }}>
                                <p style={{ fontSize: 26, fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.04em', lineHeight: 1 }}>{orders.length}</p>
                                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>Orders</p>
                            </div>
                        )}

                        {/* Spend */}
                        {!loading && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 20px', textAlign: 'center', minWidth: 120 }}>
                                <p style={{ fontSize: 22, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.04em', lineHeight: 1 }}>₹{fmt(totalSpend)}</p>
                                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>Total Spend</p>
                            </div>
                        )}

                        {/* New order */}
                        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 18px', borderRadius: 12, background: '#0EA5E9', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em', flexShrink: 0 }}>
                            <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
                            New Order
                        </Link>
                    </div>

                    {/* ── Filter chips ── */}
                    {!loading && orders.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                            {tabs.map(tab => {
                                const count  = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length;
                                const active = filter === tab.key;
                                const col    = tab.key === 'all' ? '#38BDF8' : (STATUS[tab.key]?.color || '#38BDF8');
                                return (
                                    <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 99, cursor: 'pointer', border: active ? `1px solid ${col}35` : '1px solid rgba(255,255,255,0.07)', background: active ? `${col}0d` : 'rgba(255,255,255,0.025)', transition: 'all 0.18s' }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: active ? col : 'rgba(148,163,184,0.65)' }}>{tab.label}</span>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: active ? col : 'rgba(148,163,184,0.45)', background: active ? `${col}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? `${col}25` : 'rgba(255,255,255,0.06)'}`, borderRadius: 99, padding: '1px 6px' }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>

                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 14 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid rgba(14,165,233,0.15)', borderTopColor: '#0EA5E9', animation: 'spin 0.7s linear infinite' }} />
                        <p style={{ color: 'rgba(148,163,184,0.35)', fontSize: 13 }}>Loading orders…</p>
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '20px 24px', textAlign: 'center', marginTop: 12 }}>
                        <p style={{ color: 'rgba(239,68,68,0.75)', fontSize: 13, marginBottom: 10 }}>{error}</p>
                        <button onClick={() => window.location.reload()} style={{ color: '#38BDF8', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Try again</button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '90px 0' }}>
                        <div style={{ width: 58, height: 58, borderRadius: 15, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <svg width="24" height="24" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        </div>
                        <h3 style={{ color: 'rgba(226,232,240,0.75)', fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 7 }}>No orders yet</h3>
                        <p style={{ color: 'rgba(148,163,184,0.38)', fontSize: 13, marginBottom: 26 }}>Place your first bulk medicine order.</p>
                        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 99, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38BDF8', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Browse Medicines</Link>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {filtered.map(order => (
                            <OrderRow key={order.orderNumber} order={order} onClick={() => setSelected(order)} />
                        ))}
                    </div>
                )}

                {!loading && !error && orders.length > 0 && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <p style={{ color: 'rgba(148,163,184,0.4)', fontSize: 13, marginBottom: 10 }}>No orders with this status.</p>
                        <button onClick={() => setFilter('all')} style={{ color: '#38BDF8', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Show all</button>
                    </div>
                )}

                {/* Trust strip */}
                {!loading && orders.length > 0 && (
                    <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, textAlign: 'center' }}>
                        {[
                            { d: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>, title: 'Payment by Call', desc: 'We call to confirm payment before dispatch.' },
                            { d: <><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m0 0h4l3 3v4h-7V8Z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>, title: 'GDP Certified', desc: 'Cold-chain logistics to your doorstep.' },
                            { d: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>, title: 'WHO-GMP Quality', desc: 'Every batch tested before dispatch.' },
                        ].map(item => (
                            <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="15" height="15" fill="none" stroke="rgba(56,189,248,0.6)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{item.d}</svg>
                                </div>
                                <p style={{ color: 'rgba(226,232,240,0.8)', fontSize: 12, fontWeight: 700 }}>{item.title}</p>
                                <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: 11, lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail modal */}
            {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};

export default Orders;