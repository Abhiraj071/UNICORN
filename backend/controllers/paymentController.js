const crypto = require('crypto');
const https = require('https');

// @desc    Create Razorpay Order for Checkout
// @route   POST /api/payment/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(400).json({ message: 'Razorpay keys are not configured in backend .env' });
    }

    const amountInPaise = Math.round(amount * 100);

    const postData = JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    });

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: '/v1/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': authHeader
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (response.statusCode >= 200 && response.statusCode < 300) {
            return res.status(200).json({
              id: data.id,
              amount: data.amount,
              currency: data.currency,
              keyId: keyId
            });
          } else {
            console.error('Razorpay API Error:', data);
            return res.status(response.statusCode).json({ message: data.error?.description || 'Razorpay order creation failed' });
          }
        } catch (e) {
          return res.status(500).json({ message: 'Failed to parse Razorpay response' });
        }
      });
    });

    request.on('error', (err) => {
      console.error('Razorpay HTTPS Request Error:', err);
      return res.status(500).json({ message: 'Network error connecting to Razorpay' });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error('Razorpay Order Controller Error:', error);
    res.status(500).json({ message: 'Server error creating Razorpay order' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay verification parameters' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Razorpay secret key not configured on server' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully by Razorpay Bank Gateway',
        paymentId: razorpay_payment_id
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    res.status(500).json({ message: 'Server error verifying Razorpay payment' });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
