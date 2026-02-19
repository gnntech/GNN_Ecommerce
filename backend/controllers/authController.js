const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
};

// @desc    Register a new admin (Run once manually or via seed script)
// @route   POST /api/auth/register-admin
// @access  Public (Should be protected or removed in production)
const registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        username,
        password,
        isAdmin: true,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

module.exports = { authUser, registerAdmin };
