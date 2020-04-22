class Obstacles
{
  constructor()
  {
    this.arr = [];
    this.matrix = [];
    if(arguments[0] == "de_dust2x2")
      this.de_dust2x2();
  }
  add(obj)
  {
    this.arr.push(obj);
  }
  debug()
  {
    for(let  i = 0; i < this.arr.length; i++)
      this.arr[i].show(color(50));
  }
  de_dust2x2()
  {
    //Boundaries
    //-----
    this.add(new Line(0, 0, 0, 2750));
    this.add(new Line(0, 0, 2000, 0));
    this.add(new Line(0, 2750, 2000, 2750));
    this.add(new Line(2000, 0, 2000, 2750));
    //-----
    //1 levi ogromni short
    this.add(new Rectangle(0, 0, 800, 1000));
    //1 levo ispupcenje
    //--------------------------------------------
    this.add(new Rectangle(800, 300, 50, 300));
    this.add(new Circle(800, 300, 100));
    this.add(new Circle(800, 600, 100));
    //--------------------------------------------
    //leva strana
    //------------------------------------------
    this.add(new Rectangle(0, 1000, 100, 600));
    this.add(new Rectangle(0, 1800, 50, 500));
    this.add(new Rectangle(50, 1850, 50, 450));
    //------------------------------------------
    //2 linija koja deli niziju i short
    this.add(new Rectangle(450, 1000, 20, 600));
    //3 veliki zid izmedju short i vrata
    this.add(new Poly(600, 1200, 650, 1150, 1200, 1150, 1200, 1700, 600, 1700));
    //4 stepenice
    this.add(new Line(1000, 800, 1000, 900));
    //5 kod stepenice linija
    this.add(new Rectangle(1000, 800, 200, 20));
    //6 zidic na short da gledas na long
    this.add(new Rectangle(1200, 400, 20, 300));
    //7 box na short
    this.add(new Rectangle(1100, 600, 100, 100));
    //7 box pre short
    this.add(new Rectangle(1100, 1050, 100, 100));
    //8 gledas u njega od stepenice na short
    this.add(new Rectangle(800, 0, 600, 200));
    // boxevi na 8
    this.add(new Rectangle(1400, 0, 100, 100));
    this.add(new Rectangle(1500, 0, 50, 50));
    //9 site donja linija
    //----------------------------------------------
    this.add(new Rectangle(1200, 400, 200, 20));
    this.add(new Rectangle(1380, 400, 20, 70));
    this.add(new Rectangle(1380, 450, 300, 20));
    //----------------------------------------------
    //10 site desna linija
    this.add(new Rectangle(1680, 200, 20, 270));
    //11 site veca kutija
    this.add(new Rectangle(1400, 350, 100, 100));
    //12 site manja kutija
    this.add(new Rectangle(1425, 300, 50, 50));
    //12 site manja kutija sama
    this.add(new Rectangle(1630, 250, 50, 50));
    //14 ogromni blok na long
    this.add(new Rectangle(1200, 700, 500, 550));
    //13 skroz desno prvi blok
    this.add(new Rectangle(1900, 0, 100, 650));
    // box
    this.add(new Rectangle(1950, 800, 50, 50));
    //15 skroz desno drugi blok
    this.add(new Rectangle(1900, 850, 100, 450));
    //16 skroz desno stek
    this.add(new Rectangle(1900, 1300, 20, 40));
    this.add(new Rectangle(1900, 1450, 20, 200));
    //17 zid za vrata
    this.add(new Rectangle(1500, 1500, 20, 150));
    //17 zid za vrata
    this.add(new Rectangle(1520, 1600, 50, 50)); 
    //18 zid za niziju na long
    this.add(new Rectangle(1700, 1500, 20, 150));
    //19 povezuje sve te prethodne tri
    this.add(new Rectangle(1500, 1650, 500, 1150));
    //   produzetak
    //--------------------------------------------
    this.add(new Rectangle(1100, 1700, 100, 100));
    this.add(new Rectangle(1050, 1700, 50, 50));
    this.add(new Circle(1100, 1750, 100));
    //--------------------------------------------
    //20 drzac za leva vrata
    this.add(new Rectangle(1200, 1780, 50, 20));
    //21 leva vrata
    this.add(new Line(1250, 1790, 1300, 1700));
    //22 drzac za desna vrata
    this.add(new Rectangle(1450, 1780, 50, 20));
    //23 desna vrata
    this.add(new Line(1450, 1790, 1400, 1880));
    //24 box kod vrata
    this.add(new Rectangle(1400, 1500, 100, 100));
    //------------------------------------------------
    this.add(new Rectangle(1380, 1480, 140, 20));
    this.add(new Rectangle(1200, 1480, 20, 20));
    //------------------------------------------------
    //25 veci box posle vrata
    this.add(new Rectangle(1350, 1250, 100, 100));
    //26 manji box posle vrata
    this.add(new Rectangle(1450, 1250, 50, 50));
    //27 box u niziju na long
    this.add(new Rectangle(1850, 1530, 50, 50));
    //28 veci box u niziju na veci dust2
    this.add(new Rectangle(350, 1100, 100, 100));
    //29 manji box u niziju na manji dust2
    this.add(new Rectangle(400, 1200, 50, 50));
    //30 od t spawn veliki blok koj razdvaja long i short
    this.add(new Rectangle(350, 1900, 500, 300));
    //31 veci box kod t spawn
    this.add(new Rectangle(100, 1900, 100, 100));
    //32 manji box kod t spawn
    this.add(new Rectangle(100, 2000, 100, 100));
    //33 zid koj stalno preskacem od t spawn
    this.add(new Rectangle(0, 2300, 700, 20));
    //34 box kod t spawn
    this.add(new Rectangle(1100, 2100, 100, 100));
    //34 zid kod t spawn kod rotiran box
    this.add(new Rectangle(1200, 2100, 300, 650));
    //35 box kod A site
    this.add(new Rectangle(1700, 300, 50, 50));
    //36 box pre short
    this.add(new Rectangle(600, 1000, 50, 50));


    let w = 2000;
    let h = 2750;
    for (let i = 0; i < w / 100; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < h / 100; j++) {
        this.matrix[i][j] = this.intersectingObjects(i, j);
      }
    }
  }
  intersectingObjects(i, j) {
    let arr = [];
    let square = new Rectangle(i * 100, j * 100, 100, 100);
    for (const obj of this.arr) {
      if(collider.collide(obj, square))
        arr.push(obj);
    }
    return arr;
  }
}


