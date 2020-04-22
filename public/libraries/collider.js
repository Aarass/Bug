(function (exports) {

  exports.dist = function (ax, ay, bx, by) {
    return Math.sqrt(Math.pow(ax - bx, 2) - Math.pow(ay - by, 2));
  }
  exports.capitalized = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exports.collide = function (objectA, objectB) {
    return eval("exports." + objectA.shape + "By" + exports.capitalized(objectB.shape) + "(objectA, objectB);");
  }

  exports.pointByPoint = function (objectA, objectB) {
    return (objectA.pos.x === objectB.pos.x && objectA.pos.y == objectB.pos.y)
  }
  exports.pointByLine = function (objectA, objectB) {
    let lineLength = exports.dist(objectB.a.x, objectB.a.y, objectB.b.x, objectB.b.y);
    let firstPart = exports.dist(objectA.pos.x, objectA.pos.y, objectB.a.x, objectB.a.y);
    let seccondPart = exports.dist(objectA.pos.x, objectA.pos.y, objectB.b.x, objectB.b.y);
    return (lineLength - firstPart - seccondPart < 1);
  }
  exports.lineByPoint = function (objectA, objectB) { return exports.pointByLine(objectB, objectA) }

  exports.pointByCircle = function (objectA, objectB) {
    return (exports.dist(objectA.pos.x, objectB.pos.y, objectB.pos.x, objectB.pos.y) <= objectB.r / 2)
  }
  exports.circleByPoint = function (objectA, objectB) { return exports.pointByCircle(objectB, objectA) }

  exports.circleByCircle = function (objectA, objectB) {
    return (exports.dist(objectA.pos.x, objectA.pos.y, objectB.pos.x, objectB.pos.y) <= objectA.r / 2 + objectB.r / 2)
  }
  exports.pointByRectangle = function (objectA, objectB) {
    return ((objectA.pos.x > objectB.pos.x) && (objectA.pos.x < objectB.pos.x + objectB.dim.x)
      && (objectA.pos.y > objectB.pos.y) && (objectA.pos.y < objectB.pos.y + objectB.dim.y))
  }
  exports.rectangleByPoint = function () { return exports.pointByRectangle(objectB, objectA) } //a

  exports.rectangleByRectangle = function (objectA, objectB) {
    return (objectA.pos.x + objectA.dim.x >= objectB.pos.x &&
      objectA.pos.x <= objectB.pos.x + objectB.dim.x &&
      objectA.pos.y + objectA.dim.y >= objectB.pos.y &&
      objectA.pos.y <= objectB.pos.y + objectB.dim.y)
  }

  exports.circleByRectangle = function (objectA, objectB) {
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
  exports.rectangleByCircle = function (objectA, objectB) { return exports.circleByRectangle(objectB, objectA) } //a

  exports.lineByCircle = function (objectA, objectB) {
    const x1 = objectA.a.x;
    const y1 = objectA.a.y;
    const x2 = objectA.b.x;
    const y2 = objectA.b.y;
    const cx = objectB.pos.x;
    const cy = objectB.pos.y;
    const r = objectB.r / 2;
    if (exports.dist(x1, y1, cx, cy) < r)
      return true;
    if (exports.dist(x2, y2, cx, cy) < r)
      return true;
    const len = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);

    const closestX = x1 + (dot * (x2 - x1));
    const closestY = y1 + (dot * (y2 - y1));
    const distX = closestX - cx;
    const distY = closestY - cy;
    const distance = Math.sqrt((distX * distX) + (distY * distY));

    return (distance <= r && exports.pointByLine({ pos: { x: closestX, y: closestY } }, objectA));
  }
  exports.circleByLine = function (objectA, objectB) { return exports.lineByCircle(objectB, objectA) }

  exports.rayByCircle = function (objectA, objectB) {
    const x1 = objectA.a.x;
    const y1 = objectA.a.y;
    const x2 = objectA.b.x;
    const y2 = objectA.b.y;
    const cx = objectB.pos.x;
    const cy = objectB.pos.y;
    const r = objectB.r / 2;
    if (exports.dist(x1, y1, cx, cy) < r)
      return true;
    if (exports.dist(x2, y2, cx, cy) < r)
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
  exports.circleByRay = function (objectA, objectB) { return exports.rayByCircle(objectB, objectA) } //a

  exports.lineByLine = function (objectA, objectB) {
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

  exports.lineByRectangle = function (objectA, objectB) {
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
    if (exports.lineByLine(objectA, leftEgde) || exports.lineByLine(objectA, bottomEgde) || exports.lineByLine(objectA, rightEgde) || exports.lineByLine(objectA, topEgde))
      return true;
    return false;
  }
  exports.rectangleByLine = function (objectA, objectB) { return exports.lineByRectangle(objectB, objectA) }

  exports.polyByPoint = function (objectA, objectB) {
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
  exports.pointByPoly = function (objectA, objectB) { return exports.polyByPoint(objectB, objectA) }

  exports.polyByCircle = function (objectA, objectB) {
    let next;
    for (let current = 0; current < objectA.size; current++) {
      next = (current + 1) % objectA.size;
      let line = {
        a: objectA.vertices[current],
        b: objectA.vertices[next]
      };
      if (exports.lineByCircle(line, objectB))
        return true;
      if (exports.polyByPoint(objectA, objectB))
        return true;
    }
    return false;
  }
  exports.circleByPoly = function (objectA, objectB) { return exports.polyByCircle(objectB, objectA) } //a

  exports.polyByRectangle = function (objectA, objectB) {
    let next;
    for (let current = 0; current < objectA.size; current++) {
      next = (current + 1) % objectA.size;
      let line = {
        a: objectA.vertices[current],
        b: objectA.vertices[next]
      };
      if (exports.lineByRectangle(line, objectB))
        return true;
      let center = {
        pos: {
          x: objectB.pos.x + objectB.dim.x / 2,
          y: objectB.pos.y + objectB.dim.y / 2
        }
      }
      if (exports.polyByPoint(objectA, center))
        return true;
    }
    return false;
  }
  exports.rectangleByPoly = function (objectA, objectB) { return exports.polyByRectangle(objectB, objectA) } //a

  exports.polyByLine = function (objectA, objectB) {
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
      if (exports.lineByLine(segment, objectB))
        return true;
    }
    return false;
  }
  exports.lineByPoly = function (objectA, objectB) { return exports.polyByLine(objectB, objectA) } //a

  exports.polyByPoly = function (objectA, objectB) {
    let next;
    for (let current = 0; current < objectA.size; current++) {
      next = (current + 1) % objectA.size;
      let line = {
        a: objectA.vertices[current],
        b: objectA.vertices[next]
      };
      if (exports.polyByLine(objectB, line))
        return true;
      if (exports.polyByPoint(objectA, { pos: objectB.vertices[0] }))
        return true;
    }
    return false;
  }
})(typeof exports === 'undefined' ? this['collider'] = {} : exports);