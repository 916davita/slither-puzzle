$(document).ready(function(){
	begin(5);
});

var activeCells;
function begin(size){
	createGrid(size, size);
	deactivateEdges();
	displayGrid(size, size ,40);

	activeCells = (size - 2)* (size - 2); // setup
};

//capitalized to designate it as constructor
var Cell = function(x,y){
	this.xCoordinate = x;
	this.yCoordinate = y;
	this.type; // edge for deactivated
	this.playable = true;
	this.value;
};

var cell; //use arr over obj for indexing
function createGrid(width, height){ //the same for this purpose
	cell = [];
	for(x=0; x<width; x++){  //for every column
		cell[x] = [];

		for(y=0; y<height; y++){ //for every item in the column
			cell[x][y] = new Cell(x,y); //create a cell
		};
	};
	return cell;
};

function deactivateEdges(){
	var width = cell.length;
	var height = cell[0].length;
	var results = [];
	for(x=0; x<width; x++){
		for(y=0; y<height; y++){
			var test = cell[x][y];

			if (test.xCoordinate === 0 || test.xCoordinate === (width - 1)){
				test.playable = false;
				results.push([test.xCoordinate , test.yCoordinate]);

			} else if(test.yCoordinate === 0 || test.yCoordinate === (height - 1)){
				test.playable = false;
				results.push([test.xCoordinate , test.yCoordinate]);
			};
		};
	};
	return results;
};
function displayGrid (width, height, cellSize){
	function createElements(){
		$(".puzzle").empty();
		for(y=0; y<height; y++){
			$(".puzzle").prepend("<div class='row row" + y + "'></div>");
			for(x=0;x<width;x++){
				$(".row" + y).append("<div class='cell cell" + x + "-" + y + "'></div>");
			};
		};
	};
	function sizeGrid(){
		if (cellSize === undefined) cellSize = 30; //so cellSize is optional
		$(".row").css({
			"width": width*cellSize,
			"height": cellSize});
		$(".cell").css({
			"width": cellSize,
			"height": cellSize});
	};
	function turnGrey(){
		for(i=0;i< deactivateEdges().length;i++){  //for every deactivated result
			var x = deactivateEdges()[i][0];
			var y = deactivateEdges()[i][1];
			$(".cell"+ x + "-" + y).css("background-color", "#BAB7BD");
		};
	};
	createElements();
	sizeGrid();
	turnGrey();
};

function pathValues(){              //just for display
	for(i=0;i<path.length;i++){
		path[i].value = i + 1;
		x = path[i].xCoordinate;
		y = path[i].yCoordinate;
		$('.cell' + x + "-" + y).empty();
		$('.cell' + x + "-" + y).append(path[i].value);
	};
};

function turnPurple(x,y){
	$(".cell"+ x + "-" + y).css("background-color", "#8C60BD");  //temp for learning.
};
function undoPurple(x,y){
	$(".cell"+ x + "-" + y).css("background-color", "#C8F4D0");  //temp for learning.
};

function clearGrid(){
	deactivateEdges();
	for(i=1;i<(cell.length-1);i++){
		for(j=1;j<(cell[i].length-1);j++){

			var targetCell = cell[i][j];
			targetCell.playable = true;
			targetCell.value = undefined;

			$('.cell' + targetCell.xCoordinate + "-" + targetCell.yCoordinate).empty();
			undoPurple(j,i);
		};
	};
	return cell;
};

var allPaths;
var path;

function findAllPaths(x,y){ //arg- start cell

	allPaths = [];

	if (cell[x][y] !== undefined && cell[x][y].playable){  //if start is playable
		
		findPath(x,y);
		pathValues();  //for display

		return allPaths;

	} else return null;
};

function findPath(x,y){
	path = [];
	clearGrid();
	nextCell(x,y);

	if(path.length === activeCells) allPaths.push(path);
}

function nextCell(x, y){

	var start = cell[x][y];
	
	path.push(start);
	start.playable = false;

	turnPurple(x,y);

	var adjacentCells = [
		cell[x][y +1],    // N
		cell[x +1][y +1], // NE
		cell[x +1][y],    // E
		cell[x +1][y -1], // SE
		cell[x][y -1],    // S
		cell[x -1][y -1], // SW
		cell[x -1][y],    // W
		cell[x -1][y +1]  // NW
		];

	for(i=0;i<adjacentCells.length;i++){  //goes through every adj until one is playable

		var test = adjacentCells[i];

		if (test.playable === true){          //when one is playable, it starts again at that spot

			return nextCell(test.xCoordinate, test.yCoordinate);

		                            //if test space is not playable, it continues clockwise	
		} else {
			continue
		};
	};

	//if function gets to this point, then none of the adjacent spaces were playable
	
		//next, needs to start again one step back, all adj positions offset by one
	start = path[path.length - 2];
};
