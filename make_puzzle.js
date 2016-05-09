/*takes a pure coordinate string and converts to a puzzle
     built only for 5x5 grids

"12131415242534233241525142312111223343534454554535"
"12131415253545555453525141424344333424233231211122"
"12131415253545555453525141424344333424233231222111"
"12131415253545555453525141424344333424233231221121"
"12131415252423333221112231415251425344555445353443"
"12131415253545555453525141424344333424233221112231"
"12131415253545555453525141424344333424233222312111"
"11121314152524233221312233425141525343343544554554"
*/

var example1 = "15253545551424344454132333435312223242521121314151";


function main(slimData){
	function setup(){
		function unpack(slimData){
			var array = [];
			var x,y;
			for(i=0;i<slimData.length;i+=2){
				x = slimData.substr(i,1);
				y = slimData.substr(i+1,1);
				array.push([x,y]);
			}
			return array;
		}
		function Cell(x,y){
		    this.x = x;
		    this.y = y;
		    this.coords ="(" + x + "," + y + ")";
		    this.valid = true;
		    this.value;
		}
		function buildGrid(){
		    var grid = [];
		    for(i=0;i<7;i++){
		        grid[i]= [];
		        for(j=0;j<7;j++){
		            grid[i][j] = new Cell(i,j);
		        }
			}
			var coords = unpack(slimData);
			for(i=0;i<25;i++){
				var xCoor = coords[i][0];
				var yCoor = coords[i][1];
				var cell = grid[xCoor][yCoor];
				cell.value = i.toString();
			/*	if(cell.value.length === 1){
					cell.value = "0" + i;
				} */
			}
			function setRelationships(grid){
		    	function setOptions(cell){
		    		cell.options = [
	    				grid[cell.x][0],
	    				grid[cell.x][6],
	    				grid[0][cell.y],
	    				grid[6][cell.y]];
	    			if(cell.x === cell.y){
	    				cell.options.push(
	    					grid[0][0],
	    					grid[6][6]);
	    			}
	    			if(cell.x + cell.y === 6){
	    				cell.options.push(
	    					grid[0][6],
	    					grid[6][0]);
	    			}
		    	}
		    	function setEffects(centerCell){
			    	centerCell.options.forEach(function(edgeCell){
			    		if(edgeCell.affected === undefined){
			    			edgeCell.affected = [centerCell];
			    		}else{
			    			edgeCell.affected.push(centerCell);
			    		}
			    	})
			    }
		    	for(j=1;j<=5;j++){
		    		for(k=1;k<=5;k++){
		    			var current = grid[j][k];
		    			setOptions(current);
		    			setEffects(current);
		    			current.avail = current.options.length;
		    		}
		    	}
		    	return grid;
			}
			return setRelationships(grid);
		}
		return buildGrid();
	}
	function cellList(grid){
		var allCells = [];
		for(i=1;i<6;i++){
			for(j=1;j<6;j++){
				allCells.push(grid[i][j]);
			}
		}
		return allCells
	}
	var itsAllOver = false;
	function placeValues(grid){
		function setValue(originCell, destinationCell){
			destinationCell.value = originCell.value;
			destinationCell.valid = false;
			originCell.valid = false;
			destinationCell.affected.forEach(function(value){
				value.avail--
			});
		}
		function fillGroup1(group){
			group.forEach(function(edgeCell){
				var choices = sortByConstraint(edgeCell.affected);
				var index = Math.floor(Math.random() * choices.length);
				while(choices[index].valid === false){
					if(index === 3){
						index = 0;
					}else{index++}
				}
				setValue(choices[index], edgeCell);
			});

			/* For each edge cell to be placed, one of its associated center cells is chosen at random. 
			The function tries options until one is valid. */
		}
		function sortByConstraint(group){
			var lowestAvail = 8;
			var lowestAvailHasChanged = false;
			function mostConstrained(value){
				if(value.avail < lowestAvail){
					lowestAvail = value.avail;
					lowestAvailHasChanged = true;
					return true
				}else if(value.avail === lowestAvail){
					return true
				}else{
					return false
				}
			}
			var cellsToPlace = group.filter(mostConstrained);
			if(lowestAvailHasChanged){
				cellsToPlace = group.filter(mostConstrained);
			}
			return cellsToPlace
		}
		/* only issue: after centerGroup_a is placed, if four remaining ALL share a cell */
		function placeCenterGroup(group){
			function place(){
				var cellsToPlace = sortByConstraint(group);
				var index = Math.floor(Math.random() * cellsToPlace.length);
				var originCell = cellsToPlace[index];
				var options = originCell.options;

				var index2 = Math.floor(Math.random() * options.length);
				var destinationCell;
				var failures = 0;
				do{
					destinationCell = options[index2];
					if(destinationCell.valid){
						setValue(originCell,destinationCell);
						var dex = group.findIndex(function(element){
							return (element.value === originCell.value)
						})
						group.splice(dex, 1);
						break;
					}else{
						if(index2 === options.length - 1){
							index2 = 0;
						}else{
							index2++;
						}
						failures++
					}
				}while(failures < options.length);

				if(failures === options.length){
					console.log('unable to place ' + originCell.coords)
				//this is a temporary fix
				itsAllOver = true;
				}
			}
			var iterations = group.length;
			for(i=0;i<iterations;i++){
				place();
			}
			return;
		}
		function sort(num){
			return function(cell){
				return (cell.avail === num)
			}
		}
		itsAllOver = false;
		var list = cellList(grid);
		var centerGroup_a, diagonals, edgeGroup_1;
		centerGroup_a = list.filter(sort(4));
		diagonals = list.filter(sort(6));

		edgeGroup_1 = [
			grid[3][0],
			grid[3][6],
			grid[0][3],
			grid[6][3]];

		fillGroup1(edgeGroup_1);
		centerGroup_a = centerGroup_a.filter(function(elem){return (elem.valid)});
		placeCenterGroup(centerGroup_a);
		placeCenterGroup(diagonals);
		
		return grid;
	}
	function slimifyData(fatData){
		var data = fatData.join().replace(/\D/g,'');
		return data;
	}
	//temp fix:
	do{
		var g = placeValues(setup());}
	while(itsAllOver === true);

	var results = [];
	for(i=0;i<7;i++){
		results.push(g[i][6].value);
	}
	for(j=5;j>0;j--){
		results.push(g[0][j].value, g[6][j].value);
	}
	for(i=0;i<7;i++){
		results.push(g[i][0].value);
	}

	function finalValue(list){
		//console.log(list);
		var index = Math.floor(Math.random() * 25);
		if(index === 12){ //center cell, nothing changes
			results.push(g[3][3].value);
		}else{
			console.log(list[index]);
		}
	}
	finalValue(cellList(g));

	//final two digits in results represent value of centermost cell
	//coming back, make it possible to have a center in any location displayed

	return g;
}

