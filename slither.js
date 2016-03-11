//for testing purposes:
function getFunky(x,y,size){
    var funk = findAllPaths(x,y,size);
    display(funk[0], size+2);
    for(i=0;i<funk[0].length;i++){
        console.log("(" + funk[0][i].xCoordinate + "," + funk[0][i].yCoordinate + ") value: " + funk[0][i].value);
    }
};

function findAllPaths(x,y, size){
    function Cell(x,y){
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.valid = true;
        this.value,
        this.testShift = 0;
    };
    function buildGrid(size){
        size = size + 2 // edge cells
        var grid = [];
        for(i=0;i<size;i++){
            grid[i]= [];
            for(j=0;j<size;j++){
                grid[i][j] = new Cell(i,j);
            }
        }
        for(i=0;i<grid.length;i++){  //make edges invalid
            grid[0][i].valid = false;
            grid[i][0].valid = false;
            grid[grid.length -1][i].valid = false;
            grid[i][grid.length -1].valid = false;
        };
        return grid;
    };
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
    };
    function clonePath(path){
        var newArray = [];
        for(i=0;i<path.length;i++){
            var x = path[i].xCoordinate;
            var y = path[i].yCoordinate;
            var clone = new Cell(x,y);
            clone.value = i + 1;
            clone.valid = false;
            clone.testShift = path[i].testShift;
            newArray.push(clone);
        } return newArray;
    };
    var allPaths = [];
    var currentPath = [];
    function takeStep(currentCell){
        currentCell.valid = false;
        if(currentPath.length === (size*size)-1){
            currentPath.push(currentCell);
            allPaths.push(clonePath(currentPath));
            console.log("full length");
            return
        }else{
            var testArray = findAdjacent(currentCell);
            for(i=currentCell.testShift;i<testArray.length;i++){

                if(testArray[i].valid === true){
                    currentCell.testShift = i+1;
                    currentPath.push(currentCell); //must be after testShift is altered
                    takeStep(testArray[i]);
                    return
                }
            }
        }
        currentCell.testShift = 0;
        currentCell.valid = true;
        takeStep(currentPath.pop());
    }
    var grid = buildGrid(size);
    takeStep(grid[x][y]);
    return allPaths;
}
/* display(findAllPaths(x,y,size)[0], gridSize)*/

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
