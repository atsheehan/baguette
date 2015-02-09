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
      break;

    case LEFT_KEY:
      player.startTurning("counter-clockwise");
      break;

    case RIGHT_KEY:
      player.startTurning("clockwise");
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
      player.stopTurning("counter-clockwise");
      break;

    case RIGHT_KEY:
      player.stopTurning("clockwise");
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
