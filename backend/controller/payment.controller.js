import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import * as orderService from "../services/order.service.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    // Convert items to products format for order service
    const products = items.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));

    const order = await orderService.createOrder({ products }, req.user._id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            description: item.description || "",
            metadata: {
              category: item.category || "",
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    case 'checkout.session.expired':
      const expiredSession = event.data.object;
      await handleExpiredSession(expiredSession);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

async function handleSuccessfulPayment(session) {
  try {
    const orderId = session.metadata.orderId;
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'confirmed',
      paymentStatus: 'PAID',
      updatedBy: null // System update
    });

    console.log(`Payment successful for order ${orderId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleExpiredSession(session) {
  try {
    const orderId = session.metadata.orderId;
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'cancelled',
      paymentStatus: 'FAILED',
      updatedBy: null // System update
    });

    console.log(`Payment expired for order ${orderId}`);
  } catch (error) {
    console.error('Error handling expired session:', error);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    // Find order by stripe session ID
    const order = await Order.findOne({ stripeSessionId: paymentIntent.id });
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'cancelled',
        paymentStatus: 'FAILED',
        updatedBy: null // System update
      });

      console.log(`Payment failed for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

export const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required"
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Payment session not found"
      });
    }

    // Find the associated order
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        session,
        order,
        paymentStatus: session.payment_status,
        isCompleted: session.payment_status === 'paid'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
