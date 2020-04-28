class Player {
  constructor(x, y, type) {
    this.startingPosition = createVector(x, y);
    this.isCt = type == 'ct';
    this.speed = playerSpeed;
    this.radius = playerRadius;
    this.spawn();
  }
  spawn() {
    this.pos = createVector(this.startingPosition.x, this.startingPosition.y);
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
    this.show();
    if(this.isAlive)
      this.move();
  }
  //SHOTING
  //------------------------------------------------------------------
  shoot(x, y)
  {
    const ray = {
      shape: "ray",
      a: createVector(this.pos.x, this.pos.y),
      b: createVector(this.pos.x + x, this.pos.y + y)
    }
    line(ray.a.x, ray.a.y, ray.a.x + ray.b.copy().sub(ray.a).setMag(width*2).x, ray.a.y + ray.b.copy().sub(ray.a).setMag(width*2).y);
    console.log(`Shot at ${x}, ${y}`);
    //Placeholder for client-server communication
  }
  //MOVING
  //----------------------------------------------------------------
  move()
  {
    let isPositionChanged = false;
    if(this.up)
    {
      this.moveUp();
      if(this.collides())
      {
        if(!this.tryLeft())
          if(!this.tryRight())
            this.undoUp();
          else
          isPositionChanged = true;
        else
          isPositionChanged = true;
        } 
      else 
      isPositionChanged = true;
    }
    if(this.down)
    {
      this.moveDown();
      if(this.collides())
      {
        if(!this.tryLeft())
          if(!this.tryRight())
            this.undoDown();
            else
            isPositionChanged = true;
            else
          isPositionChanged = true;
      }
      else
        isPositionChanged = true;
      }
    if(this.right)
    {
      this.moveRight();
      if(this.collides())
      {
        if(!this.tryUp())
        if(!this.tryDown())
            this.undoRight();
          else
          isPositionChanged = true;
        else
          isPositionChanged = true;
      }
      else
      isPositionChanged = true;
    }
    if(this.left)
    {
      this.moveLeft();
      if(this.collides())
      {
        if(!this.tryUp())
          if(!this.tryDown())
            this.undoLeft();
            else
            isPositionChanged = true;
        else
        isPositionChanged = true;
      }
      else
      isPositionChanged = true;
    }
    if(isPositionChanged) {
      //Send new posiiton to server
      const data = {
        shape: "circle",
        pos:  {
          x: this.pos.x,
          y: this.pos.y
        },
        r: this.radius
      };
      socket.emit('position', data);
    }
  }
  tryUp()
  {
    this.moveUp();
    if(this.collides())
    {
      this.undoUp();
      return false;
    }
    return true;
  }
  tryDown()
  {
    this.moveDown();
    if(this.collides())
    {
      this.undoDown();
      return false;
    }
    return true;
  }
  tryLeft()
  {
    this.moveLeft();
    if(this.collides())
    {
      this.undoLeft();
      return false;
    }
    return true;
  }
  tryRight()
  {
    this.moveRight();
    if(this.collides())
    {
      this.undoRight();
      return false;
    }
    return true;
  }
  moveUp()
  {
    this.pos.add(createVector(0, -1).setMag(this.speed));
  }
  moveDown()
  {
    this.pos.add(createVector(0, 1).setMag(this.speed));
  }
  moveLeft()
  {
    this.pos.add(createVector(-1, 0).setMag(this.speed));
  }
  moveRight()
  {
    this.pos.add(createVector(1, 0).setMag(this.speed));
  }
  undoUp()
  {
    this.pos.sub(createVector(0, -1).setMag(this.speed));
  }
  undoDown()
  {
    this.pos.sub(createVector(0, 1).setMag(this.speed));
  }
  undoLeft()
  {
    this.pos.sub(createVector(-1, 0).setMag(this.speed));
  }
  undoRight()
  {
    this.pos.sub(createVector(1, 0).setMag(this.speed));
  }
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