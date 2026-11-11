
const crypto = require("crypto");
const pool = require("./db");

function verifyAdminToken(req) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const parts = token.split(".");

    if (parts.length !== 2) return false;

    const [payload, signature] = parts;
    const expected = crypto
      .createHmac("sha256", process.env.ADMIN_PASSWORD)
      .update(payload)
      .digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return false;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );

    return data.exp > Date.now();
  } catch (error) {
    return false;
  }
}

module.exports = async function (req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT settings FROM public.tsp_store_settings WHERE id = 1"
      );

      return res.status(200).json({
        success: true,
        settings: result.rows[0]?.settings || {}
      });
    } catch (error) {
      console.error("Unable to load settings:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to load settings."
      });
    }
  }

  if (req.method === "POST") {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required."
      });
    }

    try {
      const settings = req.body || {};

      const allowedSettings = {
        deliveryCharge: Number(settings.deliveryCharge),
        freeDeliveryAmount: Number(settings.freeDeliveryAmount),
        discountThreshold: Number(settings.discountThreshold),
        deliveryDiscount: Number(settings.deliveryDiscount),
        estimatedDeliveryDays: 7,
        upiId: String(settings.upiId || "").trim(),
        qrCode: String(settings.qrCode || "")
      };

      if (
        !allowedSettings.upiId ||
        !/^[^\s@]+@[^\s@]+$/.test(allowedSettings.upiId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid UPI ID."
        });
      }

      if (allowedSettings.qrCode.length > 700000) {
        return res.status(400).json({
          success: false,
          message: "QR image is too large."
        });
      }

      await pool.query(
        `INSERT INTO public.tsp_store_settings (id, settings, updated_at)
         VALUES (1, $1::jsonb, NOW())
         ON CONFLICT (id)
         DO UPDATE SET settings = EXCLUDED.settings,
                       updated_at = NOW()`,
        [JSON.stringify(allowedSettings)]
      );

      return res.status(200).json({
        success: true,
        message: "Settings saved successfully."
      });
    } catch (error) {
      console.error("Unable to save settings:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to save settings."
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed."
  });
};
