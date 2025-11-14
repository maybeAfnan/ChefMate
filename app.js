const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

const container = document.getElementById('recipes-container');
const categoryButtons = document.querySelectorAll('.category-title');
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

const MEAL_DATA = [
    { mealId: '53076', calories: 780, cookingTime: 40 },
    { mealId: '52965', calories: 950, cookingTime: 55 },
    { mealId: '52895', calories: 410, cookingTime: 25 },
    { mealId: '52957', calories: 1100, cookingTime: 75 },
    { mealId: '52896', calories: 630, cookingTime: 30 },
    { mealId: '52967', calories: 340, cookingTime: 15 },
    { mealId: '52842', calories: 480, cookingTime: 22 },
    { mealId: '52840', calories: 710, cookingTime: 45 },
    { mealId: '52779', calories: 880, cookingTime: 60 },
    { mealId: '52841', calories: 590, cookingTime: 35 },
    { mealId: '53099', calories: 390, cookingTime: 18 },
    { mealId: '52874', calories: 750, cookingTime: 48 },
    { mealId: '52878', calories: 920, cookingTime: 65 },
    { mealId: '53071', calories: 510, cookingTime: 28 },
    { mealId: '52997', calories: 1050, cookingTime: 80 },
    { mealId: '52904', calories: 430, cookingTime: 20 },
    { mealId: '53085', calories: 680, cookingTime: 42 },
    { mealId: '53050', calories: 810, cookingTime: 55 },
    { mealId: '52940', calories: 360, cookingTime: 17 },
    { mealId: '53016', calories: 980, cookingTime: 70 },
    { mealId: '52846', calories: 490, cookingTime: 24 },
    { mealId: '52796', calories: 730, cookingTime: 49 },
    { mealId: '52807', calories: 560, cookingTime: 33 },
    { mealId: '53078', calories: 1150, cookingTime: 90 },
    { mealId: '53077', calories: 460, cookingTime: 25 },
    { mealId: '52870', calories: 840, cookingTime: 58 },
    { mealId: '53072', calories: 600, cookingTime: 38 },
    { mealId: '52785', calories: 1020, cookingTime: 85 },
    { mealId: '53049', calories: 380, cookingTime: 19 },
    { mealId: '52893', calories: 770, cookingTime: 52 },
    { mealId: '52768', calories: 530, cookingTime: 30 },
    { mealId: '52767', calories: 900, cookingTime: 62 },
    { mealId: '52855', calories: 450, cookingTime: 21 },
    { mealId: '52894', calories: 690, cookingTime: 44 }
];

const dataCache = MEAL_DATA.reduce((acc, item) => {
    acc[item.mealId] = {
        calories: item.calories,
        cookingTime: item.cookingTime,
    };
    return acc;
}, {});

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
   
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        fetchFilteredMeals(category);
    });
});


async function fetchFilteredMeals(category) {
   
    const url = `${BASE_URL}filter.php?c=${category}`;

  
    container.innerHTML = '<p>Loading ' + category + ' recipes</p>';

    try {
        const response = await fetch(url);
        
        const data = await response.json(); 
        const meals = data.meals;

        if (meals && meals.length > 0) {
        
            renderMeals(meals);
        } else {
            container.innerHTML = `<p>No meals found for the category: ${category}.</p>`;
        }
    } catch (error) {
        console.error("Error fetching meals:", error);
        container.innerHTML = '<p>Sorry, an error occurred.</p>';
    }
}

function renderMeals(meals) {

    container.innerHTML = '';
    
    const displayMeals = meals.slice(0, 6); 

    displayMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        const mealsData = dataCache[meal.idMeal] || { cookingTime: 'N/A', calories: 'N/A' };
   
        const recipeHtml = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image-placeholder">
            <div class="card-body">
                <h3 class="card-title">${meal.strMeal}</h3> 
                <div>
                <p class = "card-meta">
                    Time: ${mealsData.cookingTime} min - Calories: ${mealsData.calories} cal</p>
                </div>
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

//details button 
container.addEventListener("click", handleHomeMealClick);

// Listener for the back button
backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    container.scrollIntoView({ behavior: "smooth" }); // Scroll back to recipes
});

async function handleHomeMealClick(e) {
    const detailsBtn = e.target.closest(".details-button");
    
    if (!detailsBtn) return;
    
    const mealId = detailsBtn.getAttribute("data-id");
    
    const mealsData = dataCache[mealId] || { cookingTime: 'N/A', calories: 'N/A' };
    
    // Temporarily clear and show loading
    mealDetailsContent.innerHTML = '<p style="text-align:center;">Loading recipe details...</p>';
    mealDetails.classList.remove("hidden");
    mealDetails.scrollIntoView({ behavior: "smooth" });

    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();

        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            const ingredients = [];

            // Extract ingredients and measures
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    ingredients.push({
                        ingredient: ingredient,
                        measure: measure,
                    });
                }
            }

            // Display meal details
            mealDetailsContent.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
                <h2 class="meal-details-title">${meal.strMeal}</h2>
                <div class="meal-details-category">
                    <span>${meal.strCategory || "Uncategorized"}</span>
                </div>
                <p class="card-meta meal-details-meta">
                    Cooking Time: ${mealsData.cookingTime} minutes | Calories: ${mealsData.calories} calories
                </p>
                <div class="meal-details-instructions">
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="meal-details-ingredients">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">
                        ${ingredients
                            .map(
                                (item) => `
                                <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
                            `
                            )
                            .join("")}
                    </ul>
                </div>
            `;

            mealDetails.classList.remove("hidden");
        } else {
            mealDetailsContent.innerHTML = '<p style="text-align:center;">Recipe details not found.</p>';
        }
    } catch (error) {
        mealDetailsContent.innerHTML = '<p style="text-align:center;">Could not load recipe details. Please try again later.</p>';
    }
}

fetchFilteredMeals('Breakfast');
