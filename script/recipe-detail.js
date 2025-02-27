document.addEventListener('DOMContentLoaded', function() {
    // Extract recipe ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId) {
        loadRecipeDetails(recipeId);
    } else {
        document.getElementById('recipe-detail').innerHTML = `
            <div class="alert alert-danger">
                No recipe selected. <a href="index.html">Return to search</a>
            </div>
        `;
    }
});

function loadRecipeDetails(recipeId) {
    const loadingElement = document.getElementById('loading');
    const recipeDetailElement = document.getElementById('recipe-detail');
    
    // Get recipe data from localStorage
    const storedRecipes = JSON.parse(localStorage.getItem("recipeDetails")) || {};
    const recipeData = storedRecipes[recipeId];
    
    if (!recipeData) {
        // If not found in localStorage, try to fetch from server
        fetchRecipeFromServer(recipeId);
        return;
    }
    
    // Hide loading indicator
    loadingElement.style.display = 'none';
    
    // Render recipe details
    recipeDetailElement.innerHTML = `
        <img src="${recipeData.Images}" alt="${recipeData.Name}" class="recipe-image">

        <div>
            <h1 class="recipe-title">${recipeData.Name}</h1>
        </div>

        <div>
            <h1 class="recipe-cal">Caloris: ${recipeData.Calories}</h1>
        </div>

        <div>
            <p class="recipe-description"><b>Description: </b>${recipeData.Description}</p>
        </div>

        <div>
            <p class="recipe-description"><b>Ingrediant: </b> ${recipeData.RecipeIngredientParts}</p>
        </div>

        <div>
            <p class="recipe-description"><b>How to cook:</b> ${recipeData.RecipeInstructions}</p>
        </div>

        <button class="bookmark-detail-btn" onclick="bookmarkFromDetail('${recipeData.Name}', '${recipeData.Images}', '${recipeData.Description}')">
            Save to Bookmarks
        </button>
    `;
}

function fetchRecipeFromServer(recipeId) {
    // In a real app, you would fetch the recipe details from your server
    // This is a placeholder for that functionality
    document.getElementById('recipe-detail').innerHTML = `
        <div class="alert alert-warning">
            Recipe details not found. <a href="index.html">Return to search</a>
        </div>
    `;
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