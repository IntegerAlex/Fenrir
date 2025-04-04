export function initializeDashboard() {
    // Fetch user profile
    fetch('/htmx/v1/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').value = data.nickname;
            
            // Fetch repositories
            return fetch(`/htmx/v1/repositories?user_id=${data.nickname}`);
        })
        .then(response => response.json())
        .then(repoData => {
            const repoSelect = document.getElementById('repoLink');
            repoSelect.innerHTML = '<option value="">Select Repository</option>';
            
            repoData.repositories.forEach(repo => {
                const option = document.createElement('option');
                option.value = repo.url;
                option.textContent = repo.name;
                repoSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));

    // HTMX event listeners for loading state
    document.getElementById('project-setup-form')
        .addEventListener('htmx:beforeRequest', () => {
            document.getElementById('loading-message').style.display = 'block';
        });

    document.getElementById('project-setup-form')
        .addEventListener('htmx:afterRequest', () => {
            document.getElementById('loading-message').style.display = 'none';
        });
}
