const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
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
    { mealId: '52893', calories: 590, cookingTime: 47 },
    { mealId: '53076', calories: 780, cookingTime: 40 },
    { mealId: '52776', calories: 610, cookingTime: 45 },
    { mealId: '52905', calories: 950, cookingTime: 70 },
    { mealId: '52794', calories: 430, cookingTime: 25 },
    { mealId: '52966', calories: 880, cookingTime: 65 },
    { mealId: '52853', calories: 550, cookingTime: 35 },
    { mealId: '52860', calories: 720, cookingTime: 50 },
    { mealId: '53101', calories: 310, cookingTime: 18 },
    { mealId: '52917', calories: 1000, cookingTime: 90 },
    { mealId: '53295', calories: 490, cookingTime: 30 },
    { mealId: '53224', calories: 800, cookingTime: 60 },
    { mealId: '53279', calories: 370, cookingTime: 20 },
    { mealId: '53170', calories: 640, cookingTime: 48 },
    { mealId: '52897', calories: 570, cookingTime: 38 },
    { mealId: '53282', calories: 810, cookingTime: 62 },
    { mealId: '53047', calories: 460, cookingTime: 27 },
    { mealId: '53246', calories: 930, cookingTime: 85 },
    { mealId: '52996', calories: 330, cookingTime: 17 },
    { mealId: '52997', calories: 680, cookingTime: 54 },
    { mealId: '52992', calories: 770, cookingTime: 58 }
];

const MEAL_DATA_MAP = MEAL_DATA.reduce((acc, item) => {
    acc[item.mealId] = { calories: item.calories, cookingTime: item.cookingTime };
    return acc;
}, {});



function initSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('s');

    if (searchTerm) {
        searchInput.value = searchTerm;
        fetchMealsBySearch(searchTerm);
    }
}

searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchMealsBySearch(searchTerm);
    } else {
        errorContainer.textContent = "Please enter a search term.";
        errorContainer.classList.remove("hidden");
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchMealsBySearch(searchTerm);
        }
    }
});

async function fetchMealsBySearch(term) {
    mealsContainer.innerHTML = '';
    resultHeading.innerHTML = `<h2>Searching for: "${term}"</h2>`;
    errorContainer.classList.add("hidden");

    try {
        const response = await fetch(`${SEARCH_URL}${term}`);
        const data = await response.json();

        if (data.meals) {
            await displayMeals(data.meals);
        } else {
            mealsContainer.innerHTML = `<p class="error-message">No recipes found for "${term}". Please try another search term. </p>`;
        }
    } catch (error) {
        errorContainer.textContent = "Failed to fetch recipes.";
        errorContainer.classList.remove("hidden");
    }
}

async function displayMeals(meals) {
    mealsContainer.innerHTML = "";

    
    meals.forEach((meal, index) => {
        const mealsData = MEAL_DATA_MAP[meal.idMeal] || { cookingTime: 'N/A', calories: 'N/A' };
    
        mealsContainer.innerHTML += `
            <div class="recipe-card" data-meal-id="${meal.idMeal}"> 
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image-placeholder">
                <div class="card-body">
                    <h3 class="card-title">${meal.strMeal}</h3>
                    
                    <div>
                        <p class="card-meta">
                            Time: ${mealsData.cookingTime} min - Calories: ${mealsData.calories} cal
                        </p>
                    </div>

                    <div class="card-btns">
                        <button class="details-button" data-id="${meal.idMeal}">View Details</button>
                        </div>
                </div>
            </div>
        `;
    });
}

mealsContainer.addEventListener("click", async (e) => {
    const detailsBtn = e.target.closest(".details-button");

    if (detailsBtn) {
        e.stopPropagation();
        const mealId = detailsBtn.getAttribute("data-id");
        handleMealClick(e, mealId);
    } 
});


backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    mealsContainer.scrollIntoView({ behavior: "smooth" });
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
        }
    } catch (error) {
        errorContainer.textContent = "Could not load recipe details. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}

document.addEventListener("DOMContentLoaded", initSearch);
