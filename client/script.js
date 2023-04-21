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
const attackButton = document.querySelector("#attack-button");
const magicButton1 = document.querySelector("#magic1");
const magicButton2 = document.querySelector("#magic2");
const magicButton3 = document.querySelector("#magic3");
const magicButton4 = document.querySelector("#magic4");
const runButton = document.querySelector("#run-button");
const investigate = document.querySelector("#investigate");
const consumeButton1 = document.querySelectorAll("#health-s");
const consumeButton2 = document.querySelectorAll("#health-m");
const consumeButton3 = document.querySelectorAll("#health-l");
const consumeButton4 = document.querySelectorAll("#mana-s");
const consumeButton5 = document.querySelectorAll("#mana-m");
const consumeButton6 = document.querySelectorAll("#mana-l");
const saveButton = document.querySelector("#save-button");
const legendBox = document.querySelector("#legend");

// attach event listeners
saveButton.addEventListener("click", () => Save());
attackButton.addEventListener("click", () => Attack());
magicButton1.addEventListener("click", () => Magic1());
magicButton2.addEventListener("click", () => Magic2());
magicButton3.addEventListener("click", () => Magic3());
magicButton4.addEventListener("click", () => Magic4());
consumeButton1.forEach((button) => {
  button.addEventListener("click", () => Consume1());
});
consumeButton2.forEach((button) => {
  button.addEventListener("click", () => Consume2());
});
consumeButton3.forEach((button) => {
  button.addEventListener("click", () => Consume3());
});
consumeButton4.forEach((button) => {
  button.addEventListener("click", () => Consume4());
});
consumeButton5.forEach((button) => {
  button.addEventListener("click", () => Consume5());
});
consumeButton6.forEach((button) => {
  button.addEventListener("click", () => Consume6());
});
runButton.addEventListener("click", () => Run());
investigate.addEventListener("click", () => Investigate());
submitButton.addEventListener("click", (e) => handleInput(e));
actionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput(e);
});

const sessionId = window.location.pathname.split("/").pop();

//grab username cookie
let u_name = document.cookie;
console.log("client username is "+u_name);

console.log("printing list of cookies "+document.cookie);

//grabbed from here: http://stackoverflow.com/questions/10730362/ddg#15724300
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  console.log("Cookie found: "+parts.pop().split(';').shift());
}


// initialize player_stats object
let player_stats = {
  Username: getCookie("Username"),
  Password: getCookie("Password"),
  character_level_current: 1,
  hp_max: 100,
  hp_current: 100,
  mana_current: 50,
  mana_max: 50,
  ap_current: 4,
  ap_max: 4,
  xp_current: 0,
  xp_threshold: 25,
  strength: 10,
  score: 69,
  user: {
    Small_H: 0,
    Medium_H: 0,
    Large_H: 0,
    Small_M: 0,
    Medium_M: 0,
    Large_M: 0,
    Equipment_Legs: 0,
    Equipment_Chest: 0,
    Equipment_Arms: 0,
    Equipment_Head: 0,
    Equipment_Weapon: 0,
    World_Current_Stage: 0,
    World_Chaos_Level: 0
  }
};

let enemy_stats = {
  name: 0,
  attack: 0,
  defense: 0,
  health_current: 0,
  health_max: 0,
};

const enemyGeneration = (enemy) => {
  enemy_stats.name = enemy.name;
  enemy_stats.attack = enemy.attack;
  enemy_stats.defense = enemy.defense;
  enemy_stats.health_max = enemy.health;
  enemy_stats.health_current = enemy.health;
};

let ws;

let turn = false;

let inCombat = false;

let chaos_level_current = 1;

// initialize other UI things
levelDiv.innerText = `Level: ${player_stats.character_level_current}`;
chaos.innerText = `${chaos_level_current}`;
scoreDiv.innerText = player_stats.score;

