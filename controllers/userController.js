const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
      return res.status(422).json({ Message: "Fill in all fields" });
    }
    if (!Email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (Password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }
    const hashed = await bcrypt.hash(Password, 10);
    const user = new User({ Username, Email, Password: hashed });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.loginUser = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const user = await User.findOne({ Username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
