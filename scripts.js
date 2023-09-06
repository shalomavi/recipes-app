// Define constants and DOM elements at the beginning
const recipeForm = document.getElementById('recipe-form');
const recipeName = document.getElementById('recipe-name');
const ingredients = document.getElementById('ingredients');
const steps = document.getElementById('steps');
const recipeUrl = document.getElementById('recipeUrl');
const displayArea = document.getElementById('display-area');
const apiUrl = 'http://127.0.0.1:8000/recipes';

// Initialize an empty array for recipes
let recipes = [];

// Fetch recipes and add event listeners
fetchRecipes();
addRecipe();

// Function to fetch recipes from the server
async function fetchRecipes() {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            recipes = await response.json();
            refreshDisplay();
        } else {
            console.error("Failed to fetch recipes from the server");
        }
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

// Function to create a new recipe
async function addRecipe() {
    recipeForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const enteredRecipeName = recipeName.value;
        const enteredIngredients = ingredients.value.split(',');
        const enteredSteps = steps.value;
        const enteredRecipeUrl = recipeUrl.value || "https://cdn.dribbble.com/users/5393625/screenshots/18264661/media/a4a178d24054ad1712c25c52596adb01.jpg"
        const newRecipe = {
            name: enteredRecipeName,
            ingredients: enteredIngredients,
            steps: enteredSteps,
            url: enteredRecipeUrl,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecipe),
            });

            if (response.ok) {
                const createdRecipe = await response.json();
                recipes.push(createdRecipe);
                clearFormFields();
                refreshDisplay();
            } else {
                console.error("Failed to create recipe on the server");
            }
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    });
}

// Function to clear form fields
function clearFormFields() {
    recipeName.value = '';
    ingredients.value = '';
    steps.value = '';
    recipeUrl.value = '';
}

// Function to create an image element
function createImageElement(url) {
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('recipeUrl');
    return img;
}

// Function to create a text element
function createTextElement(tagName, text) {
    const element = document.createElement(tagName);
    element.textContent = text;
    return element;
}

// Function to create a list element for ingredients
function createListElement(ingredients) {
    const list = document.createElement('ul');
    ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        list.appendChild(listItem);
    });
    return list;
}

// Function to display a recipe
function displayRecipe(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipeDiv');

    recipeDiv.appendChild(createImageElement(recipe.url));
    recipeDiv.appendChild(createTextElement('h3', 'Recipe Name'));
    recipeDiv.appendChild(createTextElement('p', recipe.name));
    recipeDiv.appendChild(createTextElement('h3', 'Ingredients'));
    recipeDiv.appendChild(createListElement(recipe.ingredients));
    recipeDiv.appendChild(createTextElement('h3', 'Steps'));

    const stepsParagraph = document.createElement('p');
    const stepsLines = recipe.steps.split('\n');

    stepsLines.forEach(line => {
        const stepLine = document.createElement('span');
        stepLine.textContent = line;
        stepsParagraph.appendChild(stepLine);
        stepsParagraph.appendChild(document.createElement('br'));
    });
    recipeDiv.appendChild(stepsParagraph);

    recipeDiv.appendChild(createActionButton('Delete', 'deleteBtn', () => deleteRecipe(recipe)));
    recipeDiv.appendChild(createActionButton('Update', 'updateBtn', () => showUpdateForm(recipe, recipeDiv)));

    displayArea.appendChild(recipeDiv);
}

// Function to create an action button
function createActionButton(text, className, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener('click', clickHandler);
    return button;
}

// Function to delete a recipe
async function deleteRecipe(recipeToDelete) {
    const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeToDelete.id);
    if (recipeIndex !== -1) {
        try {
            const response = await fetch(`${apiUrl}/${recipeToDelete.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Recipe deleted successfully on server.");
                recipes.splice(recipeIndex, 1);
                refreshDisplay();
            } else {
                console.error("Failed to delete recipe on the server");
            }
        } catch (error) {
            console.error("ERROR:", error.message);
        }
    }
}

// Function to clear the display area
function clearDisplayArea() {
    while (displayArea.firstChild) {
        displayArea.removeChild(displayArea.firstChild);
    }
}

// Function to show the update form
function showUpdateForm(recipeToUpdate, recipeDiv) {
    const nameInput = createInput('input', recipeToUpdate.name);
    const ingredientsInput = createInput('input', recipeToUpdate.ingredients.join(','));
    const stepsInput = createInput('textarea', recipeToUpdate.steps);
    const urlInput = createInput('input', recipeToUpdate.url);
    const saveButton = createActionButton('Save Changes', 'saveBtn', () => updateRecipe(recipeToUpdate, nameInput, ingredientsInput, stepsInput, urlInput, recipeDiv));

    recipeDiv.innerHTML = ''; // Clear the div
    recipeDiv.appendChild(createTextElement('h3', 'Recipe Name'));
    recipeDiv.appendChild(nameInput);
    recipeDiv.appendChild(createTextElement('h3', 'Ingredients'));
    recipeDiv.appendChild(ingredientsInput);
    recipeDiv.appendChild(createTextElement('h3', 'Steps'));
    recipeDiv.appendChild(stepsInput);
    recipeDiv.appendChild(createTextElement('h3', 'Url'));
    recipeDiv.appendChild(urlInput);
    recipeDiv.appendChild(saveButton);
}

// Function to update a recipe
async function updateRecipe(recipeToUpdate, nameInput, ingredientsInput, stepsInput, urlInput, recipeDiv) {
    const updatedRecipe = {
        name: nameInput.value,
        ingredients: ingredientsInput.value.split(','),
        steps: stepsInput.value,
        url: urlInput.value,
        id: recipeToUpdate.id, // Include the ID
    };

    try {
        const response = await fetch(`${apiUrl}/${recipeToUpdate.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe),
        });

        if (response.ok) {
            console.log("Recipe updated successfully on the server.");
            const updatedRecipeData = await response.json();
            const recipeIndex = recipes.findIndex(recipe => recipe.id === updatedRecipeData.id);
            if (recipeIndex !== -1) {
                recipes[recipeIndex] = updatedRecipeData;
            }
            clearDisplayArea();
            recipes.forEach(displayRecipe);
        } else {
            console.error("Failed to update recipe on the server");
        }
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

// Function to create an input element
function createInput(type, value) {
    const input = document.createElement(type);
    input.setAttribute("type", "text");
    input.value = value;
    return input;
}

// Function to refresh the display area
function refreshDisplay() {
    clearDisplayArea();
    recipes.forEach(displayRecipe);
}
