// Global cart functionality that works on all pages

// Function to update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
    
    // Add bounce animation when count changes
    if (count > 0) {
      cartCount.classList.add('animate-bounce');
      setTimeout(() => {
        cartCount.classList.remove('animate-bounce');
      }, 500);
    }
  }
}

// Function to add animation class if available
function addCartAnimation() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount && !cartCount.style.display.includes('none')) {
    cartCount.style.animation = 'cartPulse 0.3s ease-in-out';
    setTimeout(() => {
      cartCount.style.animation = '';
    }, 300);
  }
}

// Listen for storage changes (when cart is updated on another tab/page)
window.addEventListener('storage', function(e) {
  if (e.key === 'cart') {
    updateCartCount();
    addCartAnimation();
  }
});

// Listen for custom cart update events
window.addEventListener('cartUpdated', function() {
  updateCartCount();
  addCartAnimation();
});

// Update cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});

// Also update immediately if script loads after DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
  updateCartCount();
}

// Helper function to trigger cart update event
function triggerCartUpdate() {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  
  // Also trigger storage event for cross-tab updates
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'cart',
    newValue: localStorage.getItem('cart'),
    storageArea: localStorage
  }));
}

// Export functions for use in other scripts
window.globalCart = {
  updateCartCount,
  triggerCartUpdate,
  addCartAnimation
};
