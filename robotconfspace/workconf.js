//********  Global Variable

// Canvas
var workspace = document.getElementById("workspace");
var confspace = document.getElementById("confspace");
var workcontext = workspace.getContext("2d");
var confcontext = confspace.getContext("2d");

var size = 300;

// Robot Parameters
var l1 = 50;
var l2 = 50;
var q1 = 0;
var q2 = 0;

// Box
var boxx = 50;
var boxy = 50;
var boxsize = 80;

// Other Data
var clicked = false;
var c_x = 0;
var c_y = size;
var collide = false;

// Collision Map
var map = confcontext.createImageData(size, size);

function drawBox() {
  workcontext.fillStyle = "black";

  workcontext.fillRect(boxx,boxy, boxsize, boxsize);
}

function drawRobot() {
  x0 = size/2;
  y0 = size/2;

  x1 = x0 + l1 * Math.cos(q1); 
  y1 = y0 - l1 * Math.sin(q1); // -1 to compensate "image coordinates".

  x2 = x1 + l2 * Math.cos(q1 + q2);
  y2 = y1 - l2 * Math.sin(q1 + q2);

  workcontext.strokeStyle = "black";
  workcontext.fillStyle = "black";
  
  workcontext.beginPath();
  workcontext.arc(x0,y0,5, 0, Math.PI*2, true);
  workcontext.closePath();
  workcontext.fill();
  
  workcontext.beginPath();
  workcontext.moveTo(x0,y0); 
  workcontext.lineTo(x1,y1);
  workcontext.lineTo(x2,y2);
  workcontext.stroke();
}

function drawCircle() {
  if (collide)
    confcontext.fillStyle = "red";
  else
    confcontext.fillStyle = "blue";
  
  confcontext.beginPath();
  confcontext.arc(c_x,c_y,5, 0, Math.PI*2, true);
  confcontext.closePath();
  confcontext.fill();
}

function draw() {
  workcontext.clearRect(0,0,size,size);
  confcontext.putImageData(map,0,0);
  drawBox();
  drawRobot();
  drawCircle();
}

function onMouseDown(ev) {
  if (!clicked) {
    clicked = true;
  }
}

function onMouseUp(ev) {
  if (clicked) {
    clicked = false;
  }  
}

function onMouseMove(ev) {
  if (clicked) {
    if (ev.offsetX) {
      c_x = ev.offsetX;
      c_y = ev.offsetY;
    }
    if (ev.layerX) {
      c_x = ev.layerX;
      c_y = ev.layerY;
    }
    
    q1 = c_x * ((Math.PI*2) / size);
    q2 = (size - c_y) * ((Math.PI*2) / size);

    collide = isColliding();
  }
  draw();
}

function segmentCollide(xi,yi,xf,yf) {
  cyi = (yi>boxy && yi<(boxy + boxsize));
  cyf = (yf>boxy && yf<(boxy + boxsize));
  cxi = (xi>boxx && xi<(boxx + boxsize));
  cxf = (xf>boxx && xf<(boxx + boxsize));

  if (( cyi && cxi ) || ( cyf && cxf )) return true;
  
  if ((xi == xf) || (yi == yf)) return false;
  
  // Vertical
  t1 = (boxx - xi) / (xf - xi);
  t2 = (boxx + boxsize - xi) / (xf - xi);

  // Horizontal
  t3 = (boxy - yi) / (yf - yi);
  t4 = (boxy + boxsize - yi) / (yf - yi);

  if (t1>= 0 && t1 <= 1) {
    y = yi * (1 - t1) + t1*yf;
    if (y>boxy && y<(boxy + boxsize)) return true; 
  }

  if (t2>= 0 && t2 <= 1) {
    y = yi * (1 - t2) + t2*yf;
    if (y>boxy && y<(boxy + boxsize)) return true;
  }

  if (t3>= 0 && t3 <= 1) {
    x = xi * (1 - t3) + t3*xf;
    if (x>boxx && x<(boxx + boxsize)) return true;
  }

  if (t4>= 0 && t4 <= 1) {
    x = xi * (1 - t4) + t4*xf;
    if (x>boxx && x<(boxx + boxsize)) return true;
  }

  return false;
}

function isColliding() {
  x0 = size/2;
  y0 = size/2;

  x1 = x0 + l1 * Math.cos(q1);
  y1 = y0 - l1 * Math.sin(q1); // -1 to compensate "image coordinates".

  x2 = x1 + l2 * Math.cos(q1 + q2);
  y2 = y1 - l2 * Math.sin(q1 + q2);

  s1 = segmentCollide(x0,y0,x1,y1);

  if (s1) return true;
  
  s2 = segmentCollide(x1,y1,x2,y2);
  
  return s2;
}

function buildCollisionMap() {
  for (i=0;i<size;i+=1) {
    for (j=0;j<size;j+=1) {
          q1 = i * ((Math.PI*2) / size);
          q2 = (size - j) * ((Math.PI*2) / size);
          idx = (i + j*size)*4;
          if (isColliding()) {
            map.data[idx] = 0;
            map.data[idx+1] = 0;
            map.data[idx+2] = 0;
            map.data[idx+3] = 255;
          }
          else {
            map.data[idx] = 255;
            map.data[idx+1] = 255;
            map.data[idx+2] = 255;
            map.data[idx+3] = 255;
          }
    }
  }
}

  function updateBlock() {
    var inx = document.getElementById("x");
    var iny = document.getElementById("y");
    var insize = document.getElementById("size");

    boxx = parseInt(inx.value);
    boxy = parseInt(iny.value);
    boxsize = parseInt(insize.value);
    console.debug(boxx);console.debug(boxy);console.debug(boxsize);
    buildCollisionMap();
    draw();
  }

confspace.onmousedown = onMouseDown;
confspace.onmouseup = onMouseUp;
confspace.onmousemove = onMouseMove;

buildCollisionMap();
draw();

