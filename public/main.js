const socket = io();

//Manje bitne
//------------------------
let isScreenLocked;
let pointerRadius = 8;  
//------------------------      
//Kontrola      
//------------------------
let left, right, up, down;
//------------------------
let bg;
let pointer;
let player = {};
let enemies = {};
function preload() {
    bg = loadImage('./assets/map.png');
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    isScreenLocked = false;
    pointer = createVector(0, 0);
    player.x = 500;
    player.y = 500;
}
function draw() {
    background(255, 150, 100);
    move();
    translate(-player.x + width / 2, -player.y + height / 2);
    image(bg, 0, 0);
    for (const id in enemies) {
        ellipse(enemies[id].x, enemies[id].y, 16, 16);
    }
    ellipse(player.x, player.y, 16, 16);
    drawPointer();
}
socket.on('NewPlayer', (data) => {
    console.log(data);
});
function drawPointer() {
    noFill();
    stroke(255);
    strokeWeight(2);
    ellipse(player.x + pointer.x, player.y + pointer.y, pointerRadius, pointerRadius);
}
socket.on('initial', (data) => {
    enemies = data;
});
socket.on('newPlayer', (data) => {
    enemies[data.id] = {
        x: data.x,
        y: data.y
    };
});
socket.on('position', (pos) => {
    player.x = pos.x;
    player.y = pos.y;
});
socket.on('enemyMoved', (data) => {
    enemies[data.id].x = data.x;
    enemies[data.id].y = data.y;
});
socket.on('playerDisconnected', (id) => {
    delete enemies[id];
});








































function move() {
    if (left)
        socket.emit('keydown', 'left');
    if (right)
        socket.emit('keydown', 'right');
    if (up)
        socket.emit('keydown', 'up');
    if (down)
        socket.emit('keydown', 'down');
}
function keyPressed() {
    if(key == 'a' || keyCode == LEFT_ARROW)
        left = true;
    else if (key == 'd' || keyCode == RIGHT_ARROW) 
        right = true;
    else if (key == 'w' || keyCode == UP_ARROW) 
        up = true;
    else if (key == 's' || keyCode == DOWN_ARROW) 
        down = true;
}
function keyReleased() {
    if(key == 'a' || keyCode == LEFT_ARROW)
        left = false;
    else if (key == 'd' || keyCode == RIGHT_ARROW) 
        right = false;
    else if (key == 'w' || keyCode == UP_ARROW) 
        up = false;
    else if (key == 's' || keyCode == DOWN_ARROW) 
        down = false;
}
function mouseMoved() {
    if(movedX > 0) {
        if(pointer.x + movedX > width / 2)
            pointer.x = width/2;
        else
            pointer.x += movedX;
    } else if(movedX < 0) {
        if (pointer.x + movedX < -width / 2)
            pointer.x = -width / 2;
        else
            pointer.x += movedX;
    }
    if(movedY > 0) {
        if (pointer.y + movedY > height / 2)
            pointer.y = height / 2;
        else
            pointer.y += movedY;
    } else if(movedY < 0) {
        if (pointer.y + movedY < -height / 2)
            pointer.y = -height / 2;
        else
            pointer.y += movedY;
    }
}
function mousePressed() {
    if (!isScreenLocked)
        requestPointerLock();
}
document.addEventListener('pointerlockchange', () => {
    isScreenLocked = !isScreenLocked
});