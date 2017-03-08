var canvas = document.querySelector('#engines'),
  ctx = canvas.getContext('2d');
var trailCanvas = document.querySelector("#trails"),
  trailCtx = trailCanvas.getContext('2d');

var factor = 0.70;

// document.documentElement.clientWidth OR parent.document.documentElement.client ?

var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var len = factor * Math.min(w, h);
var dotR = len / 180;

ctx.canvas.width = len;
ctx.canvas.height = len;
trailCtx.canvas.width = len;
trailCtx.canvas.height = len;

function animLoop(render) {
  var running, lastFrame = +new Date;
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  function loop(now) {
    if (running !== false) {
      requestAnimFrame(loop);
      running = render(now - lastFrame);
      lastFrame = now;
    }
  }
  loop(lastFrame);
};

function drawDot(x, y, color, ctx) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, dotR, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

function drawMDot(x, y, color, ctx) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 1.7 * dotR, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

var getTrailColor = (function() {
  //var blue = 150 -- to 50,
  var blue = 174,
    dir = -1;
  return function() {
    blue += dir;
    if (blue === 74) {
      dir = 1;
    } else if (blue === 174) {
      dir = -1;
    }
    return 'rgba(104, 55,' + blue + ',1)';
    //return 'rgba(102,0,' + blue + ',.9)';
  };
})();

var r1 = len / 5.0;
var r2 = 1.5 * r1;

// 5 petals flower
var engines = [
  {x: r1 + 2*dotR, y: r1 + 2*dotR, r: r1, a: (3 * Math.PI / 4), s: (Math.PI / 200)},
  {x: (len - r2 - 2*dotR), y: (len - r2 - 2*dotR), r: r2, a: (-Math.PI / 4), s: (-Math.PI / 50)}
];

/*var engines = [
  {x: r1, y: r1, r: r1, a: (3 * Math.PI / 4), s: (Math.PI / 200)},
  {x: (radius + 100), y: (radius + 225), r: (radius * 5 / 3), a: (-Math.PI / 4), s: (-Math.PI / 50)}
];*/

// 8 petals
/*var engines = [
  {x: 300, y: 300, r: 200, a: Math.PI / 4, s: Math.PI / 50},
  {x: 300, y: 300, r: 200, a: -Math.PI / 4, s: -Math.PI / 30}
];*/

// 4 circles
/*var engines = [
  {x: 150, y: 300, r: 150, a: Math.PI, s: Math.PI / 100},
  {x: 300, y: 150, r: 150, a: -Math.PI/2, s: Math.PI / 100},
  {x: 450, y: 300, r: 150, a: 2*Math.PI, s: Math.PI / 100},
  {x: 300, y: 450, r: 150, a: Math.PI/2, s: Math.PI / 100}
];*/

// rosace
/*var engines = [];
for (var i = 0; i < 2 * Math.PI; i += Math.PI / 16) {
  engines.push({
    x: 300 + (150 * Math.cos(i)),
    y: 300 + (150 * Math.sin(i)),
    r: 100,
    a: i,
    s: Math.PI / 100
  });
}*/

animLoop(function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var linksCoordinates = [];

  // Engines
  ctx.strokeStyle = 'rgba(125,127,125,.8)';
  ctx.lineWidth = 0.25 * dotR;
  engines.forEach(function(engine) {
    var posX = engine.x + (engine.r * Math.cos(engine.a)),
      posY = engine.y + (engine.r * Math.sin(engine.a));

    ctx.beginPath();
    ctx.moveTo(engine.x, engine.y);
    ctx.lineTo(posX, posY);
    ctx.closePath();
    ctx.stroke();

    drawDot(engine.x, engine.y, 'rgba(125,127,125,.9)', ctx);
    drawDot(posX, posY, 'rgba(125,127,125,.9)', ctx);

    engine.a += engine.s;

    linksCoordinates.push({
      x: posX,
      y: posY
    });
  });

  // Links
  ctx.strokeStyle = 'rgba(255,105,180,.5)';
  ctx.beginPath();
  ctx.moveTo(linksCoordinates[0].x, linksCoordinates[0].y);
  linksCoordinates.forEach(function(point, index) {
    if (index !== 0) {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.stroke();

  // Links mid-points
  linksCoordinates.forEach(function(point, index, points) {
    var start = point,
      end = points[index + 1] || points[0];
    var midX = (start.x + end.x) / 2,
      midY = (start.y + end.y) / 2;
    drawMDot(midX, midY, 'rgba(36, 9, 53, 1)', ctx); //'rgba(18,10,143,.9)'
    drawDot(midX, midY, getTrailColor(), trailCtx);
  });
});
