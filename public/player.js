class Player {
  constructor(id, type) {
    this.id = id;
    this.isCt = type == 'ct';
    this.speed = playerSpeed;
    this.radius = playerRadius;
    this.spawn();
  }
  spawn() {
    this.isAlive = true;
    this.health = 100;
    this.killCount = 0;
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
  }
  update()
  {
    if(this.pos) {
      this.show();
      this.move();
    }
  }
  updateOthers()
  {
    if(this.pos) {
      this.show();
      if(this.desiredPos) {
        if(this.pos.x < this.desiredPos.x) {
          this.pos.x += playerSpeed;
          this.right = true;
          this.left = false;
        }
        else if(this.pos.x > this.desiredPos.x) {
          this.pos.x -= playerSpeed;
          this.right = false;
          this.left = true;
        }
        else {
          this.right = false;
          this.left = false;
        }
        if (this.pos.y < this.desiredPos.y) {
          this.pos.y += playerSpeed;
          this.down = true;
          this.up = false;
        }
        else if (this.pos.y > this.desiredPos.y) {
          this.pos.y -= playerSpeed;
          this.down = false;
          this.up = true;
        }
        else {
          this.down = false;
          this.up = false;
        }
      }
    }
  }
  interpolateTo(data) {
    this.desiredPos = data;
  }
  //MOVING
  //----------------------------------------------------------------
  move() {
    let ms;
    if (this.left || this.right || this.up || this.down) {
      ms = Date.now();
      socket.emit('move', {
        left: this.left,
        right: this.right,
        up: this.up,
        down: this.down,
        id: ms
      });
    }
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
    if(ms)
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
  show()
  {
    imageMode(CENTER);
    if(this.isCt)
    {
      if(this.isAlive)
      {
        if(this.right)
        image(ctModel[(floor(frameCount/4) % 8) + 18], this.pos.x, this.pos.y);
        else if(this.left)
        image(ctModel[(floor(frameCount/4) % 8) + 8], this.pos.x, this.pos.y);
        else if(this.up)
        image(ctModel[(floor(frameCount/4) % 8) + 1], this.pos.x, this.pos.y);
        else if(this.down)
        image(ctModel[(floor(frameCount/4) % 8) + 28], this.pos.x, this.pos.y);
        else
        image(ctModel[0], this.pos.x, this.pos.y);
      }
      else
      {
        image(ctModel[36], this.pos.x, this.pos.y);
      }
    }
    else
    {
      if(this.isAlive)
      {
        if(this.right)
        image(tModel[(floor(frameCount/4) % 8) + 18], this.pos.x, this.pos.y);
        else if(this.left)
        image(tModel[(floor(frameCount/4) % 8) + 8], this.pos.x, this.pos.y);
        else if(this.up)
          image(tModel[(floor(frameCount/4) % 8) + 1], this.pos.x, this.pos.y);
        else if(this.down)
        image(tModel[(floor(frameCount/4) % 8) + 28], this.pos.x, this.pos.y);
        else
        image(tModel[0], this.pos.x, this.pos.y);
      }
      else
      {
        image(tModel[36], this.pos.x, this.pos.y);
      }
    }
  }
  collides()
  {
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