import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending','confirmed','processing','dispatched','delivered','cancelled'];
const STATUS_COLORS  = {
    pending:    'bg-amber-100 text-amber-700 border-amber-200',
    confirmed:  'bg-blue-100 text-blue-700 border-blue-200',
    processing: 'bg-purple-100 text-purple-700 border-purple-200',
    dispatched: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    delivered:  'bg-green-100 text-green-700 border-green-200',
    cancelled:  'bg-red-100 text-red-600 border-red-200',
};

export default function AdminDashboard() {
    const { user, getToken } = useAuth();
    const navigate = useNavigate();

    const [orders,   setOrders]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');
    const [filter,   setFilter]   = useState('all');
    const [search,   setSearch]   = useState('');
    const [updating, setUpdating] = useState(null);
    const [expanded, setExpanded] = useState(null);

    // Only admins
    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.role !== 'Admin') { navigate('/'); return; }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true); setError('');
        try {
            const res  = await fetch(`${API}/api/orders/admin/all`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOrders(data.orders || []);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const updateStatus = async (orderNumber, status) => {
        setUpdating(orderNumber);
        try {
            const res = await fetch(`${API}/api/orders/admin/${orderNumber}/status`, {
                method:  'PATCH',
                headers: { 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` },
                body:    JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setOrders(prev => prev.map(o => o.orderNumber === orderNumber ? { ...o, status } : o));
        } catch (err) { alert('Failed to update: ' + err.message); }
        finally { setUpdating(null); }
    };

    const filtered = orders.filter(o => {
        const matchFilter = filter === 'all' || o.status === filter;
        const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase())
            || o.customerName?.toLowerCase().includes(search.toLowerCase())
            || o.email?.toLowerCase().includes(search.toLowerCase())
            || o.phone?.includes(search);
        return matchFilter && matchSearch;
    });

    const counts = STATUS_OPTIONS.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, { all: orders.length });

    if (!user || user.role !== 'Admin') return null;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-primary border-b border-white/5 px-6 sm:px-10 lg:px-16 py-6">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-white" style={{ letterSpacing:'-0.02em' }}>Order Management</h1>
                        <p className="text-blue-200/50 text-xs mt-0.5">James Brown Life Sciences — Admin</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm font-semibold">{user.firstName} {user.lastName}</p>
                            <p className="text-blue-200/40 text-xs">{user.email}</p>
                        </div>
                        <button onClick={fetchOrders} className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-blue-200/60 hover:text-white hover:bg-white/12 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-8">

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {[
                        { key:'all',        label:'Total',      color:'bg-primary text-white' },
                        { key:'pending',    label:'Pending',    color:'bg-amber-50 text-amber-700 border border-amber-200' },
                        { key:'confirmed',  label:'Confirmed',  color:'bg-blue-50 text-blue-700 border border-blue-200' },
                        { key:'processing', label:'Processing', color:'bg-purple-50 text-purple-700 border border-purple-200' },
                        { key:'dispatched', label:'Dispatched', color:'bg-indigo-50 text-indigo-700 border border-indigo-200' },
                        { key:'delivered',  label:'Delivered',  color:'bg-green-50 text-green-700 border border-green-200' },
                    ].map(s => (
                        <button key={s.key} onClick={() => setFilter(s.key)}
                            className={`p-4 rounded-2xl text-center transition-all ${s.color} ${filter===s.key ? 'ring-2 ring-secondary ring-offset-1' : 'hover:shadow-md'}`}>
                            <div className="text-2xl font-bold">{counts[s.key] || 0}</div>
                            <div className="text-xs font-medium mt-0.5 opacity-75">{s.label}</div>
                        </button>
                    ))}
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search by order no, name, email or phone..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 bg-white"/>
                    </div>
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary bg-white text-gray-600">
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600 text-sm">{error}</div>
                )}

                {/* Orders table */}
                {!loading && !error && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {filtered.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 text-sm">No orders found.</div>
                        ) : (
                            <>
                                {/* Table header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="col-span-2">Order #</div>
                                    <div className="col-span-3">Customer</div>
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-1">Items</div>
                                    <div className="col-span-1">Total</div>
                                    <div className="col-span-3">Status</div>
                                </div>

                                <div className="divide-y divide-gray-50">
                                    {filtered.map(order => (
                                        <div key={order.orderNumber}>
                                            {/* Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                                onClick={() => setExpanded(e => e===order.orderNumber ? null : order.orderNumber)}>
                                                <div className="col-span-2 font-bold text-sm text-secondary">{order.orderNumber}</div>
                                                <div className="col-span-3">
                                                    <p className="text-sm font-semibold text-primary">{order.customerName}</p>
                                                    <p className="text-xs text-gray-400">{order.phone}</p>
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                                                </div>
                                                <div className="col-span-1 text-sm text-gray-600">{order.items?.length}</div>
                                                <div className="col-span-1 text-sm font-semibold text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                                                <div className="col-span-3 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        value={order.status}
                                                        onChange={e => updateStatus(order.orderNumber, e.target.value)}
                                                        disabled={updating === order.orderNumber}
                                                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all disabled:opacity-50 ${STATUS_COLORS[order.status]}`}>
                                                        {STATUS_OPTIONS.map(s => (
                                                            <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                                                        ))}
                                                    </select>
                                                    {updating === order.orderNumber && (
                                                        <div className="w-4 h-4 rounded-full border-2 border-secondary border-t-transparent animate-spin flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded detail */}
                                            {expanded === order.orderNumber && (
                                                <div className="px-6 pb-5 pt-2 bg-gray-50/60 border-t border-gray-100">
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact</p>
                                                            <p className="text-gray-700">{order.email}</p>
                                                            <a href={`tel:${order.phone}`} className="text-secondary font-semibold">{order.phone}</a>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Address</p>
                                                            <p className="text-gray-600 leading-relaxed">
                                                                {order.address?.line1}{order.address?.line2 ? ', '+order.address.line2 : ''}<br/>
                                                                {order.address?.city}, {order.address?.state} {order.address?.pincode}<br/>
                                                                {order.address?.country}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Items Ordered</p>
                                                            <div className="space-y-1">
                                                                {order.items?.map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-xs">
                                                                        <span className="text-gray-600">{item.medicineName} × {item.quantity}</span>
                                                                        <span className="font-semibold text-gray-700">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {order.notes && (
                                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
                                                            <strong>Notes:</strong> {order.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}