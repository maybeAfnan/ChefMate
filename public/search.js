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
const authInfo = document.getElementById('auth-info');
const usernameDisplay = document.getElementById('username-display');
const logoutButton = document.getElementById('logout-button');

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
    { mealId: '53282', calories: 493, cookingTime: 35 },
    { mealId: '52897', calories: 742, cookingTime: 65 },
    { mealId: '53047', calories: 203, cookingTime: 25 },
    { mealId: '53246', calories: 352, cookingTime: 40 },
    { mealId: '52996', calories: 432, cookingTime: 35 },
    { mealId: '52997', calories: 533, cookingTime: 50 },
    { mealId: '52992', calories: 664, cookingTime: 38 }
];


async function fetchUserInfo() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.loggedIn) {
            authInfo.style.display = 'flex';
            usernameDisplay.textContent = `Welcome, ${data.username}!`;
        } else {
            window.location.href = '/login.html'; 
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        window.location.href = '/login.html';
    }
}

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    });
}


async function getFavoriteStatuses() {
    try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
            return [];
        }
        const favorites = await response.json();
        return favorites.map(fav => fav.meal_id);
    } catch (error) {
        console.error('Error fetching favorite statuses:', error);
        return [];
    }
}

async function toggleFavorite(mealId, mealData) {
    try {
        const favorites = await getFavoriteStatuses();
        const isCurrentlyFavorite = favorites.includes(mealId);

        let response;
        if (isCurrentlyFavorite) {
            response = await fetch(`/api/favorites/${mealId}`, { method: 'DELETE' });
        } else {
            response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mealData)
            });
        }

        if (response.ok) {
            const searchTerm = new URLSearchParams(window.location.search).get('s');
            if (searchTerm) {
                searchMeals(searchTerm);
            }
            return !isCurrentlyFavorite; 
        } else {
            console.error('Failed to toggle favorite:', await response.json());
            return isCurrentlyFavorite; 
        }
    } catch (error) {
        console.error('Network error during toggle favorite:', error);
        return false;
    }
}



function getMealMetaData(mealId) {
    return MEAL_DATA.find(data => data.mealId === mealId) || { calories: 'N/A', cookingTime: 'N/A' };
}

function displayMeals(meals, heading) {
    mealsContainer.innerHTML = '';
    errorContainer.classList.add('hidden');
    resultHeading.textContent = heading;

    if (!meals || meals.length === 0) {
        errorContainer.textContent = 'No recipes found. Try a different search term.';
        errorContainer.classList.remove('hidden');
        return;
    }

    getFavoriteStatuses().then(favorites => {
        meals.forEach((meal, index) => {
            const mealId = meal.idMeal;
            const mealMetaData = getMealMetaData(mealId);
            const isFav = favorites.includes(mealId);

            const mealEl = document.createElement('div');
            mealEl.classList.add('recipe-card');
            mealEl.setAttribute('data-id', mealId);

            mealEl.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image-placeholder">
                <div class="card-body">
                    <h3 class="card-title">${meal.strMeal}</h3>
                    <p class="card-meta">
                        Time: ${mealMetaData.cookingTime} min - Calories: ${mealMetaData.calories} cal
                    </p>
                    <div class="card-btns">
                        <button class="details-button" data-id="${mealId}">View Details</button>
                        <button class="add-favorites-button" data-id="${mealId}" 
                            data-name="${meal.strMeal}" 
                            data-img="${meal.strMealThumb}" 
                            data-category="${meal.strCategory}"
                            data-calories="${mealMetaData.calories}"
                            data-time="${mealMetaData.cookingTime}"
                        >
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i> 
                        </button>
                    </div>
                </div>
            `;
            mealsContainer.appendChild(mealEl);
        });
    });
}

mealsContainer.addEventListener("click", async (e) => {
    const detailsBtn = e.target.closest(".details-button");
    const favBtn = e.target.closest(".add-favorites-button");

    if (detailsBtn) {
        e.stopPropagation();
        const mealId = detailsBtn.getAttribute("data-id");
        handleMealClick(e, mealId);
    } else if (favBtn) {
        e.stopPropagation();
        const mealId = favBtn.getAttribute("data-id");
        const mealData = {
            idMeal: mealId,
            strMeal: favBtn.dataset.name,
            strMealThumb: favBtn.dataset.img,
            strCategory: favBtn.dataset.category,
            calories: parseInt(favBtn.dataset.calories),
            cookingTime: parseInt(favBtn.dataset.time),
        };
        
        await toggleFavorite(mealId, mealData);
    }
});


backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    mealsContainer.scrollIntoView({ behavior: "smooth" });
});

async function searchMeals(searchTerm) {
    try {
        const response = await fetch(`${SEARCH_URL}${searchTerm}`);
        const data = await response.json();
        displayMeals(data.meals, `Search Results for: "${searchTerm}"`);
        searchInput.value = searchTerm;
    } catch (error) {
        errorContainer.textContent = 'Failed to load search results.';
        errorContainer.classList.remove('hidden');
        displayMeals(null, 'Error');
    }
}

async function handleMealClick(e, mealId) {
    const mealsData = getMealMetaData(mealId);
    
    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        
        mealDetailsContent.innerHTML = ''; 

        if (meal) {
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
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

function redirectToSearchResults() {
    const searchTerm = document.getElementById("search-input").value.trim();
    if (searchTerm) {
       window.location.href = `search-results.html?s=${encodeURIComponent(searchTerm)}`;
    } else {
        alert("Please enter a search term!");
    }
}

searchBtn.addEventListener("click", redirectToSearchResults);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") redirectToSearchResults();
});


function initSearch() {
    fetchUserInfo();
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('s');

    if (searchTerm) {
        searchMeals(searchTerm);
    } else {
        resultHeading.textContent = 'Search results will appear here.';
    }
}

document.addEventListener("DOMContentLoaded", initSearch);