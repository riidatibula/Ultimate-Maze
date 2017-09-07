function Character(){
	this.x = 0;
	this.y = 0;

	this.getCell = function(){
		var cell = grid[index(this.x,this.y)];
		return cell;
	};

	this.draw = function(){
		context.strokeStyle = "rgba(255,255,255,1)";
		context.fillStyle = "rgba(255,255,255,0.5)";
		context.beginPath();
		context.arc(this.x*20+10,this.y*20+10,8,Math.PI*2,false);
		context.stroke();
		context.fill();
	};

	this.remove = function(){
		context.fillStyle = "black"; //"#154360"
		context.fillRect(this.x*20+1,this.y*20+1,18,18);
	};

	this.move = function(a,b){
		this.remove();
		this.x = a;
		this.y = b;
		this.draw();
	}
}
var character = new Character(); 
character.draw();


window.addEventListener("keydown", function(e){
	var keyCode = e.keyCode;
	var cell = character.getCell();

	if(keyCode == 38){	//arrow up
		if(!cell.walls[0]){
			character.remove();
			character.y--;
			character.draw();
		}
	}
	else if(keyCode == 39){ //arrow right
		if(!cell.walls[1]){
			character.remove();
			character.x++;
			character.draw();
		}
	}
	else if(keyCode == 40){	//arrow down
		if(!cell.walls[2]){
			character.remove();
			character.y++;
			character.draw();
		}
	}
	else if(keyCode == 37){	//arrow left
		if(!cell.walls[3]){
			character.remove();
			character.x--;
			character.draw();
		}
	}

	if(character.x == portal.x && character.y == portal.y){
		portal.remove();
		character.move(portal_2.x,portal_2.y);
		regeneratePortal();
	}
	else if(character.x == portal_2.x && character.y == portal_2.y){
		portal_2.remove();
		character.move(portal.x,portal.y);
		regeneratePortal();
	}

	if(hasPowerUp(character)){
		time = time + 5;
	}

	if(hasEnemy(character)){
		time = time - 5;
	}

	if(character.x == home.x && character.y == home.y){
		alert("GAME OVER! Your score is " + time);
		window.location = 'index.html';
	}
});