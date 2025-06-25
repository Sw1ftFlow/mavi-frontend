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

    // Render each product as a Tailwind card
    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'max-w-sm bg-white border border-gray-200 rounded-lg shadow-md m-4 p-6 dark:bg-gray-800 dark:border-gray-700';

        productDiv.innerHTML = `
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${product.name}</h5>
            <p class="mb-2 font-normal text-gray-700 dark:text-gray-400">${product.description || ''}</p>
            <div class="flex justify-between items-center mt-4">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">${product.price} kr</span>
                <span class="text-sm text-gray-500">Stock: ${product.stock}</span>
            </div>
        `;

        container.appendChild(productDiv);
    });
}

// Call the function to fetch products
getProducts();
