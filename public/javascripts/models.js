var Vec2 = function(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype.add = function(that) {
  return new Vec2(this.x + that.x, this.y + that.y);
}
