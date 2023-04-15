// selections
const homePage = document.querySelector("#home-page");
const spinner = document.getElementById("loading-spinner");
const loginButton = document.querySelector("#login-button");
const logoutButton = document.querySelector("#logout-button");
const signupButton = document.querySelector("#signup-button");
const usernameInput = document.querySelector("#username-input");
const userPasswordInput = document.querySelector("#userpassword-input");
const infoMessagesElement = document.querySelector("#info-messages-element");

const playButtonsDiv = document.querySelector("#play-buttons");
const playSoloButton = document.querySelector("#play-solo-button");
const playOnlineButton = document.querySelector("#play-online-button");

// reusable colors
const GREEN = "#32CD32";
const RED = "#B22222";
const BLUE = "#0074D9";

// user's authentication status
let authUser;

// on signup clicked, validate user and password entries exist and are valid
// then, send POST to /signup to create an account in the database
// if account was created successsfully, login, else notify user of error
signupButton.addEventListener("click", async () => {
  const username = usernameInput.value;
  const userpassword = userPasswordInput.value;

  // validate username (must exist, must be between 3-16 chars)
  // if username invalid, add text to an error message below the button
  if (!username) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Error: Please enter a username...";
    return;
  } else if ((username.length > 16) | (username.length < 3)) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText =
      "Error starting: Usernames must be between 3-16 characters long.";
    return;
  }

  // validate password
  if (!userpassword) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Error: Please enter a password...";
    return;
  }

  showLoadingSpinner();

  const response = await fetch(`http://localhost:3001/signup`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: username, pass: userpassword }),
  });

  hideLoadingSpinner();

  if (!response.ok) {
    const msg = await response.text();
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Failed to sign up: " + msg;
  } else {
    infoMessagesElement.style.color = BLUE;
    infoMessagesElement.innerText = `Account created!`;
    await login();
  }
});

loginButton.addEventListener("click", async () => {
  await login();
});

logoutButton.addEventListener("click", async () => {
  await logout();
});

// just simply move to game page for now
playSoloButton.addEventListener("click", async () => {
  window.location.href = "/";
});

playOnlineButton.addEventListener("click", async () => {
  window.location.href = "/";
});

const login = async () => {
  const username = usernameInput.value;
  const userpassword = userPasswordInput.value;

  // validate username (must exist, must be between 3-16 chars)
  // if username invalid, add text to an error message below the button
  if (!username) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Error: Please enter a username...";
    return;
  } else if ((username.length > 16) | (username.length < 3)) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText =
      "Error starting: Usernames must be between 3-16 characters long.";
    return;
  }

  // validate password
  if (!userpassword) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Error: Please enter a password...";
    return;
  }

  showLoadingSpinner();

  const response = await fetch(`http://localhost:3001/login`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: username, pass: userpassword }),
  });

  hideLoadingSpinner();

  if (!response.ok) {
    const msg = await response.text();
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Failed to log in: " + msg;
  } else {
    json = await response.json();
    authUser = json.userData;
    infoMessagesElement.style.color = GREEN;
    infoMessagesElement.innerText = `Logged in as: ${username}!`;
  }

  updateUI();
};

const logout = async () => {
  const username = usernameInput.value;
  const userpassword = userPasswordInput.value;

  // loading spinner causes flashes, because this operation is extremely fast
  // showLoadingSpinner();

  const response = await fetch(`http://localhost:3001/logout`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: username, pass: userpassword }),
  });

  // hideLoadingSpinner();

  if (!response.ok) {
    infoMessagesElement.style.color = RED;
    infoMessagesElement.innerText = "Failed to log out: " + response.text();
  } else {
    authUser = null;
    infoMessagesElement.style.color = BLUE;
    infoMessagesElement.innerText = `Logged out!`;
  }

  updateUI();
};

// call this when state changes to hide/show different UI elements
const updateUI = () => {
  updateAuthButtons();
  updatePlayButtons();
};

// when auth status changes, call this method to hide/show the login/signup vs logout buttons
const updateAuthButtons = () => {
  if (authUser) {
    console.log("user signed in, updating buttons");
    loginButton.style.display = "none";
    signupButton.style.display = "none";

    logoutButton.style.display = "block";
  } else {
    console.log("user NOT signed in, updating buttons");
    loginButton.style.display = "block";
    signupButton.style.display = "block";

    logoutButton.style.display = "none";
  }
};

const updatePlayButtons = () => {
  if (authUser) {
    playButtonsDiv.style.display = "flex";
  } else {
    playButtonsDiv.style.display = "none";
  }
};

function showLoadingSpinner() {
  spinner.style.display = "block";
}

function hideLoadingSpinner() {
  spinner.style.display = "none";
}
