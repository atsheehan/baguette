var Vec2 = function(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype.add = function(that) {
  return new Vec2(this.x + that.x, this.y + that.y);
}

Vec2.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec2.prototype.normalize = function() {
  var magnitude = this.magnitude();

  if (magnitude === 0) return new Vec(0, 0)
  else return new Vec2(this.x / magnitude, this.y / magnitude);
}

Vec2.prototype.scale = function(factor) {
  return new Vec2(this.x * factor, this.y * factor);
}

Vec2.prototype.lengthTo = function(length) {
  return this.normalize().scale(length);
}

Vec2.prototype.rotate = function(radians) {
  var cos = Math.cos(radians);
  var sin = Math.sin(radians);

  return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
}
