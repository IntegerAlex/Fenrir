document.getElementById('loginForm')?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

    // Reset UI state
    errorMessage.style.display = 'none';
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    const passKey = (document.getElementById('passKey') as HTMLInputElement).value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ passKey }),
            credentials: 'same-origin'
        });

        if (response.ok) {
            window.location.href = '/'; // Redirect to the dashboard
        } else {
            const data = await response.json();
            errorMessage.textContent = data.message || 'Invalid credentials';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Connection error. Please try again.';
        errorMessage.style.display = 'block';
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
}); 