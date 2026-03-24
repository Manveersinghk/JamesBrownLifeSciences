import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartProvider } from './context/CartContext';
import Checkout from './pages/Checkout';
import Orders         from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

// Redirect logged-in users away from login/register pages
const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? <Navigate to="/" replace /> : children;
};

function AppLayout() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/"         element={<Home />} />
                        <Route path="/about"    element={<About />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/careers"  element={<Careers />} />
                        <Route path="/contact"  element={<Contact />} />
                        <Route path="/orders"    element={<Orders />} />
                        <Route path="/admin"     element={<AdminDashboard />} />
                        <Route path="/order/checkout" element={<Checkout />} />
                        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
                        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                        {/* 404 fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>
                </main>
                <Footer />
                <ChatBot />
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppLayout />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;