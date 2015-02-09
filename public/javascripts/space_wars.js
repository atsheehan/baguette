$(document).ready(function() {
  function drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  ws = new WebSocket($("#websocket-url").data("url"));

  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");

  var SCREEN_WIDTH = ctx.canvas.width;
  var SCREEN_HEIGHT = ctx.canvas.height;

  var player = {
    id: 0,
    pos: new Vec2(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2),
    vel: new Vec2(0, 0),
    accel: new Vec2(0, 0),
    heading: new Vec2(0, -1)
  }

  var ships = [player];

  function draw() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for (var i = 0; i < ships.length; i++) {
      drawCircle(ships[i].pos.x, ships[i].pos.y, 30, "blue");
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

    var counter = 0;

    while (timeCounter > millisecondsPerFrame) {
      counter += 1;

      for (var i = 0; i < ships.length; i++) {
        var ship = ships[i];

        ship.vel = ship.vel.add(ship.accel);
        ship.pos = ship.pos.add(ship.vel);
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
    var action = null;

    switch (event.keyCode) {

    case UP_KEY:
      action = "up";
      break;

    case DOWN_KEY:
      action = "down";
      break;

    case LEFT_KEY:
      action = "left";
      break;

    case RIGHT_KEY:
      action = "right";
      // position.x += 10;
      break;

    default:
      handled = false;
      break;
    }

    if (handled) {
      ws.send(action);
      event.preventDefault();
    }
  }

  function run() {
    window.onkeydown = keyDown;

    window.requestAnimationFrame(function(time) {
      loop(time);
    });
  }

  run();

  ws.onmessage = function(msg) {
    console.log(msg.data);
    // positions = JSON.parse(msg.data);
  }
});
