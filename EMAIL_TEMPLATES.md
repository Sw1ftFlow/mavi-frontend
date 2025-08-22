# Order Confirmation Email Templates

## Professional HTML Email Template

This template can be used with any email service provider (SendGrid, Mailgun, Nodemailer, etc.)

### Example usage with Node.js and Nodemailer:

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
