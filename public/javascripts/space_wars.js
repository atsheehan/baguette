$(document).ready(function() {
  function drawTriangle(pos, heading, radius, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    var firstLeg = heading.lengthTo(radius);
    var secondLeg = firstLeg.rotate(3 * Math.PI / 4);
    var thirdLeg = firstLeg.rotate(5 * Math.PI / 4);

    ctx.beginPath();
    ctx.moveTo(pos.x + firstLeg.x, pos.y + firstLeg.y);
    ctx.lineTo(pos.x + secondLeg.x, pos.y + secondLeg.y);
    ctx.lineTo(pos.x + thirdLeg.x, pos.y + thirdLeg.y);
    ctx.fill();
  }

  function drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");

  var SCREEN_WIDTH = ctx.canvas.width;
  var SCREEN_HEIGHT = ctx.canvas.height;

  var player = new Ship(0, new Vec2(100, 100));
  var ships = [player];

  function draw() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for (var i = 0; i < ships.length; i++) {
      drawTriangle(ships[i].pos, ships[i].heading, 30, "blue");
    }
  }

  var framesPerSecond = 30;
  var millisecondsPerFrame = (1 / framesPerSecond) * 1000;
  var millisecondsLastTick = 0;
  var timeCounter = 0;

  function tick(milliseconds) {
    var timeElapsed = milliseconds - millisecondsLastTick;
    millisecondsLastTick = milliseconds;
    timeCounter += timeElapsed;

    while (timeCounter > millisecondsPerFrame) {
      for (var i = 0; i < ships.length; i++) {
        ships[i].update();
      }

      timeCounter -= millisecondsPerFrame;
    }
  }

  function loop(time) {
    tick(time);
    draw();

    window.requestAnimationFrame(function(time) {
      loop(time);
    });
  }

  function keyDown(event) {
    var handled = true;

    switch (event.keyCode) {

    case UP_KEY:
      player.toggleEngine(true);
      break;

    case LEFT_KEY:
      player.startTurning("left");
      break;

    case RIGHT_KEY:
      player.startTurning("right");
      break;

    default:
      handled = false;
      break;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  function keyUp(event) {
    var handled = true;

    switch (event.keyCode) {

    case UP_KEY:
      player.toggleEngine(false);
      break;

    case LEFT_KEY:
      player.stopTurning("left");
      break;

    case RIGHT_KEY:
      player.stopTurning("right");
      break;

    default:
      handled = false;
      break;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  function run() {
    window.onkeydown = keyDown;
    window.onkeyup = keyUp;

    window.requestAnimationFrame(function(time) {
      loop(time);
    });
  }

  run();
});
