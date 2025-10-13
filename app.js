

const API_BASE = 'https://www.themealdb.com/api/json/v1/1/';
const container = document.getElementById('recipes-container');
const categoryButtons = document.querySelectorAll('.category-title');


categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
   
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        fetchFilteredMeals(category);
    });
});


async function fetchFilteredMeals(category) {
   
    const url = `${API_BASE}filter.php?c=${category}`;

  
    container.innerHTML = '<p>Loading ' + category + ' recipes...</p>';

    try {
        const response = await fetch(url);
        
        const data = await response.json(); 
        const meals = data.meals;

        if (meals && meals.length > 0) {
        
            renderMeals(meals);
        } else {
            container.innerHTML = `<p>No meals found for the category: ${category}. Try a different one!</p>`;
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
        container.innerHTML = '<p>Sorry, an error occurred while loading recipes.</p>';
    }
}

function renderMeals(meals) {

    container.innerHTML = '';
    
    const displayMeals = meals.slice(0, 7); 

    displayMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
   
        const recipeHtml = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image-placeholder">
            <div class="card-body">
                <h3 class="card-title">${meal.strMeal}</h3> 
                <div class="card-btns">
                    <button class="details-button" data-id="${meal.idMeal}">View Details</button>
                    <button class="add-favorites-button">Add to Favorites</button>
                </div>
            </div>
        `;

        card.innerHTML = recipeHtml;
        container.appendChild(card);
    });
}

fetchFilteredMeals('Breakfast');