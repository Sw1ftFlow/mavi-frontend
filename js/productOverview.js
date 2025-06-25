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

    // Use the image as a full URL if it already is, otherwise use as relative or fallback
    let imageUrl = data.image;
    if (!imageUrl) {
        imageUrl = 'https://via.placeholder.com/600x600?text=No+Image';
    } else if (!/^https?:\/\//i.test(imageUrl)) {
        imageUrl = `img/${imageUrl}`;
    }

    // If your feature column is a comma-separated string:
    const features = data.feature ? data.feature.split(',').map(f => f.trim()) : [];

    // Render the Tailwind UI Product Overview component with expandable details
    document.getElementById('product-overview').innerHTML = `
      <div class="bg-white px-4 py-8 rounded-lg shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img src="${imageUrl}" alt="${data.name}" class="rounded-lg w-full object-contain bg-white-100 max-h-[500px]" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">${data.name}</h1>
          <p class="text-xl text-gray-700 mb-4">${data.price} kr</p>
          <p class="mb-6 text-gray-600">${data.description || ''}</p>
          <button class="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">Add to Cart</button>
          <div class="mt-8 space-y-2">
            <details class="mb-2">
              <summary class="font-semibold cursor-pointer">Features</summary>
              <div class="mt-2 text-gray-600">
                <p>${data.feature || 'No features listed.'}</p>
              </div>
            </details>
            <details class="mb-2">
              <summary class="font-semibold cursor-pointer">Shipping</summary>
              <div class="mt-2 text-gray-600">
                <p>${data.shipping || 'No shipping info.'}</p>
              </div>
            </details>
            <details class="mb-2">
              <summary class="font-semibold cursor-pointer">Return</summary>
              <div class="mt-2 text-gray-600">
                <p>${data.return || 'No return policy.'}</p>
              </div>
            </details>
          </div>
        </div>
      </div>
      ${renderFeatureBox(features)}
    `;
}

loadProduct();