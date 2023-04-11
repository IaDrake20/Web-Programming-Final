console.log("Hello from script!");

let hp_current = 100;
let hp_max = 100;

let mana_current = 10;
let mana_max = 10;

let ap_current = 4;
let ap_max = 4;

let xp_current = 0;
let xp_threshold = 25;

let character_level_current = 1;
let character_level_max = 10;

let chaos_level_current = 1;
let chaos_level_max = 10;

let score = 69;

let player_stats = {
  hp_max,
  hp_current,
  mana_current,
  mana_max,
  ap_current,
  ap_max,
  xp_current,
  xp_threshold,
  character_level_current,
  character_level_max,
};
const healthValues = document.querySelector("#health-values");
const manaValues = document.querySelector("#mana-values");
const actionPointsValues = document.querySelector("#action-points-values");
const experienceValues = document.querySelector("#experience-values");

const healthBar = document.querySelector("#health-bar");
const manaBar = document.querySelector("#mana-bar");
const actionPointsBar = document.querySelector("#action-points-bar");
const experienceBar = document.querySelector("#experience-bar");

const updatePlayerStats = () => {
  healthValues.innerText = `${player_stats.hp_current}/${player_stats.hp_max}`;

  manaValues.innerText = `${player_stats.mana_current}/${player_stats.mana_max}`;

  actionPointsValues.innerText = `${player_stats.ap_current}/${player_stats.ap_max}`;

  experienceValues.innerText = `${player_stats.xp_current}/${player_stats.xp_threshold}`;

  let hpPercentage = player_stats.hp_current / player_stats.hp_max;
  let manaPercentage = player_stats.mana_current / player_stats.mana_max;
  let apPercentage = player_stats.ap_current / player_stats.ap_max;
  let xpPercentage = player_stats.xp_current / player_stats.xp_threshold;

  healthBar.style.width = `${150 * hpPercentage}px`;
  manaBar.style.width = `${150 * manaPercentage}px`;
  actionPointsBar.style.width = `${150 * apPercentage}px`;
  experienceBar.style.width = `${150 * xpPercentage}px`;
};
updatePlayerStats();

const middleDiv = document.querySelector("#middle");
const exploreDiv = document.querySelector("#explore");
const combatDiv = document.querySelector("#combat");


const handleInput = (event) => {
  event.preventDefault();

  if (!actionInput.value) return;
  event.preventDefault();
  const p = document.createElement("p");
  const value = actionInput.value;
  p.innerText = value;

  // scroll middleDiv down to see the new entry
  p.scrollIntoView();

  // clear value of middle div
  actionInput.value = "";

  // if user inputs a keyword, subtract (or add) to player stats
  // temporary, for testing
  if (value === "hp") {
    player_stats.hp_current -= 5;
    p.style.color = "red";
    if (player_stats.hp_current <= 0) player_stats.hp_current = 0;
  } else if (value === "mana") {
    player_stats.mana_current -= 1;
    p.style.color = "blue";
    if (player_stats.mana_current <= 0) player_stats.mana_current = 0;
  } else if (value === "mana +") {
    player_stats.mana_current += 1;
    p.style.color = "blue";
    if (player_stats.mana_current >= 10) player_stats.mana_current = 10;
  } else if (value === "ap") {
    player_stats.ap_current -= 1;
    p.style.color = "green";
    if (player_stats.ap_current <= 0) player_stats.ap_current = 0;
  } else if (value === "xp") {
    player_stats.xp_current += 5;
    p.style.color = "yellow";
    if (player_stats.xp_current >= player_stats.xp_threshold)
      player_stats.xp_current = player_stats.xp_threshold;
  } else if (value === "random item") {
    fetch("http://localhost:3001/random-item")
      .then((response) => response.json())
      .then((data) => {
        const itemP = document.createElement("p");
        itemP.innerText = data.Name;
        itemP.style.color = "violet";
        middleDiv.appendChild(itemP);
      });
  } else if (value === "combat") {
    p.style.display = "none";
    Combat();
  }

  updatePlayerStats();

  middleDiv.appendChild(p);
};

const Combat = () => {
  exploreDiv.style.display = "none";
  combatDiv.style.display = "flex";
}

const Explore = (event) => {
  combatDiv.style.display = "none";
  exploreDiv.style.display = "flex";
}

const actionInput = document.querySelector("#action-input");
actionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput(e);
});

document.querySelector("#submit-button").addEventListener("click", (e) => handleInput(e));
document.querySelector("#end-button").addEventListener("click", (e) => Explore(e));



const levelDiv = document.querySelector("#player-level");
levelDiv.innerText = `Level: ${player_stats.character_level_current}`;

const chaos = document.querySelector("#chaos-level");
chaos.innerText = `${chaos_level_current}`;

let scoreDiv = document.querySelector("#score");
scoreDiv.innerText = score;
