var workcanvas = document.getElementById("workspace");
var workspace  = workcanvas.getContext("2d");

workspace.translate(150,150);

// ROBOT PARAMETERS
var x = -140;
var y = -140;
var theta = 0;

var xdot = 0;
var ydot = 0;
var thetadot = 0;

// CONTROL INPUT
var v = 0;
var omega = 0;

// ANIMATION CONSTANT
var gamma = 0.1;

function drawRobot(x,y,teta) {
    h = 10;
    j = 6;
    
    workspace.strokeStyle = "black";
    
    // Translate and Rotate
    workspace.translate(x, y);
    workspace.rotate(teta);
    
    // Draw
    workspace.beginPath();
    workspace.moveTo(h, 0);
    workspace.lineTo(- h,  - j);
    workspace.lineTo( - h,  + j);
    workspace.closePath();
    workspace.stroke();
    
    // Inverse Transformation
    workspace.rotate(-teta);
    workspace.translate(-x, -y);
}

function robot_evolution() {
   xdot = Math.cos(theta) * v;
   ydot = Math.sin(theta) * v;
   thetadot = omega;
   
   x = x + xdot*gamma;
   y = y + ydot*gamma;
   theta = theta + thetadot*gamma;   
}

function regulate() {
   k1 = 1;
   k2 = 3;
   
   v = -k1*(x*Math.cos(theta) + y*Math.sin(theta));
   omega = k2*( Math.atan2(y,x) - theta + Math.PI);
   
   robot_evolution();
   workspace.clearRect(-150,-150,300,300);
   drawRobot(x,y,theta);
   
   if (Math.abs(x) > 2 ||  Math.abs(y) > 2) {
      setTimeout(regulate,gamma*1000);
      }
}

function click(ev) {
    if (ev.offsetX) {
      x = ev.offsetX - 150;
      y = ev.offsetY - 250;
    }
    if (ev.layerX) {
      x = ev.layerX - 150;
      y = ev.layerY - 250;
    }
}

workcanvas.onclick = click;

drawRobot(x,y,theta);
setTimeout(regulate,gamma*1000);