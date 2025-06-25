/**
 * Renders an expandable feature box.
 * @param {string[]} features - Array of feature strings.
 * @param {string} [title="Features"] - The title for the box.
 * @returns {string} - HTML string for the expandable box.
 */
function renderFeatureBox(features, title = "Features") {
  const featureList = features && features.length
    ? `<ul class="list-disc pl-6 space-y-1">${features.map(f => `<li>${f}</li>`).join('')}</ul>`
    : `<p class="text-gray-500">No features listed.</p>`;

  // Unique IDs for accessibility
  const boxId = `feature-box-${Math.random().toString(36).substr(2, 9)}`;
  const panelId = `feature-panel-${Math.random().toString(36).substr(2, 9)}`;

  return `
    <div class="mb-4">
      <button
        class="flex items-center justify-between w-full px-4 py-3 text-left font-semibold bg-gray-100 rounded-lg focus:outline-none transition"
        type="button"
        aria-expanded="false"
        aria-controls="${panelId}"
        onclick="toggleFeatureBox('${panelId}', this)"
        id="${boxId}"
      >
        <span>${title}</span>
        <span class="ml-2 flex items-center">
          <svg class="w-5 h-5 plus-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          <svg class="w-5 h-5 minus-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14"/>
          </svg>
        </span>
      </button>
      <div id="${panelId}" class="hidden mt-2 px-4 py-2 bg-white rounded-b-lg border border-t-0 border-gray-200">
        ${featureList}
      </div>
    </div>
  `;
}

// Toggle function for the expandable box
function toggleFeatureBox(panelId, btn) {
  const panel = document.getElementById(panelId);
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !expanded);
  panel.classList.toggle('hidden');
  btn.querySelector('.plus-icon').classList.toggle('hidden');
  btn.querySelector('.minus-icon').classList.toggle('hidden');
}