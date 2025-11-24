// Application-wide configuration
// Toggle features and default values here for development and production

window.APP_CONFIG = window.APP_CONFIG || {
  // Enable or disable adding a flat shipping cost to orders
  enableShippingCost: false,

  // Flat shipping cost (in SEK)
  shippingCostAmount: 99
};

// Expose a helper to update config at runtime (useful from console)
window.setAppConfig = function (newConfig) {
  window.APP_CONFIG = Object.assign({}, window.APP_CONFIG, newConfig);
  console.log('APP_CONFIG updated', window.APP_CONFIG);
  return window.APP_CONFIG;
};