function displayPuzzle(slimData, puzzleId){  //puzzleId optional
	if(puzzleId === undefined){puzzleId = 0}

	var grid = main(slimData);

	$(".puzzle-container").html("<div class='puzzle puzzle" + puzzleId + "'></div>");
    $(".puzzle").css("width", 280); //temp

    function addCells(){
    	for(y=0; y<7; y++){
            $(".puzzle" + puzzleId).prepend("<div class='puzzle" + puzzleId +"_row" + y + "'></div>");
            for(x=0;x<7;x++){
                $(".puzzle" + puzzleId + "_row" + y).append("<div class='cell cell" + x + "-" + y + " puzzle" + puzzleId + "_column" + x + " puzzle" + puzzleId + "_cell" + x + "-" + y + "'><h1></h1></div>");
            }
        }
    }
    function displayValue(cell){
    	var x = cell.x;
    	var y = cell.y;
    	$(".cell" + x + "-" + y).html(cell.value);
    }
    function styleEdges(){
    	function style(cell){
    		var x = cell.x;
    		var y = cell.y;
	    	$(".cell" + x + "-" + y).css("background-color", "#DDDDDD");    	
	    }
	    grid[0].forEach(style);
	    grid[6].forEach(style);
	    grid.forEach(
	    	function(columnX){
		    	style(columnX[0]);
		    	style(columnX[6]);
		    });
	}
	function displayAllValues(){
		for(i=0;i<7;i++){
	        for(j=0;j<7;j++){
	            displayValue(grid[i][j]);
	        }
		}
	}
	function displayAllPuzzleValues(){
		for(i=0;i<7;i++){
	        for(j=0;j<7;j++){
	            displayValue(grid[i][0]);
	            displayValue(grid[i][6]);
	            displayValue(grid[0][j]);
	            displayValue(grid[6][j]);
	        }
		}
		displayValue(grid[3][3]);
	}
	addCells();
	styleEdges();
	displayAllPuzzleValues();
}