class Ray {
  constructor(x, y, angle) {
    this.pos = createVector(x, y);
    this.mag = 10;
  }
  show() {
    this.dir = createVector(mouseX, mouseY).sub(this.pos).setMag(this.mag);
    this.dir.add(createVector(1, 1));
    line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);
  }
  cast(pos, arr) {
    let dist = signedDistance(pos, arr);
    if (dist > 1) {
      stroke(255, 0, 0);
      ellipse(pos.x, pos.y, dist * 2, dist * 2);
      const newPoint = pos.copy().add(this.dir.copy().setMag(dist));
      if (offScreen(newPoint))
        return 0;
      return dist + this.cast(newPoint, arr);
    }
    return 0;
  }
}
function offScreen(pos) {
  return (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height);
}
function signedDistance(pos, arr) {
  let record = Infinity;
  for (let i = 0; i < arr.length; i++) {
    let distance = dist(pos.x, pos.y, arr[i].pos.x, arr[i].pos.y) - arr[i].r / 2;
    if (distance < record)
      record = distance;
  }
  return record;
}
class Point {
  constructor(x, y) {
    this.shape = "point";
    this.pos = createVector(x, y);
  }
  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
}
class Line {
  constructor(x1, y1, x2, y2) {
    this.shape = "line";
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }
  show() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
class Circle {
  constructor(x, y, r) {
    this.shape = "circle";
    this.pos = createVector(x, y);
    this.r = r;
  }
  show() {
    if (arguments.length == 0) {
      noFill();
      stroke(255);
    }
    else {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}
class Rectangle {
  constructor(x, y, w, h) {
    this.shape = "rectangle";
    this.pos = createVector(x, y);
    this.dim = createVector(w, h);
  }
  show() {
    if (arguments.length == 0) {
      noFill();
      stroke(255);
    }
    else {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }
}
class Poly {
  constructor() {
    this.shape = "poly";
    this.vertices = [];
    this.size = 0;
    for (let i = 0; i < arguments.length; i += 2)
      this.vertices[this.size++] = createVector(arguments[i], arguments[i + 1]);
  }
  show() {
    if (arguments.length == 0) {
      noFill();
      stroke(255);
    }
    else {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    beginShape();
    for (let i = 0; i < this.size; i++)
      vertex(this.vertices[i].x, this.vertices[i].y);
    endShape(CLOSE);
  }
  moveBy(x, y) {
    for (let i = 0; i < this.vertices.length; i++)
      this.vertices[i].add(x, y);
  }
}