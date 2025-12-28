// Application-wide configuration
// Toggle features and default values here for development and production

// Supabase configuration
const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnN2dnp1a3RpcnBkaWN3Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg2MzAsImV4cCI6MjA2NjQyNDYzMH0.LAJmKc1RiJT-JSNqucL8cWq8ogtrswysG1A5K1bmCh4';

// Create Supabase client if not already created
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

window.APP_CONFIG = window.APP_CONFIG || {
  // Enable or disable adding a flat shipping cost to orders
  enableShippingCost: true,

  // Flat shipping cost (in SEK)
  shippingCostAmount: 99
};

// Expose a helper to update config at runtime (useful from console)
window.setAppConfig = function (newConfig) {
  window.APP_CONFIG = Object.assign({}, window.APP_CONFIG, newConfig);
  console.log('APP_CONFIG updated', window.APP_CONFIG);
  return window.APP_CONFIG;
};
