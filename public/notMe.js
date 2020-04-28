class notMe {
    constructor(id, type) {
        this.id = id;
        this.pos = createVector(0, 0);
        this.isCt = type == 'ct';
        this.isAlive = true;
    }
    move(newPos) {
        this.pos = newPos;
    }
    show() {
        imageMode(CENTER);
        if (this.isCt) {
            if (this.isAlive) {
                if (this.right)
                    image(ctModel[(floor(frameCount / 4) % 8) + 18], this.pos.x, this.pos.y);
                else if (this.left)
                    image(ctModel[(floor(frameCount / 4) % 8) + 8], this.pos.x, this.pos.y);
                else if (this.up)
                    image(ctModel[(floor(frameCount / 4) % 8) + 1], this.pos.x, this.pos.y);
                else if (this.down)
                    image(ctModel[(floor(frameCount / 4) % 8) + 28], this.pos.x, this.pos.y);
                else
                    image(ctModel[0], this.pos.x, this.pos.y);
            }
            else {
                image(ctModel[36], this.pos.x, this.pos.y);
            }
        }
        else {
            if (this.isAlive) {
                if (this.right)
                    image(tModel[(floor(frameCount / 4) % 8) + 18], this.pos.x, this.pos.y);
                else if (this.left)
                    image(tModel[(floor(frameCount / 4) % 8) + 8], this.pos.x, this.pos.y);
                else if (this.up)
                    image(tModel[(floor(frameCount / 4) % 8) + 1], this.pos.x, this.pos.y);
                else if (this.down)
                    image(tModel[(floor(frameCount / 4) % 8) + 28], this.pos.x, this.pos.y);
                else
                    image(tModel[0], this.pos.x, this.pos.y);
            }
            else {
                image(tModel[36], this.pos.x, this.pos.y);
            }
        }
    }
}