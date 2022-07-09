//potential slot outcomes per column
const outcomes = {
    Fig: 2,
    Esti: 5,
    boomer: 30,
    prefrosh: 63
}

//define characters + info
const characters = {
    Fig: {
        classification: 'Fig',
        bonus: () => {
            console.log("FIGGGGGG")
        }
    },
    Esti: {
        classification: 'Esti',
        bonus: () => {
            console.log("ESTIIIIII")
        }
    },
    Luna: {
        classification: 'boomer',
        bonus: () => {
            console.log("LUNAAAA")
        }
    },
    John: {
        classification: 'boomer',
        bonus: () => {
            console.log("LUNAAAA")
        }
    },
    Andi: {
        classification: 'boomer',
        bonus: () => {
            console.log("ANDIIIIII")
        }
    },
    Anhad: {
        classification: 'boomer',
        bonus: () => {
            console.log("ANHADDDDDD")
        }
    },
    Mu: {
        classification: 'boomer',
        bonus: () => {
            console.log("MUUUU")
        }
    },
    uM: {
        classification: 'boomer',
        bonus: () => {
            console.log("uMMMMMM")
        }
    },
    Alwinfy: {
        classification: 'boomer',
        bonus: () => {
            console.log("Alwinfy")
        }
    },
    Reagan: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("REAGANNNNNN")
        }
    },
    Twin: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("TWINNNNNNNNN")
        }
    },
    Bob: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("BOBBBBBB")
        }
    },
    Petru: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("PETRUUUUUUUUUU")
        }
    },
    Hector: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("HECTOESSSSSSSSSSSSS ;)")
        }
    },
    Bread: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("BREADDDDD")
        }
    },
    Arthur: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("ARTHURRRRR")
        }
    },
    Annika: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("ANNIKA")
        }
    },
    Woooo: {
        classification: 'boomer',
        bonus: () => {
            console.log("WOOOOOOOOOOO")
        }
    },
    Maggie: {
        classification: 'prefrosh',
        bonus: () => {
            console.log("MAGGGSSSSS")
        }
    }
}

//generate weighted array to pick cards 
let possibilities = []
for (const key in outcomes) {
    for (let i = 0; i < outcomes[key]; i++) {
        possibilities.push(key)
    }
}

//generate boomer and prefrosh list
let boomers = []
let prefrosh = []

for (const key in characters) {
    if (characters[key].classification == "boomer") {
        boomers.push(key)
    } else if (characters[key].classification == "prefrosh") {
        prefrosh.push(key)
    }
}

//grab character info [name, class]
function grab_slot() {
    //grab classification
    let slot_classification = possibilities[Math.floor(Math.random() * possibilities.length)];

    if (slot_classification == 'boomer') {
        return [boomers[Math.floor(Math.random() * boomers.length)], slot_classification]
    }

    if (slot_classification == 'prefrosh') {
        return [prefrosh[Math.floor(Math.random() * prefrosh.length)], slot_classification]
    }

    //must be a special character like fig or esti
    return [slot_classification, slot_classification]
}

function grab_outcome() {
    let row_info = [grab_slot(), grab_slot(), grab_slot()]
    let names = [row_info[0][0], row_info[1][0], row_info[2][0]]
    let classes = [row_info[0][1], row_info[1][1], row_info[2][1]]

    total = 0

    //check if rare character
    if (classes.includes("Fig")) {
        //grab occurance of Fig
        let counter = -1
        for (let i = 0; i < classes.length; i++) {
            if (classes[i] == "Fig") {
                counter += 1
            }
        }

        total = 700 + counter*100
    }

    if (classes.includes("Esti")) {
        let counter = -1
        for (let i = 0; i < classes.length; i++) {
            if (classes[i] == "Esti") {
                counter += 1
            }
        }

        total = 700 + counter*100
    }

    //check if there is a 3 match
    if (classes.join() == 'boomer,boomer,boomer') {
        total += 250
    }

    if (classes.join() == 'prefrosh,prefrosh,prefrosh') {
        total += 200
    }

    //check if you have a duplicate
    if (names[0] == names[1] || names[0] == names[2] || names[1] == names[2]) {
        total += 300
    }

    return [names, total]
}

//UI code
let items = [].concat(boomers, prefrosh)

const doors = document.querySelectorAll(".door");
document.querySelector("#spinner").addEventListener("click", spin_handle);
document.querySelector("#reseter").addEventListener("click", init);

async function spin(outcome_names) {
    init(false, 1, 2, outcome_names);

    let duration;

    for (const door of doors) {
        const boxes = door.querySelector(".boxes");
        duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = "translateY(0)";
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }

    return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, duration * 900);
      });
}

async function spin_handle() {
    //grab game result
    result = grab_outcome()
    //set up animation
    await init()
    //start animation
    await spin(result[0])
    alert("You win " + result[1] + " dollars!")
}

function init(firstInit = true, groups = 1, duration = 1, slot_result_names = []) {
    //counter to keep track of name index
    counter = 0

    for (const door of doors) {
        if (firstInit) {
            door.dataset.spinned = "0";
        } else if (door.dataset.spinned === "1") {
            return;
        }

        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);

        const pool = ["❓"];
        if (!firstInit) {
            const arr = [];
            for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                arr.push(...items);
            }
            
            pool.push(...[].concat(shuffle(arr), [slot_result_names[counter]]));
            counter += 1

            boxesClone.addEventListener(
                "transitionstart",
                function () {
                    door.dataset.spinned = "1";
                    this.querySelectorAll(".box").forEach((box) => {
                        box.style.filter = "blur(1px)";
                    });
                },
                { once: true }
            );

            boxesClone.addEventListener(
                "transitionend",
                function () {
                    this.querySelectorAll(".box").forEach((box, index) => {
                        box.style.filter = "blur(0)";
                        if (index > 0) this.removeChild(box);
                    });
                },
                { once: true }
            );
        }
        // console.log(pool);

        for (let i = pool.length - 1; i >= 0; i--) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.style.width = door.clientWidth + "px";
            box.style.height = door.clientHeight + "px";
            if (pool.length > 1 && i != 0) {
                if (characters[pool[i]].classification == "boomer") {
                    box.style.color = "purple";
                } else if (characters[pool[i]].classification == "prefrosh") {
                    box.style.color = "#2acdff";
                } else {
                    box.style.color = "#ffaa18";
                }
            }
            box.textContent = pool[i];
            boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)
            }px)`;
        door.replaceChild(boxesClone, boxes);
        // console.log(door);
    }
}

function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}

init();

