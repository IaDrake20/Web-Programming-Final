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
const saveButton = document.querySelector("#save");

// attach event listeners
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

// initialize player_stats object
let player_stats = {
    hp_max: 100,
    hp_current: 100,
    mana_current: 50,
    mana_max: 50,
    ap_current: 4,
    ap_max: 4,
    xp_current: 0,
    xp_threshold: 25,
    character_level_current: 1,
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
      World_Chaos_Level: 0,
    }
};

let ws;

let turn = false;

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

  let hpPercentage = player_stats.hp_current / player_stats.hp_max;
  let manaPercentage = player_stats.mana_current / player_stats.mana_max;
  let apPercentage = player_stats.ap_current / player_stats.ap_max;
  let xpPercentage = player_stats.xp_current / player_stats.xp_threshold;

  healthBar.style.width = `${150 * hpPercentage}px`;
  manaBar.style.width = `${150 * manaPercentage}px`;
  actionPointsBar.style.width = `${150 * apPercentage}px`;
  experienceBar.style.width = `${150 * xpPercentage}px`;

  if (player_stats.ap_current == 0) {
    endTurn();
  }
};
updatePlayerStats();

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

const Save = () => {

}

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
            player_stats.Small_H++;
            break;
          case 2:
            currConsumable = document.querySelectorAll("#health-m");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.Medium_H++;
            break;
          case 3:
            currConsumable = document.querySelectorAll("#health-l");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.Large_H++;
            break;
          case 4:
            currConsumable = document.querySelectorAll("#mana-s");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.Small_M++;
            break;
          case 5:
            currConsumable = document.querySelectorAll("#mana-m");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.Medium_M++;
            break;
          case 6:
            currConsumable = document.querySelectorAll("#mana-l");
            currConsumable.forEach((consumable) => {
              consumable.style.display = "flex";
            });
            player_stats.Large_M++;
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
        const p = document.createElement("p");
        p.innerText = data.description;
        middleDiv.appendChild(p);

        switch (data.id) {
        case 1: // Treasure
              
            break;
        case 2: // Demon King Altar 

            break;
        case 3: // Trap

            break;
        case 4: // Thief

            break;
        case 5: // Caravan

            break;
        case 6: // Ohl

            break;
        case 7: // Mine

            break;
        }
          
      });
    }
  } else if (value === "search") {
    p.style.color = "skyblue";
      if (Math.random < 0.5) {

      }
      else {
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
    }
    else {
      invH.innerText = "Helmet: None";
    }
    if (player_stats.user.Equipment_Chest != 0) {
      invC.innerText = "Chest: " + player_stats.user.Equipment_Chest.name;
    }
    else {
      invC.innerText = "Chest: None";
    }
    if (player_stats.user.Equipment_Arms != 0) {
      invA.innerText = "Arms: " + player_stats.user.Equipment_Arms.name;
    }
    else {
      invA.innerText = "Arms: None";
    }
    if (player_stats.user.Equipment_Legs != 0) {
      invL.innerText = "Legs: " + player_stats.user.Equipment_Legs.name;
    }
    else {
      invL.innerText = "Legs: None";
    }
    if (player_stats.user.Equipment_Weapon != 0) {
      invW.innerText = "Weapon: " + player_stats.user.Equipment_Weapon.name;
    }
    else {
      invW.innerText = "Weapon: None";
    }
    middleDiv.appendChild(invH);
    middleDiv.appendChild(invC);
    middleDiv.appendChild(invA);
    middleDiv.appendChild(invL);
    middleDiv.appendChild(invW);
  }

  else {
    value = "Invalid Command";
  }
  p.innerText = value;

  updatePlayerStats();

  middleDiv.appendChild(p);

  actionInput.value = null;
};

// Function to enter combat
const Combat = () => {
  exploreDiv.style.display = "none";
  saveButton.style.display = "none";
  combatDiv.style.display = "flex";
  player_stats.ap_current = player_stats.ap_max;
  fetch("http://localhost:3001/Mobs")
    .then((response) => response.json())
    .then((data) => {
      const p = document.createElement("p");
      p.innerText = data.description;
      middleDiv.appendChild(p);
    });
};

