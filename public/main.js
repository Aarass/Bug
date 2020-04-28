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
        ctModel.push(loadImage("Assets/Animation/ct/tile" + i + ".png"));
    for (let i = 0; i < 37; i++)
        tModel.push(loadImage("Assets/Animation/t/tile" + i + ".png"));
    loadMap();
}
const socket = io();


//Manje bitne
//------------------------
let isScreenLocked;
let pointerRadius = 8;  
//------------------------
let map;
let player;
let pointer;
let playersList = {};
function setup() {
    createCanvas(1280, 720);
    isScreenLocked = false;
    map = new Maps.Construct(dust);
    socket.emit('ready');
}
function draw() {
    if(player)
    {
        background(255, 150, 100);
        push();
        translate(-player.pos.x + width / 2, -player.pos.y + height / 2);
        image(bg, 0, 0);
        player.update();
        for (const key in playersList) {
            if (playersList.hasOwnProperty(key)) {
                const element = playersList[key];
                element.show();
            }
        }
        pop();
        pointer.show();
    }
}
socket.on('someone moved', (data) => {
    playersList[data.id].move(data.pos);
});
socket.on('players in sight', (data) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = data[key];
            playersList[element.id].pos = element.pos;
        }
    }
});
socket.on('initial', (data) => {
    //me
    player = new Player(data.me.pos.x, data.me.pos.y, data.me.type);
    pointer = new Cursor(player);
    //playersNonSensitiveData
    for (const key in data.playersInfo) {
        if (data.playersInfo.hasOwnProperty(key)) {
            const element = data.playersInfo[key];
            if(element.id != data.me.id)
            playersList[element.id] = new notMe(element.id, element.type);
        }
    }
});
socket.on('hacked position', (pos) => {
    player.pos.x = pos.x;
    player.pos.y = pos.y;
});
socket.on('new player', (data) => {
    playersList[data.id] = new notMe(data.id, data.type);
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
        player.left = true;
    if (key == 'd' || key == 'D' || keyCode === RIGHT_ARROW)
        player.right = true;
    if (key == 'w' || key == 'W' || keyCode === UP_ARROW)
        player.up = true;
    if (key == 's' || key == 'S' || keyCode === DOWN_ARROW)
        player.down = true;
}
function keyReleased() {
    if (key == 'a' || key == 'A' || keyCode === LEFT_ARROW)
        player.left = false;
    if (key == 'd' || key == 'D' || keyCode === RIGHT_ARROW)
        player.right = false;
    if (key == 'w' || key == 'W' || keyCode === UP_ARROW)
        player.up = false;
    if (key == 's' || key == 'S' || keyCode === DOWN_ARROW)
        player.down = false;
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