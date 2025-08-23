# Order Confirmation Email Templates

## EmailJS Customer Confirmation Template (Swedish)

**This is the template you need to copy into your EmailJS dashboard for customer order confirmations.**

### Template Configuration in EmailJS:
- **Template Name:** Customer Order Confirmation
- **Subject:** `Orderbekräftelse - Beställning #{{order_number}} från MAVI`
- **To:** `{{customer_email}}`
- **From:** info@mavidesign.se

### HTML Template Code (Copy this into EmailJS):

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: 'Inter', Arial, sans-serif; 
            background-color: #ffffff; 
            line-height: 1.5;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
        }
        .header { 
            background-color: #000; 
            padding: 40px 30px; 
            text-align: center; 
        }
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .logo-img {
            height: 32px;
            width: auto;
        }
        .logo-text { 
            color: white; 
            font-size: 28px; 
            font-weight: bold; 
            letter-spacing: 2px; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .section { 
            margin-bottom: 30px; 
        }
        .order-summary { 
            background-color: #f8f9fa; 
            padding: 25px; 
            border-radius: 4px; 
            border: 1px solid #e9ecef;
        }
        .address-box { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-radius: 4px; 
            border: 1px solid #e9ecef;
        }
        .product-section { 
            border: 1px solid #e9ecef; 
            border-radius: 4px; 
            overflow: hidden; 
        }
        .total-section { 
            background-color: #000; 
            color: white; 
            padding: 25px; 
            text-align: center;
        }
        .info-section { 
            background-color: #f8f9fa; 
            padding: 25px; 
            border-left: 4px solid #000; 
        }
        .footer { 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
            margin-top: 40px; 
            padding-top: 30px; 
            border-top: 1px solid #e9ecef; 
        }
        h1 {
            color: #333;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 20px 0;
        }
        h2 {
            color: #333;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 15px 0;
        }
        h3 {
            color: #333;
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }
        p {
            color: #666;
            margin: 0 0 10px 0;
        }
        .strong {
            color: #333;
            font-weight: 600;
        }
        .price {
            font-size: 24px;
            font-weight: bold;
        }
        .contact-link {
            color: #000;
            text-decoration: none;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <img src="https://mavidesign.se/img/logo2.png" alt="MAVI Logo" class="logo-img">
                <div class="logo-text">MAVI</div>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h1>Tack för din beställning</h1>
                <p>
                    Hej <span class="strong">{{customer_name}}</span>,<br><br>
                    Vi har mottagit din beställning och den bearbetas nu. Du kommer att få en leveransbekräftelse med spårningsinformation så snart din beställning har skickats.
                </p>
            </div>
            
            <div class="section">
                <div class="order-summary">
                    <h2>Beställningsdetaljer</h2>
                    <p><span class="strong">Beställningsnummer:</span> #{{order_number}}</p>
                    <p><span class="strong">Beställningsdatum:</span> {{order_date}} kl {{order_time}}</p>
                    <p><span class="strong">E-postadress:</span> {{customer_email}}</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Leveransadress</h2>
                <div class="address-box">
                    <p class="strong">{{customer_name}}</p>
                    <p>{{customer_address}}</p>
                    <p>{{customer_postal_code}} {{customer_city}}</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Beställda produkter</h2>
                <div class="product-section">
                    {{{order_items_html}}}
                </div>
            </div>
            
            <div class="section">
                <div class="total-section">
                    <div>
                        <span>Totalt att betala: </span>
                        <span class="price">{{order_total}} kr</span>
                    </div>
                    <p style="margin-top: 10px; opacity: 0.8; font-size: 14px;">
                        Inkl. moms
                    </p>
                </div>
            </div>
            
            <div class="section">
                <div class="info-section">
                    <h3>Nästa steg</h3>
                    <p>Vi förbereder din beställning för leverans</p>
                    <p>Du får spårningsinformation när paketet skickas</p>
                    <p>Förväntad leveranstid: 2-5 arbetsdagar</p>
                </div>
            </div>
            
            <div class="footer">
                <h3>Behöver du hjälp?</h3>
                <p>
                    E-post: <a href="mailto:info@mavidesign.se" class="contact-link">info@mavidesign.se</a>
                </p>
                <p>
                    Webbplats: <a href="https://mavidesign.se" class="contact-link">mavidesign.se</a>
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #333;">
                        Med vänliga hälsningar,<br>
                        <span class="strong">MAVI Design Team</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## Admin Notification Template (Swedish)

**Template for admin notifications when new orders come in.**

### Template Configuration in EmailJS:
- **Template Name:** Admin Order Notification
- **Subject:** `🛒 Ny beställning #{{order_number}} från {{customer_name}} - {{order_total}} kr`
- **To:** viktor.lehtonen@gmail.com
- **From:** info@mavidesign.se

### HTML Template Code:

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

---

```javascript
const nodemailer = require('nodemailer');

// Email template function
function createOrderConfirmationEmail({ orderNumber, orderDate, customerData, orderData, total }) {
  const itemsHtml = orderData.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <img src="${item.thumbnail || 'https://via.placeholder.com/60x60?text=No+Image'}" 
               alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; margin-right: 15px; border-radius: 4px;">
          <div>
            <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
            <div style="color: #666; font-size: 14px;">${item.description || ''}</div>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${item.price} kr</td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${item.price * item.quantity} kr</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Orderbekräftelse - ${orderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        <!-- Header -->
        <div style="background-color: #000; padding: 30px; text-align: center;">
          <div style="color: white; font-size: 28px; font-weight: bold;">MAVI</div>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <h1 style="color: #333; margin-bottom: 10px; font-size: 24px;">Tack för din beställning!</h1>
          <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
            Hej ${customerData.firstName || 'Kund'},<br>
            Vi har tagit emot din beställning och betalningen har behandlats framgångsrikt. 
            Nedan hittar du all information om din order.
          </p>
          
          <!-- Order Info -->
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Orderinformation</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">Ordernummer:</span>
              <span style="font-weight: 600;">${orderNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666;">Orderdatum:</span>
              <span style="font-weight: 600;">${orderDate}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666;">E-post:</span>
              <span style="font-weight: 600;">${customerData.email}</span>
            </div>
          </div>
          
          <!-- Order Items -->
          <h3 style="color: #333; margin-bottom: 20px;">Beställda produkter</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Produkt</th>
                <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6;">Antal</th>
                <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Pris</th>
                <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Totalt</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <!-- Order Total -->
          <div style="text-align: right; margin-bottom: 30px;">
            <div style="font-size: 18px; font-weight: 600; color: #333;">
              Totalt: ${total} kr (inkl. 20% moms)
            </div>
          </div>
          
          <!-- Shipping Info -->
          ${customerData.address ? `
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 6px;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Leveransadress</h3>
            <div style="color: #666; line-height: 1.6;">
              ${customerData.firstName} ${customerData.lastName}<br>
              ${customerData.address}<br>
              ${customerData.postalCode} ${customerData.city}
            </div>
          </div>
          ` : ''}
          
          <!-- Next Steps -->
          <div style="border-left: 4px solid #000; padding-left: 20px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Vad händer nu?</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Vi förbereder din beställning för leverans</li>
              <li style="margin-bottom: 8px;">Du får en leveransbekräftelse med spårningsinformation</li>
              <li style="margin-bottom: 8px;">Leveranstid: 2-5 arbetsdagar</li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
            <p style="color: #666; margin: 0;">
              Har du frågor om din beställning?<br>
              Kontakta oss på <a href="mailto:support@mavi.se" style="color: #000; text-decoration: none;">support@mavi.se</a>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #dee2e6;">
          <div style="color: #666; font-size: 14px;">
            <strong>MAVI</strong><br>
            Tack för att du handlar hos oss!
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send email function
async function sendOrderConfirmationEmail(orderData) {
  const transporter = nodemailer.createTransporter({
    // Configure your email service
    service: 'gmail', // or your preferred service
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  const emailHtml = createOrderConfirmationEmail(orderData);

  const mailOptions = {
    from: '"MAVI Webshop" <your-verified-email@gmail.com>', // Use your verified SendGrid sender
    to: orderData.customerData.email,
    subject: `Orderbekräftelse - ${orderData.orderNumber}`,
    html: emailHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { createOrderConfirmationEmail, sendOrderConfirmationEmail };
```

## Getting Started with SendGrid (No Custom Domain Required)

If you don't have your own domain ready yet, you can still use SendGrid with a verified sender email address:

### Quick Setup Steps:

1. **Sign up for SendGrid**: https://sendgrid.com (free tier available)

2. **Verify Single Sender**:
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Use your existing email (Gmail, Outlook, etc.)
   - Complete email verification

3. **Create API Key**:
   - Go to Settings → API Keys
   - Create new key with "Full Access"
   - Copy and save the API key

4. **Update your backend code**:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

const msg = {
  to: customerEmail,
  from: 'your-verified-email@gmail.com', // Your verified sender
  subject: 'Order Confirmation',
  html: emailTemplate
};

await sgMail.send(msg);
```

### Example with Environment Variables:
```bash
# .env file
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
SENDGRID_FROM_NAME=MAVI Webshop
```

```javascript
// In your backend
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: orderData.customerData.email,
  from: {
    email: process.env.SENDGRID_FROM_EMAIL,
    name: process.env.SENDGRID_FROM_NAME
  },
  subject: `Orderbekräftelse - ${orderData.orderNumber}`,
  html: createOrderConfirmationEmail(orderData)
};
```

## Alternative Email Services

### SendGrid (Recommended for getting started)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// For accounts without custom domain, use a verified sender email
const msg = {
  to: customerData.email,
  from: 'your-verified-email@gmail.com', // Replace with your verified sender email
  subject: `Orderbekräftelse - ${orderNumber}`,
  html: createOrderConfirmationEmail(orderData),
  // Optional: Add reply-to if you want replies to go to a different email
  reply_to: 'support@yourdomain.com' // When you get your domain
};

await sgMail.send(msg);
```

### SendGrid Setup Steps:
1. **Create SendGrid Account**: Sign up at https://sendgrid.com
2. **Verify Sender Email**: 
   - Go to Settings > Sender Authentication
   - Click "Verify a Single Sender"
   - Use your personal email (Gmail, Outlook, etc.)
   - Complete the verification process
3. **Create API Key**:
   - Go to Settings > API Keys
   - Create a new API key with "Full Access"
   - Save the API key securely
4. **Update Code**: Replace `your-verified-email@gmail.com` with your verified sender email

### Example with Error Handling:
```javascript
async function sendOrderConfirmationEmail(orderData) {
  try {
    const msg = {
      to: orderData.customerData.email,
      from: {
        email: 'your-verified-email@gmail.com',
        name: 'MAVI Webshop'
      },
      subject: `Orderbekräftelse - ${orderData.orderNumber}`,
      html: createOrderConfirmationEmail(orderData)
    };

    await sgMail.send(msg);
    console.log('Order confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('SendGrid response:', error.response.body);
    }
    return { success: false, error: error.message };
  }
}
```

### Mailgun
```javascript
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

const data = {
  from: 'MAVI Webshop <your-verified-email@gmail.com>', // Use your verified sender
  to: customerData.email,
  subject: `Orderbekräftelse - ${orderNumber}`,
  html: createOrderConfirmationEmail(orderData)
};

await mailgun.messages().send(data);
```

## Email Features Included

✅ **Professional Design**
- Clean, modern layout
- Mobile-responsive
- Brand consistent with MAVI styling

✅ **Complete Order Information**
- Order number and date
- Customer details
- Itemized product list with images
- Total amount with tax breakdown
- Shipping address

✅ **Customer Experience**
- Clear next steps
- Contact information
- Professional tone
- Swedish language

✅ **Technical Requirements**
- HTML email compatible
- Inline CSS for email clients
- Fallback text for images
- Cross-platform compatibility

## Integration Notes

1. **Backend Implementation Required**: For production, implement the email sending on your server
2. **Environment Variables**: Store email service credentials securely
3. **Error Handling**: Include proper error handling for email failures
4. **Testing**: Test emails in different email clients
5. **Compliance**: Ensure GDPR compliance for customer data
