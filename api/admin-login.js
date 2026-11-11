
const crypto = require("crypto");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed."
    });
  }

  try {
    const { email, password } = req.body || {};
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin login is not configured."
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const payload = Buffer.from(
      JSON.stringify({
        exp: Date.now() + 12 * 60 * 60 * 1000
      })
    ).toString("base64url");

    const signature = crypto
      .createHmac("sha256", adminPassword)
      .update(payload)
      .digest("base64url");

    const token = `${payload}.${signature}`;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login."
    });
  }
};