const updatePlayerStats = () => {
  healthValues.innerText = `${player_stats.hp_current}/${player_stats.hp_max}`;

  manaValues.innerText = `${player_stats.mana_current}/${player_stats.mana_max}`;

  actionPointsValues.innerText = `${player_stats.ap_current}/${player_stats.ap_max}`;

  experienceValues.innerText = `${player_stats.xp_current}/${player_stats.xp_threshold}`;

  scoreDiv.innerText = player_stats.score;

  let hpPercentage = player_stats.hp_current / player_stats.hp_max;
  let manaPercentage = player_stats.mana_current / player_stats.mana_max;
  let apPercentage = player_stats.ap_current / player_stats.ap_max;
  let xpPercentage = player_stats.xp_current / player_stats.xp_threshold;

  healthBar.style.width = `${150 * hpPercentage}px`;
  manaBar.style.width = `${150 * manaPercentage}px`;
  actionPointsBar.style.width = `${150 * apPercentage}px`;
  experienceBar.style.width = `${150 * xpPercentage}px`;

  if (player_stats.xp_current >= player_stats.xp_threshold) {
    levelUp();
  }

  if ((player_stats.ap_current == 0) && (enemy_stats.health_current > 0)){
    endTurn();
  }
};
updatePlayerStats();

const levelUp = () => {
    player_stats.character_level_current++;
    player_stats.xp_current -= player_stats.xp_threshold;
    player_stats.hp_max += 10;
    player_stats.mana_max += 5;
    updatePlayerStats();
}

const checkTurn = () => {
  console.log(turn);
  if (!turn) {
    const p = document.createElement("p");
    p.innerText = "Not your turn!  Please wait!";
    middleDiv.appendChild(p);
    return false;
  }
  return true;
};


const Save = async () => {
  //console.log("save "+JSON.parse(player_stats));
  //const data = JSON.parse(player_stats);
  const myUsername = player_stats.user.Username;
  console.log("Saving "+myUsername);

    const response = await fetch("http://localhost:3001/updateUser", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(player_stats),
    });

  const content = await response.json();
  console.log(content);
};


