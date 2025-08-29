document.addEventListener('DOMContentLoaded', async () => {
  const SUPABASE_URL = 'https://aqfsvvzuktirpdicwgil.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnN2dnp1a3RpcnBkaWN3Z2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDg2MzAsImV4cCI6MjA2NjQyNDYzMH0.LAJmKc1RiJT-JSNqucL8cWq8ogtrswysG1A5K1bmCh4';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Fetch logo image filename from Supabase
  let logoUrl = '';
  const { data, error } = await supabase
    .from('images')
    .select('image')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching logo:', error);
  }
  console.log('Logo data:', data);

  if (data && data.image) {
    logoUrl = `${getBaseUrl()}img/${data.image}`;
    console.log('Logo URL:', logoUrl);
  }

  const headerHTML = `
    <header class="bg-white" style="font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="index.html" class="flex items-center gap-3">
          ${logoUrl
            ? `<img src="${logoUrl}" alt="Logo" class="h-10 w-auto object-contain" />`
            : `<span class="text-2xl font-bold text-blue-700">Mavi Webshop</span>`
          }
          <span class="text-2xl font-semibold tracking-tight text-black" style="font-family: 'Inter', sans-serif;">MAVI</span>
        </a>
        <nav>
          <ul class="flex space-x-6">
            <li><a href="index.html" class="text-gray-700 hover:text-blue-700">Hem</a></li>
            <li><a href="product.html" class="text-gray-700 hover:text-blue-700">Kollektion</a></li>
            <li><a href="contact.html" class="text-gray-700 hover:text-blue-700">Kontakt</a></li>
          </ul>
        </nav>
        <button id="cart-open" class="relative px-2 py-2 rounded transition cursor-pointer" aria-label="Öppna varukorg" style="background: none;">
          <!-- Smaller bag icon SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" class="w-6 h-6 stroke-black" stroke="currentColor" stroke-width="1.3">
            <rect x="5" y="9" width="18" height="13" rx="3" />
            <path d="M9 9V7a5 5 0 0 1 10 0v2" />
          </svg>
          <span id="cart-count"
            class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[10px] font-medium border-2 border-white select-none"
            style="font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; display: none;">
            0
          </span>
        </button>
      </div>
    </header>
  `;
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.innerHTML = headerHTML;
  }
});