# Stripe Payment Setup Guide

## Step 1: Create a Stripe Account
1. Go to https://stripe.com and create an account
2. Complete the verification process

## Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Replace `STRIPE_PUBLISHABLE_KEY` in `checkout.html` with your actual key

## Step 3: Test the Integration
The current setup uses Stripe's client-only mode which works for testing but has limitations:

### Test Cards (use these for testing):
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)

## Step 4: For Production (requires backend)
For a real production environment, you'll need:

1. **Backend API** to create Payment Intents:
```javascript
// Example Node.js endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'sek',
    automatic_payment_methods: { enabled: true },
  });
  
  res.send({ client_secret: paymentIntent.client_secret });
});
```

2. **Webhook handling** for order fulfillment
3. **Proper error handling** and logging

## Current Limitations (Client-only mode)
- Limited payment methods
- No server-side validation
- No order management
- Not suitable for production

## Files Modified:
- `checkout.html` - Added Stripe Payment Element
- `success.html` - Created success page

## Next Steps:
1. Add your Stripe publishable key
2. Test with the test card numbers above
3. Consider implementing a backend for production use

## Support:
- Stripe Documentation: https://stripe.com/docs
- Payment Element Guide: https://stripe.com/docs/payments/payment-element
