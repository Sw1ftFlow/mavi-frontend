// Global utility functions for the webshop

// Function to get dynamic base URL
function getBaseUrl() {
    if (window.location.pathname.includes('/mavi-frontend/')) { // GitHub Pages + local dev
        return window.location.origin + '/mavi-frontend/';
    } else {
        return window.location.origin + '/';
    }
}

// Make it globally available
window.getBaseUrl = getBaseUrl;
