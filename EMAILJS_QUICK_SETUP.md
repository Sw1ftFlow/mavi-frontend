# EmailJS Setup Instructions for MAVI Webshop

## 🚀 Quick Setup Guide

Your webshop is now configured to send professional emails from **info@mavidesign.se**. Follow these steps to complete the setup:

## Step 1: EmailJS Account Setup

1. Go to [EmailJS.com](https://www.emailjs.com/) and create an account
2. Verify your email address

## Step 2: Add Strato Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Custom SMTP"**
4. Configure with these Strato settings:

```
Service Name: Strato MAVI
SMTP Server: smtp.strato.de
Port: 587 (STARTTLS) or 465 (SSL)
Username: info@mavidesign.se
Password: [Your Strato email password]
From Name: MAVI Design
From Email: info@mavidesign.se
```

5. Test the connection
6. **Copy the Service ID** (looks like `service_abc123`)

## Step 3: Create Customer Confirmation Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Template settings:

**Template Name:** Customer Order Confirmation

**To:** `{{customer_email}}`
**From:** info@mavidesign.se
**Subject:** `Orderbekräftelse - Beställning #{{order_number}} från MAVI`

**HTML Content:** (Copy the professional template from PROFESSIONAL_EMAIL_SETUP.md)

4. **Copy the Template ID** (looks like `template_xyz789`)

## Step 4: Create Admin Notification Template

1. Create another template
2. Template settings:

**Template Name:** Admin Order Notification

**To:** viktor.lehtonen@gmail.com
**From:** info@mavidesign.se  
**Subject:** `🛒 Ny beställning #{{order_number}} från {{customer_name}} - {{order_total}} kr`

**HTML Content:** (Use the admin template from PROFESSIONAL_EMAIL_SETUP.md)

3. **Copy the Template ID** (looks like `template_admin456`)

## Step 5: Update Your Website Code

In `checkout.html`, replace these values around line 140:

```javascript
const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY_HERE', // From EmailJS Account > General
  stratoServiceId: 'YOUR_STRATO_SERVICE_ID', // From Step 2
  customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID', // From Step 3
  adminTemplateId: 'YOUR_ADMIN_TEMPLATE_ID' // From Step 4
};
```

## Step 6: Test the System

1. Place a test order on your website
2. Check that:
   - ✅ Customer receives professional confirmation from info@mavidesign.se
   - ✅ You receive admin notification at viktor.lehtonen@gmail.com
   - ✅ Emails contain all order details and proper branding

## 📋 Template Variables Available

Your email templates can use these variables:

**Order Information:**
- `{{order_number}}` - Unique order number
- `{{order_date}}` - Order date (Swedish format)
- `{{order_time}}` - Order time
- `{{order_total}}` - Total amount in SEK
- `{{order_subtotal}}` - Subtotal before shipping
- `{{order_shipping}}` - Shipping cost

**Customer Information:**
- `{{customer_name}}` - Full name
- `{{customer_email}}` - Email address
- `{{customer_phone}}` - Phone number
- `{{customer_address}}` - Street address
- `{{customer_postal_code}}` - Postal code
- `{{customer_city}}` - City

**Product Information:**
- `{{order_items}}` - Plain text product list
- `{{order_items_html}}` - HTML formatted product list with images

**Email Metadata:**
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{from_name}}` - Sender name (MAVI Design)
- `{{from_email}}` - Sender email (info@mavidesign.se)

## 🎨 Email Features

**Customer Confirmation Email:**
- Professional MAVI branding
- Complete order summary with product images
- Delivery information and timeline
- Contact information for support
- Mobile-responsive design

**Admin Notification Email:**
- Urgent styling to grab attention
- Complete customer and order details
- Action items checklist
- Direct links to admin tools

## 🔧 Troubleshooting

**Common Issues:**

1. **Strato SMTP Connection Failed:**
   - Verify username/password are correct
   - Try port 465 instead of 587
   - Check Strato account for SMTP restrictions

2. **Emails Not Sending:**
   - Check browser console for errors
   - Verify all Template IDs are correct
   - Test templates individually in EmailJS dashboard

3. **Emails Going to Spam:**
   - Add SPF/DKIM records to your domain
   - Use professional content (avoid spam keywords)
   - Monitor sending reputation

4. **Rate Limiting:**
   - Free EmailJS: 200 emails/month
   - Consider upgrading for higher volume
   - Implement retry logic for failed sends

## 🔄 Alternative Options

If Strato SMTP continues to have issues:

1. **Use EmailJS Gmail Service** (easier setup)
2. **Try SendGrid** or **Mailgun** (more reliable for business)
3. **Set up backend email service** (most professional)

## 📞 Support

Need help? Check:
- EmailJS documentation: https://www.emailjs.com/docs/
- Strato support for SMTP settings
- Test emails in EmailJS dashboard first

Your customers will now receive professional order confirmations that build trust and enhance your brand! 🚀
