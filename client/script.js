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


// attach event listeners
attackButton.addEventListener("click", () => Attack());
magicButton1.addEventListener("click", () => Magic1());
magicButton2.addEventListener("click", () => Magic2());
magicButton3.addEventListener("click", () => Magic3());
magicButton4.addEventListener("click", () => Magic4());
consumeButton1.forEach((button) => { button.addEventListener("click", () => Consume1()); });
consumeButton2.forEach((button) => { button.addEventListener("click", () => Consume2()); });
consumeButton3.forEach((button) => { button.addEventListener("click", () => Consume3()); });
consumeButton4.forEach((button) => { button.addEventListener("click", () => Consume4()); });
consumeButton5.forEach((button) => { button.addEventListener("click", () => Consume5()); });
consumeButton6.forEach((button) => { button.addEventListener("click", () => Consume6()); });
runButton.addEventListener("click", () => Run());
investigate.addEventListener("click", () => Investigate());
submitButton.addEventListener("click", (e) => handleInput(e));
actionInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInput(e);
});

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
  character_level_max: 10,
  score: 69,
};

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

  if (player_stats.ap_current == 0){
    console.log("End Turn");
    player_stats.ap_current += (player_stats.ap_max);
    updatePlayerStats();
  }
};
updatePlayerStats();

const handleInput = (event) => {
  event.preventDefault();

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
        value = null;
      });
  }else if (value === "weapon") {
    fetch("http://localhost:3001/Weapons")
      .then((response) => response.json())
      .then((data) => {
        const itemP = document.createElement("p");
        itemP.innerText = data.name;
        itemP.style.color = "violet";
        middleDiv.appendChild(itemP);
        value = null;
      });
  }else if (value === "consumable") {
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
          // health-s ++
          break;
        case 2:
          currConsumable = document.querySelectorAll("#health-m");
          currConsumable.forEach((consumable) => {
            consumable.style.display = "flex";
          });
          // health-m ++
          break;
        case 3:
          currConsumable = document.querySelectorAll("#health-l");
          currConsumable.forEach((consumable) => {
            consumable.style.display = "flex";
          });
          // health-l ++
          break;
        case 4:
          currConsumable = document.querySelectorAll("#mana-s");
          currConsumable.forEach((consumable) => {
            consumable.style.display = "flex";
          });
          // mana-s ++
          break;
        case 5:
          currConsumable = document.querySelectorAll("#mana-m");
          currConsumable.forEach((consumable) => {
            consumable.style.display = "flex";
          });
          // mana-m ++
          break;
        case 6:
          currConsumable = document.querySelectorAll("#mana-l");
          currConsumable.forEach((consumable) => {
            consumable.style.display = "flex";
          });
          // mana-l ++
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

    

  } else if (value === "search") {

    p.style.color = "skyblue";
  } else if (value === "hunt") {
    p.style.display = "none";
    Combat();
  } else {
    value = "Invalid Command";
  }
  p.innerText = value;

  updatePlayerStats();

  middleDiv.appendChild(p);

  actionInput.value = null;
};

// web socket stuff
async function websocketstuff() {
  const ws = await connectToServer();

  // temp way to send messages, only works when clicking submit
  submitButton.addEventListener("click", (e) => {
    const messageBody = actionInput.value;
    actionInput.value = "";
    ws.send(JSON.stringify({ msg: messageBody }));
  });

  // when receiving messages...
  ws.onmessage = (webSocketMessage) => {
    const messageBody = JSON.parse(webSocketMessage.data);
    const sender = messageBody.sender;
    const color = messageBody.color;
    const msg = messageBody.msg;

    const p = document.createElement("p");
    p.innerText = `sender: ${sender}, color: ${color}, msg: ${msg}`;
    middleDiv.appendChild(p);
  };
}
// Function to enter combat
const Combat = () => {
  exploreDiv.style.display = "none";
  combatDiv.style.display = "flex"
  player_stats.ap_current = player_stats.ap_max;
    fetch("http://localhost:3001/Mobs")
      .then((response) => response.json())
      .then((data) => {
          console.log(data.description);
      });
};

