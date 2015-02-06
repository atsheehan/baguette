$(document).ready(function() {
  var SPACE_KEY = 32;
  var A_KEY = 65;
  var Q_KEY = 81;
  var P_KEY = 80;
  var L_KEY = 76;
  var LEFT_KEY = 37;
  var UP_KEY = 38;
  var RIGHT_KEY = 39;
  var DOWN_KEY = 40;

  function drawRect(x, y, w, h, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.fillRect(x, y, w, h);
  }

  function drawCircle(x, y, radius, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  var positions = [];

  ws = new WebSocket($("#websocket-url").data("url"));

  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");

  var SCREEN_WIDTH = ctx.canvas.width;
  var SCREEN_HEIGHT = ctx.canvas.height;

  function draw() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for (var i = 0; i < positions.length; i++) {
      drawCircle(positions[i].x, positions[i].y, 30, "blue");
    }
  }

  function tick() {}

  function loop(time) {
    tick();
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
    positions = JSON.parse(msg.data);
  }
});
