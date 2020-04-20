function collide(objectA, objectB)
{
  return eval(objectA.shape + "By" + capitalized(objectB.shape) + "(objectA, objectB);");
}


function pointByPoint(objectA, objectB)
{
  if(objectA.pos.equals(objectB.pos))
    return {
      pos: createVector(objectA.x, objectA.y)
    }
  else
    return null;
}


function pointByCircle(objectA, objectB)
{
  if (dist(objectA.pos.x, objectB.pos.y, objectB.pos.x, objectB.pos.y) <= objectB.r/2)
    return {
      pos: createVector(objectA.x, objectA.y)
    }
  else
    return null;
}
function circleByPoint(objectA, objectB){return pointByCircle(objectB, objectA)}


function circleByCircle(objectA, objectB)
{
  if (dist(objectA.pos.x, objectA.pos.y, objectB.pos.x, objectB.pos.y) <= objectA.r/2 + objectB.r/2)
  {
    const dir = objectB.pos.copy().sub(objectA.pos);
    return {
        pos: objectA.pos.copy().add(dir.setMag(objectA.r/2))
    }
  }
  else
    return null;
}


function pointByRectangle(objectA, objectB)
{
  if ((objectA.pos.x > objectB.pos.x) && (objectA.pos.x < objectB.pos.x + objectB.dim.x)
  && (objectA.pos.y > objectB.pos.y) && (objectA.pos.y < objectB.pos.y + objectB.dim.y))
  {
    return true;
  }
}
function rectangleByPoint(){return pointByRectangle(objectB, objectA)}


function rectangleByRectangle(objectA, objectB)
{
  return (objectA.pos.x + objectA.dim.x >= objectB.pos.x &&
        objectA.pos.x <= objectB.pos.x + objectB.dim.x &&
        objectA.pos.y + objectA.dim.y >= objectB.pos.y &&
        objectA.pos.y <= objectB.pos.y + objectB.dim.y)
}


function circleByRectangle(objectA, objectB)
{
  let testX = objectA.pos.x;
  let testY = objectA.pos.y;

  if (objectA.pos.x < objectB.pos.x)
    testX = objectB.pos.x;
  else if (objectA.pos.x > objectB.pos.x + objectB.dim.x)
    testX = objectB.pos.x + objectB.dim.x;
  if (objectA.pos.y < objectB.pos.y)
    testY = objectB.pos.y;
  else if (objectA.pos.y > objectB.pos.y + objectB.dim.y)
    testY = objectB.pos.y + objectB.dim.y;

  let distance = sqrt( pow(objectA.pos.x - testX, 2) + pow(objectA.pos.y - testY, 2));

  return (distance <= objectA.r/2)
}
function rectangleByCircle(objectA, objectB){return circleByRectangle(objectB, objectA)}


function lineByPoint(objectA, objectB)
{
  const len = dist(objectA.a.x, objectA.a.y, objectA.b.x, objectA.b.y);
  const l1 = dist(objectA.a.x, objectA.a.y, objectB.pos.x, objectB.pos.y);
  const l2 = dist(objectA.b.x, objectA.b.y, objectB.pos.x, objectB.pos.y);
  return (l1 + l2 - 0.1 <= len);
}
function pointByLine(objectA, objectB){return lineByPoint(objectB, objectA);}


function lineByCircle(objectA, objectB)
{
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const cx = objectB.pos.x;
  const cy = objectB.pos.y;
  const r = objectB.r/2;
  if(dist(x1, y1, cx, cy) < r)
    return true;
  if(dist(x2, y2, cx, cy) < r)
    return true;
  const len = sqrt(pow(x1 - x2,2) + pow(y1 - y2,2));
  const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);

  const closestX = x1 + (dot * (x2-x1));
  const closestY = y1 + (dot * (y2-y1));
  const distX = closestX - cx;
  const distY = closestY - cy;
  const distance = sqrt( (distX*distX) + (distY*distY) );

  return (distance <= r && pointByLine({pos: {x : closestX, y : closestY}}, objectA))
}
function circleByLine(objectA, objectB){return lineByCircle(objectB, objectA)}

function rayByCircle(objectA, objectB)
{
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const cx = objectB.pos.x;
  const cy = objectB.pos.y;
  const r = objectB.r/2;
  if(dist(x1, y1, cx, cy) < r)
    return true;
  if(dist(x2, y2, cx, cy) < r)
    return true;
  const len = sqrt(pow(x1 - x2,2) + pow(y1 - y2,2));
  const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);

  const closestX = x1 + (dot * (x2-x1));
  const closestY = y1 + (dot * (y2-y1));
  const distX = closestX - cx;
  const distY = closestY - cy;
  const distance = sqrt( (distX*distX) + (distY*distY) );
  const dist1 = sqrt( pow(x1 - cx, 2) + pow(y1 - cy, 2) );
  const dist2 = sqrt( pow(x2 - cx, 2) + pow(y2 - cy, 2) );

  return (distance <= r && dist1 > dist2)
}
function circleByRay(objectA, objectB){return rayByCircle(objectB, objectA)}


function lineByLine(objectA, objectB)
{
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const x3 = objectB.a.x;
  const y3 = objectB.a.y;
  const x4 = objectB.b.x;
  const y4 = objectB.b.y;

  const determinator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if(determinator == 0)
    return false;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / determinator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / determinator;

  return (0 < t && t < 1 && 0 < u && u < 1);
}