// Function to exit combat
const Escape = () => {
  console.log("Escape");
  combatDiv.style.display = "none";
  exploreDiv.style.display = "flex";
};

// Attack Function
const Attack = () => {
  player_stats.ap_current -= 1;
  console.log("Enemy Damage");

  updatePlayerStats();
}

// Spell 1 - Heal
const Magic1 = () => {
  if (player_stats.mana_current > 5) {
    if ((player_stats.hp_current + 25) > (player_stats.hp_max)) {
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
}

// Spell 2 - Fireball
const Magic2 = () => {
  if (player_stats.mana_current > 15) {
    console.log("Fuckton of Damage");
    player_stats.mana_current -= 15;
    player_stats.ap_current -= 1;

    updatePlayerStats();
} else {
    console.log("No Magic");
  }
}

// Spell 3 - Invigorate
const Magic3 = () => {
  if (player_stats.mana_current > 25) {
    player_stats.mana_current -= 25;
    player_stats.ap_current += 1;

    updatePlayerStats();
} else {
    console.log("No Magic");
  }
}

// Spell 4 - Escape
const Magic4 = () => {
  if (player_stats.mana_current > 50) {
    player_stats.mana_current -= 50;
    Escape();

    updatePlayerStats();
  } else {
    console.log("No Magic");
  }

}

// Run Function
const Run = () => {
  chance = Math.random() * 100;
  player_stats.ap_current -= 1;

  updatePlayerStats();
  if (chance > 66) {
    console.log("Escape Successful")
    Escape();
} else {
    console.log("Escape Unsuccessful")
  }
}

// Investigate Function
const Investigate = () => { 
  console.log("Opponent Data");
  player_stats.ap_current -= 1;

  updatePlayerStats();
}

const Consume1 = () => {
  if ((player_stats.hp_current + 20) > (player_stats.hp_max)) {
    player_stats.hp_current = player_stats.hp_max;
} else {
    player_stats.hp_current += 20;
  }
  // health-s --
  // if(health-s == 0) {
    currConsumable = document.querySelectorAll("#health-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
}

const Consume2 = () => {
  if ((player_stats.hp_current + 50) > (player_stats.hp_max)) {
    player_stats.hp_current = player_stats.hp_max;
} else {
    player_stats.hp_current += 50;
  }
  // health-m --
  // if(health-m == 0) {
    currConsumable = document.querySelectorAll("#health-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
}

const Consume3 = () => {
  if ((player_stats.hp_current + 100) > (player_stats.hp_max)) {
    player_stats.hp_current = player_stats.hp_max;
} else {
    player_stats.hp_current += 100;
  }
  // health-l --
  // if(health-l == 0) {
    currConsumable = document.querySelectorAll("#health-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
}

const Consume4 = () => {
  if ((player_stats.mana_current + 10) > (player_stats.mana_max)) {
    player_stats.mana_current = player_stats.mana_max;
} else {
    player_stats.mana_current += 10;
  }
  // mana-s --
  // if(mana-s == 0) {
    currConsumable = document.querySelectorAll("#mana-s");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
}

const Consume5 = () => {
  if ((player_stats.mana_current + 25) > (player_stats.mana_max)) {
    player_stats.mana_current = player_stats.mana_max;
} else {
    player_stats.mana_current += 25;
  }
  // mana-m --
  // if(mana-m == 0) {
    currConsumable = document.querySelectorAll("#mana-m");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
}

const Consume6 = () => {
  if ((player_stats.mana_current + 50) > (player_stats.mana_max)) {
    player_stats.mana_current = player_stats.mana_max;
} else {
    player_stats.mana_current += 50;
  }
  // mana-l --
  // if(mana-l == 0) {
    currConsumable = document.querySelectorAll("#mana-l");
    currConsumable.forEach((consumable) => {
      consumable.style.display = "none";
    });
  // }
  updatePlayerStats();
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

websocketstuff();
