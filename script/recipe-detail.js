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
    
    // Sample data for demonstration - in a real app, these would come from your API
    // Here I'm generating some sample data for fields that might not be in your current data
    const ingredients = generateSampleIngredients();
    const instructions = generateSampleInstructions();
    const nutritionalInfo = generateSampleNutritionalInfo();
    const prepTime = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
    const cookTime = Math.floor(Math.random() * 40) + 20; // 20-60 minutes
    const servings = Math.floor(Math.random() * 6) + 2; // 2-8 servings
    
    // Render recipe details
    recipeDetailElement.innerHTML = `
        <img src="${recipeData.Images}" alt="${recipeData.Name}" class="recipe-image">
        <h1 class="recipe-title">${recipeData.Name}</h1>
        <p class="recipe-description">${recipeData.Description}</p>
        
        <div class="recipe-meta">
            <div class="meta-item">
                <i class="bi bi-clock"></i>
                <span>Prep: ${prepTime} min</span>
            </div>
            <div class="meta-item">
                <i class="bi bi-fire"></i>
                <span>Cook: ${cookTime} min</span>
            </div>
            <div class="meta-item">
                <i class="bi bi-people"></i>
                <span>Serves: ${servings}</span>
            </div>
        </div>
        
        <div class="recipe-section">
            <h2 class="section-title">Ingredients</h2>
            <ul class="ingredients-list">
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        
        <div class="recipe-section">
            <h2 class="section-title">Instructions</h2>
            <ol class="instructions-list">
                ${instructions.map(ins => `<li>${ins}</li>`).join('')}
            </ol>
        </div>
        
        <div class="recipe-section">
            <h2 class="section-title">Nutritional Information</h2>
            <div class="nutritional-info">
                ${Object.entries(nutritionalInfo).map(([key, value]) => `
                    <div class="nutrition-item">
                        <div class="nutrition-value">${value}</div>
                        <div class="nutrition-label">${key}</div>
                    </div>
                `).join('')}
            </div>
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

// Helper functions to generate sample data
function generateSampleIngredients() {
    const commonIngredients = [
        "2 tablespoons olive oil",
        "1 large onion, diced",
        "3 cloves garlic, minced",
        "1 pound boneless chicken, cubed",
        "1 cup rice",
        "2 cups chicken broth",
        "1 teaspoon salt",
        "1/2 teaspoon black pepper",
        "1 tablespoon fresh herbs (parsley, thyme, or rosemary)",
        "1 cup mixed vegetables (carrots, peas, corn)",
        "1/4 cup heavy cream",
        "2 tablespoons butter"
    ];
    
    // Randomly select 5-8 ingredients
    const numIngredients = Math.floor(Math.random() * 4) + 5;
    const selectedIngredients = [];
    
    for (let i = 0; i < numIngredients; i++) {
        const randomIndex = Math.floor(Math.random() * commonIngredients.length);
        selectedIngredients.push(commonIngredients[randomIndex]);
        // Remove the selected ingredient to avoid duplicates
        commonIngredients.splice(randomIndex, 1);
    }
    
    return selectedIngredients;
}

function generateSampleInstructions() {
    const commonSteps = [
        "Preheat oven to 375°F (190°C).",
        "Heat olive oil in a large skillet over medium heat.",
        "Add onions and sauté until translucent, about 3-4 minutes.",
        "Add garlic and cook for another 30 seconds until fragrant.",
        "Add chicken and cook until browned on all sides, about 5-7 minutes.",
        "Stir in rice and cook for 1-2 minutes to toast slightly.",
        "Pour in chicken broth and bring to a boil.",
        "Reduce heat to low, cover, and simmer for 18-20 minutes until rice is tender.",
        "Stir in mixed vegetables and cook for another 3-4 minutes until heated through.",
        "Remove from heat and stir in butter and heavy cream.",
        "Season with salt and pepper to taste.",
        "Garnish with fresh herbs before serving."
    ];
    
    // Return 5-8 steps
    return commonSteps.slice(0, Math.floor(Math.random() * 4) + 5);
}

function generateSampleNutritionalInfo() {
    return {
        "Calories": `${Math.floor(Math.random() * 300) + 250} kcal`,
        "Protein": `${Math.floor(Math.random() * 20) + 15}g`,
        "Carbs": `${Math.floor(Math.random() * 30) + 20}g`,
        "Fat": `${Math.floor(Math.random() * 15) + 5}g`,
        "Fiber": `${Math.floor(Math.random() * 5) + 1}g`,
        "Sugar": `${Math.floor(Math.random() * 8) + 2}g`
    };
}