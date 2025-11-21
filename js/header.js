document.addEventListener('DOMContentLoaded', async () => { 
  var logoUrl = `${getBaseUrl()}img/logo2.png`;
  var logoText = `<span class="text-xl font-semibold tracking-tight text-black" style="font-family: 'Inter', sans-serif;">MAVI</span>`;

  const headerHTML = `
    <header class="bg-white" style="font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">
      <!-- Desktop Layout -->
      <div class="container mx-auto px-4 py-4 hidden lg:flex justify-between items-center">
        <a href="index.html" class="flex items-center gap-3"><img src="${logoUrl}" alt="Logo" class="h-10 w-auto object-contain" />${logoText}</a>
        <!-- Desktop Navigation -->
        <nav>
          <ul class="flex space-x-6">
            <li><a href="index.html" class="text-gray-700 hover:text-blue-700">Hem</a></li>
            <li><a href="product.html" class="text-gray-700 hover:text-blue-700">Kollektion</a></li>
            <li><a href="contact.html" class="text-gray-700 hover:text-blue-700">Kontakt</a></li>
          </ul>
        </nav>

        <!-- Desktop Cart -->
        <div class="flex items-center">
          <button id="cart-open" class="relative px-2 py-2 rounded transition cursor-pointer" aria-label="Öppna varukorg" style="background: none;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" class="w-6 h-6 stroke-black" stroke="currentColor" stroke-width="1.3">
              <rect x="5" y="9" width="18" height="13" rx="3" />
              <path d="M9 9V7a5 5 0 0 1 10 0v2" />
            </svg>
            <span id="cart-count"
              class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px] font-medium border-2 border-white select-none"
              style="font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; display: none;">
              0
            </span>
          </button>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="container mx-auto px-4 py-4 lg:hidden flex items-center">
        <!-- Mobile Menu Toggle (Left) -->
        <button id="mobile-menu-toggle" class="p-3 rounded-md hover:bg-gray-100 transition-colors" aria-label="Öppna meny">
          <svg id="menu-icon" class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg id="close-icon" class="w-7 h-7 text-gray-700 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Logo (Center) -->
        <div class="flex-1 flex justify-center">
          <a href="index.html" class="flex items-center gap-2"><img src="${logoUrl}" alt="Logo" class="h-8 w-auto object-contain" />${logoText}</a>
        </div>

        <!-- Cart Button (Right) -->
        <button id="cart-open-mobile" class="relative px-2 py-2 rounded transition cursor-pointer" aria-label="Öppna varukorg" style="background: none;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" class="w-6 h-6 stroke-black" stroke="currentColor" stroke-width="1.3">
            <rect x="5" y="9" width="18" height="13" rx="3" />
            <path d="M9 9V7a5 5 0 0 1 10 0v2" />
          </svg>
          <span id="cart-count-mobile"
            class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px] font-medium border-2 border-white select-none"
            style="font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; display: none;">
            0
          </span>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div id="mobile-menu" class="lg:hidden hidden bg-white border-t border-gray-200">
        <nav class="container mx-auto px-4 py-4">
          <ul class="space-y-4">
            <li><a href="index.html" class="block text-gray-700 hover:text-blue-700 py-2 text-lg">Hem</a></li>
            <li><a href="product.html" class="block text-gray-700 hover:text-blue-700 py-2 text-lg">Kollektion</a></li>
            <li><a href="contact.html" class="block text-gray-700 hover:text-blue-700 py-2 text-lg">Kontakt</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.innerHTML = headerHTML;
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
  }
});

function initializeMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileMenuToggle && mobileMenu && menuIcon && closeIcon) {
    mobileMenuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        // Show menu
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        // Hide menu
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    });
  }

  // Handle both desktop and mobile cart buttons
  const cartButton = document.getElementById('cart-open');
  const cartButtonMobile = document.getElementById('cart-open-mobile');
  
  if (cartButton && window.openCart) {
    cartButton.addEventListener('click', window.openCart);
  }
  
  if (cartButtonMobile && window.openCart) {
    cartButtonMobile.addEventListener('click', window.openCart);
  }

  // Initialize cart count using global system
  if (window.globalCart) {
    window.globalCart.updateCartCount();
  } else if (window.updateCartCount) {
    window.updateCartCount();
  }
}