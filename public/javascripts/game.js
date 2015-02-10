var view = new View(document.getElementById("game-canvas"));
var player = null;
var playerId = "atsheehan";
var world = {"ships": []};

function draw() {
  view.clearScreen();

  world.ships.forEach(function(ship) {
    view.drawTriangle(ship.pos, ship.heading, 30, ship.color);
  });
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
    world.ships.forEach(function(ship) {
      Ship.update(ship);
    });

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
    if (player) {
      Ship.toggleEngine(player, true);
    }
    ws.send("engineOn")
    break;

  case LEFT_KEY:
    if (player) {
      Ship.startTurning(player, "CounterClockwise");
    }
    ws.send("startTurnCC")
    break;

  case RIGHT_KEY:
    if (player) {
      Ship.startTurning(player, "Clockwise");
    }
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
    if (player) {
      Ship.toggleEngine(player, false);
    }
    ws.send("engineOff")
    break;

  case LEFT_KEY:
    if (player) {
      Ship.stopTurning(player, "CounterClockwise");
    }
    ws.send("stopTurnCC")
    break;

  case RIGHT_KEY:
    if (player) {
      Ship.stopTurning(player, "Clockwise");
    }
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

var ws = new WebSocket(document.getElementById("websocket-url").dataset.url);

ws.onmessage = function(message) {
  world = JSON.parse(message.data);

  for (var i = 0; i < world.ships.length; i++) {
    if (world.ships[i].id === playerId) {
      player = world.ships[i];
      break;
    }
  }
}

run();
