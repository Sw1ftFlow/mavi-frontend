// Simple cart drawer logic
document.addEventListener('DOMContentLoaded', () => {
  function setupCartDrawer() {
    const openBtn = document.getElementById('cart-open');
    const closeBtn = document.getElementById('cart-close');
    const backdrop = document.getElementById('cart-backdrop');
    const drawer = document.getElementById('cart-drawer');
    const cartCount = document.getElementById('cart-count');

    if (openBtn && closeBtn && backdrop && drawer) {
      openBtn.addEventListener('click', () => {
        renderCart(); // <-- Make sure this is called!
        backdrop.classList.remove('hidden');
        drawer.classList.remove('translate-x-full');
      });
      closeBtn.addEventListener('click', () => {
        backdrop.classList.add('hidden');
        drawer.classList.add('translate-x-full');
      });
      backdrop.addEventListener('click', () => {
        backdrop.classList.add('hidden');
        drawer.classList.add('translate-x-full');
      });
    } else {
      setTimeout(setupCartDrawer, 100);
    }

    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.style.display = cartItemCount > 0 ? 'flex' : 'none';
      cartCount.textContent = cartItemCount;
    }
  }
  setupCartDrawer();

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full py-16">
          <div class="text-gray-900 text-lg font-semibold mb-2">Din varukorg är tom</div>
          <button onclick="window.location.href='index.html'" class="mt-6 px-6 py-3 bg-black text-white rounded-none font-semibold text-base hover:bg-gray-900 transition cursor-pointer">
            Börja handla
          </button>
        </div>
      `;
      cartTotal.textContent = '0 kr';
      // Hide the checkout button when cart is empty
      const checkoutBtn = document.querySelector('#cart-drawer button.w-full.bg-black');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    } else {
      // Show the checkout button when cart is not empty
      const checkoutBtn = document.querySelector('#cart-drawer button.w-full.bg-black');
      if (checkoutBtn) {
        checkoutBtn.style.display = '';
        checkoutBtn.onclick = () => {
          window.location.href = 'checkout.html';
        };
      }
    }

    cartItems.innerHTML = cart.map((item, idx) => {
      total += item.price * item.quantity;
      
      // Handle image URL consistently
      let imageUrl = '';
      if (item.thumbnail) {
        // If thumbnail already includes the full path (starts with http or includes /img/), use it directly
        if (item.thumbnail.startsWith('http') || item.thumbnail.includes('/img/')) {
          imageUrl = item.thumbnail;
        } else {
          // If it's just a filename, build the full path
          imageUrl = getBaseUrl() + 'img/' + item.thumbnail;
        }
      } else if (item.image) {
        imageUrl = getBaseUrl() + 'img/' + item.image;
      } else {
        imageUrl = 'https://via.placeholder.com/80x80?text=No+Image';
      }
      
      return `
        <div class="flex items-center gap-4 py-6 border-b last:border-b-0">
          <img src="${imageUrl}" alt="${item.name}" class="w-20 h-20 object-cover bg-gray-100 border border-gray-300" />
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium text-base text-gray-900 truncate">${item.name}</div>
                <div class="text-sm text-gray-500 truncate">${item.description || ''}</div>
                <div class="text-sm text-gray-500 mt-1">${item.price} kr/st</div>
              </div>
              <button data-remove="${item.id}" class="text-gray-400 hover:text-red-600 text-lg font-bold px-2 cursor-pointer" title="Ta bort">
                &times;
              </button>
            </div>
            <div class="flex items-center mt-3 gap-2">
              <button data-qty-down="${item.id}" class="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-lg font-semibold cursor-pointer">-</button>
              <span class="w-8 text-center text-base">${item.quantity}</span>
              <button data-qty-up="${item.id}" class="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100 text-lg font-semibold cursor-pointer">+</button>
              <span class="ml-auto font-semibold text-base">${item.price * item.quantity} kr</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    cartTotal.textContent = `${total} kr`;

    // Quantity and remove handlers
    cartItems.querySelectorAll('[data-qty-down]').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.getAttribute('data-qty-down'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(i => i.id === id);
        if (item && item.quantity > 1) item.quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        if (window.updateCartCount) window.updateCartCount();
      };
    });
    cartItems.querySelectorAll('[data-qty-up]').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.getAttribute('data-qty-up'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(i => i.id === id);
        if (item) item.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        if (window.updateCartCount) window.updateCartCount();
      };
    });
    cartItems.querySelectorAll('[data-remove]').forEach(btn => {
      btn.onclick = () => {
        const id = Number(btn.getAttribute('data-remove'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(i => i.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        if (window.updateCartCount) window.updateCartCount();
      };
    });

    // After rendering cart items, make sure the checkout button has cursor-pointer:
    const checkoutBtn = document.querySelector('#cart-drawer button.w-full.bg-black');
    if (checkoutBtn) {
      checkoutBtn.classList.add('cursor-pointer');
      checkoutBtn.style.display = '';
      checkoutBtn.onclick = () => {
        window.location.href = 'checkout.html';
      };
    }
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalCount;
      cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
    }
  }

  // Open cart
  const openBtn = document.getElementById('cart-open');
  const closeBtn = document.getElementById('cart-close');
  const backdrop = document.getElementById('cart-backdrop');
  const drawer = document.getElementById('cart-drawer');

  if (openBtn && closeBtn && backdrop && drawer) {
    openBtn.addEventListener('click', () => {
      renderCart();
      backdrop.classList.remove('hidden');
      drawer.classList.remove('translate-x-full');
    });
    closeBtn.addEventListener('click', () => {
      backdrop.classList.add('hidden');
      drawer.classList.add('translate-x-full');
    });
    backdrop.addEventListener('click', () => {
      backdrop.classList.add('hidden');
      drawer.classList.add('translate-x-full');
    });
  }

  // Update cart count on page load
  updateCartCount();

  // Listen for storage changes (if cart is updated from another tab)
  window.addEventListener('storage', () => {
    updateCartCount();
  });

  // Expose updateCartCount for other scripts (like product add)
  window.updateCartCount = updateCartCount;
});

// Example: Add product to cart in localStorage
function addToCart(product) {
  // Get current cart or start with empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if product already in cart
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  // Save back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Optionally update cart count in header
  if (window.updateCartCount) window.updateCartCount();
}

window.addToCart = addToCart;

// Add to cart with extended product data
function addToCartWithDetails(productData, selectedVariant) {
  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.image,
    thumbnail: productData.thumbnail,
    description: productData.description, // <-- Add this line
    variant: selectedVariant,
    quantity: 1
  };
  addToCart(product);
}