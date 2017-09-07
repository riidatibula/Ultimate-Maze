var rows, cols;			//number of cols and rows 
var s = 20; 			//cell side size
var grid = [];			//all cell storage
var stack = [];
var all_enemy = [];
var timePowerUp = [];
var current;
var unvisited_ctr;
var home;
var portal;
var portal_2;
var time = 59;
var sound;

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
canvas.width = 940;							//set canvas width
canvas.height = 560;						//set canvas height
setInterval(controlEnemy, 140);
setInterval(setTimer,1000);
setInterval(createNewPortal,10000);
setInterval(updatePowerUps,15000);
setInterval(updateMaze,30000);

function setUp(){
	displayBackground();					//display background color
	cols = Math.floor(canvas.width/s);		//set number of columns
	rows = Math.floor(canvas.height/s);		//set number of rows
	unvisited_ctr = cols * rows;

	for (var y = 0; y < rows; y++) {
		for (var x = 0; x < cols; x++) {
			var cell = new Cell(x,y);
			grid.push(cell);
		}
	}
	current = grid[0];

	while(unvisited_ctr > 0){	
		current.visited = true;
		current.highlight();
		var next = current.getNeighbors();
		unvisited_ctr--;
		
		if (next) {
			next.visited = true;
			stack.push(current);
			removeWalls(current, next);
			current = next;
		}else if (stack.length > 0) {
			current = stack.pop();
			unvisited_ctr++;
		}
	}

	for (var i = 0; i < grid.length; i++) {		//draw maze
		grid[i].show();
	}

	for (var i = 0; i < 20; i++) {				//generate enemy
		all_enemy[i] = new Enemy();	
	}

	home = new Home();							//generating home
	home.draw();								//draw home
			
	do{											//generating portals
		portal = new Portal();
		portal_2 = new Portal();
	}while(portal.x == portal_2.x && portal_2.y == portal_2.y);	

	portal.draw();								//draw portals
	portal_2.draw();

	for (var i = 0; i < 30; i++) {				//generate powerups
		timePowerUp[i] = new TimePowerUp();
	}
	drawPowerUp();

	sound = new Audio("assets/background_music.mp3"); //setup sound
	sound.play();

}; setUp();


function Home(){
	this.x = 22;
	this.y = 15;

	this.draw = function(){
		context.strokeStyle = "rgba(241,196,15,1)";
		context.fillStyle = "rgba(241,196,15,0.5)"; //241, 196, 15
		context.beginPath();
		context.arc(this.x*20+10,this.y*20+10,8,Math.PI*2,false);
		context.stroke();
		context.fill();
	};

	this.update = function(){
		this.remove();
		this.x = randomBetween(1, cols);
		this.y = randomBetween(1, rows);
	};

	this.remove = function(){
		context.fillStyle = "black";
		context.fillRect(this.x*20+1,this.y*20+1,18,18);
	};

}; 


function Enemy(){
	this.x = randomBetween(1,cols);
	this.y = randomBetween(1,rows);
	this.hasWay = false;

	this.getCell = function(){
		var cell = grid[index(this.x,this.y)];
		return cell;
	};

	this.update = function(){
		this.remove();
		var rand = randomBetween(0,4);
		var cell = this.getCell();
		if(rand == 0 && !cell.walls[0]){ 					// go up
			this.y--;
		}
		else if(rand == 1 && !cell.walls[1]){ 			//go right
			this.x++;
		}
		else if(rand == 2 && !cell.walls[2]){ 			//go down
			this.y++;
		}
		else if(rand == 3 && !cell.walls[3]){ 			// go left
			this.x--;	
		}
	};

	this.draw = function(){
		context.strokeStyle = "rgba(255,0,0,1)";
		context.fillStyle = "rgba(255,0,0,0.8)"; 
		context.beginPath();
		context.arc(this.x*20+10,this.y*20+10,4,Math.PI*2,false);
		context.stroke();
		context.fill();
	};

	this.remove = function(){
		context.fillStyle = "black";
		context.fillRect(this.x*20+1,this.y*20+1,18,18);
		if(this.x == home.x && this.y == home.y){
			home.draw();
		}
	};
}


function Portal(){
	this.x=randomBetween(1,cols);
	this.y=randomBetween(1,rows);

	this.draw = function(){
		context.strokeStyle = "rgba(168,50,125,1)";
		context.fillStyle = "rgba(74,35,90,0.7)";//74, 35, 90  
		context.beginPath();
		context.moveTo(this.x*20+3, this.y*20+2 + 4);
		context.lineTo(this.x*20+3, this.y*20+2 + 16 - 4);
		context.arcTo(this.x*20+3, this.y*20+2 + 16, this.x*20+3 + 4, this.y*20+2 + 16, 4);
		context.lineTo(this.x*20+3 + 10 - 4, this.y*20+2 + 16);
		context.arcTo(this.x*20+3 + 10, this.y*20+2 + 16, this.x*20+3 + 10, this.y*20+2 + 16-4, 4);
		context.lineTo(this.x*20+3 + 10, this.y*20+2 + 4);
		context.arcTo(this.x*20+3 + 10, this.y*20+2, this.x*20+3 + 10 - 4, this.y*20+2, 4);
		context.lineTo(this.x*20+3 + 4, this.y*20+2);
		context.arcTo(this.x*20+3, this.y*20+2, this.x*20+3, this.y*20+2 + 4, 4);
		context.stroke();
		context.fill();
	};

	this.remove = function(){
		context.fillStyle = "black";
		context.fillRect(this.x*20+2,this.y*20+1,15,17.5);
		if(this.x == home.x && this.y == home.y){
			home.draw();
		}
	};
}


