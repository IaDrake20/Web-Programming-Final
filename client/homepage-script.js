// selections
const homePage = document.querySelector("#home-page");
const beginButton = document.querySelector("#begin-button");
const usernameInput = document.querySelector("#username-input");
const userPasswordInput = document.querySelector("#userpassword-input");
const infoMessagesElement = document.querySelector("#info-messages-element");

// reusable colors
const GREEN = "#32CD32";
const RED = "#B22222";

beginButton.addEventListener("click", async () => {
  const username = usernameInput.value;
  const userpassword = userPasswordInput.value;

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

  //IAN: get user from db
  // url = new URL("http://localhost:3001/auth-name");
  // params = { name: username, password: userpassword };
  // url.search = new URLSearchParams(params).toString();
  // console.log(url.toString());
  // fetch(url);

  //TODO: set this up better
  const verifiedUser = false;

  console.log(username);
  await fetch(`http://localhost:3001/auth-name`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: username, pass: userpassword }),
  });

  if(verifiedUser){
    infoMessagesElement.style.color = GREEN;
    infoMessagesElement.innerText = `Logging in as '${username}'...`;
  } else {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText= 'Incorrect login info';
  }

  addLoadingSpinner();
});

function addLoadingSpinner() {
  console.log("Checking if spinner div already exists...");
  if(document.getElementById("loading-spinner")){
    console.log("Loading Spinner already exists...");
  } else {
    const spinnerDiv = document.createElement("div");
    spinnerDiv.id = "loading-spinner";
    homePage.appendChild(spinnerDiv);
    console.log("Loading spinner created...")
  }
}
