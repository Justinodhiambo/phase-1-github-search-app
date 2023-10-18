// GitHub access 
const GITHUB_API_TOKEN = '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';
const apiUrl = 'https://api.github.com';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const userRepos = document.getElementById('user-repos');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();

    // Clear previous results
    searchResults.innerHTML = '';
    userRepos.innerHTML = '';

    if (username) {
        // Search for GitHub users
        try {
            const usersResponse = await fetch(`${apiUrl}/search/users?q=${username}`, {
                headers: {
                    Authorization: `token ${GITHUB_API_TOKEN}`,
                },
            });
            const userData = await usersResponse.json();
            displayUsers(userData.items);
        } catch (error) {
            console.error('Error searching for users:', error);
        }
    }
});

function displayUsers(users) {
    searchResults.innerHTML = '';

    if (users.length === 0) {
        searchResults.innerHTML = '<p>No users found.</p>';
        return;
    }

    users.forEach((user) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" />
            <h3>${user.login}</h3>
            <a href="${user.html_url}" target="_blank">Profile</a>
        `;
        userCard.addEventListener('click', () => {
            fetchUserRepositories(user.login);
        });

        searchResults.appendChild(userCard);
    });
}

async function fetchUserRepositories(username) {
    try {
        const reposResponse = await fetch(`${apiUrl}/users/${username}/repos`, {
            headers: {
                Authorization: `token ${GITHUB_API_TOKEN}`,
            },
        });
        const reposData = await reposResponse.json();
        displayUserRepositories(reposData);
    } catch (error) {
        console.error('Error fetching user repositories:', error);
    }
}

function displayUserRepositories(repositories) {
    userRepos.innerHTML = '';

    if (repositories.length === 0) {
        userRepos.innerHTML = '<p>No repositories found for this user.</p>';
        return;
    }

    repositories.forEach((repo) => {
        const repoItem = document.createElement('div');
        repoItem.className = 'repo-item';
        repoItem.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description'}</p>
            <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        `;

        userRepos.appendChild(repoItem);
    });
}