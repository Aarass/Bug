const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const server = app.listen(port);
const io = require('socket.io')(server);
const dust = JSON.parse(fs.readFileSync('./public/de_dust2x2.json'));
const mapClass = require('./public/obstacles.js');
const map = new mapClass.Construct(dust);
app.use(express.static('public'));
const ctSpawn = {
    x: 1400,
    y: 600
}
const tSpawn = {
    x: 200,
    y: 2500
}
let playerSpeed = 5;
let playerRadius = 30;
let playersList = {};
let positions = {};

io.on('connection', (socket) => {
    //Dodavanje novog igraca u listu i odvajanje u grupe
    if (Object.keys(playersList).length % 2 == 0)
        playersList[socket.id] = new Player(ctSpawn.x, ctSpawn.y, socket.id, "ct");
    else
        playersList[socket.id] = new Player(tSpawn.x, tSpawn.y, socket.id, "t");

    const current = playersList[socket.id];
    //Slanje inicijalnih podataka novom igracu
    let initialData = {};
    for (const key in playersList) {
        if (playersList.hasOwnProperty(key)) {
            const element = playersList[key];
            initialData[element.id] = {
                id: element.id,
                type: element.type
            }
        }
    }
    socket.on('ready', () => {
        socket.emit('players', initialData);
        socket.emit('me', current);
    });

    //Obavestavanje ostalih igraca da se konektovao nov igrac
    //Verovatno treba poboljsanja
    socket.broadcast.emit('new player', {
        id: current.id,
        type: current.id
    });


    socket.on('move', (data) => {
        current.left = data.left;
        current.right = data.right;
        current.up = data.up;
        current.down = data.down;
        current.move();
        if(positions[data.id])
            positions[data.id][socket.id] = JSON.parse(JSON.stringify(playersList[socket.id]));
        else
            positions[data.id] = JSON.parse(JSON.stringify(playersList));


        let seen = {};
        let unseen = {};
        for (const key in playersList) {
            if (playersList.hasOwnProperty(key)) {
                const element = playersList[key];
                if(current == element)
                    continue;
                if(map.seeEachOther(current, element)) {
                    seen[element.id] = element;
                    io.to(element.id).emit('visible enemy', current);
                } else {
                    unseen[element.id] = element;
                    io.to(element.id).emit('unvisible enemy', current.id);
                }
            }
        }
        socket.emit('move respond', {
            timestamp: data.id,
            position: positions[data.id][socket.id].pos,
            visible: seen,
            unvisible: unseen
        });
    });
    socket.on('disconnect', () => {
        delete playersList[socket.id];
        socket.broadcast.emit('player disconnected', socket.id);
    });
});
class Player {
    constructor(_x, _y, id, type) {
        this.pos = {
            x: _x,
            y: _y
        }
        this.radius = playerRadius;
        this.speed = playerSpeed;
        this.id = id;
        this.type = type;
    }
    move() {
        let ms;
        if (this.left || this.right || this.up || this.down)
            ms = Date.now();
        if (this.up) {
            this.moveUp();
            if (this.collides())
                if (!this.tryLeft())
                    if (!this.tryRight())
                        this.undoUp();
        }
        if (this.down) {
            this.moveDown();
            if (this.collides())
                if (!this.tryLeft())
                    if (!this.tryRight())
                        this.undoDown();
        }
        if (this.right) {
            this.moveRight();
            if (this.collides())
                if (!this.tryUp())
                    if (!this.tryDown())
                        this.undoRight();
        }
        if (this.left) {
            this.moveLeft();
            if (this.collides())
                if (!this.tryUp())
                    if (!this.tryDown())
                        this.undoLeft();
        }
        if (ms)
            positions[ms] = {
                x: this.pos.x,
                y: this.pos.y
            };
    }
    tryUp() {
        this.moveUp();
        if (this.collides())
            return this.undoUp();
        return true;
    }
    tryDown() {
        this.moveDown();
        if (this.collides())
            return this.undoDown();
        return true;
    }
    tryLeft() {
        this.moveLeft();
        if (this.collides())
            return this.undoLeft();
        return true;
    }
    tryRight() {
        this.moveRight();
        if (this.collides())
            return this.undoRight();
        return true;
    }
    moveUp() { this.pos.y -= this.speed; }
    moveDown() { this.pos.y += this.speed; }
    moveLeft() { this.pos.x -= this.speed; }
    moveRight() { this.pos.x += this.speed; }
    undoUp() { this.pos.y += this.speed; return false; }
    undoDown() { this.pos.y -= this.speed; return false; }
    undoLeft() { this.pos.x += this.speed; return false; }
    undoRight() { this.pos.x -= this.speed; return false; }
    collides() {
        return (map.check({
            shape: "circle",
            pos: {
                x: this.pos.x,
                y: this.pos.y
            },
            r: this.radius
        }));
    }
}
function inSight(p) {
    let seen = {};
    for (const key in playersList) {
        if (playersList.hasOwnProperty(key)) {
            const element = playersList[key];
            if(p == element)
                continue;
            if (map.seeEachOther(p, element))
                seen[element.id] = {
                    id: element.id,
                    pos: element.pos,
                    type: element.type
                }
        }
    }
    return seen;
}