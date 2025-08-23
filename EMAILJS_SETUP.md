# EmailJS Setup Guide for Order Notifications

## Overview
This guide will help you set up EmailJS to automatically send order notifications to your email (viktor.lehtonen@gmail.com) when customers complete purchases.

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (up to 200 emails/month for free)
3. Verify your email address

## Step 2: Connect Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. **IMPORTANT:** If you get "412Gmail_API: Request had insufficient authentication scopes" error:
   - Click "Disconnect" if already connected
   - Clear your browser cache and cookies for emailjs.com
   - Try connecting again in an incognito/private browser window
   - Make sure you're logged into the correct Gmail account (viktor.lehtonen@gmail.com)
   - When authorizing, make sure to check ALL permission boxes that appear
5. Follow the authentication process to connect your email account
6. Note down the **Service ID** (e.g., "service_abc123")

### Alternative Email Services (if Gmail continues to have issues):
- **Outlook/Hotmail**: Often easier to set up
- **Yahoo Mail**: Good alternative
- **Custom SMTP**: If you have a business email

## Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template content:

### Template Subject:
```
🛒 Ny beställning från MAVI Webshop - {{customer_name}}
```

### Template Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .order-details { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #000; }
        .customer-info { background: white; padding: 15px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MAVI - Ny Beställning</h1>
        </div>
        
        <div class="content">
            <h2>Beställningsinformation</h2>
            <div class="order-details">
                <p><strong>Datum:</strong> {{order_date}} {{order_time}}</p>
                <p><strong>Totalt:</strong> {{order_total}}</p>
            </div>

            <h2>Kundinformation</h2>
            <div class="customer-info">
                <p><strong>Namn:</strong> {{customer_name}}</p>
                <p><strong>E-post:</strong> {{customer_email}}</p>
                <p><strong>Adress:</strong> {{customer_address}}</p>
                <p><strong>Postnummer:</strong> {{customer_postal_code}}</p>
                <p><strong>Stad:</strong> {{customer_city}}</p>
            </div>

            <h2>Beställda produkter</h2>
            <div class="order-details">
                <pre>{{order_items}}</pre>
            </div>

            <div class="footer">
                <p>Logga in på din admin-panel för att hantera beställningen.</p>
            </div>
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down the **Template ID** (e.g., "template_xyz789")

## Step 4: Get Public Key
1. Go to "Account" > "General" in EmailJS dashboard
2. Find your **Public Key** (e.g., "abc123def456")

## Step 5: Update Your Code
In your `checkout.html` file, replace these placeholder values:

```javascript
const EMAILJS_SERVICE_ID = 'service_abc123'; // Your Service ID
const EMAILJS_TEMPLATE_ID = 'template_xyz789'; // Your Template ID  
const EMAILJS_PUBLIC_KEY = 'abc123def456'; // Your Public Key
```

## Step 6: Test the Setup
1. Make a test purchase on your website
2. Check your email (viktor.lehtonen@gmail.com) for the notification
3. Check EmailJS dashboard for delivery status

## Email Content Example
You'll receive emails like this:

**Subject:** 🛒 Ny beställning från MAVI Webshop - Anna Andersson

**Content:**
- Customer: Anna Andersson (anna@email.com)
- Address: Storgatan 123, 12345 Stockholm
- Products: 
  - Banker's Lamp (Grön och mässing) - Antal: 2 - Pris: 2800 kr
  - Amanita (Orange) - Antal: 1 - Pris: 700 kr
- Total: 3500 kr
- Date/Time: 2025-08-23 14:30:25

## Security Notes
- EmailJS keys are safe to use in frontend code
- Your gmail password is never exposed
- Rate limiting prevents abuse (200 emails/month on free plan)
- Consider upgrading to paid plan for higher volume

## Troubleshooting
### Gmail API Scope Error (412 Error):
1. **Clear browser data**: Go to browser settings and clear cookies/cache for emailjs.com
2. **Use incognito mode**: Try connecting in a private/incognito browser window
3. **Check Gmail account**: Make sure you're logged into viktor.lehtonen@gmail.com
4. **Grant all permissions**: When Google asks for permissions, check ALL boxes
5. **Try multiple times**: Sometimes it takes 2-3 attempts to work properly
6. **Alternative**: Use Outlook/Yahoo instead of Gmail if issues persist

### Other Common Issues:
- Check browser console for error messages
- Verify all IDs are correct (Service ID, Template ID, Public Key)
- Ensure email authentication is still active
- Check EmailJS dashboard for delivery logs

### Gmail Alternative Setup:
If Gmail keeps failing, use Outlook:
1. Go to outlook.com and create a free account
2. In EmailJS, choose "Outlook" instead of Gmail
3. Follow the same authentication process
4. Update your receiving email to viktor.lehtonen@gmail.com in the template

## Alternative: Webhook Integration
For production use, consider setting up a proper backend with webhook integration to handle order processing and email notifications more securely.
