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

    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);