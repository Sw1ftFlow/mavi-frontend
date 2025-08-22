// Global utility functions for the webshop

// Function to get dynamic base URL
function getBaseUrl() {
    return window.location.pathname.includes('/Webshop/') 
        ? window.location.origin + '/Webshop/' 
        : window.location.origin + '/';
}

// Make it globally available
window.getBaseUrl = getBaseUrl;
