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
let bulletManager;
let positions = {};
let playersList = {};
function setup() {
    createCanvas(1280, 720);
    isScreenLocked = false;
    map = new Maps.Construct(dust);
    bulletManager = new BulletsManager();
    let name = prompt('Type your name');
    socket.emit('ready', name);
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
        bulletManager.show();
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
            if (playersList[element.id].pos != undefined)
                playersList[element.id].interpolateTo(element.pos);
            else
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
    if(playersList[data.id].pos != undefined)
        playersList[data.id].interpolateTo(data.pos);
    else
        playersList[data.id].pos = data.pos;
});
socket.on('unvisible enemy', (id) => {
    playersList[id].pos = undefined;
});
socket.on('players', (data) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            playersList[element.id] = new Player(element.id, element.type, element.name);
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
    playersList[data.id] = new Player(data.id, data.type, data.name);
});
socket.on('dead player', (id) => {
    playersList[id].isAlive = false;
});
socket.on('respawn player', (data) => {
    playersList[data.id].isAlive = true;
    playersList[data.id].pos = createVector(data.pos.x, data.pos.y);
});
socket.on('respawn', (data) => {
    me.isAlive = true;
    playersList[myId].pos = createVector(data.pos.x, data.pos.y);
});
socket.on('player disconnected', (id) => {
    delete playersList[id];
});
function mouseMoved() {
    if (isScreenLocked) 
        pointer.move(movedX, movedY);
}
function mouseDragged() {
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
    if (!isScreenLocked)
        requestPointerLock();
    else {
        bulletManager.queueUp(me.pos, pointer.pos);
        socket.emit('click', {
            pos: pointer.pos,
            id: Date.now()
        });
    }
}
socket.on('enemy shooted', (data)=> {
    bulletManager.queueUp(data.start, data.end);
});
document.addEventListener('pointerlockchange', () => {
    isScreenLocked = !isScreenLocked
});