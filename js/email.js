// EmailJS configuration for professional domain emails
// Get these from: https://www.emailjs.com/
const EMAILJS_CONFIG = {
  publicKey: 'EXLO5_EZugAYOuHiB', // Your EmailJS public key
  
  // Service IDs - you'll need to create these in EmailJS dashboard
  stratoServiceId: 'service_y1lcs9t', // Strato SMTP service for sending from info@mavidesign.se
  gmailServiceId: 'service_y1lcs9t', // Gmail service for admin notifications (can be same initially)
  
  // Template IDs - you'll need to create these templates
  customerTemplateId: 'template_cxfpi08', // Customer order confirmation template (UPDATED!)
  adminTemplateId: 'template_247sx9d' // Admin notification template (can be same initially)
};

// Make configuration globally available
window.EMAILJS_CONFIG = EMAILJS_CONFIG;

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

console.log('EmailJS initialized with config:', EMAILJS_CONFIG);

// Test function to verify email configuration (for debugging)
window.testEmailSetup = async function() {
  try {
    console.log('Testing EmailJS setup...');
    
    const testParams = {
      to_email: 'viktor.lehtonen@gmail.com',
      to_name: 'Viktor Test',
      from_name: 'MAVI Test',
      from_email: 'info@mavidesign.se',
      order_number: 'TEST123',
      order_date: new Date().toLocaleDateString('sv-SE'),
      order_time: new Date().toLocaleTimeString('sv-SE'),
      order_total: '100 kr',
      customer_name: 'Test Kund',
      customer_email: 'test@example.com',
      customer_phone: '0701234567',
      customer_address: 'Testgatan 1',
      customer_postal_code: '12345',
      customer_city: 'Stockholm',
      order_items: 'Test Produkt - Antal: 1 - Pris: 100 kr',
      order_subtotal: '85 kr',
      order_shipping: '15 kr'
    };
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.stratoServiceId,
      EMAILJS_CONFIG.adminTemplateId,
      testParams
    );
    
    console.log('Test email sent successfully:', result);
    alert('Test email skickat! Kolla din inkorg.');
    
  } catch (error) {
    console.error('Test email failed:', error);
    alert('Test email misslyckades: ' + error.message);
  }
};

console.log('EmailJS test function available at: window.testEmailSetup()');