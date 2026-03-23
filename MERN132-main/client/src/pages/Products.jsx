import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { medicines, categories, formatPrice } from '../data/medicineData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const categoryColors = {
    red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    btn: 'bg-red-500 hover:bg-red-600',    badge: 'bg-red-100 text-red-700' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', btn: 'bg-purple-500 hover:bg-purple-600', badge: 'bg-purple-100 text-purple-700' },
    green:  { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  btn: 'bg-green-500 hover:bg-green-600',  badge: 'bg-green-100 text-green-700' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   btn: 'bg-blue-500 hover:bg-blue-600',    badge: 'bg-blue-100 text-blue-700' },
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   border: 'border-teal-200',   btn: 'bg-teal-500 hover:bg-teal-600',    badge: 'bg-teal-100 text-teal-700' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  btn: 'bg-amber-500 hover:bg-amber-600',  badge: 'bg-amber-100 text-amber-700' },
};

const MedicineCard = ({ medicine, onAdd }) => {
    const [qty, setQty] = useState(medicine.minQty);
    const [added, setAdded] = useState(false);
    const cat = categories.find((c) => c.id === medicine.category);
    const colors = categoryColors[cat?.color || 'blue'];

    const handleAdd = () => {
        onAdd(medicine, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className={`bg-white rounded-2xl border ${colors.border} hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col`}>
            {/* Image */}
            <div className={`${colors.bg} h-40 flex items-center justify-center relative overflow-hidden`}>
                <div className="text-5xl">{cat?.icon}</div>
                <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
                    {medicine.dosageForm}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-bold text-primary text-base group-hover:${colors.text} transition-colors leading-tight`}>
                        {medicine.name}
                    </h3>
                </div>
                <p className="text-gray-400 text-xs mb-1">{medicine.composition}</p>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed flex-1">{medicine.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                    {medicine.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                    <span>Pack: {medicine.packSize}</span>
                    <span className="font-bold text-primary text-sm">₹{medicine.pricePerUnit.toLocaleString('en-IN')}/pack</span>
                </div>

                {/* Quantity + Add */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => setQty(Math.max(medicine.minQty, qty - medicine.minQty))}
                            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold">−</button>
                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(Math.max(medicine.minQty, parseInt(e.target.value) || medicine.minQty))}
                            className="w-14 text-center text-sm font-semibold text-primary border-x border-gray-200 py-2 outline-none"
                            min={medicine.minQty}
                        />
                        <button onClick={() => setQty(qty + medicine.minQty)}
                            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-bold">+</button>
                    </div>
                    <button onClick={handleAdd}
                        className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 ${
                            added ? 'bg-green-500' : colors.btn
                        }`}>
                        {added ? '✓ Added' : 'Add to Order'}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-center">Min. order: {medicine.minQty} packs</p>
            </div>
        </div>
    );
};

const Products = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const { addToCart, cartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const filtered = medicines.filter((m) => {
        const catMatch  = activeCategory === 'all' || m.category === activeCategory;
        const srchMatch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.composition.toLowerCase().includes(search.toLowerCase()) ||
                          m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return catMatch && srchMatch;
    });

    const handleAdd = (medicine, qty) => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(medicine, qty);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero */}
            <div className="relative bg-primary py-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-1/2 right-0 w-1/2 h-full bg-secondary/10 rounded-full blur-[100px]" />
                </div>
                <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block text-secondary font-bold tracking-widest uppercase text-xs mb-4 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full">
                                Our Portfolio
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                                Pharmaceutical Medicines
                            </h1>
                            <p className="text-blue-200/70 max-w-xl leading-relaxed">
                                GMP-certified medicines across 6 therapeutic categories. Select your medicines, set quantities, and place your order with verified delivery.
                            </p>
                        </div>
                        {/* Cart button */}
                        {cartCount > 0 && (
                            <Link to="/order/checkout"
                                className="flex items-center gap-3 bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                View Order ({cartCount})
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-16 py-12">

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1 max-w-md">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, composition or tag..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-white"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeCategory === 'all' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                            All ({medicines.length})
                        </button>
                        {categories.map((cat) => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                                    activeCategory === cat.id
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}>
                                <span>{cat.icon}</span> {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Not logged in banner */}
                {!user && (
                    <div className="bg-secondary/8 border border-secondary/20 rounded-2xl px-6 py-4 mb-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p className="text-sm text-gray-600">You need to be logged in to place an order.</p>
                        </div>
                        <Link to="/login" className="bg-secondary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-secondary-dark transition flex-shrink-0">
                            Log In
                        </Link>
                    </div>
                )}

                {/* Results count */}
                <p className="text-sm text-gray-400 mb-6">
                    Showing <strong className="text-gray-600">{filtered.length}</strong> medicines
                    {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
                    {search && ` matching "${search}"`}
                </p>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No medicines found.</p>
                        <button onClick={() => { setSearch(''); setActiveCategory('all'); }} className="mt-3 text-secondary text-sm font-semibold hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((med) => (
                            <MedicineCard key={med.id} medicine={med} onAdd={handleAdd} />
                        ))}
                    </div>
                )}

                {/* Quality strip */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {[
                            { label: 'Manufacturing', value: 'WHO-GMP Certified' },
                            { label: 'Quality Testing', value: 'In-house QC & QA' },
                            { label: 'Cold Chain', value: 'GDP Compliant' },
                            { label: 'Packaging', value: 'Tamper-proof' },
                        ].map((item) => (
                            <div key={item.label} className="border-r last:border-0 border-gray-100 px-2">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-primary">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;