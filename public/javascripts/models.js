var Vec2 = {
  build: function(x, y) {
    return { "x": x, "y": y };
  },

  add: function(a, b) {
    return this.build(a.x + b.x, a.y + b.y);
  },

  magnitude: function(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  },

  normalize: function(vec) {
    var magnitude = this.magnitude(vec);

    if (magnitude === 0) return this.build(0, 0);
    else return Vec2.build(vec.x / magnitude, vec.y / magnitude);
  },

  scale: function(vec, factor) {
    return Vec2.build(vec.x * factor, vec.y * factor);
  },

  lengthTo: function(vec, length) {
    return this.scale(this.normalize(vec), length);
  },

  rotate: function(vec, radians) {
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);

    return Vec2.build(vec.x * cos - vec.y * sin, vec.x * sin + vec.y * cos);
  }
}

var Ship = {
  startTurning: function(ship, direction) {
    ship.rotating = direction;
  },

  stopTurning: function(ship, direction) {
    if (direction === ship.rotating) {
      ship.rotating = "None";
    }
  },

  toggleEngine: function(ship, value) {
    ship.engineOn = value;
  },

  update: function(ship) {
    if (ship.engineOn) {
      ship.accel = Vec2.scale(ship.heading, ship.thrust);
    } else {
      ship.accel = Vec2.build(0, 0);
    }

    if (ship.rotating === "CounterClockwise") {
      ship.heading = Vec2.rotate(ship.heading, -Math.PI / 20);
    } else if (ship.rotating === "Clockwise") {
      ship.heading = Vec2.rotate(ship.heading, Math.PI / 20);
    }

    ship.vel = Vec2.add(ship.vel, ship.accel);
    ship.pos = Vec2.add(ship.pos, ship.vel);
  }
}
