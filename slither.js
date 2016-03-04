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
				var item = [test.xCoordinate , test.yCoordinate];
				results.push(item);

			} else if(test.yCoordinate === 0 || test.yCoordinate === (height - 1)){
				test.playable = false;
				var item = [test.xCoordinate , test.yCoordinate];
				results.push(item);
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

function turnPurple(x,y){
	$(".cell"+ x + "-" + y).css("background-color", "#8C60BD");
};
function undoPurple(x,y){
	$(".cell"+ x + "-" + y).css("background-color", "#C8F4D0");
};

function clearGrid(){
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

var path;

function makePath(x,y){
	clearGrid();
	path = [];

	nextCell(x,y);
	pathValues();
	return path;
};

function nextCell(startX, startY){
		var start = cell[startX][startY];
		path.push(start);

		start.playable = false;
		turnPurple(startX,startY);

		var adjacentCells = [
			cell[startX][startY +1],    // N
			cell[startX +1][startY +1], // NE
			cell[startX +1][startY],    // E
			cell[startX +1][startY -1], // SE
			cell[startX][startY -1],    // S
			cell[startX -1][startY -1], // SW
			cell[startX -1][startY],    // W
			cell[startX -1][startY +1]  // NW
			];
		
		for(i=0;i<adjacentCells.length;i++){
			var test = adjacentCells[i];

			if (test.playable === true){
				console.log(path);
				nextCell(test.xCoordinate, test.yCoordinate);
			};
		};
	};

function pathValues(){
	for(i=0;i<path.length;i++){
		path[i].value = i + 1;
		x = path[i].xCoordinate;
		y = path[i].yCoordinate;
		$('.cell' + x + "-" + y).empty();
		$('.cell' + x + "-" + y).append(path[i].value);
	};
};










