# Professional Email Setup for MAVI Webshop

## Quick Setup Guide

### 1. Strato Email Configuration
Your Strato webmail settings for info@mavidesign.se:

- **SMTP Server**: smtp.strato.de
- **Port**: 587 (STARTTLS recommended) or 465 (SSL/TLS)
- **Username**: info@mavidesign.se
- **Password**: [Your Strato password]
- **Authentication**: Required
- **Connection Security**: STARTTLS or SSL/TLS

### 2. EmailJS Setup Steps

1. **Create EmailJS Account** at https://www.emailjs.com/
2. **Add Strato SMTP Service**:
   - Service Type: Custom SMTP
   - SMTP Settings: Use values above
   - From Name: MAVI Design
   - From Email: info@mavidesign.se

3. **Create Customer Confirmation Template**:
   - Subject: `Orderbekräftelse - Beställning #{{order_number}} från MAVI`
   - To: `{{customer_email}}`
   - From: info@mavidesign.se

4. **Create Admin Notification Template**:
   - Subject: `🛒 Ny beställning #{{order_number}} från {{customer_name}}`
   - To: viktor.lehtonen@gmail.com
   - From: info@mavidesign.se

### 3. Integration Code

Add this to your checkout.html:

```javascript
// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',
  stratoServiceId: 'YOUR_STRATO_SERVICE_ID',
  customerTemplateId: 'YOUR_CUSTOMER_TEMPLATE_ID',
  adminTemplateId: 'YOUR_ADMIN_TEMPLATE_ID'
};

// Send order confirmation emails
async function sendOrderEmails(orderData, customerData) {
  try {
    // Generate order number
    const orderNumber = Date.now().toString().slice(-6);
    
    // Format order items for email
    const orderItemsText = orderData.map(item => 
      `${item.name} - Antal: ${item.quantity} - Pris: ${item.price * item.quantity} kr`
    ).join('\n');
    
    const orderItemsHtml = orderData.map(item => `
      <div style="display: flex; padding: 15px; border-bottom: 1px solid #eee;">
        <img src="${item.thumbnail || 'https://via.placeholder.com/60x60?text=No+Image'}" 
             style="width: 60px; height: 60px; object-fit: contain; margin-right: 15px; border-radius: 4px;" 
             alt="${item.name}">
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
          <div style="color: #666; font-size: 14px;">${item.description || ''}</div>
          <div style="color: #333; margin-top: 8px;">
            Antal: ${item.quantity} × ${item.price} kr = <strong>${item.price * item.quantity} kr</strong>
          </div>
        </div>
      </div>
    `).join('');
    
    const total = orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const now = new Date();
    const orderDate = now.toLocaleDateString('sv-SE');
    const orderTime = now.toLocaleTimeString('sv-SE');
    
    const emailParams = {
      order_number: orderNumber,
      order_date: orderDate,
      order_time: orderTime,
      order_total: total,
      customer_name: `${customerData.firstName} ${customerData.lastName}`,
      customer_email: customerData.email,
      customer_phone: customerData.phone || 'Ej angivet',
      customer_address: customerData.address,
      customer_postal_code: customerData.postalCode,
      customer_city: customerData.city,
      order_items: orderItemsText,
      order_items_html: orderItemsHtml
    };
    
    // Send customer confirmation email
    await emailjs.send(
      EMAILJS_CONFIG.stratoServiceId,
      EMAILJS_CONFIG.customerTemplateId,
      emailParams,
      EMAILJS_CONFIG.publicKey
    );
    
    // Send admin notification email
    await emailjs.send(
      EMAILJS_CONFIG.stratoServiceId,
      EMAILJS_CONFIG.adminTemplateId,
      emailParams,
      EMAILJS_CONFIG.publicKey
    );
    
    console.log('Order confirmation emails sent successfully');
    return { success: true, orderNumber };
    
  } catch (error) {
    console.error('Failed to send order emails:', error);
    return { success: false, error: error.message };
  }
}
```

