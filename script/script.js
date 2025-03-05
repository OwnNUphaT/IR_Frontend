let bookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];

// Store the last search query and results
function storeSearchState(query, results) {
    sessionStorage.setItem("lastSearchQuery", query);
    sessionStorage.setItem("lastSearchResults", JSON.stringify(results));
}

// Restore search state
function restoreSearchState() {
    const query = sessionStorage.getItem("lastSearchQuery");
    const results = JSON.parse(sessionStorage.getItem("lastSearchResults"));
    
    if (query && results) {
        document.getElementById('searchQuery').value = query;
        displayResults(results);
        return true;
    }
    return false;
}

// Trigger search when Enter key is pressed
function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchRecipes();
    }
}

function searchRecipes() {
    let query = document.getElementById('searchQuery').value;
    let resultsDiv = document.getElementById('results');
    let loadingDiv = document.getElementById('loading');

    if (!query) {
        alert("Please enter a search term!");
        return;
    }

    resultsDiv.innerHTML = ""; // Clear previous results
    loadingDiv.style.display = "block"; // Show loading message

    axios.get(`http://127.0.0.1:5000/search?query=${query}`)
        .then(response => {
            loadingDiv.style.display = "none"; // Hide loading message
            let results = response.data.results;

            if (results.length === 0) {
                resultsDiv.innerHTML = "<p class='text-center text-muted'>No results found.</p>";
                return;
            }

            // Store current search state
            storeSearchState(query, results);
            
            // Display results
            displayResults(results);
        })
        .catch(error => {
            loadingDiv.style.display = "none"; // Hide loading message
            resultsDiv.innerHTML = "<p class='text-danger text-center'>Error fetching results. Please try again.</p>";
        });
}

function displayResults(results) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; // Clear previous results
    
    results.forEach(recipe => {
        // Create a safe ID from recipe name
        const recipeId = encodeURIComponent(recipe.Name.replace(/\s+/g, '-').toLowerCase());
        
        // Store the recipe in sessionStorage instead of passing it in the URL
        const recipeKey = `recipe_${recipeId}`;
        sessionStorage.setItem(recipeKey, JSON.stringify(recipe));
        
        let item = document.createElement('div');
        item.className = 'grid-item';
        item.innerHTML = `
            <img src="${recipe.image_link}" alt="${recipe.Name}">
            <div class="content">
                <h5>${recipe.Name}</h5>
                <p>${recipe.Description}</p>
                <button class="bookmark-btn">Bookmark</button>
            </div>
        `;
        
        // Add event listener for click on the whole item
        item.addEventListener('click', function() {
            viewRecipeDetails(recipeId);
        });
        
        // Add event listener for bookmark button
        const bookmarkBtn = item.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            bookmarkRecipe(event, recipe.Name, recipe.Images, recipe.Description);
        });
        
        resultsDiv.appendChild(item);
    });
}

// Modified viewRecipeDetails function
function viewRecipeDetails(recipeId) {
    // Navigate to recipe detail page
    window.location.href = `recipe-detail.html?id=${recipeId}`;
}

function bookmarkRecipe(event, name, image, description) {
    // Stop the click event from bubbling up to the parent container
    event.stopPropagation();
    
    let recipe = { name, image, description };
    let exists = bookmarks.some(b => b.name === name);

    if (!exists) {
        bookmarks.push(recipe);
        localStorage.setItem("bookmarkedRecipes", JSON.stringify(bookmarks));
        alert("Recipe bookmarked!");
    } else {
        alert("Recipe already bookmarked!");
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page
    if (window.location.pathname.endsWith('search-result.html') || 
        window.location.pathname === '/' || 
        window.location.pathname.endsWith('/')) {
        // Try to restore previous search state
        restoreSearchState();
    }
});