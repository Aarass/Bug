class BulletsManager {
    constructor() {
        this.queue = [];
    }
    show() {
        stroke(0);
        strokeWeight(2);
        for (const i of this.queue)
            line(i.start.x, i.start.y, i.start.x + i.end.x * 100, i.start.y + i.end.y * 100);
        this.queue = [];
    }
    queueUp(pos1, pos2) {
        const start = {
            x: pos1.x,
            y: pos1.y
        }
        const end = {
            x: pos2.x,
            y: pos2.y
        }
        this.queue.push({
            start,
            end
        });
    }
}