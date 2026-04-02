import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { toast } from "sonner";
import { Package, Eye, Truck, CheckCircle, Clock, X } from "lucide-react";
import { motion } from "framer-motion";

const ManageOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate("/admin");
        } else {
            fetchOrders();
        }
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders...");
            const { data } = await api.get("/orders");
            console.log("Orders fetched:", data);
            setOrders(data);
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string, isDelivered?: boolean) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status, isDelivered });
            toast.success("Order status updated");
            fetchOrders();
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update order");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Processing":
                return "bg-yellow-100 text-yellow-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Processing":
                return <Clock className="w-4 h-4" />;
            case "Shipped":
                return <Truck className="w-4 h-4" />;
            case "Delivered":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFCF6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B2533] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        <Package className="w-10 h-10 text-[#9B2533]" />
                        Order Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        View and manage all customer orders
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Processing</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {orders.filter(o => o.status === "Processing").length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Shipped</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {orders.filter(o => o.status === "Shipped").length}
                                </p>
                            </div>
                            <Truck className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {orders.filter(o => o.status === "Delivered").length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono text-gray-900">
                                                {order._id.slice(-8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{order.user.name}</p>
                                                <p className="text-sm text-gray-500">{order.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {order.orderItems.length} item(s)
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{order.totalPrice}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowModal(true);
                                                }}
                                                className="text-[#9B2533] hover:text-[#7d1f29] font-medium text-sm flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No orders yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                                    <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                                    <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedOrder.user.phone}</p>
                                    <p><span className="font-medium">Address:</span> {selectedOrder.user.address}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.orderItems.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                                            </div>
                                            <p className="font-semibold">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                                    <p><span className="font-medium">Total:</span> ₹{selectedOrder.totalPrice}</p>
                                    <p><span className="font-medium">Payment Status:</span> {selectedOrder.isPaid ? "Paid" : "Pending"}</p>
                                    <p><span className="font-medium">Order ID:</span> {selectedOrder.paymentInfo.razorpayOrderId}</p>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder._id, "Processing")}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                    >
                                        Mark as Processing
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder._id, "Shipped")}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Mark as Shipped
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder._id, "Delivered", true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Mark as Delivered
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;