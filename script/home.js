 // Clear search state and stored data
function clearSearchState() {
    // Clear session storage
    sessionStorage.removeItem("lastSearchQuery");
    sessionStorage.removeItem("lastSearchResults");
    
    // Clear local storage recipe keys
    const recipeKeys = Object.keys(sessionStorage).filter(key => key.startsWith('recipe_'));
    recipeKeys.forEach(key => sessionStorage.removeItem(key));
}

// Add event listener to home link
document.addEventListener('DOMContentLoaded', function() {
    const homeLink = document.getElementById('home-link');
    
    homeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default navigation
        
        // Clear search states
        clearSearchState();
        
        // Clear search query input
        document.getElementById('searchQuery').value = '';
        
        // Redirect to home page
        window.location.href = 'Home.html';
    });
});

function searchRecipes() {
    let query = document.getElementById('searchQuery').value;
    
    if (!query) {
        alert("Please enter a search term!");
        return;
    }

    // Redirect to search results page with the query
    window.location.href = `search-result.html?query=${encodeURIComponent(query)}`;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        searchRecipes();
    }
}