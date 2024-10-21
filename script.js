//potential slot outcomes per column
const outcomes = {
    celeste: 30,
    horse: 40,
    putz: 30
}

//define categories
const categories = {
    Celeste: {
        classification: 'celeste',
        src: ["celeste1.PNG", "celeste2.jpg", "celeste3.jpg"],
        bonus: () => {
            console.log("celeste")
        }
    },

    Horses: {
        classification: 'horse',
        src: ["gage_horse.jpeg", "pria_horse.jpeg", "angie_horse.jpeg", "spruce_horse.jpeg"],
        bonus: () => {
            console.log("horse")
        }
    },

    Putz: {
        classification: 'putz',
        src: ["putzLogo.png"],
        bonus: () => {
            console.log("putz")
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

//grab character info [name, class]
function grab_slot() {
    //grab classification
    let slot_classification = possibilities[Math.floor(Math.random() * possibilities.length)];

    if (slot_classification == 'celeste') {
        return [categories.Celeste.src[Math.floor(Math.random() * categories.Celeste.src.length)], slot_classification]
    }

    if (slot_classification == 'horse') {
        return [categories.Horses.src[Math.floor(Math.random() * categories.Horses.src.length)], slot_classification]
    }

    //must be putz
    return ["putzLogo.png", slot_classification]
}

function grab_outcome() {
    let row_info = [grab_slot(), grab_slot(), grab_slot()]
    let names = [row_info[0][0], row_info[1][0], row_info[2][0]]
    let classes = [row_info[0][1], row_info[1][1], row_info[2][1]]

    saying = ""

    //check if there is a 3 match
    if (classes.join() == 'putz,putz,putz') {
        saying = "You won putz!"
    }

    if (classes.join() == 'horse,horse,horse') {
        saying = "NEIGHHHHHHHHHH!"
    }

    if (classes.join() == 'celeste,celeste,celeste') {
        saying = "You won celester! Now you owe celeste a chipotle gift card!"
    }

    //check if you have a duplicate
    if (names[0] == names[1] || names[0] == names[2] || names[1] == names[2]) {
        saying = "Looks like your seeing double!"
    }

    return [names, saying]
}

//UI code
let items = [].concat(categories.Celeste.src, categories.Horses.src, categories.Putz.src)

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
    alert(result[1])
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
        console.log(pool, "HELLLOOOO");

        for (let i = pool.length - 1; i >= 0; i--) {
            const box = document.createElement("div");
            const image_cont = document.createElement("div")
            box.classList.add("box");
            box.style.width = door.clientWidth + "px";
            box.style.height = door.clientHeight + "px";
            if (pool.length > 1 && i != 0) {
                image_cont.classList.add("imageContainer")
                image_cont.innerHTML = "<img src='./images/" + pool[i] + "'>"; //add image
                if (categories.Celeste.src.includes(pool[i])) {
                    box.style.color = "purple";
                } else if (categories.Horses.src.includes(pool[i])) {
                    box.style.color = "#2acdff";
                } else {
                    box.style.color = "#ffaa18";
                }

                box.appendChild(image_cont);
            }
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

