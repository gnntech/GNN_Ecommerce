import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Package, Mail, Home } from "lucide-react";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#FDFCF6] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Thank you for your order. Your payment has been processed successfully.
                        </p>
                    </motion.div>

                    {/* Order ID */}
                    {orderId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gray-50 rounded-xl p-6 mb-8"
                        >
                            <p className="text-sm text-gray-600 mb-2">Order ID</p>
                            <p className="text-xl font-mono font-semibold text-gray-900">
                                {orderId}
                            </p>
                        </motion.div>
                    )}

                    {/* Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid md:grid-cols-2 gap-4 mb-8"
                    >
                        <div className="bg-blue-50 rounded-xl p-6 text-left">
                            <div className="flex items-start gap-3">
                                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Email Confirmation
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        A confirmation email has been sent to your registered email address.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-6 text-left">
                            <div className="flex items-start gap-3">
                                <Package className="w-6 h-6 text-purple-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        Order Processing
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Your order is being processed and will be shipped soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-[#9B2533] text-white py-4 rounded-xl font-semibold hover:bg-[#7d1f29] transition-colors flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Return to Home
                        </button>

                        <p className="text-sm text-gray-500">
                            Redirecting to home in {countdown} seconds...
                        </p>
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
