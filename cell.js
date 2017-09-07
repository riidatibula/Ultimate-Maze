function Cell(x, y) {
	this.x = x;
	this.y = y;
	this.walls = [true, true, true, true];
	this.visited = false;

	this.getNeighbors = function(){
		var neighbors = [];

		var top    = grid[index(x, y-1)];
		var right  = grid[index(x+1, y)];
		var bottom = grid[index(x, y+1)];
		var left   = grid[index(x-1, y)];

		if (top && !top.visited) {
			neighbors.push(top);
		}
		if (right && !right.visited) {
			neighbors.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbors.push(bottom);
		}
		if (left && !left.visited) {
			neighbors.push(left);
		}
		if (neighbors.length > 0) {
		  	var r = randomBetween(0, neighbors.length);
		  	return neighbors[r];
		}else {
			return undefined;
		}
	}

	this.show = function() {
		var x = this.x*s;
		var y = this.y*s;

		if (this.walls[0]) {
			createLine(x    , y    , x + s, y);			//top line
		}
		if (this.walls[1]) {
			createLine(x + s, y    , x + s, y + s);		//right line
		}
		if (this.walls[2]) {
			createLine(x + s, y + s, x    , y + s);		//bottom line
		}
		if (this.walls[3]) {
			createLine(x    , y + s, x    , y);			//left line
		}
	}

	this.highlight = function() {
		var a = this.x*s;
		var b = this.y*s;
		context.fillStyle = "black";
		context.fillRect(a,b,s,s);
	}
}