const handleInput = (event) => {
  event.preventDefault();

  if (!checkTurn()) return;

  if (!actionInput.value) return;
  event.preventDefault();
  const p = document.createElement("p");
  value = actionInput.value;
  // scroll middleDiv down to see the new entry
  p.scrollIntoView();

  // if user inputs a keyword, subtract (or add) to player stats
  // temporary, for testing
  if (value === "hp") {
    player_stats.hp_current -= 5;
    p.style.color = "red";
    if (player_stats.hp_current <= 0) player_stats.hp_current = 0;
  } else if (value === "mana") {
    player_stats.mana_current -= 5;
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
  } else if (value === "equipment") {
    fetch("http://localhost:3001/Equipment")
      .then((response) => response.json())
      .then((data) => {
        const itemP = document.createElement("p");
        itemP.innerText = data.name;
        itemP.style.color = "violet";
        middleDiv.appendChild(itemP);
        switch (data.position) {
          case "legs":
            player_stats.user.Equipment_Legs = data;
            break;
          case "arms":
            player_stats.user.Equipment_Arms = data;
            break;
          case "chest":
            player_stats.user.Equipment_Chest = data;
            break;
          case "head":
            player_stats.user.Equipment_Head = data;
            break;
        }
        value = null;
      });
  } else if (value === "weapon") {
    fetch("http://localhost:3001/Weapons")
      .then((response) => response.json())
      .then((data) => {
        const itemP = document.createElement("p");
        itemP.innerText = data.name;
        itemP.style.color = "violet";
        middleDiv.appendChild(itemP);
        player_stats.user.Equipment_Weapon = data;
        value = null;
      });
  } else if (value === "consumable") {
    fetch("http://localhost:3001/Consumables")
      .then((response) => response.json())
      .then((data) => {
        const itemP = document.createElement("p");
        itemP.innerText = data.name;
        itemP.style.color = "violet";
        middleDiv.appendChild(itemP);
        switch (data.id) {
          case 1:
            currConsumable = document.querySelectorAll("#health-s");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
              player_stats.user.Small_H++;
              updatePlayerStats();
            break;
          case 2:
            currConsumable = document.querySelectorAll("#health-m");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.user.Medium_H++;
            updatePlayerStats();
            break;
          case 3:
            currConsumable = document.querySelectorAll("#health-l");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.user.Large_H++;
            updatePlayerStats();
            break;
          case 4:
            currConsumable = document.querySelectorAll("#mana-s");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.user.Small_M++;
            updatePlayerStats();
            break;
          case 5:
            currConsumable = document.querySelectorAll("#mana-m");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.user.Medium_M++;
            updatePlayerStats();
            break;
          case 6:
            currConsumable = document.querySelectorAll("#mana-l");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.user.Large_M++;
            updatePlayerStats();
            break;
        }
        value = null;
      });
  } else if (value === "travel") {
    p.style.color = "gray";
    if (player_stats.hp_current < player_stats.hp_max) {
      if (player_stats.hp_current <= player_stats.hp_max - 5) {
        player_stats.hp_current += 5;
      } else {
        player_stats.hp_current = player_stats.hp_max;
      }
    }
    if (player_stats.mana_current < player_stats.mana_max) {
      player_stats.mana_current++;
    }

    if (Math.random() < 0.5) {
      fetch("http://localhost:3001/Events")
      .then((response) => response.json())
      .then((event) => {

        if(Math.random() < event.chance){
          const p = document.createElement("p");
          p.innerText = event.description;
          middleDiv.appendChild(p);

          switch (event.id) {
            case 1: // Treasure
            switch (Math.floor(Math.random() * 3) % 3) {
              case 0:
                fetch("http://localhost:3001/Weapons")
                  .then((response) => response.json())
                  .then((data) => {
                    const itemP = document.createElement("p");
                    itemP.innerText = data.name;
                    itemP.style.color = "violet";
                    middleDiv.appendChild(itemP);
                    if ((data.id > player_stats.user.Equipment_Weapon.id) || (player_stats.user.Equipment_Weapon === 0)) {
                      player_stats.user.Equipment_Weapon = data;
                    }
                    value = null;
                  });
                  updatePlayerStats(); 
                  break;
              case 1:
                fetch("http://localhost:3001/Equipment")
                  .then((response) => response.json())
                  .then((data) => {
                    const itemP = document.createElement("p");
                    itemP.innerText = data.name;
                    itemP.style.color = "violet";
                    middleDiv.appendChild(itemP);
                    switch (data.position) {
                      case "legs":
                        if ((data.id > player_stats.user.Equipment_Legs.id) || (player_stats.user.Equipment_Legs === 0)) {
                            player_stats.user.Equipment_Legs = data;
                        }
                        break;
                      case "arms":
                        if ((data.id > player_stats.user.Equipment_Arms.id) || (player_stats.user.Equipment_Arms === 0)) {
                            player_stats.user.Equipment_Arms = data;
                        }
                        break;
                      case "chest":
                        if ((data.id > player_stats.user.Equipment_Chest.id) || (player_stats.user.Equipment_Chest === 0)) {
                            player_stats.user.Equipment_Chest = data;
                        }
                        break;
                      case "head":
                        if ((data.id > player_stats.user.Equipment_Head.id) || (player_stats.user.Equipment_Head === 0)){
                          player_stats.user.Equipment_Head = data;
                        }
                        break;
                    }
                    value = null;
                  });
                updatePlayerStats(); 
                break;
              case 2:
                fetch("http://localhost:3001/Weapons")
                  .then((response) => response.json())
                  .then((data) => {
                    const itemP = document.createElement("p");
                    itemP.innerText = data.name;
                    itemP.style.color = "violet";
                    middleDiv.appendChild(itemP);
                    if ((data.id > player_stats.user.Equipment_Weapon.id) || (player_stats.user.Equipment_Weapon === 0)) {
                      player_stats.user.Equipment_Weapon = data;
                    }
                  });
                fetch("http://localhost:3001/Equipment")
                  .then((response) => response.json())
                  .then((data) => {
                    const itemP = document.createElement("p");
                    itemP.innerText = data.name;
                    itemP.style.color = "violet";
                    middleDiv.appendChild(itemP);
                    switch (data.position) {
                      case "legs":
                        if ((data.id > player_stats.user.Equipment_Legs.id) || (player_stats.user.Equipment_Legs === 0)) {
                            player_stats.user.Equipment_Legs = data;
                        }
                        break;
                      case "arms":
                        if ((data.id > player_stats.user.Equipment_Arms.id) || (player_stats.user.Equipment_Arms === 0)) {
                            player_stats.user.Equipment_Arms = data;
                        }
                        break;
                      case "chest":
                        if ((data.id > player_stats.user.Equipment_Chest.id) || (player_stats.user.Equipment_Chest === 0)) {
                            player_stats.user.Equipment_Chest = data;
                        }
                        break;
                      case "head":
                        if ((data.id > player_stats.user.Equipment_Head.id) || (player_stats.user.Equipment_Head === 0)){
                          player_stats.user.Equipment_Head = data;
                        }
                        break;
                    }
                  });
                  updatePlayerStats(); 
                break;
              }
              break;
            case 2: // Demon King Altar
              switch (Math.floor(Math.random() * 2) % 2) {
                case 0:
                  fetch("http://localhost:3001/Weapons")
                    .then((response) => response.json())
                    .then((data) => {
                      const itemP = document.createElement("p");
                      itemP.innerText = data.name;
                      itemP.style.color = "violet";
                      middleDiv.appendChild(itemP);
                      if ((data.id > player_stats.user.Equipment_Weapon.id) || (player_stats.user.Equipment_Weapon === 0)) {
                        player_stats.user.Equipment_Weapon = data;
                      }
                      updatePlayerStats();
                    });
                    break;
                case 1:
                  fetch("http://localhost:3001/Consumables")
                    .then((response) => response.json())
                    .then((data) => {
                      const itemP = document.createElement("p");
                      itemP.innerText = data.name;
                      itemP.style.color = "violet";
                      middleDiv.appendChild(itemP);
                      switch (data.id) {
                        case 1:
                          currConsumable = document.querySelectorAll("#health-s");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Small_H++;
                          updatePlayerStats();
                          break;
                        case 2:
                          currConsumable = document.querySelectorAll("#health-m");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Medium_H++;
                          updatePlayerStats();
                          break;
                        case 3:
                          currConsumable = document.querySelectorAll("#health-l");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Large_H++;
                          updatePlayerStats();
                          break;
                        case 4:
                          currConsumable = document.querySelectorAll("#mana-s");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Small_M++;
                          updatePlayerStats();
                          break;
                        case 5:
                          currConsumable = document.querySelectorAll("#mana-m");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Medium_M++;
                          updatePlayerStats();
                          break;
                        case 6:
                          currConsumable = document.querySelectorAll("#mana-l");
                          currConsumable.forEach((consumable) => {
                            consumable.style.display = "flex";
                          });
                          player_stats.user.Large_M++;
                          updatePlayerStats();
                          break;
                      }
                    });
                }
              break;
            case 3: // Trap
              if (Math.random() > 0.5) {
                const p = document.createElement("p");
                p.innerText = "You Evaded the Trap";
                middleDiv.appendChild(p);
              }
              else {
                const p = document.createElement("p");
                p.innerText = "You Sprung The Trap!";
                middleDiv.appendChild(p);
                player_stats.hp_current -= player_stats.character_level_current * 10;
              }
              break;
            case 4: // Combat
              const fight = document.createElement("p");
              fight.innerText = "An Enemy Approaches";
              middleDiv.appendChild(fight);
              Combat();
              break;
            case 5: // Ohl
              const ohl = document.createElement("p");
              ohl.innerText = "You Deserve an A+!";
              middleDiv.appendChild(ohl);
              player_stats.hp_current = player_stats.hp_max;
              player_stats.mana_current = player_stats.mana_max;
              break;
            case 6: // Caravan (Unimplemented)
              break;
            case 7: // Mine (Unimplemented)
              break;
            case 8: // Thief (Unimplemented)
              break;
            }
          }
      });
    }
  } else if (value === "search") {
    p.style.color = "skyblue";
    if ((Math.random() * 10) < 5) {
      fetch("http://localhost:3001/Consumables")
        .then((response) => response.json())
        .then((data) => {
          const itemP = document.createElement("p");
          itemP.innerText = data.name;
          itemP.style.color = "violet";
          middleDiv.appendChild(itemP);
          switch (data.id) {
            case 1:
              currConsumable = document.querySelectorAll("#health-s");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Small_H++;
              updatePlayerStats();
              break;
            case 2:
              currConsumable = document.querySelectorAll("#health-m");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Medium_H++;
              updatePlayerStats();
              break;
            case 3:
              currConsumable = document.querySelectorAll("#health-l");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Large_H++;
              updatePlayerStats();
              break;
            case 4:
              currConsumable = document.querySelectorAll("#mana-s");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Small_M++;
              updatePlayerStats();
              break;
            case 5:
              currConsumable = document.querySelectorAll("#mana-m");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Medium_M++;
              updatePlayerStats();
              break;
            case 6:
              currConsumable = document.querySelectorAll("#mana-l");
              currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
              });
              player_stats.user.Large_M++;
              updatePlayerStats();
              break;
            }
        });
    } else {
        const inv = document.createElement("p");
        inv.innerText = "You Didn't Find Anything Useful.";
        middleDiv.appendChild(inv);
    }
  } else if (value === "hunt") {
    p.style.display = "none";
    Combat();
  } else if (value === "inventory") {
    p.style.display = "none";
    invH = document.createElement("p");
    invC = document.createElement("p");
    invA = document.createElement("p");
    invL = document.createElement("p");
    invW = document.createElement("p");
    if (player_stats.user.Equipment_Head != 0) {
      invH.innerText = "Helmet: " + player_stats.user.Equipment_Head.name;
    } else {
      invH.innerText = "Helmet: None";
    }
    if (player_stats.user.Equipment_Chest != 0) {
      invC.innerText = "Chest: " + player_stats.user.Equipment_Chest.name;
    } else {
      invC.innerText = "Chest: None";
    }
    if (player_stats.user.Equipment_Arms != 0) {
      invA.innerText = "Arms: " + player_stats.user.Equipment_Arms.name;
    } else {
      invA.innerText = "Arms: None";
    }
    if (player_stats.user.Equipment_Legs != 0) {
      invL.innerText = "Legs: " + player_stats.user.Equipment_Legs.name;
    } else {
      invL.innerText = "Legs: None";
    }
    if (player_stats.user.Equipment_Weapon != 0) {
      invW.innerText = "Weapon: " + player_stats.user.Equipment_Weapon.name;
    } else {
      invW.innerText = "Weapon: None";
    }
    middleDiv.appendChild(invH);
    middleDiv.appendChild(invC);
    middleDiv.appendChild(invA);
    middleDiv.appendChild(invL);
    middleDiv.appendChild(invW);
  } else if (value === "wstest") {
    sendMsgToAll("wstest", { color: "blue" });
    actionInput.value = "";
    return;
  } else {
    value = "Invalid Command";
  }
  p.innerText = value;

  updatePlayerStats();

  middleDiv.appendChild(p);

  sendMsgToAll("chat", { msg: actionInput.value });
  actionInput.value = "";
};

