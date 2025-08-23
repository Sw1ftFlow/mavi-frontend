// Simple cart drawer logic
document.addEventListener('DOMContentLoaded', () => {
  // Supabase configuration
  const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnN2dnp1a3RpcnBkaWN3Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg2MzAsImV4cCI6MjA2NjQyNDYzMH0.LAJmKc1RiJT-JSNqucL8cWq8ogtrswysG1A5K1bmCh4';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Function to fetch fresh stock information for cart items
  async function fetchStockInfo(cartItems) {
    if (cartItems.length === 0) return cartItems;
    
    try {
      const productIds = cartItems.map(item => item.id);
      const { data, error } = await supabase
        .from('products')
        .select('id, stock')
        .in('id', productIds);
      
      if (error) {
        console.error('Error fetching stock info:', error);
        return cartItems; // Return original items if fetch fails
      }
      
      // Update cart items with fresh stock information
      return cartItems.map(item => {
        const stockInfo = data.find(product => product.id === item.id);
        return {
          ...item,
          stock: stockInfo ? stockInfo.stock : item.stock // Use fresh stock or fallback to existing
        };
      });
    } catch (error) {
      console.error('Error in fetchStockInfo:', error);
      return cartItems; // Return original items if there's an error
    }
  }

  // Helper function to get inventory status HTML
  function getInventoryStatusHTML(item) {
    // Handle cases where stock info might be missing (old cart items)
    const stock = item.stock !== undefined ? item.stock : null;
    
    if (stock === null) {
      // If no stock info available, could fetch from server or show default
      return '<div class="flex items-center mt-1"><span class="text-xs text-gray-400">Stock info not available</span></div>';
    }
    
    const inStock = stock > 0;
    const stockText = inStock
      ? `I LAGER (${stock} st)`
      : `SNART I LAGER`;
    
    return `
      <div class="flex items-center mt-1">
        <span class="inline-flex items-center justify-center w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-yellow-400'} mr-1">
          <svg class="w-1 h-1 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 8l3 3 5-5"/>
          </svg>
        </span>
        <span class="text-[9px] text-gray-600 font-medium leading-none">
          ${stockText}
        </span>
      </div>
    `;
  }

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
    
    // Migrate old cart items to use consistent URL structure
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
    
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (migratedCart.length === 0) {
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

    // Fetch fresh stock information and render cart
    fetchStockInfo(migratedCart).then(cartWithFreshStock => {
      let total = 0;
      
      cartItems.innerHTML = cartWithFreshStock.map((item, idx) => {
        total += item.price * item.quantity;
        
        // Now all items should have consistent URL structure
        let imageUrl = item.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image';
        
        return `
          <div class="flex items-center gap-4 py-6 border-b last:border-b-0">
            <img src="${imageUrl}" alt="${item.name}" class="w-20 h-20 object-contain bg-gray-100 border border-gray-300" />
            <div class="flex-1 flex flex-col justify-between min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-base text-gray-900 truncate">${item.name}</div>
                  <div class="text-sm text-gray-500 truncate">${item.description || ''}</div>
                  <div class="text-sm text-gray-500 mt-1">${item.price} kr/st</div>
                </div>
                <button data-remove="${item.id}" class="text-gray-400 hover:text-red-600 text-lg font-bold px-2 cursor-pointer" title="Ta bort">
                  &times;
                </button>            </div>
            <div class="flex items-center mt-3 gap-2">
              ${getInventoryStatusHTML(item)}
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

      // Update localStorage with fresh stock information
      localStorage.setItem('cart', JSON.stringify(cartWithFreshStock));

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
    }).catch(error => {
      console.error('Error rendering cart with fresh stock:', error);
      // Fallback to render with existing stock information
      renderCartFallback(migratedCart, cartItems, cartTotal);
    });
  }

  // Fallback function to render cart with existing stock information
  function renderCartFallback(migratedCart, cartItems, cartTotal) {
    let total = 0;
    
    cartItems.innerHTML = migratedCart.map((item, idx) => {
      total += item.price * item.quantity;
      
      let imageUrl = item.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image';
      
      return `
        <div class="flex items-center gap-4 py-6 border-b last:border-b-0">
          <img src="${imageUrl}" alt="${item.name}" class="w-20 h-20 object-contain bg-gray-100 border border-gray-300" />
          <div class="flex-1 flex flex-col justify-between min-w-0">
            <div class="flex justify-between items-start">                <div>
                  <div class="font-medium text-base text-gray-900 truncate">${item.name}</div>
                  <div class="text-sm text-gray-500 truncate">${item.description || ''}</div>
                  <div class="text-sm text-gray-500 mt-1">${item.price} kr/st</div>
                </div>
              <button data-remove="${item.id}" class="text-gray-400 hover:text-red-600 text-lg font-bold px-2 cursor-pointer" title="Ta bort">
                &times;
              </button>
            </div>
            <div class="flex items-center mt-3 gap-2">
              ${getInventoryStatusHTML(item)}
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
    description: productData.description,
    stock: productData.stock, // Add stock information
    variant: selectedVariant,
    quantity: 1
  };
  addToCart(product);
}