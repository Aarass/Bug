class Cursor {
    constructor(player) {
        this.pos = {
            x: 0,
            y: 0
        }
        this.target = player;
        this.shape = 'circle';
        this.size = 8;
        this.fill = color(0, 0);
        this.stroke = color(255, 255, 255);
        this.thickness = 2;
        this.sensitivity = 1;
    }
    show() {
        fill(this.fill);
        stroke(this.stroke);
        strokeWeight(this.thickness);
        switch(this.shape) {
            case 'circle':
                ellipse(width/2 + this.pos.x, height/2 + this.pos.y, this.size,this.size);
                break;
            case 'rectangle':
                rectMode(CENTER);
                rect(width / 2 + this.pos.x, height / 2 + this.pos.y, this.size, this.size)
                break;
            case 'triangle':
                triangle(
                    width / 2 + this.pos.x - this.size/2,
                    height / 2 + this.pos.y + this.size/2, 
                    width / 2 + this.pos.x, 
                    height / 2 + this.pos.y - this.size / 2, 
                    width / 2 + this.pos.x + this.size / 2, 
                    height / 2 + this.pos.y + this.size / 2)
        }
    }
    move(_x, _y) {
        let x = _x * this.sensitivity;
        let y = _y * this.sensitivity;
        if (x > 0) {
            if (this.pos.x + x > width / 2)
                this.pos.x = width / 2;
            else
                this.pos.x += x;
        } else if (x < 0) {
            if (this.pos.x + x < -width / 2)
                this.pos.x = -width / 2;
            else
                this.pos.x += x;
        }
        if (y > 0) {
            if (this.pos.y + y > height / 2)
                this.pos.y = height / 2;
            else
                this.pos.y += y;
        } else if (y < 0) {
            if (this.pos.y + y < -height / 2)
                this.pos.y = -height / 2;
            else
                this.pos.y += y;
        }
    }
    click() {
        let data = {
            x: this.target.pos.x + this.pos.x,
            y: this.target.pos.y + this.pos.y
        }
        socket.emit('click', data);
    }
}