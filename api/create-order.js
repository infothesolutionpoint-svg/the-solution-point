// ==========================================
// RAZORPAY - CREATE ORDER
// The Solution Point
// ==========================================

module.exports = async function (req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        // ------------------------------------------
        // GET DATA FROM WEBSITE
        // ------------------------------------------

        const {
            amount,
            receipt
        } = req.body || {};


        // ------------------------------------------
        // CHECK AMOUNT
        // ------------------------------------------

        const amountNumber = Number(amount);


        if (
            !Number.isFinite(amountNumber) ||
            amountNumber <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });

        }


        // ------------------------------------------
        // RAZORPAY AMOUNT
        // Razorpay requires paise
        // ₹160 = 16000 paise
        // ------------------------------------------

        const amountInPaise =
            Math.round(amountNumber * 100);


        // ------------------------------------------
        // RAZORPAY API
        // ------------------------------------------

        const razorpayKeyId =
            process.env.RAZORPAY_KEY_ID;

        const razorpayKeySecret =
            process.env.RAZORPAY_KEY_SECRET;


        // ------------------------------------------
        // CHECK SERVER KEYS
        // ------------------------------------------

        if (
            !razorpayKeyId ||
            !razorpayKeySecret
        ) {

            console.error(
                "Razorpay environment variables are missing."
            );

            return res.status(500).json({
                success: false,
                message: "Razorpay configuration is missing."
            });

        }


        // ------------------------------------------
        // CREATE RAZORPAY ORDER
        // ------------------------------------------

        const response = await fetch(
            "https://api.razorpay.com/v1/orders",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Basic " +
                        Buffer
                            .from(
                                razorpayKeyId +
                                ":" +
                                razorpayKeySecret
                            )
                            .toString("base64")

                },

                body: JSON.stringify({

                    amount:
                        amountInPaise,

                    currency:
                        "INR",

                    receipt:
                        receipt ||
                        "TSP-" +
                        Date.now(),

                    payment_capture:
                        1

                })

            }
        );


        // ------------------------------------------
        // READ RAZORPAY RESPONSE
        // ------------------------------------------

        const data =
            await response.json();


        // ------------------------------------------
        // RAZORPAY ERROR
        // ------------------------------------------

        if (!response.ok) {

            console.error(
                "Razorpay Error:",
                data
            );

            return res.status(
                response.status
            ).json({

                success: false,

                message:
                    data.error?.description ||
                    "Unable to create Razorpay order."

            });

        }


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        return res.status(200).json({

            success: true,

            orderId:
                data.id,

            amount:
                data.amount,

            currency:
                data.currency,

            keyId:
                razorpayKeyId

        });


    }
    catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating payment order."

        });

    }

};