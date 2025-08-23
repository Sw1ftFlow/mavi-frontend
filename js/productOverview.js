const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnN2dnp1a3RpcnBkaWN3Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg2MzAsImV4cCI6MjA2NjQyNDYzMH0.LAJmKc1RiJT-JSNqucL8cWq8ogtrswysG1A5K1bmCh4';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        document.getElementById('product-overview').innerHTML = '<p class="text-red-500">Product not found.</p>';
        return;
    }

    console.log('data.thumbnail:', data.thumbnail);

    // Use the new img column (JSON array) for carousel images
    let images = [];
    try {
      images = Array.isArray(data.img) ? data.img : JSON.parse(data.img);
    } catch {
      images = [];
    }
    if (!images.length && data.image) images = [data.image];

    // Set main image to first in array, or fallback
    let imageUrl = images[0] ? `${getBaseUrl()}img/${images[0]}` : 'https://via.placeholder.com/600x600?text=No+Image';

    // If your feature column is a comma-separated string:
    const features = data.beskrivning ? data.beskrivning.split(/\r?\n/).map(f => f.trim()).filter(Boolean) : [];

    // Generate feature list HTML
    const featureList = features.length
      ? `<div class="text-gray-500 space-y-2">${features.map(f => `<p>${f}</p>`).join('')}</div>`
      : `<p class="text-gray-500">No features listed.</p>`;

    // Unique IDs for the accordions
    const featureAccordionId = `feature-accordion-${id}`;
    const shippingAccordionId = `shipping-accordion-${id}`;
    const returnAccordionId = `return-accordion-${id}`;

    const shippingItems = data.specifikationer
      ? data.specifikationer.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
      : [];
    const shippingList = shippingItems.length
      ? `<div class="text-gray-500 space-y-1">${shippingItems.map(s => `<p>${s}</p>`).join('')}</div>`
      : `<div class="text-gray-500"><p>No specifications available.</p></div>`;

    const returnItems = data.frakt
      ? data.frakt.split(/\r?\n/).map(r => r.trim()).filter(Boolean)
      : [];
    const returnList = returnItems.length
      ? `<div class="text-gray-500 space-y-1">${returnItems.map(r => `<p>${r}</p>`).join('')}</div>`
      : `<div class="text-gray-500"><p>No shipping info.</p></div>`;

    // Render the Tailwind UI Product Overview component with pure CSS accordions
    document.getElementById('product-overview').innerHTML = `
      <div class="bg-white w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-6">
        <div class="flex flex-col h-full">
          <div class="relative flex-1 flex items-start justify-start overflow-hidden min-h-0 min-w-0 bg-[#f5f5f5]">
            <button type="button" class="main-carousel-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 text-black w-10 h-10 flex items-center justify-center text-4xl font-light opacity-80 hover:opacity-100 hover:bg-white transition" style="outline:none; border:none; background:transparent;">
              &#8249;
            </button>
            <img id="main-product-image" src="${imageUrl}" alt="${data.name}" class="w-full aspect-[4/3] object-contain transition-all duration-300" style="display:block;" />
            <button type="button" class="main-carousel-next absolute right-2 top-1/2 -translate-y-1/2 z-20 text-black w-10 h-10 flex items-center justify-center text-4xl font-light opacity-80 hover:opacity-100 hover:bg-white transition" style="outline:none; border:none; background:transparent;">
              &#8250;
            </button>
          </div>
          <div class="mt-4 flex justify-center">
            <div class="flex gap-4">
              ${images.map((img, i) => `
