function findAllPaths(x,y, size){
	function Cell(x,y){
		this.xCoordinate = x;
		this.yCoordinate = y;
		this.valid = true;
		this.value;
	};
	function buildGrid(size){
	size = size + 2 /*edge cells*/
	var grid = [];
		for(i=0;i<size;i++){
			grid[i]= [];
			for(j=0;j<size;j++){
				grid[i][j] = new Cell(i,j);
			}
		}
		return grid;
	};
	var grid = buildGrid(size);
	for(i=0;i<grid.length;i++){  //make edges invalid
		grid[0][i].valid = false;
		grid[i][0].valid = false;
		grid[grid.length -1][i].valid = false;
		grid[i][grid.length -1].valid = false;
	};
	var start = grid[x][y];
	var allPaths = [];
	if (start.valid){
		findPath();
		function findPath(){
			var path = [];
			function findAdjacent(x,y,shift){  //shift is optional
				var adjacentCells = [
					grid[x][y +1],    // N
					grid[x +1][y +1], // NE
					grid[x +1][y],    // E
					grid[x +1][y -1], // SE
					grid[x][y -1],    // S
					grid[x -1][y -1], // SW
					grid[x -1][y],    // W
					grid[x -1][y +1]  // NW
					];
				for(i=0; i<shift; i++){
					adjacentCells.push(adjacentCells.shift());
				};
				return adjacentCells;
			};
			nextStep(start, 0);
			function nextStep(start, shift){
				console.log("start: " + start.xCoordinate + "," + start.yCoordinate);
				console.log("with shift " + shift);

				start.valid = false;
				var testArray = findAdjacent(start.xCoordinate, start.yCoordinate, shift);
				for(i=0; i<testArray.length; i++){
					var test = testArray[i];
					if(test.valid === true){
						path.push(start);
						return nextStep(test, shift); // to 0
					}
				};
				console.log("no hits at " + start.xCoordinate, start.yCoordinate);

				if(path.length === (size*size)-1){
					path.push(start);
					return path;

				} else if(shift < testArray.length-1){  //if already shifted 7 times
					start.valid = true;

					return nextStep(path.pop(), shift+1);

				}else{
					console.log("jump back another")
					return path;
				}
			}
			console.log(path);
			for(i=0;i<path.length;i++){
				path[i].value = i + 1;
			};
			allPaths.push(path);
		}
		return allPaths;
	} else {return null}
};

/* allPaths will currently only contain one path. 
display(findAllPaths(x,y,size)[0], gridSize)
Eventually: for every item in allPaths, display(path) */

function display(path,gridSize){
	$(".puzzle").empty();
	$(".puzzle").css("width", gridSize*40); //temp

	for(y=0; y<gridSize; y++){
		$(".puzzle").prepend("<div class='row row" + y + "'></div>");
		for(x=0;x<gridSize;x++){
			$(".row" + y).append("<div class='cell column" + x + " cell" + x + "-" + y + "'></div>");
		};
	};
	for(i=0;i<path.length;i++){
		x = path[i].xCoordinate;
		y = path[i].yCoordinate;
		$('.cell' + x + "-" + y).empty();
		$('.cell' + x + "-" + y).append(path[i].value);
	}
	$(".column0, .column" + (gridSize-1) + ", .row0 * , .row" + (gridSize-1) + " *" ).css("background-color", "#7F7E8C");
}
