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
    { mealId: '52842', calories: 480, cookingTime: 35 },
    { mealId: '52940', calories: 710, cookingTime: 45 },
    { mealId: '52926', calories: 550, cookingTime: 30 },
    { mealId: '52787', calories: 690, cookingTime: 50 },
    { mealId: '52792', calories: 380, cookingTime: 20 },
    { mealId: '52951', calories: 1200, cookingTime: 80 },
    { mealId: '52857', calories: 660, cookingTime: 40 },
    { mealId: '52820', calories: 590, cookingTime: 35 },
    { mealId: '52924', calories: 430, cookingTime: 25 },
    { mealId: '52944', calories: 750, cookingTime: 50 },
    { mealId: '52934', calories: 900, cookingTime: 65 },
    { mealId: '52802', calories: 320, cookingTime: 20 },
    { mealId: '52768', calories: 1050, cookingTime: 70 },
    { mealId: '52846', calories: 500, cookingTime: 30 },
    { mealId: '53169', calories: 650, cookingTime: 55 },
    { mealId: '52840', calories: 420, cookingTime: 25 },
    { mealId: '52779', calories: 910, cookingTime: 75 },
    { mealId: '52841', calories: 580, cookingTime: 30 },
    { mealId: '53173', calories: 720, cookingTime: 60 },
    { mealId: '53281', calories: 350, cookingTime: 20 },
    { mealId: '53133', calories: 880, cookingTime: 85 },
    { mealId: '53099', calories: 510, cookingTime: 45 },
    { mealId: '52874', calories: 620, cookingTime: 50 },
    { mealId: '52878', calories: 980, cookingTime: 90 },
    { mealId: '53071', calories: 480, cookingTime: 35 },
    { mealId: '53085', calories: 750, cookingTime: 70 },
    { mealId: '53050', calories: 390, cookingTime: 18 },
    { mealId: '53016', calories: 830, cookingTime: 80 },
    { mealId: '53161', calories: 560, cookingTime: 42 },
    { mealId: '53158', calories: 690, cookingTime: 65 },
    { mealId: '53288', calories: 940, cookingTime: 78 },
    { mealId: '53278', calories: 450, cookingTime: 28 },
    { mealId: '53267', calories: 700, cookingTime: 58 },
    { mealId: '53107', calories: 500, cookingTime: 48 },
    { mealId: '52807', calories: 800, cookingTime: 68 },
    { mealId: '53120', calories: 320, cookingTime: 15 },
    { mealId: '53138', calories: 670, cookingTime: 52 },
    { mealId: '53111', calories: 960, cookingTime: 88 },
    { mealId: '53049', calories: 400, cookingTime: 22 },
    { mealId: '52893', calories: 590, cookingTime: 47 }
];

const MEAL_DATA_MAP = MEAL_DATA.reduce((acc, item) => {
    acc[item.mealId] = { calories: item.calories, cookingTime: item.cookingTime };
    return acc;
}, {});


async function fetchFilteredMeals(category) {
    try {
        const response = await fetch(`${BASE_URL}filter.php?c=${category}`);
        const data = await response.json();
        if (data.meals) {
            await renderMeals(data.meals);
        } else {
            container.innerHTML = `<p class="error-message">No ${category} recipes found.</p>`;
        }
    } catch (error) {
        container.innerHTML = '<p class="error-message">Failed to fetch recipes.</p>';
    }
}

async function renderMeals(meals) {
    container.innerHTML = '';
    
    const displayMeals = meals.slice(0, 6); 

    displayMeals.forEach((meal, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        const mealsData = MEAL_DATA_MAP[meal.idMeal] || { cookingTime: 'N/A', calories: 'N/A' };
   
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
                    </div>
            </div>
        `;

        card.innerHTML = recipeHtml;
        container.appendChild(card);
    });
}

categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        fetchFilteredMeals(category);
    });
});

container.addEventListener("click", async (e) => {
    const detailsBtn = e.target.closest(".details-button");

    if (detailsBtn) {
        e.stopPropagation();
        const mealId = detailsBtn.getAttribute("data-id");
        handleMealClick(e, mealId);
    } 
});


backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
});


async function handleMealClick(e, mealId) {
    const mealsData = MEAL_DATA_MAP[mealId] || { cookingTime: 'N/A', calories: 'N/A' };
    
    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];

        if (meal) {
            let ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
                    ingredients.push({
                        ingredient: meal[`strIngredient${i}`],
                        measure: meal[`strMeasure${i}`]
                    });
                }
            }

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
            mealDetails.scrollIntoView({ behavior: "smooth" });

        } else {
            mealDetailsContent.innerHTML = '<p style="text-align:center;">Recipe details not found.</p>';
        }
    } catch (error) {
        mealDetailsContent.innerHTML = '<p style="text-align:center;">Could not load recipe details. Please try again later.</p>';
    }
}

fetchFilteredMeals('Breakfast');