### 4. Customer Email Template (Professional)

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
        .logo { color: white; font-size: 28px; font-weight: bold; letter-spacing: 2px; }
        .content { padding: 40px 30px; }
        .order-summary { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .product-section { border: 1px solid #eee; border-radius: 8px; overflow: hidden; margin: 20px 0; }
        .total-section { background-color: #000; color: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .info-box { background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MAVI</div>
            <div style="color: #ccc; font-size: 14px; margin-top: 5px;">Design & Belysning</div>
        </div>
        
        <div class="content">
            <h1 style="color: #333; margin-bottom: 10px; font-size: 28px; font-weight: 600;">Tack för din beställning!</h1>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                Hej <strong>{{customer_name}}</strong>,<br><br>
                Vi har mottagit din beställning och den bearbetas nu. Du kommer att få en leveransbekräftelse med spårningsinformation så snart din beställning har skickats.
            </p>
            
            <div class="order-summary">
                <h2 style="margin-top: 0; color: #333; font-size: 20px;">📋 Beställningsdetaljer</h2>
                <p style="margin: 8px 0;"><strong>Beställningsnummer:</strong> #{{order_number}}</p>
                <p style="margin: 8px 0;"><strong>Beställningsdatum:</strong> {{order_date}} kl {{order_time}}</p>
                <p style="margin: 8px 0;"><strong>E-postadress:</strong> {{customer_email}}</p>
            </div>
            
            <h2 style="color: #333; font-size: 20px; margin-top: 30px;">📍 Leveransadress</h2>
            <div style="background-color: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #333; line-height: 1.6; margin: 0; font-size: 15px;">
                    <strong>{{customer_name}}</strong><br>
                    {{customer_address}}<br>
                    {{customer_postal_code}} {{customer_city}}
                </p>
            </div>
            
            <h2 style="color: #333; font-size: 20px; margin-top: 30px;">🛍️ Beställda produkter</h2>
            <div class="product-section">
                {{{order_items_html}}}
            </div>
            
            <div class="total-section">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 18px; font-weight: 600;">Totalt att betala:</span>
                    <span style="font-size: 28px; font-weight: bold;">{{order_total}} kr</span>
                </div>
                <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">
                    Inkl. moms • Frakt tillkommer
                </div>
            </div>
            
            <div class="info-box">
                <h3 style="margin-top: 0; color: #0369a1; font-size: 18px;">🚚 Nästa steg</h3>
                <div style="color: #0369a1;">
                    <p style="margin: 8px 0;">✓ Vi förbereder din beställning för leverans</p>
                    <p style="margin: 8px 0;">✓ Du får spårningsinformation när paketet skickas</p>
                    <p style="margin: 8px 0;">✓ Förväntad leveranstid: 2-5 arbetsdagar</p>
                </div>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #92400e;">💡 Viktigt att veta</h3>
                <div style="color: #92400e; font-size: 14px;">
                    <p style="margin: 5px 0;">• Vi skickar endast till adressen som angivits ovan</p>
                    <p style="margin: 5px 0;">• Du kommer att få SMS när paketet är på väg</p>
                    <p style="margin: 5px 0;">• Kontakta oss omgående vid adressändringar</p>
                </div>
            </div>
            
            <div class="footer">
                <h3 style="color: #333; margin-bottom: 15px;">Behöver du hjälp?</h3>
                <p style="margin: 8px 0;">
                    📧 E-post: <a href="mailto:info@mavidesign.se" style="color: #000; text-decoration: none; font-weight: 600;">info@mavidesign.se</a>
                </p>
                <p style="margin: 8px 0;">
                    🌐 Webbplats: <a href="https://mavidesign.se" style="color: #000; text-decoration: none;">mavidesign.se</a>
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 16px; color: #333;">
                        Med vänliga hälsningar,<br>
                        <strong style="font-size: 18px;">MAVI Design Team</strong>
                    </p>
                    <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">
                        Tack för att du valde oss för din belysning! ✨
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### 5. Testing Checklist

- [ ] Strato SMTP connection working in EmailJS
- [ ] Customer confirmation template created and tested
- [ ] Admin notification template created and tested
- [ ] Test emails sent to real addresses
- [ ] Order number generation working
- [ ] Product details formatting correctly
- [ ] All customer data appearing in emails
- [ ] Professional branding consistent
- [ ] Mobile-responsive email design

### 6. Troubleshooting

**Common Strato SMTP Issues:**
1. **Authentication errors**: Double-check username/password
2. **Port issues**: Try both 587 (STARTTLS) and 465 (SSL)
3. **Firewall blocking**: Ensure SMTP ports are open
4. **Strato limits**: Check if there are sending limits on your account

**Alternative Solutions:**
- Use SendGrid, Mailgun, or AWS SES for higher reliability
- Set up a backend service to handle email sending
- Use a combination: Customer emails via professional service, admin notifications via EmailJS

### 7. Professional Email Best Practices

✅ **Always include:**
- Clear order number and date
- Complete customer information
- Detailed product list with images
- Total amount and payment method
- Delivery address and timeline
- Contact information for support
- Professional branding and design

✅ **Email deliverability:**
- Use professional domain (info@mavidesign.se)
- Include unsubscribe option if required
- Monitor bounce rates and spam reports
- Test across different email clients
- Use proper HTML structure and alt text for images

This setup will give your customers a professional experience while keeping you informed of all new orders!
