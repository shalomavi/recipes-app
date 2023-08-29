const recipeForm = document.getElementById('recipe-form');
const recipeName = document.getElementById('recipe-name');
const ingredients = document.getElementById('ingredients');
const steps = document.getElementById('steps');
const recipeUrl = document.getElementById('recipeUrl');
const displayArea = document.getElementById('display-area');
let recipes = [];

fetchRecipes();
addRecipe();

function fetchRecipes() {
    if (localStorage.getItem('recipes')) {
        recipes = JSON.parse(localStorage.getItem('recipes'));
    }
    recipes.forEach((recipe, index) => {
        displayRecipe(recipe, index);
    });
}

function saveRecipesToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function addRecipe() {
    recipeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const enteredRecipeName = recipeName.value;
        const enteredIngredients = ingredients.value;
        const enteredSteps = addLineBreaksAfterDigits(steps.value);
        const enteredrecipeUrl = recipeUrl.value;

        const enteredIngredientsArr = enteredIngredients.split(',');
        const newRecipe = {
            name: enteredRecipeName,
            ingredients: enteredIngredientsArr,
            steps: enteredSteps,
            url: enteredrecipeUrl,
        };

        recipes.push(newRecipe);
        saveRecipesToLocalStorage();

        clearFormFields();
        displayRecipe(newRecipe, recipes.length - 1);
    });
}

function addLineBreaksAfterDigits(inputString) {
    let result = '';

    for (let i = 0; i < inputString.length; i++) {


        if (isDigit(inputString[i]) && i > 0) {
            result += '\n'; // Add a newline character
        }

        result += inputString[i];
    }

    return result;
}

function isDigit(char) {
    return !isNaN(parseInt(char));
}


function clearFormFields() {
    recipeName.value = '';
    ingredients.value = '';
    steps.value = '';
    recipeUrl.value = '';
}

function createImageElement(url) {
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('recipeUrl');
    return img;
}

function createTextElement(tagName, text) {
    const element = document.createElement(tagName);
    element.textContent = text;
    return element;
}

function createListElement(ingredients) {
    const list = document.createElement('ul');
    ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.textContent = ingredient;
        list.appendChild(listItem);
    });
    return list;
}

function displayRecipe(recipe, index) {
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

    recipeDiv.appendChild(createDeleteButton(index));
    recipeDiv.appendChild(createUpdateButton(index, recipeDiv));

    displayArea.appendChild(recipeDiv);
}


function createDeleteButton(index) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteBtn');
    deleteButton.onclick = function () {
        deleteRecipe(index);
    };
    return deleteButton;
}

function createUpdateButton(index, recipeDiv) {
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.classList.add('updateBtn');
    updateButton.onclick = function () {
        showUpdateForm(index, recipeDiv);
    };
    return updateButton;
}

function showUpdateForm(index, recipeDiv) {
    clearDiv(recipeDiv);

    const updatedRecipe = recipes[index];
    const nameInput = createInput('input', updatedRecipe.name);
    const ingredientsInput = createInput('input', updatedRecipe.ingredients.join(','));
    const stepsInput = createInput('textarea', updatedRecipe.steps);
    const urlInput = createInput('input', updatedRecipe.url);
    const saveButton = createSaveButton(index, nameInput, ingredientsInput, stepsInput, urlInput, recipeDiv);

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

function createSaveButton(index, nameInput, ingredientsInput, stepsInput, urlInput, recipeDiv) {
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.classList.add('saveBtn');

    saveButton.onclick = function () {
        recipes[index].name = nameInput.value;
        recipes[index].ingredients = ingredientsInput.value.split(',');
        recipes[index].steps = stepsInput.value;
        recipes[index].url = urlInput.value;

        displayUpdatedRecipe(index, recipeDiv);
        saveRecipesToLocalStorage();
    };
    return saveButton;
}

function displayUpdatedRecipe(index, recipeDiv) {
    clearDiv(recipeDiv);
    const updatedRecipe = recipes[index];

    recipeDiv.appendChild(createImageElement(updatedRecipe.url)); // Display the updated image
    recipeDiv.appendChild(createTextElement('h3', 'Recipe Name'));
    recipeDiv.appendChild(createTextElement('p', updatedRecipe.name));
    recipeDiv.appendChild(createTextElement('h3', 'Ingredients'));
    recipeDiv.appendChild(createListElement(updatedRecipe.ingredients));
    recipeDiv.appendChild(createTextElement('h3', 'Steps'));

    const stepsParagraph = document.createElement('p');
    const stepsLines = updatedRecipe.steps.split('\n');
    stepsLines.forEach(line => {
        const stepLine = document.createElement('span');
        stepLine.textContent = line;
        stepsParagraph.appendChild(stepLine);
        stepsParagraph.appendChild(document.createElement('br'));
    });
    recipeDiv.appendChild(stepsParagraph);

    recipeDiv.appendChild(createDeleteButton(index));
    recipeDiv.appendChild(createUpdateButton(index, recipeDiv));
}



function deleteRecipe(index) {
    if (index >= 0 && index < recipes.length) {
        recipes.splice(index, 1);
        refreshDisplay();
    }
    saveRecipesToLocalStorage();
}

function refreshDisplay() {
    displayArea.innerHTML = '';
    recipes.forEach((recipe, newIndex) => {
        displayRecipe(recipe, newIndex);
    });
}

function createInput(type, value) {
    const input = document.createElement(type);
    input.type = 'text'; // Set the input type to text
    input.value = value;
    return input;
}


function clearDiv(recipeDiv) {
    while (recipeDiv.firstChild) {
        recipeDiv.removeChild(recipeDiv.firstChild);
    }
}
