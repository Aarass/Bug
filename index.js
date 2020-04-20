const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const server = app.listen(port);

const io = require('socket.io')(server);

app.use(express.static('public'));

let playersList = {};    
let movingSpeed = 5;                                                                                     


io.on('connection', (socket) => {
    //Dodavanje novog igraca u listu
    playersList[socket.id] = {
        id: socket.id,
        x: 500,
        y: 500
    }

    //Obavestavanje novog igraca o vec konektovanim igracima
    //Potrebna izmena jer je nebezbedno
    let others = Object.assign({}, playersList);
    delete others[socket.id];
    socket.emit('initial', others);

    //Obavestavanje ostalih igraca da se konektovao nov igrac
    //Potrebna izmena jer je nebezbedno
    socket.broadcast.emit('newPlayer', playersList[socket.id]);

    //Rukovanje kretanja
    //Potreban collision detect
    socket.on('keydown', (dir) => {
        if (dir == 'left')
            playersList[socket.id].x -= movingSpeed;
        if (dir == 'right')
            playersList[socket.id].x += movingSpeed;
        if (dir == 'up')
            playersList[socket.id].y -= movingSpeed;
        if (dir == 'down')
            playersList[socket.id].y += movingSpeed;
        //Pomeranje igraca koji je pritusnuo taster
        socket.emit('position', {
            x: playersList[socket.id].x,
            y: playersList[socket.id].y
        });
        //Slanje novih koordinata ostalim igracima
        //Potrebna izmena jer nije bezbedno
        socket.broadcast.emit('enemyMoved', {
            id: playersList[socket.id].id,
            x: playersList[socket.id].x,
            y: playersList[socket.id].y
        });
    });
    socket.on('disconnect', () => {
        delete playersList[socket.id];
        socket.broadcast.emit('playerDisconnected', socket.id);
    })
});