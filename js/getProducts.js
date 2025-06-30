// Replace with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnN2dnp1a3RpcnBkaWN3Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg2MzAsImV4cCI6MjA2NjQyNDYzMH0.LAJmKc1RiJT-JSNqucL8cWq8ogtrswysG1A5K1bmCh4';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    // Find or create a container for products
    let container = document.getElementById('products-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'products-container';
        document.body.appendChild(container);
    }

    // Clear previous content
    container.innerHTML = '';

    // Render each product as a Nordiska Galleriet-style card
    data.forEach(product => {
        const inStock = product.stock > 0;
        const stockText = inStock
          ? `I LAGER (${product.stock} st)`
          : `SNART I LAGER`;

        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
        <a href="product.html?id=${product.id}">
            <div class="bg-[#f5f5f5] w-full aspect-[3/5] flex items-center justify-center overflow-hidden relative p-6">
                <!-- Lager badge -->
                <div class="absolute bottom-2 left-2 flex items-center z-10">
                    <span class="inline-flex items-center justify-center w-3 h-3 rounded-full ${inStock ? 'bg-green-500' : 'bg-yellow-400'} mr-1">
                        <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 8l3 3 5-5"/>
                        </svg>
                    </span>
                    <span class="text-[10px] text-black font-medium leading-none">
                        ${stockText}
                    </span>
                </div>
                <img src="/img/${product.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image'}" alt="${product.name}" class="object-contain h-full w-full" />
            </div>
            <div class="w-full text-left py-3 bg-white pl-4">
                <div class="text-base font-medium text-gray-900 truncate">${product.name}</div>
                <div class="text-base text-gray-700 mt-1">${product.price} kr</div>
            </div>
        </a>
        `;
        productDiv.className = "flex flex-col items-center justify-between bg-[#f5f5f5] rounded-none border-0 shadow-none overflow-hidden";
        container.appendChild(productDiv);
    });
}

// Call the function to fetch products
getProducts();
