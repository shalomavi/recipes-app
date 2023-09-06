// create basic elements
const formArea = document.getElementById("formArea");
const recipeForm = document.getElementById("recipe-form");
const recipeName = document.getElementById("recipe-name");
const ingredients = document.getElementById("recipe-ingredients");
const steps = document.getElementById("recipe-steps");
const recipeUrl = document.getElementById("recipe-url");
const displayAreaDiv = document.getElementById("displayAreaDiv");
const displayArea = document.getElementById("display-area");

// setUp
const API_ADDRESS = "http://127.0.0.1:8000";
RECIPES_ROUTE = "/recipes";
main();


// show all recipes
async function showAllRceipes(route) {
    let recipes = await getRecipes(route);
    renderRecipes(recipes);

}

function renderRecipes(recipes) {
    recipes.forEach((recipe) => {
        renderRecipe(recipe);
    })
}

//get recipes
async function getRecipes(route) {
    try {
        let response = await fetch(`${API_ADDRESS}${route}`);
        if (!response.ok) {
            throw new Error("faild to fetch recipes");
        }
        recipes = await response.json();
        return recipes;
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}

// show a recipe
function renderRecipe(recipe) {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipeDiv";
    recipeDiv.id = recipe.id;

    const nameTitle = document.createElement("h3");
    nameTitle.innerHTML = "Name";
    const name = document.createElement("p");
    name.className = "name";
    name.innerHTML = recipe.name;

    const stepsTitle = document.createElement("h3");
    stepsTitle.innerHTML = "Steps";
    const steps = document.createElement("p");
    const newStepsDigits = addNewLineBeforeNumbers(recipe.steps);
    steps.className = "steps";
    steps.innerHTML = newStepsDigits;

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.innerHTML = "Ingredients";
    const ingredients = document.createElement("p");
    ingredients.className = "ingredients";
    ingredients.innerHTML = recipe.ingredients;
    const ingredientsArray = ingredients.innerHTML.split(",");
    const ingredientsList = document.createElement("ul");

    ingredientsArray.forEach((ingredient) => {
        const li = document.createElement("li");
        li.innerHTML = ingredient;
        ingredientsList.appendChild(li);
    });

    const url = document.createElement("img");
    url.className = "url";
    url.src = recipe.url || "https://cdn.dribbble.com/users/5393625/screenshots/18264661/media/a4a178d24054ad1712c25c52596adb01.jpg";

    recipeDiv.appendChild(url);
    recipeDiv.appendChild(nameTitle);
    recipeDiv.appendChild(name);
    recipeDiv.appendChild(ingredientsTitle);
    recipeDiv.appendChild(ingredientsList);
    recipeDiv.appendChild(stepsTitle);
    recipeDiv.appendChild(steps);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttonsDiv";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerHTML = "Delete";
    const updateBtn = document.createElement("button");
    updateBtn.className = "updateBtn";
    updateBtn.innerHTML = "Update";
    buttonsDiv.appendChild(deleteBtn);
    buttonsDiv.appendChild(updateBtn);

    recipeDiv.appendChild(buttonsDiv);
    displayArea.appendChild(recipeDiv);

    deleteBtn.addEventListener("click", () => {
        deleteRecipe(recipe.id);
    })
    updateBtn.addEventListener("click", () => {
        updateRecipe(recipe.id);
    })

}
// add a recipe
async function addRecipe() {
    recipeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newName = recipeName.value;
        const newIngredients = ingredients.value;
        const newSteps = steps.value;
        const newStepsDigits = newSteps;
        const newUrl = recipeUrl.value;
        const ingredientsArray = dataToArry(newIngredients);

        const newRecipe = {
            name: newName,
            ingredients: ingredientsArray,
            steps: newStepsDigits,
            url: newUrl
        }
        await sendRecipe(newRecipe);
        clearDisplayArea();
        await showAllRceipes(RECIPES_ROUTE);
    });
}

function dataToArry(str) {
    return str.split(",");
}
function addNewLineBeforeNumbers(inputString) {
    // Use a regular expression to match numbers (digits)
    const regex = /(\d+)/g;

    // Split the string into an array using the regular expression
    const parts = inputString.split(regex);

    // Add a new line before each number except the first one and join the parts
    const resultString = parts.map((part, index) => {
        // Skip the first part (index 0) and add a new line before numbers (digits)
        if (index > 1 && part.match(/^\d+$/)) {
            return '<br>' + part;
        }
        return part;
    }).join('');

    return resultString;
}

async function sendRecipe(newRecipe) {
    try {
        const response = await fetch(`${API_ADDRESS}${RECIPES_ROUTE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecipe)
        });
        if (response.ok) {
            const createdRecipe = await response.json();

        }
    }
    catch (error) {
        console.error(error);
    }
}

//update Recipe
async function updateRecipe(recipeId) {
    const recipeDiv = document.getElementById(recipeId);
    while (recipeDiv.firstChild) {
        recipeDiv.removeChild(recipeDiv.firstChild);
    }
    const recipeDivUpdateForm = recipeForm.innerHTML;
    const form = document.createElement("form");
    form.innerHTML = recipeDivUpdateForm;
    recipeDiv.appendChild(form);
    const updateButton = recipeDiv.querySelector("#submitBtn");
    updateButton.innerHTML = "Update recipe";
    updateButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const updatedName = recipeDiv.querySelector("#recipe-name").value;
        const updatedIngredients = recipeDiv.querySelector("#recipe-ingredients").value;
        const updatedSteps = recipeDiv.querySelector("#recipe-steps").value;
        const updatedUrl = recipeDiv.querySelector("#recipe-url").value;
        const ingredientsArray = dataToArry(updatedIngredients);

        const updatedRecipe = {
            name: updatedName,
            ingredients: ingredientsArray,
            steps: updatedSteps,
            url: updatedUrl
        }
        routeId = `/${recipeId}`;
        await fetch(API_ADDRESS + RECIPES_ROUTE + routeId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(updatedRecipe)
        });
        clearDisplayArea();
        await showAllRceipes(RECIPES_ROUTE);
    });
}

function clearDisplayArea() {
    while (displayArea.firstChild) {
        displayArea.removeChild(displayArea.firstChild);
    }
}
// delete a recipe
async function deleteRecipe(recipeId) {
    routeId = `/${recipeId}`;
    const response = await fetch(API_ADDRESS + RECIPES_ROUTE + routeId, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error("failed to delete recipe");
    }
    clearDisplayArea();
    await showAllRceipes(RECIPES_ROUTE);
}

// search for a recipe
function searchRecipes() {
    const searchForm = document.getElementById("searchForm");
    console.log("serch");
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const searchInput = document.getElementById("search-input");
        const searchedRecipe = searchInput.value || "_";
        console.log("serched:" + searchedRecipe + "......");
        const filteredRecipes = await filterRecipes(searchedRecipe);
        console.log("fitered:" + filteredRecipes + "......");
        clearDisplayArea();
        renderRecipes(filteredRecipes);
    });
}

async function filterRecipes(searchedRecipe) {
    try {
        let response = await fetch(API_ADDRESS + RECIPES_ROUTE + "/search_recipes" + `/${searchedRecipe}`);
        if (!response.ok) {
            throw new Error("faild to fetch recipes");
        }
        const filteredRecipes = await response.json();
        return filteredRecipes;
    }
    catch (error) {
        console.error("Error:", error.message);
    }
}
//main
async function main() {
    showAllRceipes(RECIPES_ROUTE);
    addRecipe();
    searchRecipes();
}