// Function to enter combat
const Combat = () => {
  exploreDiv.style.display = "none";
  saveButton.style.display = "none";
  legendBox.style.display = "none";
  combatDiv.style.display = "flex";
  inCombat = true;
  player_stats.ap_current = player_stats.ap_max;
  fetch("http://localhost:3001/Mobs")
    .then((response) => response.json())
    .then((data) => {
      enemyGeneration(data);
      const p = document.createElement("p");
      p.innerText = data.description;
      middleDiv.appendChild(p);
    });
};

// Function to exit combat
const Escape = () => {
  const p = document.createElement("p");
  p.innerText = "You are no longer in Combat.";
  middleDiv.appendChild(p);
  inCombat = false;
  combatDiv.style.display = "none";
  exploreDiv.style.display = "flex";
  saveButton.style.display = "flex";
  legendBox.style.display = "block";
};

// Attack Function
const Attack = () => {
  if (!checkTurn()) return;
  player_stats.ap_current -= 1;
  calcDamage("Enemy");

  updatePlayerStats();
};

// Spell 1 - Heal
const Magic1 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current > 5) {
    if (player_stats.hp_current + 25 > player_stats.hp_max) {
      player_stats.hp_current = player_stats.hp_max;
    } else {
      player_stats.hp_current += 25;
    }
    player_stats.mana_current -= 5;
    player_stats.ap_current -= 1;

    updatePlayerStats();
  } else {
    console.log("No Magic");
  }
};

