document.addEventListener('DOMContentLoaded', function() {
    // Extract recipe ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId) {
        loadRecipeDetails(recipeId);
    } else {
        document.getElementById('recipe-detail').innerHTML = `
            <div class="alert alert-danger">
                No recipe selected. <a href="search-result.html">Return to search</a>
            </div>
        `;
    }

    // Add event listener to home link to clear states
    const homeLinks = document.querySelectorAll('a[href="Home.html"]');
    
    homeLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default navigation
            
            // Clear search-related session storage
            sessionStorage.removeItem('lastSearchQuery');
            sessionStorage.removeItem('lastSearchResults');
            
            // Clear any stored recipe details
            const recipeKeys = Object.keys(sessionStorage).filter(key => key.startsWith('recipe_'));
            recipeKeys.forEach(key => sessionStorage.removeItem(key));
            
            // Redirect to home page
            window.location.href = 'Home.html';
        });
    });
});

function loadRecipeDetails(recipeId) {
    const loadingElement = document.getElementById('loading');
    const recipeDetailElement = document.getElementById('recipe-detail');
    
    // Get recipe data from sessionStorage
    const recipeKey = `recipe_${recipeId}`;
    const recipeData = JSON.parse(sessionStorage.getItem(recipeKey));
    
    if (!recipeData) {
        // If not found in sessionStorage, show error
        loadingElement.style.display = 'none';
        recipeDetailElement.innerHTML = `
            <div class="alert alert-warning">
                Recipe details not found. <a href="search-result.html">Return to search</a>
            </div>
        `;
        return;
    }
    
    // Hide loading indicator
    loadingElement.style.display = 'none';
    
    // Render recipe details
    recipeDetailElement.innerHTML = `
        <img src="${recipeData.image_link}" alt="${recipeData.Name}" class="recipe-image">

        <div>
            <h1 class="recipe-title">${recipeData.Name}</h1>
        </div>

        <div>
            <h1 class="recipe-cal">Calories: ${recipeData.Calories || 'N/A'}</h1>
        </div>

        <div>
            <p class="recipe-description"><b>Description: </b>${recipeData.Description}</p>
        </div>

        <div>
            <p class="recipe-description"><b>Ingredients: </b> ${recipeData.RecipeIngredientParts || 'Not available'}</p>
        </div>

        <div>
            <p class="recipe-description"><b>How to cook:</b> ${recipeData.RecipeInstructions || 'Not available'}</p>
        </div>

        <button class="bookmark-detail-btn" id="bookmarkButton">
            Save to Bookmarks
        </button>
    `;
    
    // Add event listener for bookmark button
    document.getElementById('bookmarkButton').addEventListener('click', function() {
        bookmarkFromDetail(recipeData.Name, recipeData.image_link, recipeData.Description);
    });
}

function bookmarkFromDetail(name, image, description) {
    // Get existing bookmarks
    let bookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];
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

function fetchRecipeFromServer(recipeId) {
    // In a real app, you would fetch the recipe details from your server
    // This is a placeholder for that functionality
    document.getElementById('recipe-detail').innerHTML = `
        <div class="alert alert-warning">
            Recipe details not found. <a href="search-result.html">Return to search</a>
        </div>
    `;
}