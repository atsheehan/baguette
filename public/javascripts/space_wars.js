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
      player.accel = new Vec2(0.001, 0);
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
    worldState = JSON.parse(msg.data);

    for (var i = 0; i < worldState.ships.length; i++) {
      for (var j = 0; j < ships.length; j++) {
        if (ships[j].id === worldState.ships[i].id) {
          ships[j].accel.x = worldState.ships[i].accel.x;
          ships[j].accel.y = worldState.ships[i].accel.y;
          ships[j].vel.x = worldState.ships[i].vel.x;
          ships[j].vel.y = worldState.ships[i].vel.y;
          ships[j].pos.x = worldState.ships[i].pos.x;
          ships[j].pos.y = worldState.ships[i].pos.y;
          break;
        }
      }
    }
  }
});
