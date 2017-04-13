var GameBoard = require('./board')

function Player(config,positions) {
    this.config = config
    this.board = new GameBoard(this.config,positions)
    this.printBoards(this)
}

Player.prototype.turn = function(coordinates,activePlayer,callback) {

    var player = this,
        result,
        sunk
   
    this.printBoards(activePlayer)
   

    result = activePlayer.board.testTarget(coordinates)

            if(result) {
                console.log(result.message)
                if(result.duplicate) {
                    player.turn(activePlayer)
                    return
                }
                if(result.hit) {
                    // update activePlayer ships
                    sunk = activePlayer.board.updateShips(coordinates)
                    if(sunk) {
                        callback(true,sunk.message)
                    }
                    // checks to see if there are any remaining ships
                    if(!activePlayer.board.testShips(coordinates)) {
                        // all sunk, end the game
                        callback(false,result.message)
                    } else {
                        // player gets another turn
                        callback(true,result.message)
                    }
                } else {
                    callback(true,result.message)
                }
                return
            }
}

Player.prototype.printBoards = function(self) {

    var i,
        j,
        row = '',
        col = '',
        border = '  ------------------------------'

   console.log('')
   console.log('   0  1  2  3  4  5  6  7  8  9' + '    ' + '   0  1  2  3  4  5  6  7  8  9')
   console.log(border + '    ' + border)

    for(i=0; i < this.board.grid.length; i++) {
        row += i + ' '
        for(j=0; j < this.board.grid.length; j++) {

            if(self.board.grid[i][j].hit) {
                if(self.board.grid[i][j].occupied) {
                    col = 'x'.red
                } else {
                    col = 'x'
                }
            } else {
                col = ' '
            }
            row += '['+col+']'
        }
        row += '    ' + i + ' '
        for(j=0; j < this.board.grid.length; j++) {
            if(this.board.grid[i][j].hit) {
                if(this.board.grid[i][j].occupied) {
                    col = 'x'.red
                } else {
                    col = 'x'
                }
            } else {
                if(this.board.grid[i][j].occupied) {
                    col = '#'.green
                } else {
                    col = ' '
                }
            }
            row += '['+col+']'
        }
        console.log(row)
        row = ''
    }

    console.log(border + '    ' + border)
  
  

}

module.exports = Player