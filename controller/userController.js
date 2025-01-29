const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createRegister = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const profilePics = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const image = profilePics[Math.floor(Math.random() * profilePics.length)];

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
        email,
        password: hashedPassword,
        username,
        image,
    });

    await newUser.save();

    // Send user data excluding the password
    const userResponse = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
    };

    res.status(201).json({ success: true, user: userResponse });
});

const createLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Wrong email address provided' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Wrong password, check your credentials' });
    }

    const token = jwt.sign(
        { user: { id: user._id, username: user.username, email: user.email } },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '1d' }
    );

    res.cookie('token', token, {
        expires: new Date(Date.now() + 86400000), // 1 day expiry
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
    });

    const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
    };

    res.status(200).json({
        token,
        user: userResponse,
        message: 'Login successful',
    });
});

const createLogout = asyncHandler(async (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ message: 'Logout successful' });
});

const myProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
});

module.exports = { createRegister, createLogin, createLogout, myProfile };
