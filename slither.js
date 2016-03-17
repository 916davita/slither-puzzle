function findAllPaths(x,y, size){
    function Cell(x,y){
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.valid = true;
        this.value;
        this.testShift = 0;
    }
    function buildGrid(size){
        size = size + 2;
        var grid = [];
        for(i=0;i<size;i++){
            grid[i]= [];
            for(j=0;j<size;j++){
                grid[i][j] = new Cell(i,j);
            }
        }
        for(i=0;i<grid.length;i++){
            grid[0][i].valid = false;
            grid[i][0].valid = false;
            grid[grid.length -1][i].valid = false;
            grid[i][grid.length -1].valid = false;
        };
        return grid;
    }
    function findAdjacent(current){
        var x = current.xCoordinate;
        var y = current.yCoordinate;
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
        return adjacentCells
    }
    function clonePath(path){
        var newArray = [];
        for(i=0;i<path.length;i++){
            var x = path[i].xCoordinate;
            var y = path[i].yCoordinate;
            var clone = new Cell(x,y);
            clone.value = i;
            clone.valid = false;
            clone.testShift = path[i].testShift;
            newArray.push(clone);
        } return newArray;
    }
    function makePath(currentCell, size){
        do{ var currentCell = takeStep(currentCell);
        } while(currentPath.length !== (size*size) -1);
        if(currentPath[currentPath.length-1].xCoordinate === -1){ //for testing
            return null;
        }
        currentPath.push(currentCell);
        allPaths.push(clonePath(currentPath));
    }
    function takeStep(currentCell){
        if(currentCell !== undefined){ //for testing
            currentCell.valid = false;
            var testArray = findAdjacent(currentCell);
            for(i=currentCell.testShift;i<8;i++){
                if(testArray[i].valid){
                    currentCell.testShift = i+1;
                    currentPath.push(currentCell);
                    return testArray[i];
                }
            }
            reset(currentCell);
            return takeStep(currentPath.pop());
        } else {
            currentPath.push(new Cell(-1,-1)); //for testing
            return
        }
    }
    function reset(targetCell){
        targetCell.valid = true;
        targetCell.testShift = 0;
    }
    var grid, currentPath, allPaths;
    allPaths = [];
    currentPath = [];
    grid = buildGrid(size);
    makePath(grid[x][y], size);
    var currentCell;
    function removeCells(num){ //num is optional
        for(var l=0;l<num;l++){ //for every cell to be removed
            currentCell = currentPath[currentPath.length-(l+1)];
            reset(currentCell);
        }
        currentPath.splice(-num, num);
        currentCell = currentPath[currentPath.length-1]; //setup for next start
        currentCell.valid = true;
        currentCell = currentPath.pop();
    }
    for(n=1;n<50000;n++){  //start at 1 because one is already complete
        removeCells();
        if(makePath(currentCell, size) === null){ //for testing
            break
        }
    }
    return allPaths; 
}
function displayAllPaths(x,y,size){
    function display(path, gridSize, puzzleId){
        $(".puzzle-container").append("<div class='puzzle puzzle" + puzzleId + "'></div>");
        $(".puzzle" + puzzleId).css("width", gridSize*40); //temp

        for(y=0; y<gridSize; y++){
            $(".puzzle" + puzzleId).prepend("<div class='puzzle" + puzzleId +"_row" + y + "'></div>");
            for(x=0;x<gridSize;x++){
                $(".puzzle" + puzzleId + "_row" + y).append("<div class='cell puzzle" + puzzleId + "_column" + x + " puzzle" + puzzleId + "_cell" + x + "-" + y + "'></div>");
            }
        }
        for(i=0;i<path.length;i++){
            x = path[i].xCoordinate;
            y = path[i].yCoordinate;
            $(".puzzle" + puzzleId + "_cell" + x + "-" + y).append(path[i].value);
        }
        $(".puzzle" + puzzleId + "_column0, .puzzle" + puzzleId + "_column" + (gridSize-1) + ", .puzzle" + puzzleId + "_row0 * , .puzzle" + puzzleId + "_row" + (gridSize-1) + " *" ).css("background-color", "#7F7E8C");
    }
    var allPaths= findAllPaths(x,y,size);
    for(var h=0;h<allPaths.length;h++){
        display(allPaths[h], size +2, h)
    }
    return allPaths //MAY REMOVE LATER
}

