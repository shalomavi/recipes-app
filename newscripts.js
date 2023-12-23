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
const API_ADDRESS = "https://recipe-app-i8yd.onrender.com/";
// const API_ADDRESS = "https://www.pythonanywhere.com/user/shalomavi/files/home/shalomavi/recipe_server/main.py";
const RECIPES_ROUTE = "/recipes";
let recipe_dates = [
    ['2023-09-12', "pasta"]

    // Add more dates as needed
];
main();


// show all recipes
async function showAllRecipes(route) {
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
    console.log(recipe.steps);
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

    const calendarDiv = document.createElement("div");
    calendarDiv.className = "calenderDiv";
    const dateForm = document.createElement("form");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "dateInput";
    dateInput.id = "dateInput";
    const dateTitle = document.createElement("h3");
    dateTitle.textContent = "Schedule a date for making the recipe :)";
    const dateBtn = document.createElement("button");
    dateBtn.innerHTML = "Schedule";
    dateBtn.className = "dateBtn";
    dateBtn.type = "submit";

    dateForm.appendChild(dateTitle);
    dateForm.appendChild(dateInput);
    dateForm.appendChild(dateBtn);

    calendarDiv.appendChild(dateForm);

    recipeDiv.appendChild(url);
    recipeDiv.appendChild(nameTitle);
    recipeDiv.appendChild(name);
    recipeDiv.appendChild(ingredientsTitle);
    recipeDiv.appendChild(ingredientsList);
    recipeDiv.appendChild(stepsTitle);
    recipeDiv.appendChild(steps);
    recipeDiv.appendChild(calendarDiv);

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

    dateBtn.addEventListener("click", (event) => {
        event.preventDefault();
        saveRecipeDate(recipe.id);
    });
    deleteBtn.addEventListener("click", () => {
        deleteRecipe(recipe.id);
    });
    updateBtn.addEventListener("click", () => {
        updateRecipe(recipe.id);
    });
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
            url: newUrl,
            recipe_date: ''
        }
        await sendRecipe(newRecipe);
        clearDisplayArea();
        await showAllRecipes(RECIPES_ROUTE);
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
        if (index > 1 && part.match(/^\d+$/) && !inputString.match('<br>')) {
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
        console.log(updatedRecipe);
        routeId = `/${recipeId}`;
        await fetch(API_ADDRESS + RECIPES_ROUTE + routeId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(updatedRecipe)
        });
        clearDisplayArea();
        await showAllRecipes(RECIPES_ROUTE);
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
    await showAllRecipes(RECIPES_ROUTE);
}

// search for a recipe
function searchRecipes() {
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("Form submitted"); // Debugging line
            const searchInput = document.getElementById("search-input");
            console.log("searchInput:", searchInput); // Debugging line
            if (searchInput) {
                const searchedRecipe = searchInput.value || "_";
                console.log("searchedRecipe:", searchedRecipe); // Debugging line
                const filteredRecipes = await filterRecipes(searchedRecipe);
                console.log("Filtered recipes:", filteredRecipes); // Debugging line
                clearDisplayArea();
                renderRecipes(filteredRecipes);
            } else {
                console.error("searchInput not found"); // Debugging line
            }
        });
    } else {
        console.error("searchForm not found"); // Debugging line
    }
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

// Save recipe date
async function saveRecipeDate(recipeId) {
    const recipeDiv = document.getElementById(recipeId);
    const dateInput = recipeDiv.querySelector("#dateInput");
    const recipeDate = await dateInput.value
    console.log(recipeDate);
    const routeId = `/${recipeId}`;

    // Get the existing recipe data from the DOM
    const name = recipeDiv.querySelector(".name").innerHTML;
    const ingredientsList = recipeDiv.querySelectorAll("li");
    const ingredients = Array.from(ingredientsList).map(li => li.innerHTML);
    const steps = recipeDiv.querySelector(".steps").innerHTML;
    const url = recipeDiv.querySelector(".url").src;
    const updatedRecipe = {
        id: parseInt(recipeId),
        name: name,
        ingredients: ingredients,
        steps: steps,
        url: url,
        recipe_date: recipeDate,
    };

    // Use PUT request and send the updated recipe data as JSON
    try {
        const response = await fetch(`${API_ADDRESS}${RECIPES_ROUTE}/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe),
        });
        if (!response.ok) {
            throw new Error("Failed to save recipe date");
        }

    } catch (error) {
        console.error("Error:", error);
    }
    await updateCalendar();
    // Clear the display and refresh the recipes
    clearDisplayArea();
    await showAllRecipes(RECIPES_ROUTE);

}

function createCalendar() {
    document.addEventListener('loadDOMContentLoaded', updateCalendar());
    // dateBtn.addEventListener('submit', updateCalendar());
}

async function updateCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'en',
        headerToolbar: {
            left: 'customPrevButton,customNextButton today',
            center: 'title',
            right: ''
        },
        customButtons: {
            customPrevButton: {
                text: ' ', // Leave the text empty
                icon: '<i> fas fa-backward fa-xs </i>', // Define the Font Awesome icon for backward
                click: function () {
                    // Handle the click event for your custom backward button
                    calendar.prev();
                }
            },
            customNextButton: {
                text: ' ', // Leave the text empty
                icon: '<i> fas fa-forward fa-xs </i>', // Define the Font Awesome icon for forward
                click: function () {
                    // Handle the click event for your custom forward button
                    calendar.next();
                }
            }
        },
        events: [],
    });
    const recipesDates = await getRecipesDates();
    let events = recipesDates.map(function ([recipeTitle, date]) {
        return {
            title: `Making ${recipeTitle}`, // Event title
            start: date, // Start date from recipe_dates array
            allDay: true, // Set it as an all-day event
        };
    });
    console.log(events);

    // Set the events data
    calendar.addEventSource(events);

    calendar.render();
    clearDisplayArea();
    await showAllRecipes(RECIPES_ROUTE);
}

async function getRecipesDates() {
    const recipes = await getRecipes(RECIPES_ROUTE);
    const recipesDates = [];
    for (let recipe of recipes) {
        const nameDateArr = []
        for (let key in recipe) {
            if (recipe.hasOwnProperty(key)) {

                if (key == 'name') {
                    nameDateArr.push(recipe[key])
                }
                if (key == 'recipe_date') {
                    nameDateArr.push(recipe[key])
                }
                if (nameDateArr[1]) {
                    recipesDates.push(nameDateArr);
                }
            }
        }
    }
    return recipesDates;
};


//main
async function main() {
    await showAllRecipes(RECIPES_ROUTE);
    addRecipe();
    searchRecipes();
    createCalendar();
}