function lineByRectangle(objectA, objectB)
{
  const leftEgde = {
    a:{
      x: objectB.pos.x,
      y: objectB.pos.y
    },
    b:{
      x: objectB.pos.x,
      y: objectB.pos.y + objectB.dim.y
    }
  }
  const bottomEgde = {
    a:{
      x: objectB.pos.x,
      y: objectB.pos.y + objectB.dim.y
    },
    b:{
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y + objectB.dim.y
    }
  }
  const rightEgde = {
    a:{
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y + objectB.dim.y
    },
    b:{
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y
    }
  }
  const topEgde = {
    a:{
      x: objectB.pos.x,
      y: objectB.pos.y
    },
    b:{
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y
    }
  }
  if(lineByLine(objectA, leftEgde) || lineByLine(objectA, bottomEgde) || lineByLine(objectA, rightEgde) || lineByLine(objectA, topEgde))
    return true;
  return false;
}
function rectangleByLine(objectA, objectB){return lineByRectangle(objectB, objectA)}


function polyByPoint(objectA, objectB)
{
  let collision = false;
  for(let i = 0; i < objectA.size; i++)
  {
    let vc = objectA.vertices[i];
    let vn = objectA.vertices[(i+1) % objectA.size];
    let px = objectB.pos.x;
    let py = objectB.pos.y;
    if ( ((vc.y > py) != (vn.y > py)) && (px < (vn.x-vc.x) * (py-vc.y) / (vn.y-vc.y) + vc.x) ) {
      collision = !collision;
    }
  }
  return collision;
}
function pointByPoly(objectA, objectB){return polyByPoint(objectB, objectA);}


function polyByCircle(objectA, objectB)
{
  let next;
  for (let current=0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if(lineByCircle(line, objectB))
      return true;
    if(polyByPoint(objectA, objectB))
      return true;
  }
  return false;
}
function circleByPoly(objectA, objectB){return polyByCircle(objectB, objectA)}


function polyByRectangle(objectA, objectB)
{
  let next;
  for (let current=0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if(lineByRectangle(line, objectB))
      return true;
    let center = {
      pos:{
        x : objectB.pos.x + objectB.dim.x/2,
        y : objectB.pos.y + objectB.dim.y/2
      }
    }
    if(polyByPoint(objectA, center))
      return true;
  }
  return false;
}
function rectangleByPoly(objectA, objectB){return polyByRectangle(objectB, objectA)}


function polyByLine(objectA, objectB)
{
  let next = 0;
  for (let current = 0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let segment = {
      a:{
        x: objectA.vertices[current].x,
        y: objectA.vertices[current].y
      },
      b:{
        x: objectA.vertices[next].x,
        y: objectA.vertices[next].y
      }
    };
    if(lineByLine(segment, objectB))
      return true;
  }
  return false;
}
function lineByPoly(objectA, objectB){return polyByLine(objectB, objectA)}


function polyByPoly(objectA, objectB)
{
  let next;
  for (let current=0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if(polyByLine(objectB, line))
      return true;
    if(polyByPoint(objectA, {pos: objectB.vertices[0]}))
      return true;
  }
  return false;
}







class Ray
{
  constructor(x, y, angle)
  {
    this.pos = createVector(x, y);
    this.mag = 10;
  }
  show()
  {
    this.dir = createVector(mouseX, mouseY).sub(this.pos).setMag(this.mag);
    this.dir.add(createVector(1, 1));
    line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);
  }
  cast(pos, arr)
  {
    let dist = signedDistance(pos, arr);
    if(dist > 1 )
    {
      stroke(255, 0, 0);
      ellipse(pos.x, pos.y, dist*2, dist*2);
      const newPoint = pos.copy().add(this.dir.copy().setMag(dist));
      if(offScreen(newPoint))
        return 0;
      return dist + this.cast(newPoint, arr);
    }
    return 0;
  }
}
function offScreen(pos)
{
  return (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height);
}
function signedDistance(pos, arr)
{
  let record = Infinity;
  for(let i = 0; i < arr.length; i++)
  {
    let distance = dist(pos.x, pos.y, arr[i].pos.x, arr[i].pos.y) - arr[i].r/2;
    if(distance < record)
      record = distance;
  }
  return record;
}
class Point
{
  constructor(x, y)
  {
    this.shape = "point";
    this.pos = createVector(x, y);
  }
  show()
  {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4 ,4);
  }
}
class Line
{
  constructor(x1, y1, x2, y2)
  {
    this.shape = "line";
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }
  show()
  {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
class Circle
{
  constructor(x, y, r)
  {
    this.shape = "circle";
    this.pos = createVector(x, y);
    this.r = r;
  }
  show()
  {
    if(arguments.length == 0)
    {
      noFill();
      stroke(255);
    }
    else
    {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }
}
class Rectangle
{
  constructor(x, y, w, h)
  {
    this.shape = "rectangle";
    this.pos = createVector(x, y);
    this.dim = createVector(w, h);
  }
  show()
  {
    if(arguments.length == 0)
    {
      noFill();
      stroke(255);
    }
    else
    {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
  }
}
class Poly
{
  constructor()
  {
    this.shape = "poly";
    this.vertices = [];
    this.size = 0;
    for(let i = 0; i < arguments.length; i += 2)
      this.vertices[this.size++] = createVector(arguments[i], arguments[i+1]);
  }
  show()
  {
    if(arguments.length == 0)
    {
      noFill();
      stroke(255);
    }
    else
    {
      fill(arguments[0]);
      stroke(arguments[0]);
    }
    beginShape();
    for(let i = 0; i < this.size; i++)
      vertex(this.vertices[i].x, this.vertices[i].y);
    endShape(CLOSE);
  }
  moveBy(x, y)
  {
    for(let i = 0; i < this.vertices.length; i++)
      this.vertices[i].add(x, y);
  }
}








function capitalized(s)
{
  return s.charAt(0).toUpperCase() + s.slice(1)
}
