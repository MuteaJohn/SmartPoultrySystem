const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { userName, email, password, farmName } = req.body;

    if (!userName || !email || !password || !farmName) {
      return res.status(422).json({ message: "Fill in all fields" });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "User with that email already exists. Please Sign In",
        });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashed, farmName });

    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ userName }, { email: userName }],
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please Sign Up" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
