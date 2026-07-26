const crypto = require('crypto');
const https = require('https');

// ==========================================
// PhonePe Business Payment Gateway Controller
// ==========================================

const createPhonePePayment = async (req, res) => {
  try {
    const { amount, redirectUrl } = req.body;

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const isProd = process.env.PHONEPE_ENV === 'production';

    if (!merchantId || !saltKey) {
      return res.status(400).json({ message: 'PhonePe Merchant ID and Salt Key are not configured in backend .env' });
    }

    const merchantTransactionId = `MT${Date.now()}`;
    const amountInPaise = Math.round(amount * 100);

    const payload = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.user?._id?.toString() || `USER_${Date.now()}`,
      amount: amountInPaise,
      redirectUrl: redirectUrl || `${process.env.FRONTEND_URL || 'https://www.unicornonyx.com'}/order-success`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.BACKEND_URL || 'https://unicorn-ln99.onrender.com'}/api/payment/phonepe/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiPath = '/pg/v1/pay';
    const stringToHash = base64Payload + apiPath + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    const hostname = isProd ? 'api.phonepe.com' : 'api-preprod.phonepe.com';
    const path = isProd ? '/apis/hermes/pg/v1/pay' : '/apis/pg-sandbox/pg/v1/pay';

    const postData = JSON.stringify({ request: base64Payload });

    const options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-VERIFY': checksum
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
            return res.status(200).json({
              success: true,
              redirectUrl: data.data.instrumentResponse.redirectInfo.url,
              merchantTransactionId: merchantTransactionId
            });
          } else {
            console.error('PhonePe API Error:', data);
            return res.status(400).json({ message: data.message || 'PhonePe payment initialization failed' });
          }
        } catch (e) {
          return res.status(500).json({ message: 'Failed to parse PhonePe response' });
        }
      });
    });

    request.on('error', (err) => {
      console.error('PhonePe Request Error:', err);
      return res.status(500).json({ message: 'Network error connecting to PhonePe API' });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error('PhonePe Controller Error:', error);
    res.status(500).json({ message: 'Server error creating PhonePe payment' });
  }
};

const checkPhonePeStatus = async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const isProd = process.env.PHONEPE_ENV === 'production';

    if (!merchantId || !saltKey) {
      return res.status(400).json({ message: 'PhonePe keys not configured' });
    }

    const apiPath = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = apiPath + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = `${sha256}###${saltIndex}`;

    const hostname = isProd ? 'api.phonepe.com' : 'api-preprod.phonepe.com';
    const path = isProd ? `/apis/hermes${apiPath}` : `/apis/pg-sandbox${apiPath}`;

    const options = {
      hostname: hostname,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId
      }
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => body += chunk);
      response.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.success && data.code === 'PAYMENT_SUCCESS') {
            return res.status(200).json({ success: true, code: 'PAYMENT_SUCCESS', message: 'Payment verified by PhonePe' });
          } else {
            return res.status(200).json({ success: false, code: data.code, message: data.message });
          }
        } catch (e) {
          return res.status(500).json({ message: 'Error parsing PhonePe status response' });
        }
      });
    });

    request.on('error', (err) => {
      return res.status(500).json({ message: 'Error checking PhonePe status' });
    });

    request.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking PhonePe payment status' });
  }
};

// ==========================================
// Razorpay Payment Gateway Controller
// ==========================================

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
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

module.exports = {
  createPhonePePayment,
  checkPhonePeStatus,
  createRazorpayOrder,
  verifyRazorpayPayment
};
