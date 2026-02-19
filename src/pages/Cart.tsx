import React from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        navigate("/checkout", { state: { items: cartItems } });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif text-center mb-8 text-foreground">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground mb-6">Your cart is empty.</p>
                        <Button onClick={() => navigate("/")} className="bg-primary text-primary-foreground">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm relative">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-border shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-3 bg-secondary/20 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors"
                                                    disabled={item.qty <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-medium w-4 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                                                    className="p-1 hover:bg-white rounded-md transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-lg">₹ {item.price * item.qty}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="h-fit sticky top-32">
                            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹ {cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                                        <span>Total</span>
                                        <span>₹ {cartTotal}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
