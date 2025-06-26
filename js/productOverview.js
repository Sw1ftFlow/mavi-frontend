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

    // Use the new img column (JSON array) for carousel images
    let images = [];
    try {
      images = Array.isArray(data.img) ? data.img : JSON.parse(data.img);
    } catch {
      images = [];
    }
    if (!images.length && data.image) images = [data.image];

    // Set main image to first in array, or fallback
    let imageUrl = images[0] ? `/img/${images[0]}` : 'https://via.placeholder.com/600x600?text=No+Image';

    // If your feature column is a comma-separated string:
    const features = data.feature ? data.feature.split(',').map(f => f.trim()) : [];

    // Generate feature list HTML
    const featureList = features.length
      ? `<ul class="list-disc pl-6 space-y-1">${features.map(f => `<li>${f}</li>`).join('')}</ul>`
      : `<p class="text-gray-500">No features listed.</p>`;

    // Unique IDs for the accordions
    const featureAccordionId = `feature-accordion-${id}`;
    const shippingAccordionId = `shipping-accordion-${id}`;
    const returnAccordionId = `return-accordion-${id}`;

    const shippingItems = data.shipping
      ? data.shipping.split(/,|\n/).map(s => s.trim()).filter(Boolean)
      : [];
    const shippingList = shippingItems.length
      ? `<ul class="list-disc pl-6 space-y-1">${shippingItems.map(s => `<li>${s}</li>`).join('')}</ul>`
      : `<ul class="list-disc pl-6 space-y-1"><li class="text-gray-500">No shipping info.</li></ul>`;

    const returnItems = data.return
      ? data.return.split(/,|\n/).map(r => r.trim()).filter(Boolean)
      : [];
    const returnList = returnItems.length
      ? `<ul class="list-disc pl-6 space-y-1">${returnItems.map(r => `<li>${r}</li>`).join('')}</ul>`
      : `<ul class="list-disc pl-6 space-y-1"><li class="text-gray-500">No return policy.</li></ul>`;

    // Render the Tailwind UI Product Overview component with pure CSS accordions
    document.getElementById('product-overview').innerHTML = `
      <div class="bg-white max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="flex flex-col h-full">
          <div class="relative bg-[#f5f5f5] flex-1 flex items-start justify-start overflow-hidden min-h-0 min-w-0">
            <button type="button" class="main-carousel-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 text-black w-10 h-10 flex items-center justify-center text-4xl font-light opacity-80 hover:opacity-100 hover:bg-white transition" style="outline:none; border:none; background:transparent;">
              &#8249;
            </button>
            <img id="main-product-image" src="${imageUrl}" alt="${data.name}" class="w-full h-full object-contain transition-all duration-300" style="display:block;" />
            <button type="button" class="main-carousel-next absolute right-2 top-1/2 -translate-y-1/2 z-20 text-black w-10 h-10 flex items-center justify-center text-4xl font-light opacity-80 hover:opacity-100 hover:bg-white transition" style="outline:none; border:none; background:transparent;">
              &#8250;
            </button>
          </div>
          <div class="relative mt-4 flex items-center">
            <button type="button" 
              class="carousel-prev -ml-8 text-black w-8 h-8 flex items-center justify-center text-3xl font-light opacity-80 hover:opacity-100 hover:bg-white transition"
              style="outline:none; border:none; background:transparent;" disabled>
              &#8249;
            </button>
            <div class="overflow-hidden w-full px-10">
              <div class="carousel-track flex gap-4 transition-transform duration-300">
                ${images.map((img, i) => `
