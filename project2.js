// variables
var cpStart = false;
var count = 0;
var buttons = [];
var grid = [];

window.onload = function() {
    for (i = 0; i < 3; i++) {
        grid[i] = [];
    }
}

var cpStartButtonClick = function() {
    rand = getRandom();
    buttons.push(rand);
    name = 'button' + rand.toString();
    computerPlay(name);
    cpStart = true;
}

var setButton = function(n) {
    if ( buttons.length < 10 ) {
        buttons.push(n);
        name = 'button' + n.toString();
        document.getElementById(name).innerHTML = "X";
        count++;

        if (buttons.length < 9) {
            rand = getRandom();
            buttons.push(rand);
            cpName = 'button' + rand.toString();
            computerPlay(cpName);
        }
    }
    setGrid();
    checkWinner();
}

var getRandom = function() {
    min = Math.ceil(1);
    max = Math.floor(9);
    num = Math.floor(Math.random() * (max - min)) + min;
    while (checkButtons(num)) {
        num = Math.floor(Math.random() * (max - min)) + min;
    }
    return num;
}

var checkButtons = function(n) {
    for (j = 0; j < 10; j++) {
        if (buttons[j] == n)
            return true;
    }
    return false;
}

var computerPlay = function(name) {
    if ( buttons.length < 10 ) {
        document.getElementById(name).innerHTML = "O";
    }
    count++;
    setGrid();
    checkWinner();
}

var setGrid = function() {
    counter = 1;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            grid[i][j] = document.getElementById('button' + counter.toString()).innerHTML.toString();
            counter++;
        }
    }
}

var checkWinner = function() {
    if (gridIsFull()) {
        if (grid[0][0]=="X" && grid[1][1]=="X" && grid[2][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[0][0]=="X" && grid[1][1]=="X" && grid[2][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
            // right to left
        if (grid[0][2]=="O" && grid[1][1]=="O" && grid[2][0]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }
        if (grid[0][2]=="O" && grid[1][1]=="O" && grid[2][0]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check left side
        if (grid[0][0]=="X" && grid[1][0]=="X" && grid[2][0]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[0][0]=="O" && grid[1][0]=="O" && grid[2][0]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check middle vertical
        if (grid[0][1]=="X" && grid[1][1]=="X" && grid[2][1]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[0][1]=="O" && grid[1][1]=="O" && grid[2][1]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check right side
        if (grid[0][2]=="X" && grid[1][2]=="X" && grid[2][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[0][2]=="O" && grid[1][2]=="O" && grid[2][2]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check botton
        if (grid[2][0]=="X" && grid[2][1]=="X" && grid[2][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[2][0]=="O" && grid[2][1]=="O" && grid[2][2]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check middle horizontal
        if (grid[1][0]=="X" && grid[1][1]=="X" && grid[1][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[1][0]=="O" && grid[1][1]=="O" && grid[1][2]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }

        // check top
        if (grid[0][0]=="X" && grid[0][1]=="X" && grid[0][2]=="X") {
            document.getElementById('winner').innerHTML = 'Winner is X!';
            onWinner();
        }
        if (grid[0][0]=="O" && grid[0][1]=="O" && grid[0][2]=="O") {
            document.getElementById('winner').innerHTML = 'Winner is O!';
            onWinner();
        }
    }
    else {
        document.getElementById('winner').innerHTML = 'Cat!';
        onWinner();
    }
}

function gridIsFull() {
    for (i = 0; i < 3; i++){
        for (j = 0; j < 3; j++){
            if (grid[i][j] != "-")
                return true;
        }
    }
    return false;
}

function onWinner() {
    for (i = 1; i < 10; i++){
        document.getElementById('button' + i.toString()).disabled = true;
    }
}

var reset = function() {
    location.reload();
}
