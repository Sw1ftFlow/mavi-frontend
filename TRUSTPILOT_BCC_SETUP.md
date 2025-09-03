# Trustpilot Automatic Review Invitation Setup

## Overview
This setup enables automatic Trustpilot review invitations by BCC:ing their special email address when sending order confirmation emails to customers.

## How It Works
1. Customer places an order and receives confirmation email
2. The same email is BCC'd to: `mavidesign.se+3b19644966@invite.trustpilot.com`
3. Trustpilot automatically sends a review invitation to the customer after a configurable delay

## Implementation Status
✅ **Code Updated**: `checkout.html` now includes BCC to Trustpilot email in the customer confirmation email
✅ **Fallback Method**: If BCC doesn't work, a separate copy is sent to Trustpilot automatically
✅ **Error Handling**: Trustpilot email failures won't break the order process

## EmailJS Template Configuration Required

### 1. Update Your EmailJS Template
You need to modify your customer confirmation email template in the EmailJS dashboard to support BCC.

**Go to**: [EmailJS Dashboard](https://dashboard.emailjs.com) → Email Templates → Your Customer Template (`template_cxfpi08`)

### 2. Add BCC Field to Template
In your EmailJS template, you need to configure the email to include BCC. This is usually done in the template settings:

**Template Settings:**
- **To**: {{to_email}}
- **From**: {{from_email}} (info@mavidesign.se)
- **BCC**: {{bcc_email}} ← **ADD THIS LINE**
- **Subject**: Your existing subject
- **Content**: Your existing HTML content

### 3. Verify Template Variables
Make sure your template can handle these variables:
```
{{to_email}} - Customer email
{{to_name}} - Customer name
{{from_email}} - info@mavidesign.se
{{from_name}} - MAVI Design
{{bcc_email}} - mavidesign.se+3b19644966@invite.trustpilot.com
{{order_number}} - Order number
{{order_total}} - Total amount
{{order_items}} - Product list
{{customer_name}} - Full customer name
{{customer_address}} - Shipping address
{{order_shipping}} - Shipping cost
```

### 4. Important Notes

#### A. Trustpilot Email Format
- **Domain**: `mavidesign.se` (your verified domain in Trustpilot)
- **Unique ID**: `3b19644966` (your specific Trustpilot Business ID)
- **Complete BCC Address**: `mavidesign.se+3b19644966@invite.trustpilot.com`

#### B. Trustpilot Requirements
- The BCC email must come from a verified domain (`info@mavidesign.se`)
- Customer email must be in the "To" field
- Review invitations will be sent after the delay configured in Trustpilot settings

#### C. EmailJS Service Requirements
Your EmailJS service (Strato SMTP or Gmail) must support BCC functionality:
- **Strato SMTP**: Usually supports BCC ✅
- **Gmail**: Supports BCC ✅
- **Other SMTP**: Check provider documentation

### 5. Testing the Setup

1. **Test Order**: Place a test order with a real email address
2. **Check Customer Email**: Verify customer receives order confirmation
3. **Check Trustpilot**: In Trustpilot Business dashboard, check if invitation was registered
4. **Wait for Review Invite**: Customer should receive Trustpilot review invitation after configured delay

### 6. Troubleshooting

#### BCC Not Working?
- Verify EmailJS template includes BCC field
- Check if your SMTP service supports BCC
- Ensure Trustpilot email address is exactly correct
- Test with a personal email in BCC first

#### No Review Invitations Sent?
- Verify domain `mavidesign.se` is confirmed in Trustpilot
- Check Trustpilot Business ID in the email address
- Verify review invitation settings in Trustpilot dashboard
- Allow 24-48 hours for first invitations to be processed

#### Customer Not Receiving Reviews?
- Check Trustpilot's delay settings (usually 7-14 days after purchase)
- Verify customer email address is correct
- Check customer's spam folder
- Ensure review invitation is enabled in Trustpilot settings

### 7. Trustpilot Dashboard Configuration

In your Trustpilot Business dashboard:
1. Go to **Reviews** → **Invitations**
2. Enable **Automatic Review Invitations**
3. Set appropriate delay (recommended: 7-14 days)
4. Configure invitation email content and design
5. Verify domain ownership for `mavidesign.se`

### 8. Alternative Implementation (If BCC Doesn't Work)

If EmailJS doesn't support BCC properly, you can send a separate email to Trustpilot:

```javascript
// Send a copy to Trustpilot (as a separate email)
const trustpilotEmailParams = {
  ...customerEmailParams,
  to_email: 'mavidesign.se+3b19644966@invite.trustpilot.com',
  to_name: 'Trustpilot Review System'
};

await emailjs.send(
  EMAILJS_CONFIG.stratoServiceId,
  EMAILJS_CONFIG.customerTemplateId,
  trustpilotEmailParams
);
```

## Benefits
- ✅ Automatic review collection
- ✅ Increased review volume
- ✅ Better timing (after delivery)
- ✅ Professional review management
- ✅ No manual intervention required

## Next Steps
1. Configure EmailJS template with BCC support
2. Test with a real order
3. Monitor Trustpilot dashboard for incoming invitations
4. Adjust timing and content in Trustpilot settings as needed
