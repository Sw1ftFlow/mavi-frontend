import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getProducts() {
  const { data, error } = await supabase
    .from('products') // replace with your table name
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('Products:', data);
  // You can now use the data to render products on your page
}

// Call the function to fetch products
getProducts();
