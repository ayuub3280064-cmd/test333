const express = require('express');
const router = express.Router();

const { createPaymentRecord, paymentWebhook, createCheckoutSession } = require('../controllers/paymentController');
const { validate } = require('../middleware/validate');
const { createPayment: createPaymentSchema } = require('../validation/payment');
const auth = require('../middleware/auth');

router.post('/', validate(createPaymentSchema), createPaymentRecord);
// create a checkout session (protected — user must be authenticated)
router.post('/create-checkout-session', auth, createCheckoutSession);
router.post('/webhook', express.raw({ type: '*/*' }), paymentWebhook);

module.exports = router;
