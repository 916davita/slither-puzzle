function mongoIfy(solution_JSONs){
    // retrieve
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    MongoClient.connect("mongodb://localhost:27017/slither_puzzle", function(err, db) {
      if(err) { return console.dir(err); }
      if(!err) {
        console.log("We are connected");

        var collection = db.collection('solutions');

        collection.insert(solution_JSONs)
      }
    });
}

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
    function reset(targetCell){
        targetCell.valid = true;
        targetCell.testShift = 0;
    }
    function slimData(path){
        var pathString = '';
        for(i=0;i<path.length;i++){ //x and y each always one digit
            pathString += path[i].xCoordinate;
            pathString += path[i].yCoordinate;
        }
        return pathString;
    }
    function makePath(currentCell, size){
        do{ var currentCell = takeStep(currentCell);
        } while(currentPath.length !== (size*size) -1);

        if(currentPath[currentPath.length-1].xCoordinate === -1){ //for testing
            return null;
        }
        currentPath.push(currentCell);
        var slim = slimData(currentPath);
        solutions.push({
            "coordinates" : slim,
            "solution_id" : solution_id});

        solution_id++
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
    var grid, currentPath, solutions, solution_id;
    solution_id = 1;
    solutions = [];
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

    for(n=1;n<60000000;n++){  //start at 1 because one is already complete
        removeCells();
        if(makePath(currentCell, size) === null){ //for testing
            break
        }
    }
    return solutions; 
}
var solutions = findAllPaths(1,1,5);
mongoIfy(solutions);

