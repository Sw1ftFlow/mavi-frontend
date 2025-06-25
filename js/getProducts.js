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

    // Render each product as a Tailwind card with image
    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.href = `product.html?id=${product.id}`;
        productDiv.className = 'bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col';

        productDiv.innerHTML = `
        <a href="product.html?id=${product.id}">
            <div class="h-48 w-full flex items-center justify-center bg-white rounded-t-lg overflow-hidden pt-10">
                <img src="img/${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.name}" class="object-contain h-full w-full" />
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${product.name}</h5>
                <p class="mb-2 font-normal text-gray-700 flex-1">${product.description || ''}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-lg font-semibold text-gray-900">${product.price} kr</span>
                    <span class="text-sm text-gray-500">Stock: ${product.stock}</span>
                </div>
            </div>
            </a>
        `;

        container.appendChild(productDiv);
    });
}

// Call the function to fetch products
getProducts();
