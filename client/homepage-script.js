console.log("Hello world");

const homePage = document.querySelector("#home-page");
const beginButton = document.querySelector("#begin-button");
const usernameInput = document.querySelector("#username-input");
const infoMessagesElement = document.querySelector("#info-messages-element");

const GREEN = "#32CD32"; //bright green color
const RED = "#B22222";

beginButton.addEventListener("click", () => {
  const username = usernameInput.value;

  // validate username (must exist, must be between 3-16 chars)
  // if username invalid, add text to an error message below the button
  if (!username) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Error starting: Please enter a username to begin...";
    return;
  } else if ((username.length > 16) | (username.length < 3)) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText =
      "Error starting: Usernames must be between 3-16 characters long.";
    return;
  }

  infoMessagesElement.style.color = GREEN;
  infoMessagesElement.innerText = `Logging in as '${username}'...`;

  addLoadingSpinner();
});

function addLoadingSpinner() {
  const spinnerDiv = document.createElement("div");
  spinnerDiv.id = "loading-spinner";

  homePage.appendChild(spinnerDiv);
}