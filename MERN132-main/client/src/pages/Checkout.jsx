import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const steps = ['Review Order', 'Delivery Details', 'Verify Phone', 'Confirm'];

const Checkout = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user, getToken } = useAuth();
    const navigate = useNavigate();

    const [step,    setStep]    = useState(0);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    // Address form
    const [address, setAddress] = useState({
        line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
    });

    // Phone + OTP
    const [phone,       setPhone]       = useState('');
    const [otp,         setOtp]         = useState('');
    const [otpSent,     setOtpSent]     = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpTimer,    setOtpTimer]    = useState(0);

    // Placed order
    const [placedOrder, setPlacedOrder] = useState(null);

    // Notes
    const [notes, setNotes] = useState('');

    // ── Redirect if not logged in ─────────────────────────────────────────────
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Please log in to place an order.</p>
                    <Link to="/login" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary-dark transition">Log In</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !placedOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-gray-500 mb-4">Your order is empty.</p>
                    <Link to="/products" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-secondary-dark transition">Browse Medicines</Link>
                </div>
            </div>
        );
    }

    // ── Send OTP ──────────────────────────────────────────────────────────────
    const handleSendOtp = async () => {
        const digits = phone.replace(/\D/g, '');
        if (!phone || digits.length < 10) {
            setError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/otp/send`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOtpSent(true);
            // Start 60s resend timer
            setOtpTimer(60);
            const interval = setInterval(() => {
                setOtpTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
            }, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Verify OTP ────────────────────────────────────────────────────────────
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/otp/verify`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOtpVerified(true);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Place Order ───────────────────────────────────────────────────────────
    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/api/orders`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body:    JSON.stringify({
                    phone,
                    address,
                    notes,
                    items: cart.map((item) => ({
                        medicineId:   item.id,
                        medicineName: item.name,
                        category:     item.category,
                        dosageForm:   item.dosageForm,
                        packSize:     item.packSize,
                        pricePerUnit: item.pricePerUnit,
                        quantity:     item.quantity,
                    })),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setPlacedOrder(data.order);
            clearCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400';

    // ── Success screen ────────────────────────────────────────────────────────
    if (placedOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
                <div className="max-w-lg w-full text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-1">Your order has been received and is being processed.</p>
                    <div className="bg-secondary/8 border border-secondary/20 rounded-2xl p-5 my-6 text-left">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-secondary font-bold uppercase tracking-widest">Order Reference</p>
                            <span className="font-bold text-primary text-lg">{placedOrder.orderNumber}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Total: <strong className="text-primary">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</strong></p>
                        <p className="text-sm text-gray-600 mb-1">Items: <strong>{placedOrder.items.length}</strong></p>
                        <p className="text-sm text-gray-600">Delivering to: <strong>{placedOrder.address.city}, {placedOrder.address.state}</strong></p>
                    </div>
                    <p className="text-gray-400 text-sm mb-8">A confirmation email has been sent to <strong>{user.email}</strong>. Our team will contact you within 24 hours.</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/products" className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-secondary-dark transition text-sm">
                            Order More
                        </Link>
                        <Link to="/" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-full font-bold hover:border-secondary hover:text-secondary transition text-sm">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Link to="/products" className="text-secondary text-sm font-semibold hover:underline flex items-center gap-1 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                        Back to medicines
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary">Place Your Order</h1>
                </div>

                {/* Step indicator */}
                <div className="flex items-center mb-10">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    step > i ? 'bg-secondary text-white' :
                                    step === i ? 'bg-secondary/20 border-2 border-secondary text-secondary' :
                                    'bg-gray-200 text-gray-400'}`}>
                                    {step > i ? '✓' : i + 1}
                                </div>
                                <span className={`text-sm font-medium hidden sm:block ${step === i ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
                            </div>
                            {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${step > i ? 'bg-secondary' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Error banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* ── Step 0: Review Order ── */}
                {step === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-primary px-7 py-5">
                            <h2 className="text-white font-bold">Review Your Order</h2>
                            <p className="text-blue-200/60 text-xs">{cart.length} item{cart.length !== 1 ? 's' : ''} in your order</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-5">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                                        {['cardiovascular','oncology','anti-infective','neurology','respiratory','paediatric'].includes(item.category) ?
                                            { cardiovascular: '🫀', oncology: '🧬', 'anti-infective': '🦠', neurology: '🧠', respiratory: '🫁', paediatric: '👶' }[item.category] : '💊'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-primary text-sm truncate">{item.name}</p>
                                        <p className="text-gray-400 text-xs">{item.dosageForm} · {item.packSize}</p>
                                        <p className="text-secondary text-xs font-semibold">₹{item.pricePerUnit.toLocaleString('en-IN')}/pack</p>
                                    </div>
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - item.minQty)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">−</button>
                                        <span className="px-3 py-1.5 text-sm font-semibold text-primary border-x border-gray-200 min-w-[40px] text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + item.minQty)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 text-sm font-bold">+</button>
                                    </div>
                                    <div className="text-right min-w-[70px]">
                                        <p className="font-bold text-primary text-sm">₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 text-xs hover:text-red-600 transition">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-primary">Order Total</span>
                                <span className="font-bold text-secondary text-xl">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Special Instructions (optional)</label>
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Delivery preferences, urgency, etc."
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <button onClick={() => { setError(''); setStep(1); }}
                                className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary-dark transition">
                                Continue to Delivery Details →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 1: Delivery Address ── */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-primary px-7 py-5">
                            <h2 className="text-white font-bold">Delivery Address</h2>
                            <p className="text-blue-200/60 text-xs">Where should we deliver your order?</p>
                        </div>
                        <div className="p-7 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Address Line 1 *</label>
                                <input type="text" value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})}
                                    placeholder="House / Building no., Street name" className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Address Line 2</label>
                                <input type="text" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})}
                                    placeholder="Area, Landmark (optional)" className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">City *</label>
                                    <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
                                        placeholder="City" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">State *</label>
                                    <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})}
                                        placeholder="State" className={inputCls} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">PIN / ZIP Code *</label>
                                    <input type="text" value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})}
                                        placeholder="PIN code" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                                    <select value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} className={inputCls}>
                                        {['India','United States','United Kingdom','UAE','Singapore','Australia','Canada','Other'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-7 pt-0 flex gap-3">
                            <button onClick={() => setStep(0)} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold hover:border-gray-300 transition text-sm">← Back</button>
                            <button
                                onClick={() => {
                                    if (!address.line1 || !address.city || !address.state || !address.pincode) { setError('Please fill in all required address fields.'); return; }
                                    setError(''); setStep(2);
                                }}
                                className="flex-[2] bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary-dark transition">
                                Continue to Phone Verification →
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Phone OTP ── */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-primary px-7 py-5">
                            <h2 className="text-white font-bold">Verify Your Phone Number</h2>
                            <p className="text-blue-200/60 text-xs">We'll send a 6-digit OTP to confirm your delivery contact</p>
                        </div>
                        <div className="p-7 space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Phone Number *</label>
                                <div className="flex gap-3">
                                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 9876543210" disabled={otpSent}
                                        className={`${inputCls} flex-1 ${otpSent ? 'opacity-60 cursor-not-allowed' : ''}`} />
                                    <button onClick={handleSendOtp} disabled={loading || (otpSent && otpTimer > 0)}
                                        className="px-5 py-3 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary-dark transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                                        {loading ? '...' : otpSent ? (otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Resend OTP') : 'Send OTP'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Enter your 10-digit Indian mobile number. e.g. 9876543210</p>
                            </div>

                            {otpSent && (
                                <div className="animate-fade-in-up">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Enter OTP *</label>
                                    <div className="flex gap-3">
                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="6-digit OTP" maxLength={6}
                                            className={`${inputCls} flex-1 text-center text-xl font-bold tracking-[0.5em]`} />
                                        <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}
                                            className="px-5 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                            {loading ? '...' : 'Verify'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">✓ OTP sent to {phone}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-7 pt-0">
                            <button onClick={() => setStep(1)} className="w-full border border-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold hover:border-gray-300 transition text-sm">← Back to Address</button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Confirm & Place Order ── */}
                {step === 3 && (
                    <div className="space-y-5">
                        {/* Order summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                            <h3 className="font-bold text-primary mb-4 text-lg">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                        <span className="font-semibold text-primary">₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between">
                                <span className="font-bold text-primary">Total</span>
                                <span className="font-bold text-secondary text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Delivery + Phone summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                            <h3 className="font-bold text-primary mb-4">Delivery Details</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Delivering To</p>
                                    <p className="text-gray-700 font-medium">{user.firstName} {user.lastName}</p>
                                    <p className="text-gray-500">{address.line1}{address.line2 ? ', ' + address.line2 : ''}</p>
                                    <p className="text-gray-500">{address.city}, {address.state} {address.pincode}</p>
                                    <p className="text-gray-500">{address.country}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                                    <p className="text-gray-700 font-medium flex items-center gap-1">
                                        {phone}
                                        <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full ml-1">✓ Verified</span>
                                    </p>
                                    <p className="text-gray-500 mt-1">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <button onClick={handlePlaceOrder} disabled={loading}
                            className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-secondary/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                    Placing Order...
                                </span>
                            ) : '🛒 Place Order'}
                        </button>
                        <p className="text-center text-xs text-gray-400">By placing this order you agree to our Terms of Service. Our team will confirm delivery within 24 hours.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;