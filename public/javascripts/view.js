var View = function(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
}

View.prototype.clearScreen = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

View.prototype.displayPlayerIds = function(ships) {
  var view = this;
  var fontSize = 26;
  var y = fontSize;

  view.context.font = fontSize + "px courier";

  ships.forEach(function(ship) {
    view.context.fillStyle = ship.color;
    view.context.fillText(ship.id, 0, y);

    y += fontSize;
  });
};

View.prototype.drawTriangle = function(pos, heading, radius, color) {
  this.context.strokeStyle = color;
  this.context.fillStyle = color;

  var firstLeg = Vec2.lengthTo(heading, radius);
  var secondLeg = Vec2.rotate(firstLeg, 3 * Math.PI / 4);
  var thirdLeg = Vec2.rotate(firstLeg, 5 * Math.PI / 4);

  this.context.beginPath();
  this.context.moveTo(pos.x + firstLeg.x, pos.y + firstLeg.y);
  this.context.lineTo(pos.x + secondLeg.x, pos.y + secondLeg.y);
  this.context.lineTo(pos.x + thirdLeg.x, pos.y + thirdLeg.y);
  this.context.fill();
}