// Function to exit combat
const Escape = () => {
  const p = document.createElement("p");
  p.innerText = "You Have Escaped.";
  middleDiv.appendChild(p);
  combatDiv.style.display = "none";
  exploreDiv.style.display = "flex";
  saveButton.style.display = "flex";
};

// Attack Function
const Attack = () => {
  if (!checkTurn()) return;
  player_stats.ap_current -= 1;
  damage = calcDamage();
  const p = document.createElement("p");
  p.innerText = enemy.name + " took " + damage + " damage.";
  middleDiv.appendChild(p);
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
    console.log("Fuckton of Damage");
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
  console.log("Opponent Data");
  player_stats.ap_current -= 1;

  updatePlayerStats();
};

const Consume1 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 20 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 20;
  }
  player_stats.Small_H--;
  if(player_stats.Small_H === 0) {
    currConsumable = document.querySelectorAll("#health-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
  updatePlayerStats();
};

const Consume2 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 50 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 50;
  }
  player_stats.Medium_H--
  if(player_stats.Medium_H === 0) {
    currConsumable = document.querySelectorAll("#health-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    }); 
  }
  updatePlayerStats();
};

const Consume3 = () => {
  if (!checkTurn()) return;
  if (player_stats.hp_current + 100 > player_stats.hp_max) {
    player_stats.hp_current = player_stats.hp_max;
  } else {
    player_stats.hp_current += 100;
  }
  player_stats.Large_H--
  if(player_stats.Large_H === 0) {
    currConsumable = document.querySelectorAll("#health-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
  updatePlayerStats();
};

const Consume4 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 10 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 10;
  }
  player_stats.Small_M--;
  if((player_stats.Small_M === 0)) {
    currConsumable = document.querySelectorAll("#mana-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
  updatePlayerStats();
};

const Consume5 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 25 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 25;
  }
    player_stats.Medium_M--;
  if(player_stats.Medium_M === 0) {
    currConsumable = document.querySelectorAll("#mana-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
  updatePlayerStats();
};

const Consume6 = () => {
  if (!checkTurn()) return;
  if (player_stats.mana_current + 50 > player_stats.mana_max) {
    player_stats.mana_current = player_stats.mana_max;
  } else {
    player_stats.mana_current += 50;
  }
  player_stats.Large_M--;
  if (player_stats.Large_M === 0) {
    currConsumable = document.querySelectorAll("#mana-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  }
  updatePlayerStats();
};

const endTurn = () => {
  console.log("end turn");
  player_stats.ap_current += player_stats.ap_max;
  updatePlayerStats();

  // if solo, do not do the multiplayer stuff
  if (!sessionId) return;
  turn = false;
  ws.send(JSON.stringify({ msg: "end turn" }));
};

// web socket stuff
async function websocketstuff() {
  ws = await connectToServer();

  // temp way to send messages, only works when clicking submit
  submitButton.addEventListener("click", (e) => {
    const messageBody = actionInput.value;
    actionInput.value = "";
    ws.send(JSON.stringify({ msg: messageBody }));
  });

  // when receiving messages...
  ws.onmessage = (webSocketMessage) => {
    console.log("recieved message!");
    const messageBody = JSON.parse(webSocketMessage.data);

    const msgTurn = messageBody.turn;

    const sender = messageBody.sender;
    const msg = messageBody.msg;

    // if turn information was sent
    if (typeof msgTurn !== "undefined") {
      const p = document.createElement("p");
      if (msgTurn) {
        p.innerText = `It is your turn. go ahead and play!`;
        turn = true;
      } else {
        p.innerText = "It is not your turn.  Please wait.";
        turn = false;
      }
      middleDiv.appendChild(p);
    }

    const p = document.createElement("p");
    p.innerText = `sender: ${sender}, msg: ${msg}`;
    middleDiv.appendChild(p);
  };

  ws.send(JSON.stringify({ msg: "ready" }));
}

async function connectToServer() {
  const ws = new WebSocket("ws://localhost:7071/ws");
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
}

// only do web sockets if user opted to play online
if (sessionId) {
  console.log("Online game: Initializing web sockets...");
  websocketstuff();
} else {
  turn = true;
}