<img src="${getBaseUrl()}img/${img}" alt="Thumbnail ${i+1}" class="carousel-thumb h-24 w-24 object-contain cursor-pointer bg-white" data-index="${i}">
`).join('')}
            </div>
          </div>
        </div>
        <div class="pl-8 pr-12"> <!-- Increased right padding from pr-6 to pr-12 -->
          <h1 class="text-2xl font-semibold text-black mb-1">${data.name}</h1>
          <p class="mb-4 text-sm text-gray-500">${data.description || ''}</p>
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center border border-gray-300 rounded-none h-10">
              <button type="button" class="quantity-decrease px-2 py-1 text-sm font-bold text-black hover:bg-gray-100 h-10">−</button>
              <span class="quantity-value px-3 py-1 select-none text-sm font-semibold text-black h-10 flex items-center">1</span>
              <button type="button" class="quantity-increase px-2 py-1 text-sm font-bold text-black hover:bg-gray-100 h-10">+</button>
            </div>
            <div class="flex w-full max-w-xs lg:max-w-md">
              <button class="flex-1 border-none bg-black text-white px-4 py-2 rounded-none font-semibold flex items-center justify-between transition hover:bg-gray-900 text-sm h-10">
                <span class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h8a1 1 0 011 1v7" />
                  </svg>
                  <span class="text-sm">Lägg i varukorgen</span>
                </span>
                <span class="text-sm text-white font-semibold ml-2">${data.price} kr</span>
              </button>
            </div>
          </div>
          <div class="mt-6 space-y-1 text-sm">

            <!-- Accordion for Features (now Beskrivning) -->
            <div class="mb-4 bg-white rounded-[8px]">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="features-content-${id}">
                <span class="title text-black">Beskrivning</span>
                <span class="toggle-icon text-2xl font-thin leading-none text-gray-400" style="font-family: 'Inter', sans-serif;">+</span>
              </label>
              <div id="features-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white border-t border-gray-100">
                <div class="text-gray-500 py-2">
                  ${featureList}
                </div>
              </div>
            </div>

            <!-- Accordion for Shipping (now Specifikationer) -->
            <div class="mb-4 bg-white rounded-[8px]">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="shipping-content-${id}">
                <span class="title text-gray-900">Specifikationer</span>
                <span class="toggle-icon text-2xl font-thin leading-none text-gray-400" style="font-family: 'Inter', sans-serif;">+</span>
              </label>
              <div id="shipping-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white border-t border-gray-100">
                <div class="py-2">
                  ${shippingList}
                </div>
              </div>
            </div>

            <!-- Accordion for Return (now Frakt & Retur) -->
            <div class="mb-4 bg-white rounded-[8px]">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="return-content-${id}">
                <span class="title text-gray-900">Frakt & Retur</span>
                <span class="toggle-icon text-2xl font-thin leading-none text-gray-400" style="font-family: 'Inter', sans-serif;">+</span>
              </label>
              <div id="return-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white border-t border-gray-100">
                <div class="py-2">
                  ${returnList}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    // JS toggle for all accordions
    document.querySelectorAll('.accordion-toggle').forEach(label => {
      label.addEventListener('click', () => {
        const icon = label.querySelector('.toggle-icon');
        const title = label.querySelector('.title');
        const targetId = label.getAttribute('data-target');
        const content = document.getElementById(targetId);

        // Toggle content visibility
        if (content.classList.contains('max-h-0')) {
          content.classList.remove('max-h-0', 'py-0');
          content.classList.add('max-h-96', 'py-2');
          icon.textContent = '−';
          title.classList.remove('text-gray-900', 'text-black');
          title.classList.add('text-black');
          icon.classList.remove('text-gray-400');
          icon.classList.add('text-black');
        } else {
          content.classList.add('max-h-0', 'py-0');
          content.classList.remove('max-h-96', 'py-2');
          icon.textContent = '+';
          title.classList.remove('text-black');
          title.classList.add('text-gray-900');
          icon.classList.remove('text-black');
          icon.classList.add('text-gray-400');
        }
      });
    });

    // Thumbnail logic for changing main image
    const mainImage = document.getElementById('main-product-image');
    const thumbs = document.querySelectorAll('.carousel-thumb');

    // Click thumbnail to change main image
    thumbs.forEach(img => {
      img.addEventListener('click', () => {
        mainImage.src = img.src;
      });
    });

    // Main image carousel logic
    let mainImageIndex = 0;
    const mainImageEl = document.getElementById('main-product-image');
    const mainPrevBtn = document.querySelector('.main-carousel-prev');
    const mainNextBtn = document.querySelector('.main-carousel-next');

    function updateMainImage() {
      mainImageEl.src = `${getBaseUrl()}img/${images[mainImageIndex]}`;
      mainPrevBtn.disabled = mainImageIndex === 0;
      mainNextBtn.disabled = mainImageIndex === images.length - 1;
    }

    if (mainPrevBtn && mainNextBtn && mainImageEl) {
      mainPrevBtn.addEventListener('click', () => {
        if (mainImageIndex > 0) {
          mainImageIndex--;
          updateMainImage();
        }
      });
      mainNextBtn.addEventListener('click', () => {
        if (mainImageIndex < images.length - 1) {
          mainImageIndex++;
          updateMainImage();
        }
      });
      // Thumbnail click to change main image and update index
      document.querySelectorAll('.carousel-thumb').forEach((img, i) => {
        img.addEventListener('click', () => {
          mainImageIndex = i;
          updateMainImage();
        });
      });
      updateMainImage();
    }

    // Quantity logic
    let quantity = 1;
    const quantityValue = document.querySelector('.quantity-value');
    document.querySelector('.quantity-decrease').addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
      }
    });
    document.querySelector('.quantity-increase').addEventListener('click', () => {
      quantity++;
      quantityValue.textContent = quantity;
    });

    // Add to cart logic
    const addToCartBtn = document.querySelector('button.flex-1.bg-black');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        // Get current cart from localStorage or initialize
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Check if product already in cart
        const existing = cart.find(item => item.id === data.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push({
            id: data.id,
            name: data.name,
            price: data.price,
            thumbnail: data.thumbnail ? `${getBaseUrl()}img/${data.thumbnail}` : '',
            description: data.description,
            stock: data.stock, // Add stock information
            quantity: quantity
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count in header
        const cartCount = document.getElementById('cart-count');
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
          cartCount.textContent = totalCount;
          cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
        }
      });
    }

    // Global add to cart function
    window.addToCart = function(product) {
      // Get current cart from localStorage or initialize
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      // Check if product already in cart
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description, // <-- Add this line
          quantity: product.quantity || 1 // or selected quantity
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));

      // Update cart count in header
      const cartCount = document.getElementById('cart-count');
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartCount) {
        cartCount.textContent = totalCount;
        cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
      }
    }

    // Update cart count function
    window.updateCartCount = function() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const cartCount = document.getElementById('cart-count');
      if (cartCount) {
        cartCount.textContent = totalCount;
        cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
      }
    }
}

loadProduct();
