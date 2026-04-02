const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send order confirmation email
const sendOrderConfirmationEmail = async (orderData) => {
    const { user, orderItems, totalPrice, _id } = orderData;

    const itemsList = orderItems
        .map(
            (item) =>
                `<li>${item.name} x ${item.qty} - ₹${item.price}</li>`
        )
        .join("");

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Order Confirmation - GNN E-commerce",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #9B2533;">Order Received Successfully!</h2>
                <p>Dear ${user.name},</p>
                <p>Thank you for your order. We have received your payment and your order is being processed.</p>
                
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${_id}</p>
                <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                
                <h3>Items Ordered:</h3>
                <ul>
                    ${itemsList}
                </ul>
                
                <h3>Shipping Address:</h3>
                <p>${user.address}</p>
                
                <p>We will notify you once your order is shipped.</p>
                
                <p>Best regards,<br>GNN E-commerce Team</p>
            </div>
        `,
    };

    try {
        console.log("Attempting to send email to:", user.email);
        const info = await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent successfully:", info.messageId);
        console.log("Email sent to:", user.email);
    } catch (error) {
        console.error("Error sending email:", error);
        console.error("Email error details:", error.message);
        // Don't throw error - we don't want email failure to break order creation
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, isDelivered } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status || order.status;
        
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            if (isDelivered) {
                order.deliveredAt = Date.now();
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

module.exports = {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    sendOrderConfirmationEmail,
};
