$(document).ready(function() {
  var view = new View(document.getElementById("game-canvas"));
  var player = new Ship(0, new Vec2(100, 100));
  var ships = [player];

  function draw() {
    view.clearScreen();

    for (var i = 0; i < ships.length; i++) {
      view.drawTriangle(ships[i].pos, ships[i].heading, 30, "blue");
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
      ws.send("engineOn")
      break;

    case LEFT_KEY:
      player.startTurning("counter-clockwise");
      ws.send("startTurnCC")
      break;

    case RIGHT_KEY:
      player.startTurning("clockwise");
      ws.send("startTurnC")
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
      ws.send("engineOff")
      break;

    case LEFT_KEY:
      player.stopTurning("counter-clockwise");
      ws.send("stopTurnCC")
      break;

    case RIGHT_KEY:
      player.stopTurning("clockwise");
      ws.send("stopTurnC")
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

  ws = new WebSocket($("#websocket-url").data("url"));

  ws.onmessage = function(message) {
    data = JSON.parse(message.data);

    for (var i = 0; i < data.ships.length; i++) {
      var shipData = data.ships[i];

      for (var j = 0; j < ships.length; j++) {
        if (shipData.id === ships[j].id) {
          var ship = ships[j];

          ship.pos.x = shipData.pos.x;
          ship.pos.y = shipData.pos.y;
          ship.heading.x = shipData.heading.x;
          ship.heading.y = shipData.heading.y;
          ship.vel.x = shipData.vel.x;
          ship.vel.y = shipData.vel.y;
          ship.accel.x = shipData.accel.x;
          ship.accel.y = shipData.accel.y;
        }
      }
    }
  }

  run();
});
