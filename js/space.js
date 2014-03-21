var app = {
	canvas : null,
	context : null,
	particleColor : null,
	particles : [],
	emitters : [],
	maxParticles : 800,
	emissionRate : 5,
};

var startSpace = function(){
	var splashContainer = document.getElementById("splash");

	app.canvas = document.getElementById("myCanvas");
	app.canvas.height = splashContainer.clientHeight - 100;
	app.canvas.width = splashContainer.clientWidth;

	app.context = app.canvas.getContext("2d");

	app.particleColor = new RGB(0, 100, 150);

	var emitCenter = new Vector(app.canvas.width / 2, app.canvas.height / 2);

	var initialEmitter = new Emitter(emitCenter, Vector.fromAngle(0, 2), 360);
	app.emitters.push(initialEmitter);

	window.requestAnimationFrame(animateFrame);
};

var animateFrame = function(){

	clear();
	update();
	draw();
	queue();

};

var clear = function(){
	app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);
};

var update = function(){

	var h = app.canvas.height,
		w = app.canvas.width;

	// Reset backdrop
	app.context.fillStyle = "rgb(0,0,0)";
	app.context.fillRect(0, 0, w, h);

	addNewParticles();
	plotParticles(w, h);

};

var draw = function(){
	drawParticles();
};

var queue = function(){
	window.requestAnimationFrame(animateFrame);
};

/*
Generates new particles (based on emitters) if we don't have too many
*/
var addNewParticles = function(){
	var maxParticles = app.maxParticles,
		emissionRate = app.emissionRate;

	if (app.particles.length > maxParticles) return;

	for (var i = 0; i < app.emitters.length; i++) 
	{	
		for (var j = 0; j < emissionRate; j++) 
		{
			app.particles.push(app.emitters[i].emitParticle());
		}
	}
};

/*
Removes particles that are outside of bounds and moves those that we want to keep
*/
var plotParticles = function(boundsX, boundsY) {

	var currentParticles = [];

	for (var i = 0; i < app.particles.length; i++)
	{
		var particle = app.particles[i],
			pos = particle.position;

		if (pos.x < 0 || pos.x > boundsX ||
			pos.y < 0 || pos.y > boundsY)
			continue;

		particle.move();
		currentParticles.push(particle);
	}

	app.particles = currentParticles;

};

/*
Loops through and draws all of our current on-screen particles
*/
var drawParticles = function(){
	var particleSize = 1;

	app.particleColor.increment();
	app.context.fillStyle = app.particleColor.toString();

	for (var i = 0; i < app.particles.length; i++)
	{
		var position = app.particles[i].position;
		app.context.fillRect(position.x, position.y, particleSize, particleSize);

		// app.context.arc(position.x, position.y, particleSize, 0, 2 * Math.PI, false);
		app.context.fill();
	}
};

/**

Classes

**/

// VECTOR.js
var Vector = function(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

// Add a vector to another
Vector.prototype.add = function(vector) {
	this.x += vector.x;
	this.y += vector.y;
}

// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
	return Math.atan2(this.y,this.x);
};

// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

// Creates a new vector based on an input vector
Vector.prototype.clone = function() {
	return new Vector(this.x, this.y);
};

// RGB.js
var RGB = function(r, g, b) {
	this.r = r || 0;
	this.g = g || 0;
	this.b = b || 0;
};

RGB.prototype.toString = function(){
	return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};

RGB.prototype.increment = function(){
	this.r = this.r < 255 ? this.r + 1 : 0;
	this.g = this.g < 255 ? this.g + 1 : 150;
	this.b = this.b < 255 ? this.b + 1 : 100;
}

// PARTICLE.js
var Particle = function(point, velocity, acceleration) {
	this.position = point || new Vector(0, 0);
	this.velocity = velocity || new Vector(0, 0);
	this.acceleration = acceleration || new Vector(0, 0);
};

Particle.prototype.move = function() {
	// Add our current acceleartion to our current velocity
	this.velocity.add(this.acceleration);

	// Add our current velocity to our position
	this.position.add(this.velocity);
};

// EMITTER.js
var Emitter = function(point, velocity, spread){
	this.position = point; // Vector
	this.velocity = velocity; // Vector
	this.spread = spread || Math.PI / 32; //Possible angles = velocity +/- spread
	this.drawColor = "#999";
};

Emitter.prototype.emitParticle = function(){
	// Use an angle randomized over the spread so we have more of a "spray"
	var angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);

	// The magnitude of the emitter's velocity
	var magnitude = this.velocity.getMagnitude();

	// The emitter's position
	var position = this.position.clone();//new Vector(this.position.x, this.position.y);

	// New velocity based off of the calculated angle and magnitude
	var velocity = Vector.fromAngle(angle, magnitude);

	// return new particle!
	return new Particle(position, velocity);
}; 