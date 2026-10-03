const crypto = require("crypto");

module.exports = async function (req, res) {

    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body || {};


        // Check required information
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message: "Missing Razorpay payment information."
            });

        }


        // Get Secret Key from Vercel Environment Variables
        const secret =
            process.env.RAZORPAY_KEY_SECRET;


        if (!secret) {

            console.error(
                "RAZORPAY_KEY_SECRET is missing."
            );

            return res.status(500).json({
                success: false,
                message: "Razorpay secret key is not configured."
            });

        }


        // Create expected signature
        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    secret
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        // Compare signatures safely
        const expected =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const received =
            Buffer.from(
                razorpay_signature,
                "utf8"
            );


        let valid = false;


        if (
            expected.length ===
            received.length
        ) {

            valid =
                crypto.timingSafeEqual(
                    expected,
                    received
                );

        }


        // Payment verification failed
        if (!valid) {

            console.error(
                "Invalid Razorpay signature."
            );

            return res.status(400).json({
                success: false,
                message: "Payment verification failed."
            });

        }


        // Payment successfully verified
        return res.status(200).json({

            success: true,

            message:
                "Payment verified successfully.",

            paymentStatus:
                "Paid",

            razorpayOrderId:
                razorpay_order_id,

            razorpayPaymentId:
                razorpay_payment_id

        });


    }
    catch (error) {

        console.error(
            "Payment Verification Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while verifying payment."

        });

    }

};