// Spell 2 - Fireball
const Magic2 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current > 15) {
    inflictDamage("Enemy", 30);
    player_stats.mana_current -= 15;
    player_stats.ap_current -= 1;

    updatePlayerStats();
  } else {
    console.log("No Magic");
  }
};

// Spell 3 - Invigorate
const Magic3 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current > 25) {
    player_stats.mana_current -= 25;
    player_stats.ap_current += 1;

    updatePlayerStats();
  } else {
    console.log("No Magic");
  }
};

// Spell 4 - Escape
const Magic4 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current > 50) {
    player_stats.mana_current -= 50;
    Escape();

    updatePlayerStats();
  } else {
    console.log("No Magic");
  }
};

// Run Function
const Run = () => {
  if (!checkTurn()) return;
  chance = Math.random() * 100;
  player_stats.ap_current -= 1;

  updatePlayerStats();
  if (chance > 66) {
    console.log("Escape Successful");
    Escape();
  } else {
    console.log("Escape Unsuccessful");
  }
};

// Investigate Function
const Investigate = () => {
  if (!checkTurn()) return;
  player_stats.ap_current -= 1;

  const data = document.createElement("p");
  data.innerText =
    "Enemy: " +
    enemy_stats.name +
    " Health: [" +
    enemy_stats.health_current +
    "/" +
    enemy_stats.health_max +
    "] Attack: " +
    enemy_stats.attack +
    " Defense: " +
    enemy_stats.defense;
  middleDiv.appendChild(data);

  updatePlayerStats();
};

