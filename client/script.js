// p with number representation of values (eg. 100/100)
const healthValues = document.querySelector("#health-values");
const manaValues = document.querySelector("#mana-values");
const actionPointsValues = document.querySelector("#action-points-values");
const experienceValues = document.querySelector("#experience-values");

// img that shows current stats fill, scale this to shrink the bar
const healthBar = document.querySelector("#health-bar");
const manaBar = document.querySelector("#mana-bar");
const actionPointsBar = document.querySelector("#action-points-bar");
const experienceBar = document.querySelector("#experience-bar");

// misc selections
const middleDiv = document.querySelector("#middle");
const exploreDiv = document.querySelector("#explore");
const combatDiv = document.querySelector("#combat");
const actionInput = document.querySelector("#action-input");
const levelDiv = document.querySelector("#player-level");
const chaos = document.querySelector("#chaos-level");
const scoreDiv = document.querySelector("#score");
const submitButton = document.querySelector("#submit-button");
const endButton = document.querySelector("#end-button");

// attach event listeners
submitButton.addEventListener("click", (e) => handleInput(e));
endButton.addEventListener("click", (e) => Explore(e));
actionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput(e);
});

// initialize player_stats object
let player_stats = {
  hp_max: 100,
  hp_current: 100,
  mana_current: 10,
  mana_max: 10,
  ap_current: 4,
  ap_max: 4,
  xp_current: 0,
  xp_threshold: 25,
  character_level_current: 1,
  character_level_max: 10,
  score: 69,
};

// initialize other UI things
levelDiv.innerText = `Level: ${player_stats.character_level_current}`;
chaos.innerText = `${chaos_level_current}`;
scoreDiv.innerText = score;

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
        itemP.innerText = data.name;
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
};

const Explore = (event) => {
  combatDiv.style.display = "none";
  exploreDiv.style.display = "flex";
};
