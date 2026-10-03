module.exports = async function (req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const {
            email,
            password
        } = req.body || {};

        // Get admin credentials from Vercel Environment Variables
        const adminEmail =
            process.env.ADMIN_EMAIL;

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        // Check server configuration
        if (!adminEmail || !adminPassword) {

            console.error(
                "Admin environment variables are missing."
            );

            return res.status(500).json({
                success: false,
                message: "Admin login is not configured."
            });

        }

        // Check login details
        if (
            email !== adminEmail ||
            password !== adminPassword
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        // Login successful
        return res.status(200).json({
            success: true,
            message: "Login successful."
        });

    } catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error during admin login."
        });

    }

};