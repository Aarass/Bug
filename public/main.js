let bg;
let ctModel = [], tModel = [];
let map;
function preload() {
    bg = loadImage('./assets/map.png');
    for (let i = 0; i < 37; i++)
        ctModel.push(loadImage("Assets/Animation/ct/tile" + i + ".png"));
    for (let i = 0; i < 37; i++)
        tModel.push(loadImage("Assets/Animation/t/tile" + i + ".png"));
}
const socket = io();



//Manje bitne
//------------------------
let isScreenLocked;
let pointerRadius = 8;  
//------------------------

let player;
let pointer;
function setup() {
    createCanvas(windowWidth, windowHeight);
    isScreenLocked = false;
    player = new Player(true, 5, 20);
    pointer = new Cursor(player);
    map = new Obstacles('de_dust2x2');
}
function draw() {
    background(255, 150, 100);
    push();
        translate(-player.pos.x + width / 2, -player.pos.y + height / 2);
        image(bg, 0, 0);
        player.update(map.matrix[Math.floor(player.pos.x/100)][Math.floor(player.pos.y/100)]);
        for (const obs of map.matrix[Math.floor(player.pos.x / 100)][Math.floor(player.pos.y / 100)]) {
            obs.show(color(150));
        }
    pop();
    pointer.show();
}

// socket.on('NewPlayer', (data) => {
//     console.log(data);
// });
// socket.on('initial', (data) => {
//     enemies = data;
// });
// socket.on('newPlayer', (data) => {
//     enemies[data.id] = {
//         x: data.x,
//         y: data.y
//     };
// });
// socket.on('position', (pos) => {
//     player.x = pos.x;
//     player.y = pos.y;
// });
// socket.on('enemyMoved', (data) => {
//     enemies[data.id].x = data.x;
//     enemies[data.id].y = data.y;
// });
// socket.on('playerDisconnected', (id) => {
//     delete enemies[id];
// });
// function move() {
//     if (left)
//         socket.emit('keydown', 'left');
//     if (right)
//         socket.emit('keydown', 'right');
//     if (up)
//         socket.emit('keydown', 'up');
//     if (down)
//         socket.emit('keydown', 'down');
// }
function mouseMoved() {
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
        if(player.isAlive)
            pointer.click();
    }
}
document.addEventListener('pointerlockchange', () => {
    isScreenLocked = !isScreenLocked
});