function TimePowerUp(){
	this.x = randomBetween(1,cols);
	this.y = randomBetween(1,rows);

	this.draw = function(){
		context.strokeStyle = "rgba(40,116,166,1)";
		context.fillStyle = "rgba(40, 116,166,0.5)"; //40, 116, 166   
		context.beginPath();
		context.arc(this.x*20+10,this.y*20+10,4,Math.PI*2,false);
		context.stroke();
		context.fill();
	};

	this.remove = function(){
		context.fillStyle = "black";
		context.fillRect(this.x*20+1,this.y*20+1,18,18);
		if(this.x == home.x && this.y == home.y){
			home.draw();
		}
	};
}


function displayBackground() {								//displays background color
	context.fillStyle = "rgba(150,150,150,1)";
	context.fillRect(0,0,canvas.width,canvas.height);
}


function index(x, y) {										//identifies the index from the grid based on the position
	if (x < 0 || y < 0 || x > cols-1 || y > rows-1) {
	return -1;
	}
	return x + y * cols;
}


function createLine(a,b,c,d){
	context.strokeStyle = "rgb(255,255,255)";
	context.beginPath();
	context.moveTo(a,b);
	context.lineTo(c,d);
	context.stroke();
}


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function removeWalls(a, b) {
	var x = a.x - b.x;
	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	}
	var y = a.y - b.y;
	if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

sound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);


function controlEnemy(){
	for (var i = 0; i < all_enemy.length; i++) {
		all_enemy[i].update();
		all_enemy[i].draw();
	}
}


function updateHome(){
	home.update();
	home.draw();
}


function drawPowerUp(){
	for (var i = 0; i < timePowerUp.length; i++) {
		timePowerUp[i].draw();
	}
}


function regeneratePortal(){
	do{
		portal = new Portal();
		portal_2 = new Portal();
	}while(portal.x == portal_2.x && portal_2.y == portal_2.y);	

	portal.draw();
	portal_2.draw();
}


function createNewPortal(){
	portal.remove();
	portal_2.remove();
	
	do{
		portal = new Portal();
		portal_2 = new Portal();
	}while(portal.x == portal_2.x && portal_2.y == portal_2.y);	

	portal.draw();
	portal_2.draw();
}


function updatePowerUps(){
	removePowerUps();
	for (var i = 0; i < 25; i++) {
		timePowerUp[i] = new TimePowerUp();
	}
	drawPowerUp();
}


function removePowerUps(){
	for (var i = 0; i < timePowerUp.length; i++) {
		timePowerUp[i].remove();
	}
}


function setTimer(){
	if(time <= 0){
		alert("GAME OVER! Your score is 0. Nice try!");
		window.location = 'index.html';
	}
	else{
		var timer =  document.getElementById('timer');
		if(time < 10){
			timer.innerHTML = "Time: 0" + time + " secs left";
		}
		else{
			timer.innerHTML = "Time: " + time + " secs left";
		}
		time--;
	}
}


function hasPowerUp(character){
	for (var i = 0; i < timePowerUp.length; i++) {
		powerUp = timePowerUp[i];
		if(character.x == powerUp.x && character.y == powerUp.y){
			return true;
		}
	}
	return false;
}


function hasEnemy(character){
	for (var i = 0; i < all_enemy.length; i++) {
		enemy = all_enemy[i];
		if(character.x== enemy.x && character.y == enemy.y){
			return true;
		}
	}
	return false;
}


function updateMaze(){
	removeAllWalls();

	while(grid.length > 0){
		grid.pop();
	}

	unvisited_ctr = cols * rows;

	for (var y = 0; y < rows; y++) {
		for (var x = 0; x < cols; x++) {
			var cell = new Cell(x,y);
			grid.push(cell);
		}
	}
	current = grid[0];

	while(unvisited_ctr > 0){	
		current.visited = true;
		current.highlight();
		var next = current.getNeighbors();
		unvisited_ctr--;
		
		if (next) {
			next.visited = true;
			stack.push(current);
			removeWalls(current, next);
			current = next;
		}else if (stack.length > 0) {
			current = stack.pop();
			unvisited_ctr++;
		}
	}

	for (var i = 0; i < grid.length; i++) {
		grid[i].show();
	}

	character.draw();
	home.draw();
	controlEnemy();
	drawPowerUp();
}


function removeAllWalls(){
	context.fillStyle = "red";
	context.fillRect(0,0,900,600);
}