import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('jbls_cart') || '[]');
        } catch {
            return [];
        }
    });

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('jbls_cart', JSON.stringify(cart));
    }, [cart]);

    // ── Add item or increase quantity ─────────────────────────────────────────
    const addToCart = (medicine, quantity = 1) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === medicine.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === medicine.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { ...medicine, quantity }];
        });
    };

    // ── Update quantity ───────────────────────────────────────────────────────
    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    };

    // ── Remove item ───────────────────────────────────────────────────────────
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    // ── Clear cart ────────────────────────────────────────────────────────────
    const clearCart = () => setCart([]);

    // ── Totals ────────────────────────────────────────────────────────────────
    const cartCount    = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal    = cart.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, cartCount, cartTotal,
            addToCart, updateQuantity, removeFromCart, clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};