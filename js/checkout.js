 // Stripe configuration - LIVE MODE (Real payments)
    // Real payments that charge actual money
    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RyvauD6syVba6lcZmEWTvwn8IUnT4bwlFH3IHmIpNpDMVLj7jizTsuu6KTKqoZ5BNIFYaWQGMRgB8h2KWBw0h5K00W4RM08w8';
    const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
    let elements;
    let paymentElement;

    // Initialize Stripe Payment Element for Live Mode
    let elementType = null; // Track what type of element we created
    
    async function initializeStripe() {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Check if cart is empty
        if (cart.length === 0 || amount <= 0) {
          document.getElementById('payment-element').innerHTML = '<p class="text-gray-500">Din varukorg är tom. Lägg till produkter för att fortsätta.</p>';
          return;
        }
        
        console.log('Initializing Stripe LIVE mode with cart:', cart);
        console.log('Total amount:', amount, 'SEK');
        
        // Add shipping to amount if applicable
        const shippingCost = document.getElementById('shipping-cost').textContent === '99 kr' ? 99 : 0;
        const totalAmount = amount + shippingCost;
        
        try {
          // Create Payment Intent on the backend first
          console.log('Calling backend at: https://mavi-backend.onrender.com/create-payment-intent');
          console.log('Request data:', { amount: Math.round(totalAmount * 100), currency: 'sek' });
          
          const response = await fetch('https://mavi-backend.onrender.com/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              amount: Math.round(totalAmount * 100), // Convert SEK to öre
              currency: 'sek'
            })
          });

          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error response:', errorText);
            throw new Error(`Backend error: ${response.status} - ${errorText}`);
          }

          const { clientSecret } = await response.json();
          console.log('Created Payment Intent with client secret');

          // Use Payment Element with client secret for Klarna support
          elements = stripe.elements({
            clientSecret: clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '0px'
              }
            }
          });

          paymentElement = elements.create('payment', {
            business: {
              name: 'MAVI Design'
            },
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postalCode: 'auto'
                }
              }
            }
          });
          
          await paymentElement.mount('#payment-element');
          elementType = 'payment'; // Track that we created a Payment Element
          console.log('Live Payment Element with Klarna mounted successfully');
          console.log('Payment element type after creation:', paymentElement.type);
          
        } catch (clientModeError) {
          console.error('Payment Element with backend failed:', clientModeError);
          
          // Show specific error messages based on the type of error
          if (clientModeError.message && clientModeError.message.includes('fetch')) {
            console.error('Network error - backend may not be accessible');
            showMessage('Anslutningsfel till betalningsservern. Försöker med kortbetalning istället.');
          } else if (clientModeError.message && clientModeError.message.includes('CORS')) {
            console.error('CORS error - backend CORS configuration needed');
            showMessage('Serverfel - CORS-konfiguration krävs. Använder kortbetalning istället.');
          } else if (clientModeError.message && clientModeError.message.includes('Backend error')) {
            console.error('Backend returned an error:', clientModeError.message);
            showMessage('Serverfel: ' + clientModeError.message + '. Använder kortbetalning istället.');
          } else {
            console.error('Unknown error calling backend');
            showMessage('Klarna-betalningar är för närvarande inte tillgängliga. Du kan använda kort istället.');
          }
          
          // Fallback to card element for live payments (client-only mode)
          elements = stripe.elements({
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '0px'
              }
            }
          });

          paymentElement = elements.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          });
          
          await paymentElement.mount('#payment-element');
          elementType = 'card'; // Track that we created a Card Element
          console.log('Live card element mounted successfully (fallback mode - no Klarna support)');
          console.log('Card element type after creation:', paymentElement.type);
        }
        
        console.log('Stripe LIVE mode initialized successfully with amount:', totalAmount, 'SEK');
      } catch (error) {
        console.error('Stripe initialization error:', error);
        document.getElementById('payment-element').innerHTML = '<p class="text-red-500">Fel vid laddning av betalningsformuläret. Försök ladda om sidan.</p>';
        showMessage('Fel vid initiering av betalning: ' + error.message);
      }
    }

    // Handle form submission
    async function handleSubmit(e) {
      e.preventDefault();
      
      // Validate email and address before processing payment
      const emailValid = validateEmail();
      const addressValid = validateAddress();
      
      if (!emailValid || !addressValid) {
        showMessage("Vänligen korrigera e-post och adressuppgifterna innan du fortsätter.");
        return;
      }

      // Check if payment element is properly initialized
      if (!paymentElement || !elements || !elementType) {
        showMessage("Betalningsformuläret är inte redo. Vänligen ladda om sidan och försök igen.");
        return;
      }

      console.log('Processing payment with element type:', elementType);
      
      setLoading(true);

      try {
        // Store customer data for order confirmation
        const customerData = {
          email: document.querySelector('input[type="email"]').value,
          firstName: document.querySelector('input[placeholder="Förnamn"]').value,
          lastName: document.querySelector('input[placeholder="Efternamn"]').value,
          phone: document.querySelector('input[placeholder="Telefonnummer (för Klarna)"]').value,
          address: document.querySelector('input[placeholder="Adress"]').value,
          postalCode: document.querySelector('input[placeholder="Postnummer"]').value,
          city: document.querySelector('input[placeholder="Stad"]').value
        };
        
        // Save customer data to localStorage for success page
        localStorage.setItem('lastOrderCustomer', JSON.stringify(customerData));
        
        // Get cart for order notification
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = document.getElementById('shipping-cost').textContent === '99 kr' ? 99 : 0;
        const orderTotal = subtotal + shipping;
        
        // Send professional order emails (customer confirmation + admin notification)
        const emailResult = await sendOrderEmails(customerData, cart, subtotal, shipping, orderTotal);
        
        if (emailResult.success) {
          console.log(`Order emails sent successfully. Order number: ${emailResult.orderNumber}`);
          // Store order number for success page
          localStorage.setItem('lastOrderNumber', emailResult.orderNumber);
        } else {
          console.warn('Email sending failed:', emailResult.error);
          // Continue with payment process even if emails fail
        }
        
        // Process LIVE payment including Klarna (real money will be charged)
        try {
          console.log('Payment element details:', {
            elementType: elementType,
            element: paymentElement,
            elementsObject: elements
          });

          if (elementType === 'payment') {
            // Use Payment Element approach
            // Use Payment Element for live payments with enhanced error handling
            const confirmParams = {
              return_url: window.location.origin + window.location.pathname.replace('checkout.html', 'success.html'),
              receipt_email: customerData.email
            };

            console.log('Processing payment with confirmParams:', confirmParams);
            console.log('About to call stripe.confirmPayment - this should redirect for Klarna payments');

            // Validate that the payment element is ready
            try {
              await elements.submit();
            } catch (submitError) {
              console.error('Elements submit validation failed:', submitError);
              if (submitError.type === 'validation_error') {
                showMessage("Vänligen fyll i alla obligatoriska betalningsuppgifter.");
              } else {
                showMessage("Betalningsformuläret är inte komplett. Kontrollera alla fält.");
              }
              setLoading(false);
              return;
            }

            const { error, paymentIntent } = await stripe.confirmPayment({
              elements,
              confirmParams
              // Remove redirect: 'if_required' to allow redirects for Klarna
            });

            if (error) {
              console.error('Payment error:', error);
              if (error.type === "card_error" || error.type === "validation_error") {
                showMessage("Betalningsfel: " + error.message);
              } else if (error.code === 'payment_intent_authentication_failure') {
                showMessage("Betalningen kunde inte verifieras. Försök igen eller använd en annan betalmetod.");
              } else if (error.code === 'incomplete_payment_element') {
                showMessage("Vänligen fyll i alla betalningsuppgifter innan du fortsätter.");
              } else if (error.message && error.message.includes('brand')) {
                showMessage("Ett fel uppstod med den valda betalmetoden. Försök med ett annat kort eller betalmetod.");
              } else {
                showMessage("Ett fel uppstod vid betalningen: " + error.message);
              }
            } else {
              // For Klarna and other redirect-based payments, confirmPayment will redirect
              // If we reach this point without an error and without a redirect, 
              // it means the payment succeeded immediately (like with some cards)
              if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent);
                localStorage.removeItem('cart');
                window.location.href = './success.html?payment_intent=' + paymentIntent.id;
              } else {
                // This should rarely happen as most payments either error or redirect
                console.log('Payment processing...', paymentIntent);
                showMessage("Betalningen behandlas. Du kommer att omdirigeras automatiskt.");
              }
            }
            
          } else if (elementType === 'card') {
            // Card element fallback - use createPaymentMethod instead
            const { error, paymentMethod } = await stripe.createPaymentMethod({
              type: 'card',
              card: paymentElement,
              billing_details: {
                name: `${customerData.firstName} ${customerData.lastName}`,
                email: customerData.email,
                phone: customerData.phone || '',
                address: {
                  line1: customerData.address,
                  city: customerData.city,
                  postal_code: customerData.postalCode,
                  country: 'SE'
                }
              }
            });

            if (error) {
              console.error('Payment method creation error:', error);
              showMessage("Kortfel: " + error.message);
            } else {
              console.log('Payment method created:', paymentMethod);
              localStorage.removeItem('cart');
              window.location.href = './success.html?payment_method=' + paymentMethod.id;
            }
          } else {
            // This shouldn't happen with a properly configured element
            console.error('Element type not recognized:', {
              elementType,
              paymentElement
            });
            showMessage("Betalningsformuläret är inte korrekt konfigurerat. Vänligen ladda om sidan och försök igen.");
          }
        } catch (paymentError) {
          console.error('Payment processing error:', paymentError);
          console.error('Payment element type:', paymentElement?.type);
          console.error('Elements object:', elements);
          
          // Check if this is the brand property error
          if (paymentError.message && paymentError.message.includes('brand')) {
            showMessage("Ett fel uppstod med kortinformationen. Försök med ett annat kort eller välj en annan betalmetod som Klarna.");
          } else {
            showMessage("Ett fel uppstod vid betalningen: " + paymentError.message);
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        showMessage("Ett fel uppstod vid betalningen. Försök igen.");
      }

      setLoading(false);
    }

    // Show a spinner on payment submission
    function setLoading(isLoading) {
      const submitButton = document.querySelector("#submit-payment");
      const buttonText = document.querySelector("#button-text");
      const spinner = document.querySelector("#spinner");

      if (isLoading) {
        submitButton.disabled = true;
        buttonText.classList.add("hidden");
        spinner.classList.remove("hidden");
      } else {
        submitButton.disabled = false;
        buttonText.classList.remove("hidden");
        spinner.classList.add("hidden");
      }
    }

    function showMessage(messageText) {
      const messageContainer = document.querySelector("#payment-message");
      messageContainer.textContent = messageText;
      messageContainer.style.display = "block";
      setTimeout(() => {
        messageContainer.style.display = "none";
      }, 4000);
    }

    // Function to update shipping cost when address is entered
    function updateShipping() {
      const addressFields = [
        document.querySelector('input[placeholder="Förnamn"]').value.trim(),
        document.querySelector('input[placeholder="Efternamn"]').value.trim(),
        document.querySelector('input[placeholder="Adress"]').value.trim(),
        document.querySelector('input[placeholder="Postnummer"]').value.trim(),
        document.querySelector('input[placeholder="Stad"]').value.trim()
      ];
      
      // Check if at least address, postal code and city are filled
      const hasBasicAddress = addressFields[2] && addressFields[3] && addressFields[4];
      
      const shippingElement = document.getElementById('shipping-cost');
      
      if (hasBasicAddress) {
        shippingElement.textContent = '99 kr';
        shippingElement.classList.remove('text-gray-500');
        shippingElement.classList.add('text-gray-900');
      } else {
        shippingElement.textContent = 'Ange leveransadress';
        shippingElement.classList.remove('text-gray-900');
        shippingElement.classList.add('text-gray-500');
      }
      
      // Update the total calculation
      updateCheckoutTotals();
    }

    // Function to validate Swedish address format
    function validateAddress() {
      const address = document.getElementById('address').value.trim();
      const postalCode = document.getElementById('postalCode').value.trim();
      const city = document.getElementById('city').value.trim();
      const messageElement = document.getElementById('address-validation-message');
      
      let errors = [];
      let hasValidFields = true;
      
      // Validate postal code format (Swedish format: XXXXX or XXX XX)
      if (postalCode) {
        // Remove spaces and normalize
        const normalizedPostalCode = postalCode.replace(/\s/g, '');
        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(normalizedPostalCode)) {
          errors.push('Postnummer måste vara 5 siffror (t.ex. 11122 eller 111 22)');
          hasValidFields = false;
        }
      }
      
      // Validate address format (should contain at least street name and number)
      if (address) {
        // More flexible address regex that accepts Swedish address formats
        const addressRegex = /^[A-Za-zÅÄÖåäö\s]+\s+\d+[A-Za-z]?(\s*-\s*\d+[A-Za-z]?)?(\s+[A-Za-zÅÄÖåäö\s\d]*)?$/;
        if (address.length < 5 || !addressRegex.test(address)) {
          errors.push('Adress måste innehålla gatunamn och nummer (t.ex. "Storgatan 12" eller "Kungsgatan 15A")');
          hasValidFields = false;
        }
      }
      
      // Validate city format (only letters, spaces, and Swedish characters)
      if (city) {
        const cityRegex = /^[A-Za-zÅÄÖåäö\s\-]+$/;
        if (city.length < 2 || !cityRegex.test(city)) {
          errors.push('Stad får endast innehålla bokstäver, mellanslag och bindestreck');
          hasValidFields = false;
        }
      }
      
      // Update field styling
      const addressField = document.getElementById('address');
      const postalCodeField = document.getElementById('postalCode');
      const cityField = document.getElementById('city');
      
      // Reset all field styling first
      [addressField, postalCodeField, cityField].forEach(field => {
        field.classList.remove('border-red-500');
      });
      
      // Add red border to invalid fields
      if (postalCode && postalCode.replace(/\s/g, '').length > 0) {
        const normalizedPostalCode = postalCode.replace(/\s/g, '');
        if (!/^\d{5}$/.test(normalizedPostalCode)) {
          postalCodeField.classList.add('border-red-500');
        }
      }
      
      if (address && address.length > 0) {
        const addressRegex = /^[A-Za-zÅÄÖåäö\s]+\s+\d+[A-Za-z]?(\s*-\s*\d+[A-Za-z]?)?(\s+[A-Za-zÅÄÖåäö\s\d]*)?$/;
        if (address.length < 5 || !addressRegex.test(address)) {
          addressField.classList.add('border-red-500');
        }
      }
      
      if (city && city.length > 0) {
        const cityRegex = /^[A-Za-zÅÄÖåäö\s\-]+$/;
        if (city.length < 2 || !cityRegex.test(city)) {
          cityField.classList.add('border-red-500');
        }
      }
      
      // Show validation message
      if (errors.length > 0 && (address || postalCode || city)) {
        messageElement.innerHTML = errors.join('<br>');
        messageElement.style.display = 'block';
        messageElement.className = 'validation-message text-red-500 text-sm mt-2';
        return false;
      } else {
        // Clear any previous error messages
        messageElement.style.display = 'none';
        
        // Show success message if all required fields are filled and valid
        if (address && postalCode && city && hasValidFields) {
          messageElement.innerHTML = '✓ Adress verifierad';
          messageElement.style.display = 'block';
          messageElement.className = 'validation-message text-green-600 text-sm mt-2';
          
          // Update shipping after successful validation
          updateShipping();
        }
        
        return hasValidFields && address && postalCode && city;
      }
    }

    // Function to validate email format
    function validateEmail() {
      const email = document.getElementById('email').value.trim();
      const messageElement = document.getElementById('email-validation-message');
      const emailField = document.getElementById('email');
      
      // Reset styling
      emailField.classList.remove('border-red-500');
      
      if (email) {
        // Comprehensive email validation regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(email)) {
          messageElement.innerHTML = 'Ange en giltig e-postadress (t.ex. namn@exempel.se)';
          messageElement.style.display = 'block';
          messageElement.className = 'validation-message text-red-500 text-sm mb-2';
          emailField.classList.add('border-red-500');
          return false;
        } else {
          // Valid email
          messageElement.innerHTML = '✓ E-post verifierad';
          messageElement.style.display = 'block';
          messageElement.className = 'validation-message text-green-600 text-sm mb-2';
          return true;
        }
      } else {
        // Empty email - hide message
        messageElement.style.display = 'none';
        return false;
      }
    }

    // Function to update checkout totals including shipping
    function updateCheckoutTotals() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = Math.round(subtotal * 0.2); // 20% moms
      
      // Check if shipping should be added
      const shippingElement = document.getElementById('shipping-cost');
      const shipping = shippingElement.textContent === '99 kr' ? 99 : 0;
      const total = subtotal + shipping;
      
      document.getElementById('checkout-cart-subtotal').textContent = `${subtotal} kr`;
      document.getElementById('checkout-cart-tax').textContent = `${tax} kr`;
      document.getElementById('checkout-cart-total').textContent = `${total} kr`;
      
      // Re-initialize Stripe with new total if shipping changed
      if (shipping > 0 && elements) {
        console.log('Shipping added, re-initializing Stripe with new total:', total);
        initializeStripe(); // Re-initialize with shipping included
      }
    }

    // Function to send professional order emails (customer confirmation + admin notification)
    async function sendOrderEmails(customerData, cart, subtotal, shipping, orderTotal) {
      try {
        // Generate order number
        const orderNumber = Date.now().toString().slice(-6);
        
        // Format order items for plain text (admin email)
        const orderItemsText = cart.map(item => 
          `${item.name}${item.variant ? ` (${item.variant})` : ''} - Antal: ${item.quantity} - Pris: ${item.price * item.quantity} kr`
        ).join('\n');
        
        // Format order items for HTML (customer email)
        const orderItemsHtml = cart.map(item => `
          <div style="display: flex; padding: 15px; border-bottom: 1px solid #eee; align-items: center;">
            <img src="${item.thumbnail || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                 style="width: 60px; height: 60px; object-fit: contain; margin-right: 15px; border-radius: 4px; border: 1px solid #eee;" 
                 alt="${item.name}">
            <div style="flex: 1;">
              <div style="font-weight: 600; margin-bottom: 4px; color: #333;">${item.name}</div>
              ${item.description ? `<div style="color: #666; font-size: 14px; margin-bottom: 4px;">${item.description}</div>` : ''}
              ${item.variant ? `<div style="color: #888; font-size: 13px; margin-bottom: 8px;">${item.variant}</div>` : ''}
              <div style="color: #333; font-size: 14px;">
                <span style="color: #666;">Antal: ${item.quantity} × ${item.price} kr = </span>
                <strong style="color: #000;">${item.price * item.quantity} kr</strong>
              </div>
            </div>
          </div>
        `).join('');
        
        const now = new Date();
        const orderDate = now.toLocaleDateString('sv-SE');
        const orderTime = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
        
        // Common email parameters
        const baseEmailParams = {
          order_number: orderNumber,
          order_date: orderDate,
          order_time: orderTime,
          order_total: orderTotal,
          customer_name: `${customerData.firstName} ${customerData.lastName}`,
          customer_email: customerData.email,
          customer_phone: customerData.phone || 'Ej angivet',
          customer_address: customerData.address,
          customer_postal_code: customerData.postalCode,
          customer_city: customerData.city,
          order_items: orderItemsText,
          order_items_html: orderItemsHtml,
          order_subtotal: `${subtotal} kr`,
          order_shipping: `${shipping} kr`
        };

        console.log('Sending order emails...', baseEmailParams);
        
        // Send customer confirmation email from info@mavidesign.se
        // Include BCC to Trustpilot for automatic review invitation
        // NOTE: If BCC doesn't work with your EmailJS service, the fallback method below will send a separate copy
        const customerEmailParams = {
          ...baseEmailParams,
          to_email: customerData.email,
          to_name: `${customerData.firstName} ${customerData.lastName}`,
          from_name: 'MAVI Design',
          from_email: 'info@mavidesign.se',
          // BCC Trustpilot for automatic review invitation
          bcc_email: 'mavidesign.se+3b19644966@invite.trustpilot.com'
        };
        
        await emailjs.send(
          EMAILJS_CONFIG.stratoServiceId,
          EMAILJS_CONFIG.customerTemplateId,
          customerEmailParams
        );
        
        console.log('Customer confirmation email sent successfully');
        
        // Fallback: Send separate email to Trustpilot for review invitation
        // (Use this if BCC doesn't work with your EmailJS service)
        try {
          const trustpilotEmailParams = {
            ...baseEmailParams,
            to_email: 'mavidesign.se+3b19644966@invite.trustpilot.com',
            to_name: 'Trustpilot Review System',
            from_name: 'MAVI Design',
            from_email: 'info@mavidesign.se'
          };
          
          await emailjs.send(
            EMAILJS_CONFIG.stratoServiceId,
            EMAILJS_CONFIG.customerTemplateId,
            trustpilotEmailParams
          );
          
          console.log('Trustpilot invitation email sent successfully');
        } catch (trustpilotError) {
          console.warn('Failed to send Trustpilot invitation email:', trustpilotError);
          // Don't fail the entire order process if Trustpilot email fails
        }
        
        // Send admin notification email
        const adminEmailParams = {
          ...baseEmailParams,
          to_email: 'viktor.lehtonen@gmail.com',
          to_name: 'Viktor Lehtonen',
          from_name: 'MAVI Webshop',
          from_email: 'info@mavidesign.se'
        };
        
        await emailjs.send(
          EMAILJS_CONFIG.stratoServiceId,
          EMAILJS_CONFIG.adminTemplateId,
          adminEmailParams
        );
        
        console.log('Admin notification email sent successfully');
        
        return { success: true, orderNumber };
        
      } catch (error) {
        console.error('Failed to send order emails:', error);
        return { success: false, error: error.message };
      }
    }

    // Simple JS to render cart items from localStorage
    function renderCheckoutCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Migrate old cart items to use consistent URL structure (same as cart.js)
      const migratedCart = cart.map(item => {
        if (item.thumbnail && !item.thumbnail.startsWith('http') && !item.thumbnail.includes(getBaseUrl())) {
          // Fix old thumbnail paths
          if (item.thumbnail.startsWith('/img/')) {
            item.thumbnail = getBaseUrl() + item.thumbnail.substring(1);
          } else if (!item.thumbnail.includes('img/')) {
            item.thumbnail = getBaseUrl() + 'img/' + item.thumbnail;
          }
        }
        return item;
      });
      
      // Save the migrated cart back to localStorage
      if (JSON.stringify(cart) !== JSON.stringify(migratedCart)) {
        localStorage.setItem('cart', JSON.stringify(migratedCart));
      }
      
      const container = document.getElementById('checkout-cart-items');
      const subtotalSpan = document.getElementById('checkout-cart-subtotal');
      const totalSpan = document.getElementById('checkout-cart-total');
      const taxSpan = document.getElementById('checkout-cart-tax');
      let subtotal = 0;
      let tax = 0;
      if (migratedCart.length === 0) {
        container.innerHTML = '<div class="text-gray-500 text-center">Din varukorg är tom.</div>';
        subtotalSpan.textContent = '0 kr';
        totalSpan.textContent = '0 kr';
        taxSpan.textContent = '0 kr';
        return;
      }
      container.innerHTML = migratedCart.map(item => {
        // Now all items should have consistent URL structure
        let imageUrl = item.thumbnail || 'https://via.placeholder.com/56x56?text=No+Image';
        
        return `
        <div class="flex flex-col gap-2 border-b border-gray-200 pb-4 last:border-b-0">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3 min-w-0 relative">
              <div class="relative">
                <img src="${imageUrl}" alt="${item.name}" class="w-14 h-14 object-contain bg-gray-100 border flex-shrink-0 rounded" />
                <span class="absolute -top-2 -right-2 bg-gray-700 bg-opacity-95 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center border border-white shadow">
                  ${item.quantity}
                </span>
              </div>
              <div class="min-w-0">
                <div class="font-medium text-base text-gray-900 truncate">${item.name}</div>
                <div class="text-sm text-gray-500 truncate">${item.description || ''}</div>
                <div class="text-xs text-gray-400 truncate">${item.variant || ''}</div>
              </div>
            </div>
            <div class="font-semibold text-base text-right whitespace-nowrap">${item.price * item.quantity} kr</div>
          </div>
        </div>
      `;}).join('');
      subtotal = migratedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      tax = Math.round(subtotal * 0.2); // 20% moms
      subtotalSpan.textContent = `${subtotal} kr`;
      totalSpan.textContent = `${subtotal} kr`; // Will be updated by updateCheckoutTotals if shipping is added
      taxSpan.textContent = `${tax} kr`;
      
      // Update totals to include shipping if address is entered
      updateCheckoutTotals();
    }
    renderCheckoutCart();
    
    // Initialize Stripe when page loads
    initializeStripe();

    // Add event listener to form
    document.querySelector('form').addEventListener('submit', handleSubmit);

    // Optional: Update cart count in header if you want live updates
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
      }
    }
    updateCartCount();

    // Rabattkod (discount code) logic
    document.getElementById('discount-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const code = document.getElementById('discount-code').value.trim();
      const msg = document.getElementById('discount-message');
      
      // Lista över giltiga rabattkoder (tom för närvarande)
      const validDiscountCodes = [
        // 'SOMMAR2025',
        // 'STUDENT10',
        // 'VIP15'
      ];
      
      if (code.length > 0) {
        if (validDiscountCodes.includes(code.toUpperCase())) {
          msg.textContent = 'Rabattkod "' + code + '" har lagts till';
          msg.className = 'text-green-600 text-sm mt-2';
          msg.style.display = 'block';
          // Här kan du lägga till logik för att faktiskt applicera rabatten
        } else {
          msg.textContent = 'Ogiltig kod';
          msg.className = 'text-red-600 text-sm mt-2';
          msg.style.display = 'block';
        }
      } else {
        msg.textContent = '';
        msg.style.display = 'none';
      }
    });