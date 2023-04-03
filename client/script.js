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
healthDiv.innerText = `${player_stats.hp_current}/${player_stats.hp_max}`;

const manaDiv = document.querySelector("#mana");
manaDiv.innerText = `${player_stats.mana_current}/${player_stats.mana_max}`;

const actionPointsDiv = document.querySelector("#action-points-div");
actionPointsDiv.innerText = `${player_stats.action_points_current}/${player_stats.action_points_max}`;

const experienceDiv = document.querySelector("#experience");
experienceDiv.innerText = `${player_stats.experience_current}/${player_stats.experience_threshold}`;
