const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); //Generate secure random tokens and hash the token
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res, next) => {
  try {
    const { userName, email, password, farmName, phone, location } = req.body;

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

    const user = await User.create({
      userName,
      email,
      password,
      farmName,
      phone,
      location,
    });

    // You might want to send a JWT token back on registration too
    const token = user.getSignedJwtToken();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!", token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error from mongoDB
      return res
        .status(400)
        .json({ message: "User with that email or username already exists." });
    }
    next(error); //pass to error handling middleware
  }
};

exports.loginUser = async (req, res, next) => {
  const { userName, password } = req.body;
  console.log("Received password:", password);
  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }

  try {
    const user = await User.findOne({
      $or: [{ userName }, { email: userName }],
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "User not found. Please Sign Up" });

    const match = await user.matchPassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.getSignedJwtToken();

    res
      .status(200)
      .json({ success: true, message: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    next(error); // Pass to error handling middleware
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // IMPORTANT: Always send a generic success message to prevent user enumeration
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email/username exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex"); //crypto module to generate a secure random token.
    const resetPasswordExpire = Date.now() + 3600000; // 1 hour from now (in milliseconds)

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following link to reset your password: \n\n ${resetUrl} \n\nThis token will expire in 1 hour.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Smart Poultry Password Reset Token",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      user.resetPasswordToken = undefined; // Clear token if email sending fails
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error); // Pass to error handling middleware
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params; // Comes from the URL
  const { newPassword } = req.body; // Comes from the form input (new password)

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }, // Find the user only if resetPasswordExpire is greater than now
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a new password with at least 6 characters.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error); // Pass to error handling middleware
  }
};
