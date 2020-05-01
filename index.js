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
    let team;
    if (Object.keys(playersList).length % 2 == 0)
        team = 'ct';
    playersList[socket.id] = new Player(socket.id, team);

    const current = playersList[socket.id];
    //Slanje inicijalnih podataka novom igracu
    let initialData = {};
    for (const key in playersList) {
        if (playersList.hasOwnProperty(key)) {
            const element = playersList[key];
            initialData[element.id] = {
                name: element.name,
                id: element.id,
                type: element.type
            }
        }
    }
    socket.on('ready', (name) => {
        current.name = name;
        socket.emit('players', initialData);
        socket.emit('me', current);
        
        //Obavestavanje ostalih igraca da se konektovao nov igrac
        //Verovatno treba poboljsanja
        socket.broadcast.emit('new player', {
            id: current.id,
            name: current.name,
            type: current.id
        });
    });
        

    socket.on('move', (data) => {
        if (!current.isAlive)
            return;
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
    socket.on('click', (data) => {
        if (!current.isAlive)
            return;
        const ray = {
            shape: 'ray',
            a: {
                x: current.pos.x,
                y: current.pos.y
            },
            b: {
                x: current.pos.x + data.pos.x,
                y: current.pos.y + data.pos.y,
            },
            bprime: {
                x: data.pos.x,
                y: data.pos.y
            }
        }
        let seen = shootable(current, data.id);
        for (const key in seen) {
            if (seen.hasOwnProperty(key)) {
                const element = seen[key];
                if(current.type != element.type && map.hit(ray, element)) {
                    if (element.takeDamage(40)) {
                        io.emit('dead player', element.id); 
                        setTimeout(() => {
                            element.spawn();
                            io.to(element.id).emit('respawn', element);
                            io.emit('respawn player', element); 
                        }, 3000);
                    }  
                }
                io.to(element.id).emit('enemy shooted', {
                    start: ray.a,
                    end: ray.bprime
                });
            }
        }
    });
    socket.on('disconnect', () => {
        delete playersList[socket.id];
        socket.broadcast.emit('player disconnected', socket.id);
    });
});
class Player {
    constructor(id, type) {
        this.name;
        this.shape = 'circle';
        this.radius = playerRadius;
        this.speed = playerSpeed;
        this.id = id;
        this.type = type;
        this.spawn();
    }
    spawn() {
        if (this.type == 'ct')
            this.pos = {
                x: ctSpawn.x,
                y: ctSpawn.y
            }
        else
            this.pos = {
                x: tSpawn.x,
                y: tSpawn.y
            }
        this.isAlive = true;
        this.health = 100;
    }
    takeDamage(amount) {
        this.health -= amount;
        if(this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            return true;
        }
    }
    move() {
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
function shootable(p, id) {
    let seen = {};
    let list;
    if(positions[id])
        list = positions[id]
    else 
        list = playersList;
    for (const key in list) {
        if (list.hasOwnProperty(key)) {
            const element = list[key];
            
            if(p == element)
                continue;
            if (map.areShootable(p, element))
                seen[element.id] = element;
        }
    }
    return seen;
}