const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => email.trim().toLowerCase();


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must be at least 2 characters",
      });
    }

    if (!email || !emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (role && !["admin", "member"].includes(role)) {
      return res.status(400).json({
        message: "Select a valid role",
      });
    }

    const safeEmail = normalizeEmail(email);

    const userExists = await User.findOne({ email: safeEmail });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: safeEmail,
      password: hashedPassword,
      role: role || "member",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
