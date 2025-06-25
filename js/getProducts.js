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

    // Main wrapper
    let container = document.getElementById('products-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'products-container';
        document.body.appendChild(container);
    }
    container.innerHTML = '';

    // Outer card grid wrapper
    const outerDiv = document.createElement('div');
    outerDiv.className = 'bg-white';
    outerDiv.innerHTML = `
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 mb-6">Customers also purchased</h2>
        <div id="product-grid" class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"></div>
      </div>
    `;
    container.appendChild(outerDiv);

    const grid = outerDiv.querySelector('#product-grid');

    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'group relative';

        productDiv.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/300x300?text=No+Image'}"
                alt="${product.name}"
                class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-sm text-gray-700">
                        <a href="#">
                            <span aria-hidden="true" class="absolute inset-0"></span>
                            ${product.name}
                        </a>
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">${product.description || ''}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">${product.price} kr</p>
            </div>
        `;

        grid.appendChild(productDiv);
    });
}

getProducts();
