export function checkAuth() {
    const token = sessionStorage.getItem('auth_token');
    const contentDiv = document.getElementById('content');

    if (!token) {
        // Load login form if not authenticated
        htmx.ajax('GET', '/components/login-form.html', { target: '#content' });
    } else {
        // Load dashboard if authenticated
        htmx.ajax('GET', '/components/dashboard/dashboard.html', { target: '#content' });
    }
}

// Initialize the app
htmx.onLoad(() => {
    checkAuth();

    // Handle navigation
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-route]')) {
            e.preventDefault();
            const route = e.target.getAttribute('data-route');
            htmx.ajax('GET', `/components/${route}.html`, { target: '#content' });
        }
    });

    // Prevent infinite loops by ensuring only one request is made
    document.body.addEventListener('htmx:beforeRequest', (e) => {
        const currentTarget = e.detail.elt;
        if (currentTarget.closest('#content')) {
            currentTarget.removeAttribute('hx-get');
        }
    });
});
