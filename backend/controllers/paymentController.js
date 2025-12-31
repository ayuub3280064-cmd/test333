const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const stripeSecret = process.env.STRIPE_SECRET || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = require('stripe')(stripeSecret);

// Create a Stripe Checkout Session for an enrollment
async function createCheckoutSession(req, res, next) {
  try {
    const { enrollmentId, success_url, cancel_url } = req.body;
    const enrollment = await Enrollment.findById(enrollmentId).populate('course');
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    const course = enrollment.course || (await Course.findById(enrollment.course));
    if (!course) return res.status(404).json({ message: 'Course not found for enrollment' });

    // If course is free, mark paid immediately
    if (!course.price || course.price <= 0) {
      enrollment.paid = true;
      await enrollment.save();
      const payment = new Payment({ enrollment: enrollment._id, amount: 0, provider: 'free', status: 'succeeded' });
      await payment.save();
      return res.json({ message: 'Enrollment marked paid (free course)', enrollment });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: course.title, description: course.description || '' },
            unit_amount: Math.round((course.price || 0) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || `${req.protocol}://${req.get('host')}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.protocol}://${req.get('host')}/cancel`,
      metadata: { enrollmentId: String(enrollment._id) },
      client_reference_id: String(enrollment._id),
    });

    // record pending payment
    const payment = new Payment({ enrollment: enrollment._id, amount: course.price, provider: 'stripe', providerPaymentId: session.id, status: 'pending' });
    await payment.save();

    res.json({ url: session.url, id: session.id });
  } catch (err) { next(err); }
}

// Raw body is required by Stripe to verify the signature
async function paymentWebhook(req, res, next) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const raw = req.body; // express.raw middleware provides a Buffer
    event = stripe.webhooks.constructEvent(raw, sig, stripeWebhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const enrollmentId = session.metadata && session.metadata.enrollmentId;
        // find payment by providerPaymentId or enrollment
        let payment = await Payment.findOne({ providerPaymentId: session.id });
        if (!payment && enrollmentId) payment = await Payment.findOne({ enrollment: enrollmentId });
        if (payment) {
          payment.status = 'succeeded';
          payment.providerPaymentId = session.payment_intent || session.id;
          await payment.save();
        }
        if (enrollmentId) {
          const enrollment = await Enrollment.findById(enrollmentId);
          if (enrollment) {
            enrollment.paid = true;
            await enrollment.save();
          }
        }
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        // Optionally handle payment intent succeeded
        const payment = await Payment.findOne({ providerPaymentId: pi.id });
        if (payment) {
          payment.status = 'succeeded';
          await payment.save();
          const enrollment = await Enrollment.findById(payment.enrollment);
          if (enrollment) { enrollment.paid = true; await enrollment.save(); }
        }
        break;
      }
      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) { next(err); }
}

module.exports = { createPaymentRecord: async function(req,res,next){ try{ const { enrollmentId, amount, provider } = req.body; const enrollment = await Enrollment.findById(enrollmentId); if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' }); const payment = new Payment({ enrollment: enrollmentId, amount, provider, status: 'pending' }); await payment.save(); res.status(201).json(payment); } catch(err){ next(err); } }, paymentWebhook, createCheckoutSession };