<img src="/img/${img}" alt="Thumbnail ${i+1}" class="carousel-thumb h-24 w-24 object-cover cursor-pointer bg-white" data-index="${i}">
`).join('')}
              </div>
            </div>
            <button type="button" 
              class="carousel-next -mr-8 text-black w-8 h-8 flex items-center justify-center text-3xl font-light opacity-80 hover:opacity-100 hover:bg-white transition"
              style="outline:none; border:none; background:transparent;">
              &#8250;
            </button>
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-black mb-2">${data.name}</h1>
          <p class="text-lg text-black mb-2">${data.price} kr</p>
          <p class="mb-6 text-gray-500">${data.description || ''}</p>
          <div class="flex items-center gap-4 mb-8">
            <div class="flex items-center border border-gray-300 rounded-[8px]">
              <button type="button" class="quantity-decrease px-3 py-2 text-xl font-bold text-black hover:bg-gray-100">−</button>
              <span class="quantity-value px-4 py-2 select-none text-lg font-semibold text-black">1</span>
              <button type="button" class="quantity-increase px-3 py-2 text-xl font-bold text-black hover:bg-gray-100">+</button>
            </div>
            <button class="border border-black text-black px-8 py-3 rounded-[8px] font-semibold hover:bg-black hover:text-white transition">Add to Cart</button>
          </div>
          <div class="mt-8 space-y-2">

            <!-- Accordion for Features -->
            <div class="mb-4 bg-white rounded-[8px]">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="features-content-${id}">
                <span class="title text-black">Features</span>
                <span class="toggle-icon text-3xl font-light leading-none text-gray-400">+</span>
              </label>
              <div id="features-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white border-t border-gray-100">
                <div class="text-gray-500 py-2">
                  ${featureList}
                </div>
              </div>
            </div>

            <!-- Accordion for Shipping -->
            <div class="mb-4 bg-white rounded-lg">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="shipping-content-${id}">
                <span class="title text-gray-900">Shipping</span>
                <span class="toggle-icon text-3xl font-light leading-none text-gray-400">+</span>
              </label>
              <div id="shipping-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                <div class="text-gray-600 py-2">
                  ${shippingList}
                </div>
              </div>
            </div>

            <!-- Accordion for Return -->
            <div class="mb-4 bg-white rounded-lg">
              <label class="accordion-toggle flex items-center justify-between w-full px-4 py-3 text-left font-semibold cursor-pointer select-none" data-target="return-content-${id}">
                <span class="title text-gray-900">Return</span>
                <span class="toggle-icon text-3xl font-light leading-none text-gray-400">+</span>
              </label>
              <div id="return-content-${id}" class="accordion-content max-h-0 overflow-hidden transition-all duration-300 px-4 bg-white rounded-b-lg border border-t-0 border-gray-200">
                <div class="text-gray-600 py-2">
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

    // Carousel logic
    let carouselIndex = 0;
    const visibleCount = 4;
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const mainImage = document.getElementById('main-product-image');
    const thumbs = document.querySelectorAll('.carousel-thumb');

    function updateCarousel() {
      const thumbWidth = thumbs[0]?.offsetWidth || 64;
      const gap = 16; // gap-4 = 1rem = 16px
      const offset = carouselIndex * (thumbWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      prevBtn.disabled = carouselIndex === 0;
      nextBtn.disabled = carouselIndex >= images.length - visibleCount;
    }
    if (track && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        if (carouselIndex > 0) {
          carouselIndex--;
          updateCarousel();
        }
      });
      nextBtn.addEventListener('click', () => {
        if (carouselIndex < images.length - visibleCount) {
          carouselIndex++;
          updateCarousel();
        }
      });
      updateCarousel();
      // Click thumbnail to change main image
      thumbs.forEach(img => {
        img.addEventListener('click', () => {
          mainImage.src = img.src;
        });
      });
    }

    // Main image carousel logic
    let mainImageIndex = 0;
    const mainImageEl = document.getElementById('main-product-image');
    const mainPrevBtn = document.querySelector('.main-carousel-prev');
    const mainNextBtn = document.querySelector('.main-carousel-next');

    function updateMainImage() {
      mainImageEl.src = `/img/${images[mainImageIndex]}`;
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
}

loadProduct();
