let ctSpaw = {
  x: 1000,
  y: 1100
}
let tSpaw = {
  x: 1500,
  y: 1500
}
class Player {
  constructor(type, speed, radius) {
    this.isCt = type;
    this.speed = speed;
    this.radius = radius;
    this.spawn();
  }
  spawn() {
    if(this.isCt)
      this.pos = createVector(ctSpaw.x ,ctSpaw.y);
    else
      this.pos = createVector(tSpaw.x, tSpaw.y);
    this.hitbox = {
      shape: 'circle',
      x: this.pos.x,
      y: this.pos.y,
      r: this.radius
    }
    this.isAlive = true;
    this.health = 100;
    this.killCount = 0;
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
  }
  update(obs)
  {
    this.show();
    if(this.isAlive)
      this.move(obs);
  }
  collides(obs)
  {
    for (const obstacle of obs) 
      return collider.collide(this.hitbox, obstacle);
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
  move(obs)
  {
    let isPositionChanged = false;
    if(this.up)
    {
      this.moveUp();
      if(this.collides(obs))
      {
        if(!this.tryLeft(obs))
          if(!this.tryRight(obs))
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
      if(this.collides(obs))
      {
        if(!this.tryLeft(obs))
          if(!this.tryRight(obs))
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
      if(this.collides(obs))
      {
        if(!this.tryUp(obs))
          if(!this.tryDown(obs))
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
      if(this.collides(obs))
      {
        if(!this.tryUp(obs))
          if(!this.tryDown(obs))
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
    }
  }
  tryUp(obs)
  {
    this.moveUp();
    if(this.collides(obs))
    {
      this.undoUp();
      return false;
    }
    return true;
  }
  tryDown(obs)
  {
    this.moveDown();
    if(this.collides(obs))
    {
      this.undoDown();
      return false;
    }
    return true;
  }
  tryLeft(obs)
  {
    this.moveLeft();
    if(this.collides(obs))
    {
      this.undoLeft();
      return false;
    }
    return true;
  }
  tryRight(obs)
  {
    this.moveRight();
    if(this.collides(obs))
    {
      this.undoRight();
      return false;
    }
    return true;
  }
  moveUp()
  {
    this.pos.add(createVector(0, -1).setMag(this.speed));
    this.moveHitbox();
  }
  moveDown()
  {
    this.pos.add(createVector(0, 1).setMag(this.speed));
    this.moveHitbox();
  }
  moveLeft()
  {
    this.pos.add(createVector(-1, 0).setMag(this.speed));
    this.moveHitbox();
  }
  moveRight()
  {
    this.pos.add(createVector(1, 0).setMag(this.speed));
    this.moveHitbox();
  }
  undoUp()
  {
    this.pos.sub(createVector(0, -1).setMag(this.speed));
    this.moveHitbox();
  }
  undoDown()
  {
    this.pos.sub(createVector(0, 1).setMag(this.speed));
    this.moveHitbox();
  }
  undoLeft()
  {
    this.pos.sub(createVector(-1, 0).setMag(this.speed));
    this.moveHitbox();
  }
  undoRight()
  {
    this.pos.sub(createVector(1, 0).setMag(this.speed));
    this.moveHitbox();
  }
  takeDamage(amount)
  {
    this.health -= amount;
    if(this.health <= 0)
    {
      this.isAlive = false;
      return true;
    }
    return false;
  }
  moveHitbox()
  {
    this.hitbox.pos = this.pos.copy();
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
}