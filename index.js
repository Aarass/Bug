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
let playersList = {};
let playersInfo = {};
let cts = [], ts = [];

io.on('connection', (socket) => {
    //Dodavanje novog igraca u listu i odvajanje u grupe
    if (ts.length >= cts.length) {
        playersList[socket.id] = new Player(ctSpawn.x, ctSpawn.y, socket.id, "ct");
        playersInfo[socket.id] = {
            id: socket.id,
            type: 'ct'
        };
        cts.push(socket.id);
    } else {
        playersList[socket.id] = new Player(tSpawn.x, tSpawn.y, socket.id, "t");
        playersInfo[socket.id] = {
            id: socket.id,
            type: 't'
        };
        ts.push(socket.id);
    }

    //Slanje inicijalnih podataka novom igracu
    let initialData = {
        me: playersList[socket.id],
        playersInfo
    };
    socket.on('ready', () => {
        socket.emit('initial', initialData);
    });

    //Obavestavanje ostalih igraca da se konektovao nov igrac
    //Verovatno treba poboljsanja
    let newPlayerData = playersInfo[socket.id];
    socket.broadcast.emit('new player', newPlayerData);


    socket.on('position', (data) => {
        let isHacking = false;
        //Provera da li se igrac krece brze od dozvoljenje brzine
        if (Math.abs(data.pos.x - playersList[socket.id].pos.x) > playerSpeed * 2)
            isHacking = true;
        if (Math.abs(data.pos.y - playersList[socket.id].pos.y) > playerSpeed * 2)
            isHacking = true;
        //Provera da li se igrac kolajduje sa necim
        if (map.check(data))
            isHacking = true;
        //Ako je ispunjeno nesto od prethodnih uslova
        //Igracu koji se nalazi gde ne treba, salje se posledja validna pozicija
        if(isHacking) 
            socket.emit('hacked position', playersList[socket.id].pos);
        //Ako je sve u redu
        //Azurira se igraceva pozicija na serveru, i
        //Ostalim igracima se salje nova pozicija
        else {
            playersList[socket.id].pos.x = data.pos.x;
            playersList[socket.id].pos.y = data.pos.y;
            let closeOnes = inSight(playersList[socket.id]);
            for (const key in closeOnes) {
                if (closeOnes.hasOwnProperty(key)) {
                    const element = closeOnes[key];
                    socket.to(element.id).emit('someone moved', {
                        id: socket.id,
                        pos: playersList[socket.id].pos
                    });
                }
            }
            socket.emit('players in sight', closeOnes);
        }
    });
    socket.on('disconnect', () => {
        delete playersList[socket.id];
        delete playersInfo[socket.id];
        var index = cts.indexOf(socket.id);
        if (index > -1) 
            cts.splice(index, 1);
        index = ts.indexOf(socket.id);
        if (index > -1)
            ts.splice(index, 1);
        socket.broadcast.emit('player disconnected', socket.id);
    });
});
class Player {
    constructor(x, y, id, type) {
        this.pos = {
            x: x,
            y: y
        }
        this.id = id;
        this.type = type;
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