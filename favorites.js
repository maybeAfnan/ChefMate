const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

const favoritesContainer = document.getElementById('favorites-container');
const resultHeading = document.getElementById('result-heading');
const errorContainer = document.getElementById('error-container');

const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");




favoritesContainer.addEventListener("click", async (e) => {
    const detailsBtn = e.target.closest(".details-button");

    if (detailsBtn) {
        e.stopPropagation();
        const mealId = detailsBtn.getAttribute("data-id");
        handleMealClick(e, mealId); 
    } 
});


backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    favoritesContainer.scrollIntoView({ behavior: "smooth" }); 
});


async function handleMealClick(e, mealId) {
    const mealMetaData = { cookingTime: 'N/A', calories: 'N/A' };
    
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
                    Cooking Time: ${mealMetaData.cookingTime} minutes | Calories: ${mealMetaData.calories} calories
                </p>
                <div class="meal-details-instructions">
                    <h3>Instructions</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="meal-details-ingredients">
                    <h3>Ingredients</h3>
                    <ul class="ingredients-list">
                        ${ingredients.map(item => `
                            <li><i class="fas fa-check-circle"></i> ${item.measure} ${item.ingredient}</li>
                        `).join("")}
                    </ul>
                </div>
            `;

            mealDetails.classList.remove("hidden");
            mealDetails.scrollIntoView({ behavior: "smooth" });

        } else {
            mealDetailsContent.innerHTML = '<p style="text-align:center;">Recipe details not found.</p>';
        }
    } catch (error) {
        mealDetailsContent.innerHTML = '<p style="text-align:center;">Could not load recipe details. Please check your connection.</p>';
    }
}

