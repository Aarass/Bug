class Player
{
  constructor(type, controls)
  {
    this.type = type;
    this.controls = controls;
    this.enemyType;
    if(this.type == "ct")
    {
      this.pos = createVector(ctSpawn.x, ctSpawn.y);
      this.enemyType = "t";
    }
    else
    {
     this.pos = createVector(tSpawn.x, tSpawn.y);
     this.enemyType = "ct";
   }
    this.dir = createVector(random(-1, 1), random(-1, 1));
    this.hitbox = new Circle(this.pos.x, this.pos.y, playerRadius);
    this.isControlable = controls;
    this.isAlive = true;
    this.health = 100;
    this.killCount = 0;
    this.speed = playerNormalSpeed;
    this.seen = [];
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.counter = 0;
  }
  spawn()
  {
    if(this.type == "ct")
    {
      this.pos = createVector(ctSpawn.x, ctSpawn.y);
      this.enemyType = "t";
    }
    else
    {
     this.pos = createVector(tSpawn.x, tSpawn.y);
     this.enemyType = "ct";
   }
    this.dir = createVector(random(-1, 1), random(-1, 1));
    this.hitbox = new Circle(this.pos.x, this.pos.y, playerRadius);
    this.isAlive = true;
    this.health = 100;
    this.killCount = 0;
    this.pointer = createVector(0, 0);
    this.isShooting = false;
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.counter = 0;
  }
  update(group, obs)
  {
    if(this.isControlable)
    {
      if(this.isAlive)
      {
        this.move(obs);
        this.look(group, obs);
        if(this.isShooting)
          this.shoot(this.pointer.x, this.pointer.y);
      }
    }
    else
    {
      this.counter += random(1, 10);
      if(this.isAlive)
      {
        this.moveRandomly(obs);
        this.look(group, obs);
        if(floor(this.counter) % floor(random(200, 400)) == 0)
        this.shootRandomly();
      }
    }
    //this.show();
  }
  //SHOTING
  //------------------------------------------------------------------
  //------------------------------------------------------------------
  shoot(x, y)
  {
    this.isShooting = false;
    //sortSeen();
    const ray = {
      shape: "ray",
      a: createVector(this.pos.x, this.pos.y),
      b: createVector(this.pos.x + x, this.pos.y + y)
    }
    const d = ray.b.copy().sub(ray.a);
    line(ray.a.x, ray.a.y, ray.a.x + d.x * 100, ray.a.y + d.y * 100);
    for(let i = 0; i < this.seen.length; i++)
    {
      if(this.seen[i].isAlive && this.seen[i].type == this.enemyType)
      {
        if(collide(ray, this.seen[i].hitbox))
        {
          if(this.seen[i].takeDamage(50))
          {
            this.killCount++;
          }
          this.isShooting = false;
          break;
        }
      }
    }
  }
  fire(x, y)
  {
    this.pointer = createVector(x, y);
    this.isShooting = true;
  }
  shootRandomly()
  {
    let enemies = [];
    for(let i = 0; i < this.seen.length; i++)
      if(this.seen[i].type != this.type && this.seen[i].isAlive == true)
        enemies.push(this.seen[i]);
    if(enemies.length > 0)
    {
      let i = floor(random(enemies.length));
      if(this.isInSight(enemies[i]))
        if(enemies[i].takeDamage(50))
        {
          this.killCount++;
        }
    }
  }
  isInSight(other)
  {
    const x = abs(this.pos.x - other.pos.x);
    const y = abs(this.pos.y - other.pos.y);
    if(x < width - 200 && y < height - 150)
      return true;
    return false;
  }
  //LOOKING
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  look(group, obs)
  {
    this.seen = [];
    const ray = {shape : "line", a:{  x: this.pos.x, y: this.pos.y}}
    loop1:
    for(let i = 0; i < group.arr.length; i++)
    {
      ray.b = (group.arr[i].pos.copy().sub(this.pos)).add(this.pos);
      for(let i = 0; i < obs.arr.length; i++)
        if(collide(ray, obs.arr[i]))
          continue loop1;
      this.seen.push(group.arr[i]);
    }
  }
  //SHOW SEEN
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  showSeen()
  {
    for(let i = 0 ; i < this.seen.length; i++)
      this.seen[i].show();
  }
  //MOVING
  //----------------------------------------------------------------
  moveRandomly(obs)
  {
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false;

    this.pos.add(this.dir.setMag(this.speed));
    this.moveHitbox();

    if(this.dir.x > 0)
      this.right = true;
    else if(this.dir.x < 0 )
      this.left = true;
    else if(this.dir.y > 0)
      this.down = true;
    else if(this.dir.y < 0)
      this.up = true;

    if(this.collides(obs))
    {
      this.pos.sub(this.dir.setMag(this.speed));
      this.moveHitbox();
      this.dir = createVector(random(-1, 1), random(-1, 1)).setMag(this.speed);
    }
  }
  move(obs)
  {
    if(this.up)
    {
      this.moveUp();
      if(this.collides(obs))
      {
        if(!this.tryLeft(obs))
          if(!this.tryRight(obs))
            this.undoUp();
      }
    }
    if(this.down)
    {
      this.moveDown();
      if(this.collides(obs))
      {
        if(!this.tryLeft(obs))
          if(!this.tryRight(obs))
            this.undoDown();
      }
    }
    if(this.right)
    {
      this.moveRight();
      if(this.collides(obs))
      {
        if(!this.tryUp(obs))
          if(!this.tryDown(obs))
            this.undoRight();
      }
    }
    if(this.left)
    {
      this.moveLeft();
      if(this.collides(obs))
      {
        if(!this.tryUp(obs))
          if(!this.tryDown(obs))
            this.undoLeft();
      }
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
      if(true)
      {
        let that = this;
        setTimeout(function(){ that.spawn()}, 3000);
      }
      return true;
    } else return false;
  }
  collides(obs)
  {
    for(let i = 0; i < obs.arr.length; i++)
    {
      if(collide(this.hitbox, obs.arr[i]))
        return true;
    }
    return false;
  }
  moveHitbox()
  {
    this.hitbox.pos = this.pos.copy();
  }
  sortSeen()
  {
    for(let i = 0; i < this.seen.length-1; i++)
    {
      for(let j = i+1; j < this.seen.length; j++)
      {
        if(dist(this.pos.x, this.pos.y, this.seen[i].pos.x, this.seen[i].pos.y) >
          dist(this.pos.x, this.pos.y, this.seen[j].pos.x, this.seen[j].pos.y) )
        {
            let temp = this.seen[i];
            this.seen[i] = this.seen[j];
            this.seen[j] = temp;
        }
      }
    }
  }
  show()
  {
    imageMode(CENTER);
    if(this.type == "ct")
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