const Consume1 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 20 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 20;
  }
  player_stats.user.Small_H--;
  updatePlayerStats();
  if (player_stats.user.Small_H == 0) {
    currConsumable = document.querySelectorAll("#health-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const Consume2 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 50 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 50;
  }
  player_stats.user.Medium_H--;
  updatePlayerStats();
  if (player_stats.user.Medium_H == 0) {
    currConsumable = document.querySelectorAll("#health-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const Consume3 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 100 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 100;
  }
  player_stats.user.Large_H--;
  updatePlayerStats();
  if (player_stats.user.Large_H == 0) {
    currConsumable = document.querySelectorAll("#health-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const Consume4 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 10 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 10;
  }
  player_stats.user.Small_M--;
  updatePlayerStats();
  if (player_stats.user.Small_M == 0) {
    currConsumable = document.querySelectorAll("#mana-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const Consume5 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 25 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 25;
  }
  player_stats.user.Medium_M--;
  updatePlayerStats();
  if (player_stats.user.Medium_M == 0) {
    currConsumable = document.querySelectorAll("#mana-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const Consume6 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 50 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 50;
  }
  player_stats.user.Large_M--;
  updatePlayerStats();
  if (player_stats.user.Large_M == 0) {
    currConsumable = document.querySelectorAll("#mana-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
};

const calcDamage = (target) => {
  damageMult = Math.random();
  randomComponent = 0.75 + ((Math.random() * 5) / 10);
  damage = 0;
  if (target === "Enemy") {
    if (damageMult > 0.95) {
      // Crit
      if (player_stats.user.Equipment_Weapon != 0) {
        damage =
          2 *
          (player_stats.strength + player_stats.user.Equipment_Weapon.value - enemy_stats.defense);
      } else {
        damage = 2 * (player_stats.strength - enemy_stats.defense);
      }
    } else if (damageMult < 0.05) {
      // Miss
      damage = 0;
    } else {
      if (player_stats.user.Equipment_Weapon != 0) {
        damage =
          player_stats.strength + player_stats.user.Equipment_Weapon.value - enemy_stats.defense;
      } else {
        damage = player_stats.strength - enemy_stats.defense;
      }
    }
    if (damage < 0) {
      damage = 1;
    }
    damage = Math.ceil(damage * randomComponent);
    inflictDamage("Enemy", damage);
  }
  if (target === "Player") {
    player_defense = 0;

    if (player_stats.user.Equipment_Head != 0) {
      player_defense += player_stats.Equipment_Head.value;
    }
    if (player_stats.user.Equipment_Chest != 0) {
      player_defense += player_stats.Equipment_Chest.value;
    }
    if (player_stats.user.Equipment_Arms != 0) {
      player_defense += player_stats.Equipment_Arms.value;
    }
    if (player_stats.user.Equipment_Legs != 0) {
      player_defense += player_stats.Equipment_Legs.value;
    }
    if (damageMult > 0.95) {
      // Crit
      damage = 2 * (enemy_stats.attack - player_defense);
    }
    if (damageMult < 0.05) {
      // Miss
      damage = 0;
    } else {
      damage = enemy_stats.attack - player_defense;
    }
    damage = Math.ceil(damage * randomComponent);
    inflictDamage("Player", damage);
  }
};

const inflictDamage = (target, damage) => {
  if (target === "Enemy") {
    if (enemy_stats.health_current - damage > 0) {
      enemy_stats.health_current -= damage;
      const dam = document.createElement("p");
      dam.innerText = enemy_stats.name + " took " + damage + " points of damage.";
      middleDiv.appendChild(dam);
    } else {
      enemy_stats.health_current = 0;
      const dam = document.createElement("p");
      dam.innerText = enemy_stats.name + " took " + damage + " points of lethal damage.";
      middleDiv.appendChild(dam);
      endCombat();
    }
  }
  if (target === "Player") {
    if (player_stats.hp_current - damage > 0) {
      player_stats.hp_current -= damage;
      const dam = document.createElement("p");
      dam.innerText = "You took " + damage + " points of damage.";
      middleDiv.appendChild(dam);
    } else {
      player_stats.hp_current = 0;
      const dam = document.createElement("p");
      dam.innerText = "You took " + damage + " points of lethal damage.";
      middleDiv.appendChild(dam);
      playerDeath();
    }
  }
};

const endCombat = () => {
  player_stats.xp_current += 10;
  player_stats.score += 100;
  updatePlayerStats();
  Escape();
};

const playerDeath = () => {
  console.log("you died");
  const die = document.createElement("p");
  die.innerText = "You are Dead";
  middleDiv.appendChild(die);
  player_stats.hp_current = 0;
  player_stats.mana_current = 0;
  player_stats.score -= 100;
  player_stats.ap_current = 0;
  updatePlayerStats();
  Escape();
};

const endTurn = () => {
  console.log("end turn");
  player_stats.ap_current = player_stats.ap_max;
  if (player_stats.mana_current < player_stats.mana_max * 0.9) {
    player_stats.mana_current += player_stats.mana_max / 10;
  } else {
    player_stats.mana_current = player_stats.mana_max;
  }
  enemy_ap = 4;
  while ((inCombat) && (enemy_ap > 0)){
    calcDamage("Player");
    enemy_ap--;
      if (player_stats.hp_current == 0) {
          enemy_ap = -1;
      }
  }
  updatePlayerStats();

  // if solo, do not do the multiplayer stuff
  if (!sessionId) return;
  turn = false;
  sendMsgToAll("end turn");
};

/**
 *
 *  ws / multiplayer stuff below
 *
 */

// data the client needs to know about multiplayer
// currently, just needs to know its own id (assigned on init message)
const wsData = {
  id: null,
};

// call anywhere to send a message to all other clients
// header is msg title (eg. "end turn")
// msg is any other data you want to send
const sendMsgToAll = async (header, body) => {
  if (!sessionId) return;
  await ws.send(JSON.stringify({ target: "all", header, body }));
};

// call anywhere to send a message to the server only, will not go to other clients
const sendMsgToServer = async (header, body) => {
  if (!sessionId) return;
  await ws.send(JSON.stringify({ target: "server", header, body }));
};

// call anywhere to send a message to one other target
// not implemented yet
const sendMsgToOne = async (header, body, target) => {
  if (!sessionId) return;
  await ws.send(JSON.stringify({ target, header, body }));
};

// connect ws, register onMessage, send 'ready' message to server
async function connectToServer() {
  const wsLoading = new WebSocket("ws://localhost:7071/ws");
  ws = await new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (wsLoading.readyState === 1) {
        clearInterval(timer);
        resolve(wsLoading);
      }
    }, 10);
  });

  ws.onmessage = (webSocketMessage) => {
    console.log("received message!");
    const messageBody = JSON.parse(webSocketMessage.data);
    receiveMessage(messageBody);
  };

  // let server know the ws is ready
  sendMsgToServer("ready");
}

// function to handle messages received from ws
// header for msg title, body for any other data
const receiveMessage = (msg) => {
  const header = msg.header;
  const body = msg.body;

  switch (header) {
    // initial message received from server, initializes turn
    case "init":
      receiveInitMsg(body);
      break;

    // msg received when a player ends their turn
    case "turn":
      receiveTurnMsg(body);
      break;

    case "chat":
      receiveChatMsg(body);
      break;

    case "wstest":
      receiveTestMsg(body);
      break;

    default:
      receiveDefaultMsg(header, body);
      break;
  }
};

const receiveTestMsg = (data) => {
  console.log("recieved custom message!, data.color=" + data.color);
};

const receiveDefaultMsg = (header, data) => {
  console.log(`Message received! header=${header}, body=${data}`);
};

const receiveInitMsg = (data) => {
  console.log("received init message");
  // let client know its own id
  wsData.id = data.id;

  // this message also contains information about whose turn it is
  // set turn value (see receiveTurnMsg for details)
  turn = wsData.id === data.turn;

  // display turn status
  const p = document.createElement("p");
  if (turn) {
    p.innerText = `It is your turn. go ahead and play!`;
  } else {
    p.innerText = "It is not your turn.  Please wait.";
  }
  middleDiv.appendChild(p);
};

const receiveTurnMsg = (data) => {
  const turnId = data.turn;
  const sender = data.sender;

  // turnId is Id of client who's turn it currently is
  // check if your id === turnId to decide if it is your turn
  // turn is local state, true or false
  turn = wsData.id === turnId;

  const p = document.createElement("p");
  p.innerText = `${sender} ended their turn.`;
  middleDiv.appendChild(p);

  if (turn) {
    const p2 = document.createElement("p");
    p2.innerText = `It is your turn!`;
    middleDiv.appendChild(p2);
  }
};

const receiveChatMsg = (data) => {
  const p = document.createElement("p");
  p.innerText = `${data.sender}: ${data.msg}`;
  middleDiv.appendChild(p);
};

// only do web sockets if user opted to play online
if (sessionId) {
  console.log("Online game: Initializing web sockets...");
  connectToServer();
} else {
  turn = true;
}
