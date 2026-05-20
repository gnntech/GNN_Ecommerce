const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");
const { sendOrderConfirmationEmail } = require("./orderController");
const { validateOrderPrices } = require("./productController");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/payment/create-order
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
    const { amount, products, user } = req.body;

    console.log("Create Order Request Body:", req.body);

    if (!amount || !products || !user) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    // Ensure amount is a number
    let parsedAmount = amount;
    if (typeof amount === 'string') {
        parsedAmount = Number(amount.replace(/[^0-9.]/g, ''));
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400);
        throw new Error("Invalid amount");
    }

    const options = {
        amount: Math.round(parsedAmount * 100), // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500);
        throw new Error("Something went wrong with Razorpay");
    }
});

// @desc    Verify payment
// @route   POST /api/payment/verify-payment
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderData, // Helper to create order in DB
    } = req.body;

    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpaySignature === expectedSign) {
        // Payment is successful, save order to DB
        try {
            const { user, orderItems, itemsPrice, totalPrice } = orderData;

            // ── Backend price validation ──────────────────────────────────
            // Re-calculate total from DB prices to prevent client-side manipulation
            let serverTotal;
            try {
                serverTotal = await validateOrderPrices(orderItems);
            } catch (validationError) {
                res.status(400);
                throw new Error(`Order validation failed: ${validationError.message}`);
            }

            // Allow ₹1 tolerance for rounding differences
            if (Math.abs(serverTotal - totalPrice) > 1) {
                res.status(400);
                throw new Error(
                    `Total price mismatch: expected ₹${serverTotal}, received ₹${totalPrice}`
                );
            }
            // ─────────────────────────────────────────────────────────────

            const order = new Order({
                user,
                orderItems,
                paymentInfo: {
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
                },
                itemsPrice,
                totalPrice,
                isPaid: true,
                paidAt: Date.now(),
            });

            const createdOrder = await order.save();

            // Send order confirmation email
            await sendOrderConfirmationEmail(createdOrder);

            res.json({
                success: true,
                message: "Payment verified successfully",
                orderId: createdOrder._id,
            });

        } catch (error) {
            console.error("Order Save Error:", error);
            res.status(500);
            throw new Error("Payment verified but failed to save order");
        }

    } else {
        res.status(400);
        throw new Error("Invalid signature sent!");
    }
});

module.exports = { createOrder, verifyPayment };
