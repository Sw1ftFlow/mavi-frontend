document.addEventListener('DOMContentLoaded', () => {
  const headerHTML = `
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-blue-700">Mavi Webshop</h1>
        <nav>
          <ul class="flex space-x-6">
            <li><a href="index.html" class="text-gray-700 hover:text-blue-700">Home</a></li>
            <li><a href="index.html#products-container" class="text-gray-700 hover:text-blue-700">Products</a></li>
            <li><a href="#" class="text-gray-700 hover:text-blue-700">Contact</a></li>
          </ul>
        </nav>
        <button class="relative bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Cart
          <span class="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-0.5">0</span>
        </button>
      </div>
    </header>
  `;
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.innerHTML = headerHTML;
  }
});