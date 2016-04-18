canvas = document.getElementById('click');
ctx = canvas.getContext('2d');

function rand(min, max) {
	return Math.floor(Math.random() * max) + min; 
}

mouse = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2,
	down: 0
};
window.onmousemove = getMouse;
function getMouse(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}
document.body.onmousedown = function() { 
  mouse.down++;
}
document.body.onmouseup = function() {
  mouse.down--;
}

var scale,
	beginX,
	beginY;
window.onresize = resize;
function resize() {
	if (window.innerWidth > window.innerHeight) {
		scale = window.innerHeight / 360;
	} else {
		scale = window.innerWidth / 480;
	}
	beginX = (window.innerWidth - 480 * scale) / 2;
	beginY = (window.innerHeight - 360 * scale) / 2;
	
	$('#game').width(480 * scale);
	$('#game').height(360 * scale);
	$('#game').offset({top: beginY, left: beginX});
	
	canvas.width = 480 * scale;
	canvas.height = 360 * scale;
	
	$('#ring').width(100 * scale);
	$('#ring').height(100 * scale);
	
	$('#time').css('font-size', 10 * scale);
	$('#time').css('padding-left', 4 * scale);
	$('#time').offset({top: beginY, left: beginX});
}

cursor = {
	x: 240,
	y: 180
};

size = 55;
score = -1;

function newGame() {
	ring = {
		x: rand(0, 380),
		y: rand(0, 250)
	}
	opacity = 0;
	olddown = true;
	ctx.clearRect(0, 0, canvas.width, canvas.height - 10 * scale);
	
	size -= 5;
	score++;
}

function gameloop() {
	// Stop
	if (score == 10) {
		clearInterval(loopinterval);
		
		setInterval(function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height - 10 * scale);
			ctx.beginPath();
			ctx.moveTo(0, 355 * scale);
			ctx.lineTo(480 * scale, 355 * scale);
			ctx.strokeStyle = '#4b4b4b';
			ctx.lineWidth = 10 * scale;
			ctx.lineCap = 'butt';
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(0, 355 * scale);
			ctx.lineTo((480 * scale) * (scoreShow / 10), 355 * scale);
			ctx.strokeStyle = '#b4b4b4';
			ctx.lineWidth = 10 * scale;
			ctx.lineCap = 'butt';
			ctx.stroke();
			ctx.closePath();
			scoreShow += (score - scoreShow) * 0.1;
		}, 10);
	}
	
	// Move ring
	$('#ring').offset({top: ring.y * scale + beginY, left: ring.x * scale + beginX})
	
	// Move cursor
	cursor.x += (mouse.x - beginX - cursor.x) * 0.1;
	cursor.y += (mouse.y - beginY - cursor.y) * 0.1;
	
	// Ring touching?
	$ring = $('#ring').offset();
	ringX = $ring.left + scale * 50;
	ringY = $ring.top + scale * 50;
	distance = Math.sqrt(Math.pow(ringX - mouse.x, 2) + Math.pow(ringY - mouse.y, 2));
	touching = (distance < scale * 50 && distance > scale * 37.5);
	
	// Control fading
	if (touching) {
		opacity += (1 - opacity) * 0.1;
	} else {
		opacity += (0 - opacity) * 0.1;
	}
	hex = '#' + Array(4).join(Math.round((180 - 75) * opacity + 75).toString(16));
	//console.log(distance);
	$('#ring circle').attr('stroke', hex);
	
	// Ring clicked?
	//console.log(touching, mouse.down, !olddown);
	if (touching && mouse.down && !olddown) {
		newGame();
	}
	
	// Save mouse.down
	olddown = mouse.down;
	
	// Draw line
	ctx.beginPath();
	ctx.moveTo(oldX, oldY);
	ctx.lineTo(cursor.x, cursor.y);
	ctx.strokeStyle = '#00b4ff';
	ctx.lineWidth = size * scale;
	ctx.lineCap = 'round';
	ctx.stroke();
	oldX = cursor.x;
	oldY = cursor.y;
	ctx.closePath();
	
	// Draw progress bar
	ctx.beginPath();
	ctx.moveTo(0, 355 * scale);
	ctx.lineTo(480 * scale, 355 * scale);
	ctx.strokeStyle = '#4b4b4b';
	ctx.lineWidth = 10 * scale;
	ctx.lineCap = 'butt';
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.moveTo(0, 355 * scale);
	ctx.lineTo((480 * scale) * (scoreShow / 10), 355 * scale);
	ctx.strokeStyle = '#b4b4b4';
	ctx.lineWidth = 10 * scale;
	ctx.lineCap = 'butt';
	ctx.stroke();
	ctx.closePath();
	
	// Change timer
	time += 0.01;
	$('#time').html('Time: ' + parseFloat(Math.round(time * 10) / 10).toFixed(1));
	
	// Slide progress bar
	scoreShow += (score - scoreShow) * 0.1;
}

$(function(){
	resize();
	
	time = 0;
	newGame();
	oldX = cursor.x;
	oldY = cursor.y;
	scoreShow = 0;
	loopinterval = setInterval(gameloop, 10);
});