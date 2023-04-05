console.log("Hello from script!");

let hp_current = 100;
let hp_max = 100;

let mana_current = 10;
let mana_max = 10;

let action_points_current = 4;
let action_points_max = 4;

let experience_current = 0;
let experience_threshold = 25;

let player_stats = {
  hp_max,
  hp_current,
  mana_current,
  mana_max,
  action_points_current,
  action_points_max,
  experience_current,
  experience_threshold,
};

// TODO: querySelect the actual div/p/whatever elements
// TODO: set background of these to a semi-filled in bar that represents the ratio of first : second value.
const healthDiv = document.querySelector("#health");
healthDiv.innerText = `Health ${player_stats.hp_current}/${player_stats.hp_max}`;

const manaDiv = document.querySelector("#mana");
manaDiv.innerText = `Mana ${player_stats.mana_current}/${player_stats.mana_max}`;

const actionPointsDiv = document.querySelector("#action-points");
actionPointsDiv.innerText = `AP ${player_stats.action_points_current}/${player_stats.action_points_max}`;

const experienceDiv = document.querySelector("#experience");
experienceDiv.innerText = `XP ${player_stats.experience_current}/${player_stats.experience_threshold}`;

const middleDiv = document.querySelector("#middle");
const actionInput = document.querySelector("#action-input");
actionInput.addEventListener("keypress", (event) => {
  // on pressing enter, put message in middleDiv
  if (event.key === "Enter") {
    event.preventDefault();
    const p = document.createElement("p");
    p.innerText = actionInput.value;
    middleDiv.appendChild(p);

    // scroll middleDiv down to see the new entry
    p.scrollIntoView();

    // clear value of middle div
    actionInput.value = "";
  }
});
