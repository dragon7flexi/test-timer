const testContainer = document.createElement("div");
testContainer.id = "test-container";

testContainer.style.position = "fixed";
testContainer.style.top = "20%";
testContainer.style.left = "15%";
testContainer.style.backgroundColor = "orange";
testContainer.style.zIndex = "99999";

const testText = document.createElement("p");
testText.innerText = "test";
testText.style.padding = "20px"

testContainer.appendChild(testText);

document.body.appendChild(testContainer);