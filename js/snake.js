var game_canvas = document.getElementById('snake');
var canvas_w = game_canvas.width;
var canvas_h = game_canvas.height;
var context = game_canvas.getContext('2d');

var NUM_COLS = 20;
var NUM_ROWS = 20;
var SEAFOAM = '#05EAFA';
var SNAKE_COLOR = '#f3ea5f';
var FOOD_COLOR = '#32FA05';
var board = [];
var frame = 0;
var food = false;
var timer = 0;
var currentScore = 0;
var highScore = 0;

function padNumber(num, size) {
    string = num + '';
    while (string.length < size) {
        string = '0' + string;
    }
    return string
}

var Tile = function(x, y) {
    this.x = x;
    this.y = y;
    this.type = 'free';
};

var game = {
    update: function e() {
        // updates game by one frame
        console.log('frame ',frame);
        snake.move();
        game.updateScore();
        game.spawnFood();
        game.draw();
        frame++;
    },
    initBoard: function e() {
        board = [];
        console.log('game started');
        for (var i = 0; i < NUM_COLS; i++) {
            board[i] = new Array();
            for (var j=0;j < NUM_ROWS; j++) {
                board[i].push(new Tile(i, j))
            }
        }
        game.draw();
    },
    draw: function e() {
        context.beginPath();
        context.fillStyle = SEAFOAM;
        var length = 15;
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j <board.length; j++) {
                var tile = board[i][j];
                if (tile.type == 'free') {
                    context.fillStyle = 'black';
                } else if (tile.type == 'snake') {
                    context.fillStyle = SEAFOAM;
                } else if (tile.type == 'food') {
                    context.fillStyle = FOOD_COLOR;
                } else if (tile.type == 'game-over') {
                    context.fillStyle = 'red';
                }
                context.fillRect(tile.x*length, tile.y*length, length-5, length-5);
            }
        }
    },
    spawnFood: function e() {
        while (!food) {
            var x = Math.floor(Math.random()*NUM_COLS);
            var y = Math.floor(Math.random()*NUM_ROWS);
            if (board[x][y].type == 'free' && board[x][y] != snake.nextTile()) {
                foodTile = board[x][y]
                foodTile.type = 'food';
                console.log('food spawn at ', x, y, foodTile.type);
                food = true;
            }
        }
        console.log(foodTile.type, food);
    },
    end: function e() {
        console.log('game over');
        for (var i = 0; i < NUM_COLS; i++) {
            for (var j=0;j < NUM_ROWS; j++) {
                board[i][j].type = 'game-over';
            }
        }
        clearInterval(timer);
        food = false;
        game.draw();
    },
    updateScore: function e() {
        score = (snake.history.length-1)*100;
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerHTML = padNumber(highScore, 5);
        }
        document.getElementById('score').innerHTML = padNumber(score, 5);
    }
}
    




var snake = {
    length: 0,
    direction: 'left',
    lastDirection: 'left',
    history:[],
    move: function e() {
        console.log('move snake', snake.history);
        if (snake.history.length > 0) {
            // get post for next tile
            var nextTile = snake.nextTile();

            // next tile not legal -> end game
            if (!nextTile) {
                game.end();
            }
            var x = nextTile.x;
            var y = nextTile.y

            // add segment at first index
            snake.history.unshift(nextTile);

            // no food -> removes last segment
            if (nextTile.type != 'food') {
                snake.history.pop().type = 'free';
            }
            // food -> set food false keep last segment
            else {
                snake.eat();
            }
            nextTile.type = 'snake';
        }
    },
    eat: function e() {
      food = false;
    },
    init: function e() {
        // reset snake history, choose random tile as new init position
        snake.history = [];
        snake.history.push(board[Math.floor(Math.random()*(NUM_COLS/3)+(NUM_COLS/3))][Math.floor(Math.random()*(NUM_ROWS/3) +(NUM_ROWS/3))]);
    },
    nextTile: function e() {
            // get x, y of snake head
            var tile = snake.history[0];
            var x = tile.x;
            var y = tile.y;

            // direction -> next tile, keep last direction
            if (snake.direction == 'down') {
                y+=1;
                snake.lastDirection = 'down';
            } else if (snake.direction == 'up') {
                y-=1;
                snake.lastDirection = 'up';
            } else if (snake.direction == 'left') {
                x-=1;
                snake.lastDirection = 'left';
            } else if (snake.direction == 'right') {
                x+=1;
                snake.lastDirection = 'right';
            }
            if (x < 0 || x > NUM_COLS - 1|| y < 0 || y > NUM_ROWS - 1) {
                return false;
            } else if (board[x][y].type == 'snake') {
                return false;
            }
            return board[x][y];
        }

    ,
};


function run() {
    clearInterval(timer);
    food = false;
    game.initBoard();
    snake.init();
    timer = setInterval(function e() {
        game.update()},200);
}

game.initBoard();

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    if (e.keyCode == 32) {
        run();
    }
    if (e.keyCode == 37) {
        if (snake.lastDirection != 'right') {
            snake.direction = 'left';
        }
    } else if (e.keyCode == 38) {
        if (snake.lastDirection != 'down') {
            snake.direction = 'up';
        }
    } else if (e.keyCode == 39) {
        if (snake.lastDirection != 'left') {
            snake.direction = 'right';
        }
    } else if (e.keyCode == 40) {
        if (snake.lastDirection != 'up') {
            snake.direction = 'down';
        }
    }

}, false);
