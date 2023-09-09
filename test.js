const div = document.createElement("div");
const h1 = document.createElement("h1");
h1.innerText = "hello";
div.appendChild(h1);
document.body.appendChild(div);

const secondDiv = document.createElement("div");
const secondH1 = document.createElement("h1");
secondH1.innerText = "hello1";
secondDiv.appendChild(secondH1);
body.appendChild(secondDiv);

// clearDisplayArea();



function clearDisplayArea() {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}