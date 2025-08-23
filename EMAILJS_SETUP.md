# EmailJS Setup Guide for Professional Order Emails

## Overview
This guide will help you set up EmailJS to:
1. Send professional order confirmations to customers from info@mavidesign.se
2. Send order notifications to you (viktor.lehtonen@gmail.com) when customers complete purchases

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (up to 200 emails/month for free)
3. Verify your email address

## Step 2: Connect Email Service for Professional Domain
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Custom SMTP" for your Strato webmail
4. Configure with these settings:
   - **SMTP Server**: smtp.strato.de
   - **Port**: 587 (STARTTLS) or 465 (SSL)
   - **Username**: info@mavidesign.se
   - **Password**: [Your Strato email password]
   - **From Name**: MAVI Design
   - **From Email**: info@mavidesign.se
5. Test the connection
6. Note down the **Service ID** (e.g., "service_strato123")

### Alternative: Gmail Service for Admin Notifications
1. Also add a Gmail service for admin notifications
2. Choose "Gmail" and connect viktor.lehtonen@gmail.com
3. **IMPORTANT:** If you get "412Gmail_API: Request had insufficient authentication scopes" error:
   - Click "Disconnect" if already connected
   - Clear your browser cache and cookies for emailjs.com
   - Try connecting again in an incognito/private browser window
   - Make sure you're logged into the correct Gmail account (viktor.lehtonen@gmail.com)
   - When authorizing, make sure to check ALL permission boxes that appear
4. Note down this **Service ID** (e.g., "service_gmail456")

## Step 3: Create Email Templates

### Template 1: Customer Order Confirmation
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Name it "Customer Order Confirmation"

#### Template Subject:
```
Orderbekräftelse - Beställning #{{order_number}} från MAVI
```

#### Template Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #000; padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; }
        .content { padding: 40px 30px; }
        .order-summary { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .product-item { display: flex; padding: 15px 0; border-bottom: 1px solid #eee; }
        .product-image { width: 60px; height: 60px; margin-right: 15px; }
        .product-details { flex: 1; }
        .product-name { font-weight: 600; margin-bottom: 4px; }
        .product-desc { color: #666; font-size: 14px; }
        .total-section { background-color: #000; color: white; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MAVI</div>
        </div>
        
        <div class="content">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Tack för din beställning!</h1>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
                Hej {{customer_name}},<br><br>
                Vi har mottagit din beställning och den bearbetas nu. Du kommer att få en leveransbekräftelse så snart din beställning har skickats.
            </p>
            
            <div class="order-summary">
                <h2 style="margin-top: 0; color: #333;">Beställningsdetaljer</h2>
                <p><strong>Beställningsnummer:</strong> #{{order_number}}</p>
                <p><strong>Beställningsdatum:</strong> {{order_date}}</p>
                <p><strong>E-post:</strong> {{customer_email}}</p>
            </div>
            
            <h2 style="color: #333;">Leveransadress</h2>
            <p style="color: #666; line-height: 1.6;">
                {{customer_name}}<br>
                {{customer_address}}<br>
                {{customer_postal_code}} {{customer_city}}
            </p>
            
            <h2 style="color: #333;">Beställda produkter</h2>
            <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                {{order_items_html}}
            </div>
            
            <div class="total-section">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 18px; font-weight: 600;">Totalt att betala:</span>
                    <span style="font-size: 24px; font-weight: bold;">{{order_total}} kr</span>
                </div>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h3 style="margin-top: 0; color: #0369a1;">Nästa steg</h3>
                <p style="color: #0369a1; margin-bottom: 0;">
                    • Vi förbereder din beställning för leverans<br>
                    • Du får en spårningskod när paketet skickas<br>
                    • Leveranstid: 2-5 arbetsdagar
                </p>
            </div>
            
            <div class="footer">
                <p>Har du frågor? Kontakta oss på <a href="mailto:info@mavidesign.se" style="color: #000;">info@mavidesign.se</a></p>
                <p style="margin-top: 20px;">
                    Med vänliga hälsningar,<br>
                    <strong>MAVI Design Team</strong>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
```

4. Configure the "To" field: {{customer_email}}
5. Save the template and note down the **Template ID** (e.g., "template_customer123")

### Template 2: Admin Order Notification
1. Create another new template
2. Name it "Admin Order Notification"

#### Template Subject:
```
🛒 Ny beställning #{{order_number}} från {{customer_name}} - {{order_total}} kr
```

#### Template Body (HTML):
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
        .urgent { background: #fee2e2; border-left-color: #dc2626; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MAVI - Ny Beställning Mottagen</h1>
        </div>
        
        <div class="content">
            <div class="order-details urgent">
                <h2 style="margin-top: 0;">⚡ ÅTGÄRD KRÄVS</h2>
                <p><strong>Beställningsnummer:</strong> #{{order_number}}</p>
                <p><strong>Datum:</strong> {{order_date}} {{order_time}}</p>
                <p><strong>Totalt:</strong> {{order_total}} kr</p>
                <p><strong>Status:</strong> Väntar på behandling</p>
            </div>

            <h2>Kundinformation</h2>
            <div class="customer-info">
                <p><strong>Namn:</strong> {{customer_name}}</p>
                <p><strong>E-post:</strong> {{customer_email}}</p>
                <p><strong>Telefon:</strong> {{customer_phone}}</p>
                <p><strong>Adress:</strong> {{customer_address}}</p>
                <p><strong>Postnummer:</strong> {{customer_postal_code}}</p>
                <p><strong>Stad:</strong> {{customer_city}}</p>
            </div>

            <h2>Beställda produkter</h2>
            <div class="order-details">
                <pre style="white-space: pre-wrap; font-family: inherit;">{{order_items}}</pre>
            </div>

            <div class="order-details">
                <h3>Nästa steg:</h3>
                <p>
                    ✅ Kontrollera produkttillgänglighet<br>
                    📦 Förbered för leverans<br>
                    📧 Skicka spårningsinformation till kund<br>
                    💰 Bekräfta betalning i Stripe Dashboard
                </p>
            </div>

            <div class="footer">
                <p><strong>Denna beställning kräver din uppmärksamhet!</strong></p>
                <p>Logga in på din admin-panel för att hantera beställningen.</p>
            </div>
        </div>
    </div>
</body>
</html>
```

3. Configure the "To" field: viktor.lehtonen@gmail.com
4. Save the template and note down the **Template ID** (e.g., "template_admin456")
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
// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'abc123def456'; // Your Public Key

// Service IDs
const EMAILJS_STRATO_SERVICE_ID = 'service_strato123'; // Your Strato SMTP Service ID
const EMAILJS_GMAIL_SERVICE_ID = 'service_gmail456'; // Your Gmail Service ID

// Template IDs  
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_customer123'; // Customer confirmation template
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_admin456'; // Admin notification template
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
