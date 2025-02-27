let bookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];

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

            results.forEach(recipe => {
                let item = `
                    <div class="grid-item">
                        <img src="${recipe.Images}" alt="Recipe Image">
                        <div class="content">
                            <h5>${recipe.Name}</h5>
                            <p>${recipe.Description}</p>
                            <button class="bookmark-btn" onclick="bookmarkRecipe('${recipe.Name}', '${recipe.Images}', '${recipe.Description}')">Bookmark</button>
                        </div>
                    </div>
                `;
                resultsDiv.innerHTML += item;
            });
        })
        .catch(error => {
            loadingDiv.style.display = "none"; // Hide loading message
            resultsDiv.innerHTML = "<p class='text-danger text-center'>Error fetching results. Please try again.</p>";
        });
}

function bookmarkRecipe(name, image, description) {
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
