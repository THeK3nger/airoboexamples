var workspace = document.getElementById("workspace");
var workcontext = workspace.getContext("2d");

// Path Data
var xi = 50;
var yi = 50;

var xf = 250;
var yf = 250;

var thetai = 0;
var thetaf = 0;

var k = 400;

// Coefficient
var cx1 = 0;
var cx2 = 0;
var cx3 = 0;

var cy1 = 0;
var cy2 = 0;
var cy3 = 0;

function drawRobot(x,y,teta) {
    h = 10;
    j = 6;
    
    workcontext.strokeStyle = "black";
    
    // Translate and Rotate
    workcontext.translate(x, y);
    workcontext.rotate(teta);
    
    // Draw
    workcontext.beginPath();
    workcontext.moveTo(h, 0);
    workcontext.lineTo(- h,  - j);
    workcontext.lineTo( - h,  + j);
    workcontext.closePath();
    workcontext.stroke();
    
    // Inverse Transformation
    workcontext.rotate(-teta);
    workcontext.translate(-x, -y);
}

function updateCoefficient() {
    cx1 = (Math.cos(thetai) + Math.cos(thetaf)) * k + 2*xi - 2*xf;
    cx2 = (-2 * Math.cos(thetai) - Math.cos(thetaf)) * k - 3*xi + 3*xf;
    cx3 = Math.cos(thetai) * k;
    
    cy1 = (Math.sin(thetai) + Math.sin(thetaf)) * k + 2*yi - 2*yf;
    cy2 = (-2 * Math.sin(thetai) - Math.sin(thetaf)) * k - 3*yi + 3*yf;
    cy3 = Math.sin(thetai) * k;
}

function pathPoint(s) {
    var output = new Array(2);
    
    output[0] = Math.pow(s, 3) * cx1 + Math.pow(s, 2) * cx2 + s * cx3 + xi;
    output[1] = Math.pow(s, 3) * cy1 + Math.pow(s, 2) * cy2 + s * cy3 + yi;
    
    return output;
}

function drawPath() {
    workcontext.strokeStyle = "black";
    
    workcontext.beginPath();
    workcontext.moveTo(xi, yi);
    for (s=0;s<=1;s += 0.01) {
        out = pathPoint(s);
        workcontext.lineTo(out[0], out[1]);
    }
    workcontext.stroke();
}

function updatePath() {
	workcontext.clearRect(0,0,300,300);
	
	var xin = document.getElementById("xin");
	var xfin = document.getElementById("xfin");
	var thetain = document.getElementById("thetain");
	var yin = document.getElementById("yin");
	var yfin = document.getElementById("yfin");
	var thetafin = document.getElementById("thetafin");
	var ko = document.getElementById("k");
	
	xi = parseInt(xin.value);
	yi = parseInt(yin.value);
	xf = parseInt(xfin.value);
	yf = parseInt(yfin.value);
	thetai = parseInt(thetain.value);
	thetaf = parseInt(thetafin.value);
	k = parseInt(ko.value);
	
	updateCoefficient();
	drawRobot(xi,yi,thetai);
	drawPath();
	drawRobot(xf,yf,thetaf);
}

updateCoefficient();
drawRobot(xi,xi,thetai);
drawPath();
drawRobot(xf,yf,thetaf);
