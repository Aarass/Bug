class Map
{
  constructor(data)
  {
    this.matrix = data;
    this.playerRadius = 30;
    this.playerSpeed = 5;
    this.gridCellSize = 100;
    this.gridCellOffset = this.playerRadius * 0.5 * 0.6;
  }
  check(hitbox) {
    let i = Math.floor(hitbox.pos.x / this.gridCellSize);
    let j = Math.floor(hitbox.pos.y / this.gridCellSize);
    if(i >= 0 && j >= 0 && i < 20 && j < 28) {
      for(let obstacle of this.matrix[i][j]) 
        if(collide(hitbox, obstacle))
          return true;
      return false;
    } else 
    return true;
  }
  hit(shape1 ,shape2) {
    if(collide(shape1, shape2))
      return true;
    return false;
  }
  seeEachOther(hitbox1, hitbox2) {
    if(Math.abs(hitbox1.pos.x - hitbox2.pos.x) > 640)
      return false;
    if(Math.abs(hitbox1.pos.y - hitbox2.pos.y) > 360)
      return false;
    let field = raytrace(hitbox1.pos.x / this.gridCellSize,
      hitbox1.pos.y / this.gridCellSize,
      hitbox2.pos.x / this.gridCellSize,
      hitbox2.pos.y / this.gridCellSize);
    let line = {
      shape: 'line',
      a: {
        x: hitbox1.pos.x,
        y: hitbox1.pos.y,
      },
      b: {
        x: hitbox2.pos.x,
        y: hitbox2.pos.y,
      }
    };
    for(let square of field) {
      for (let obstacle of this.matrix[square.i][square.j])
        if (collide(line, obstacle))
          return false;
    }
    return true;
  }
  areShootable(hitbox1, hitbox2) {
    let field = raytrace(hitbox1.pos.x / this.gridCellSize,
      hitbox1.pos.y / this.gridCellSize,
      hitbox2.pos.x / this.gridCellSize,
      hitbox2.pos.y / this.gridCellSize);
    let line = {
      shape: 'line',
      a: {
        x: hitbox1.pos.x,
        y: hitbox1.pos.y,
      },
      b: {
        x: hitbox2.pos.x,
        y: hitbox2.pos.y,
      }
    };
    for(let square of field) {
      for (let obstacle of this.matrix[square.i][square.j])
        if (collide(line, obstacle))
          return false;
    }
    return true;
  }
}
function raytrace(x0, y0, x1, y1) {
  let arr = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let x = parseInt(Math.floor(x0));
  let y = parseInt(Math.floor(y0));

  let n = 1;
  let x_inc, y_inc;
  let error;

  if (dx == 0) {
    x_inc = 0;
    error = Infinity;
  }
  else if (x1 > x0) {
    x_inc = 1;
    n += parseInt(Math.floor(x1)) - x;
    error = (Math.floor(x0) + 1 - x0) * dy;
  }
  else {
    x_inc = -1;
    n += x - parseInt(Math.floor(x1));
    error = (x0 - Math.floor(x0)) * dy;
  }

  if (dy == 0) {
    y_inc = 0;
    error -= Infinity;
  }
  else if (y1 > y0) {
    y_inc = 1;
    n += parseInt(Math.floor(y1)) - y;
    error -= (Math.floor(y0) + 1 - y0) * dx;
  }
  else {
    y_inc = -1;
    n += y - parseInt(Math.floor(y1));
    error -= (y0 - Math.floor(y0)) * dx;
  }

  for (; n > 0; --n) {
    arr.push({
      i: x,
      j: y
    });
    if (error > 0) {
      y += y_inc;
      error -= dx;
    }
    else {
      x += x_inc;
      error += dy;
    }
  }
  return arr;
}
function collide(objectA, objectB) {
  return eval(objectA.shape + "By" + capitalized(objectB.shape) + "(objectA, objectB);");
}
function dist(x1, y1, x2, y2) {
  let result = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 -y2, 2));
  return result;
}
function capitalized(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function pointByPoint(objectA, objectB) {
  return (objectA.pos.x === objectB.pos.x &&
          objectA.pos.y === objectB.pos.y)
}
function pointByCircle(objectA, objectB) {
  return (dist(objectA.pos.x, objectB.pos.y, objectB.pos.x, objectB.pos.y) <= objectB.r / 2)
}
function circleByPoint(objectA, objectB) { return pointByCircle(objectB, objectA) }
function circleByCircle(objectA, objectB) {
  return (dist(objectA.pos.x, objectA.pos.y, objectB.pos.x, objectB.pos.y) <= objectA.r / 2 + objectB.r / 2)
}
function pointByRectangle(objectA, objectB) {
  return ((objectA.pos.x > objectB.pos.x) && (objectA.pos.x < objectB.pos.x + objectB.dim.x)
    && (objectA.pos.y > objectB.pos.y) && (objectA.pos.y < objectB.pos.y + objectB.dim.y))
}
function rectangleByPoint() { return pointByRectangle(objectB, objectA) }
function rectangleByRectangle(objectA, objectB) {
  return (objectA.pos.x + objectA.dim.x >= objectB.pos.x &&
    objectA.pos.x <= objectB.pos.x + objectB.dim.x &&
    objectA.pos.y + objectA.dim.y >= objectB.pos.y &&
    objectA.pos.y <= objectB.pos.y + objectB.dim.y)
}
function circleByRectangle(objectA, objectB) {
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

  let distance = Math.sqrt(Math.pow(objectA.pos.x - testX, 2) + Math.pow(objectA.pos.y - testY, 2));

  return (distance <= objectA.r / 2)
}
function rectangleByCircle(objectA, objectB) { return circleByRectangle(objectB, objectA) }
function lineByPoint(objectA, objectB) {
  const len = dist(objectA.a.x, objectA.a.y, objectA.b.x, objectA.b.y);
  const l1 = dist(objectA.a.x, objectA.a.y, objectB.pos.x, objectB.pos.y);
  const l2 = dist(objectA.b.x, objectA.b.y, objectB.pos.x, objectB.pos.y);
  return (l1 + l2 - 0.1 <= len);
}
function pointByLine(objectA, objectB) { return lineByPoint(objectB, objectA); }
function lineByCircle(objectA, objectB) {
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const cx = objectB.pos.x;
  const cy = objectB.pos.y;
  const r = objectB.r / 2;
  if (dist(x1, y1, cx, cy) < r)
    return true;
  if (dist(x2, y2, cx, cy) < r)
    return true;
  const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);

  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));
  const distX = closestX - cx;
  const distY = closestY - cy;
  const distance = Math.sqrt((distX * distX) + (distY * distY));
  return (distance <= r && pointByLine({ pos: { x: closestX, y: closestY } }, objectA))
}
function circleByLine(objectA, objectB) { return lineByCircle(objectB, objectA) }
function circleByLine(objectA, objectB) { return lineByCircle(objectB, objectA) }
function rayByCircle(objectA, objectB) {
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const cx = objectB.pos.x;
  const cy = objectB.pos.y;
  const r = objectB.radius / 2;
  if (dist(x1, y1, cx, cy) < r)
    return true;
  if (dist(x2, y2, cx, cy) < r)
    return true;
  const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);

  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));
  const distX = closestX - cx;
  const distY = closestY - cy;
  const distance = Math.sqrt((distX * distX) + (distY * distY));
  const dist1 = Math.sqrt(Math.pow(x1 - cx, 2) + Math.pow(y1 - cy, 2));
  const dist2 = Math.sqrt(Math.pow(x2 - cx, 2) + Math.pow(y2 - cy, 2));
  return (distance <= r && dist1 > dist2)
}
function circleByRay(objectA, objectB) { return rayByCircle(objectB, objectA) }
function lineByLine(objectA, objectB) {
  const x1 = objectA.a.x;
  const y1 = objectA.a.y;
  const x2 = objectA.b.x;
  const y2 = objectA.b.y;
  const x3 = objectB.a.x;
  const y3 = objectB.a.y;
  const x4 = objectB.b.x;
  const y4 = objectB.b.y;

  const determinator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (determinator == 0)
    return false;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / determinator;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / determinator;

  return (0 < t && t < 1 && 0 < u && u < 1);
}
function lineByRectangle(objectA, objectB) {
  const leftEgde = {
    a: {
      x: objectB.pos.x,
      y: objectB.pos.y
    },
    b: {
      x: objectB.pos.x,
      y: objectB.pos.y + objectB.dim.y
    }
  }
  const bottomEgde = {
    a: {
      x: objectB.pos.x,
      y: objectB.pos.y + objectB.dim.y
    },
    b: {
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y + objectB.dim.y
    }
  }
  const rightEgde = {
    a: {
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y + objectB.dim.y
    },
    b: {
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y
    }
  }
  const topEgde = {
    a: {
      x: objectB.pos.x,
      y: objectB.pos.y
    },
    b: {
      x: objectB.pos.x + objectB.dim.x,
      y: objectB.pos.y
    }
  }
  if (pointByRectangle({ pos: { x: objectA.a.x, y: objectA.a.y } }, objectB) || pointByRectangle({ pos: { x: objectA.b.x, y: objectA.b.y } }, objectB))
    return true;
  return (lineByLine(objectA, leftEgde) || lineByLine(objectA, bottomEgde) || lineByLine(objectA, rightEgde) || lineByLine(objectA, topEgde))
}
function rectangleByLine(objectA, objectB) { return lineByRectangle(objectB, objectA) }
function polyByPoint(objectA, objectB) {
  let collision = false;
  for (let i = 0; i < objectA.size; i++) {
    let vc = objectA.vertices[i];
    let vn = objectA.vertices[(i + 1) % objectA.size];
    let px = objectB.pos.x;
    let py = objectB.pos.y;
    if (((vc.y > py) != (vn.y > py)) && (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      collision = !collision;
    }
  }
  return collision;
}
function pointByPoly(objectA, objectB) { return polyByPoint(objectB, objectA); }
function polyByCircle(objectA, objectB) {
  let next;
  for (let current = 0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if (lineByCircle(line, objectB))
      return true;
    if (polyByPoint(objectA, objectB))
      return true;
  }
  return false;
}
function circleByPoly(objectA, objectB) { return polyByCircle(objectB, objectA) }
function polyByRectangle(objectA, objectB) {
  let next;
  for (let current = 0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if (lineByRectangle(line, objectB))
      return true;
    let center = {
      pos: {
        x: objectB.pos.x + objectB.dim.x / 2,
        y: objectB.pos.y + objectB.dim.y / 2
      }
    }
    if (polyByPoint(objectA, center))
      return true;
  }
  return false;
}
function rectangleByPoly(objectA, objectB) { return polyByRectangle(objectB, objectA) }
function polyByLine(objectA, objectB) {
  let next = 0;
  for (let current = 0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let segment = {
      a: {
        x: objectA.vertices[current].x,
        y: objectA.vertices[current].y
      },
      b: {
        x: objectA.vertices[next].x,
        y: objectA.vertices[next].y
      }
    };
    if (lineByLine(segment, objectB))
      return true;
  }
  return false;
}
function lineByPoly(objectA, objectB) { return polyByLine(objectB, objectA) }
function polyByPoly(objectA, objectB) {
  let next;
  for (let current = 0; current < objectA.size; current++) {
    next = (current + 1) % objectA.size;
    let line = {
      a: objectA.vertices[current],
      b: objectA.vertices[next]
    };
    if (polyByLine(objectB, line))
      return true;
    if (polyByPoint(objectA, { pos: objectB.vertices[0] }))
      return true;
  }
  return false;
}
(function(exports) {
  exports.Construct = Map;
})(typeof exports === 'undefined' ? this['Maps'] = {} : exports);