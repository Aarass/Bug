let bg;
let ctModel = [], tModel = [];
let dust
async function loadMap() {
    let raw = await fetch('./de_dust2x2.json');
    dust = await raw.json();
}
function preload() {
    bg = loadImage('./assets/map.png');
    for (let i = 0; i < 37; i++)
        ctModel.push(loadImage("./assets/animation/ct/tile" + i + ".png"));
    for (let i = 0; i < 37; i++)
        tModel.push(loadImage("./assets/animation/t/tile" + i + ".png"));
    loadMap();
}
const socket = io();


//Manje bitne
//------------------------
let isScreenLocked;
let pointerRadius = 8;  
//------------------------
let map;
let myId;
let me;
let pointer;
let positions = {};
let playersList = {};
function setup() {
    createCanvas(1280, 720);
    isScreenLocked = false;
    map = new Maps.Construct(dust);
    socket.emit('ready');
}
function draw() {
    if(me)
    {
        background(255, 150, 100);
        push();
        translate(-me.pos.x + width / 2, -me.pos.y + height / 2);
        image(bg, 0, 0);
        for (const key in playersList) {
            if (playersList.hasOwnProperty(key)) {
                const element = playersList[key];
                if(element.id == myId)
                    element.update();
                else
                    element.updateOthers();
            }
        }
        pop();
        pointer.show();
    }
}
socket.on('move respond', (data) => {
    //Provera da ne cituje
    let current = positions[data.timestamp];
    if (current.x != data.position.x)
        me.pos.x = data.position.x;
    if (current.y != data.position.y)
        me.pos.y = data.position.y;


    //Update-ovanje vidljivih
    for (const key in data.visible) {
        if (data.visible.hasOwnProperty(key)) {
            const element = data.visible[key];
            playersList[element.id].pos = element.pos;
        }
    }

    //Skrivanje nevidljivih
    for (const key in data.unvisible) {
        if (data.unvisible.hasOwnProperty(key)) {
            const element = data.unvisible[key];
            playersList[element.id].pos = undefined;
        }
    }
    
});
socket.on('visible enemy', (data) => {
    if(playersList[data.id].pos != undefined) {
        //Interpolate
        playersList[data.id].interpolateTo(data.pos);
    } else {
        playersList[data.id].pos = data.pos;
    }
});
socket.on('unvisible enemy', (id) => {
    playersList[id].pos = undefined;
});
socket.on('players', (data) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            playersList[element.id] = new Player(element.id, element.type);
        }
    }
});
socket.on('me', (data) => {
    myId = data.id;
    playersList[myId].pos = createVector(data.pos.x, data.pos.y);
    me = playersList[myId];
    pointer = new Cursor(me);
});
socket.on('new player', (data) => {
    playersList[data.id] = new Player(data.id, data.type);
});
socket.on('player disconnected', (id) => {
    delete playersList[id];
});
function mouseMoved() {
    if (isScreenLocked) 
        pointer.move(movedX, movedY);
}
function keyPressed() {
    if (key == 'a' || key == 'A' || keyCode === LEFT_ARROW)
        me.left = true;
    if (key == 'd' || key == 'D' || keyCode === RIGHT_ARROW)
        me.right = true;
    if (key == 'w' || key == 'W' || keyCode === UP_ARROW)
        me.up = true;
    if (key == 's' || key == 'S' || keyCode === DOWN_ARROW)
        me.down = true;
}
function keyReleased() {
    if (key == 'a' || key == 'A' || keyCode === LEFT_ARROW)
        me.left = false;
    if (key == 'd' || key == 'D' || keyCode === RIGHT_ARROW)
        me.right = false;
    if (key == 'w' || key == 'W' || keyCode === UP_ARROW)
        me.up = false;
    if (key == 's' || key == 'S' || keyCode === DOWN_ARROW)
        me.down = false;
}
function mousePressed() {
    if (!isScreenLocked) {
        requestPointerLock();
    }
    pointer.click();
}
document.addEventListener('pointerlockchange', () => {
    isScreenLocked = !isScreenLocked
});