# Stripe Payment Setup Guide

## Step 1: Create a Stripe Account
1. Go to https://stripe.com and create an account
2. Complete the verification process

## Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` for test mode, `pk_live_` for live mode)
3. Replace `STRIPE_PUBLISHABLE_KEY` in `checkout.html` with your actual key

## Step 3: Configure Payment Methods
The integration now supports 4 payment methods:
- **Credit/Debit Cards** - All major cards (Visa, Mastercard, Amex, etc.)
- **Klarna** - Buy now, pay later option
- **Google Pay** - Fast checkout for Android users
- **Apple Pay** - Fast checkout for iOS/Safari users

### Enable Payment Methods in Stripe Dashboard:
1. Go to https://dashboard.stripe.com/settings/payment_methods
2. Enable the following:
   - **Cards** (enabled by default)
   - **Klarna** - Enable "Buy now, pay later"
   - **Google Pay** - Enable under "Digital wallets"
   - **Apple Pay** - Enable under "Digital wallets"

## Step 4: Test the Integration

### Test Cards (use these for testing):
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)

### Digital Wallet Testing:
- **Google Pay**: Appears automatically on supported browsers/devices
- **Apple Pay**: Appears on Safari browsers and iOS devices
- **Klarna**: Test mode will show demo screens

## Step 5: For Production (requires backend)
For a real production environment, you'll need:

1. **Backend API** to create Payment Intents:
```javascript
// Example Node.js endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'sek',
    payment_method_types: ['card', 'klarna', 'google_pay', 'apple_pay'],
    automatic_payment_methods: { enabled: true },
  });
  
  res.send({ client_secret: paymentIntent.client_secret });
});
```

2. **Webhook handling** for order fulfillment
3. **Proper error handling** and logging

## Current Payment Methods:
- **Credit/Debit Cards** - Traditional card payments
- **Klarna** - Buy now, pay later option
- **Google Pay** - Fast mobile payments (Android/Chrome)
- **Apple Pay** - Fast mobile payments (iOS/Safari)

## Current Limitations (Client-only mode)
- Limited customization options
- No server-side validation
- No order management
- Digital wallets may have limited availability in test mode

## Files Modified:
- `checkout.html` - Added Stripe Payment Element with multiple payment methods
- `success.html` - Created success page

## Next Steps:
1. ✅ Add your Stripe publishable key (COMPLETED)
2. Enable payment methods in Stripe Dashboard
3. Test with the test card numbers above
4. Test digital wallets on supported devices
5. Consider implementing a backend for production use

## Important Notes:
- **Google Pay**: Only appears on supported browsers (Chrome, Android browsers)
- **Apple Pay**: Only appears on Safari and iOS devices
- **Klarna**: Availability depends on customer location and Stripe account setup
- For production, enable these payment methods in your Stripe Dashboard

## Support:
- Stripe Documentation: https://stripe.com/docs
- Payment Element Guide: https://stripe.com/docs/payments/payment-element
