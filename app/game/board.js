require('colors')

function GameBoard(config,positions) {
    this.config = config
    this.size = config.boardSize || 10
    this.ships = []
    this.grid = []
    this.create(positions)
}

GameBoard.prototype.create = function(positions) {
    var i,j

    // build the grid
    for ( i=0; i < this.size; i++ ) {
        this.grid[i] = []
        for( j=0; j < this.size; j++ ) {
            this.grid[i][j] = { hit: false, occupied: false }  
        }
    }

    // build the ships
    for ( i=0; i<this.config.ships.length; i++ ) {
       this.ships.push({
            type: this.config.ships[i].type,
            len: this.config.ships[i].len,
            heading: '',
            locations:Object.assign({}, positions[i])
        }) 
    }

    this.placeShips()

}

GameBoard.prototype.placeShips = function() {

    var i,
        valid = false,
        ships = this.ships

    for(var i=0; i<ships.length; i++) {
        while(!valid) {
            valid = this.getValidShipPlacement(ships[i])
            if(valid) break;
        }
        valid = false
    }

}

GameBoard.prototype.getValidShipPlacement = function(ship) {
    var x,
        y,
        i,
        heading = Math.ceil(Math.random() * 2), // generate a random heading vertically.
        px={x:ship.locations[0],y:ship.locations[1]}
        max = this.size - 1,
        locations = []

    switch(heading) {
        case 1: // north
        default: 
            if(px.x > (max - ship.len)) return false // out of bounds
            while(locations.length < ship.len) {
                x = px.x + (1*locations.length)
                y = px.y -1 
                if(this.grid[x][y].occupied) return false // ylision
                locations.push( { x: x, y: y } )
            }
            break
        case 2: // south
            if(px.x < (max - ship.len)) return false
            while(locations.length < ship.len) {
                x = px.x - (1*locations.length)
                y = px.y -1
                if(this.grid[x][y].occupied) return false
                locations.push( { x: x, y: y } )
            }
            break
     
    }

    // mark locations on the grid
    for(i=0;i<locations.length;i++) {
        this.grid[locations[i].x][locations[i].y].occupied = true
    }

    return true
}

GameBoard.prototype.testTarget = function(coordinates) {
    var square
    if ( (coordinates.x < this.size) && (coordinates.y < this.size) ) {
        square = this.grid[coordinates.x][coordinates.y]

        if(square.hit) {
            return {
                hit: false,
                duplicate: true,
                message: 'Target already called, try again'
            }
        }
        square.hit = true
        if(square.occupied) {
            return {
                hit: true,
                duplicate: false,
                message: 'Hit!'
            }
        } else {
            return {
                hit: false,
                duplicate: false,
                message: 'Miss!'
            }
        }
    }
    return null

}

GameBoard.prototype.updateShips = function(coordinates) {

    var i,
        found = false,
        sunk = null

    for(i in this.ships) {
        this.ships[i].locations.find(function(el,index,self) {
            if(el === coordinates) {
                // remove this index from the array
                self.splice(index,1)
                if(!self.length) {
                    // ship is sunk
                    sunk = {
                        message: 'Ship type ' + this.type + ' has been sunk!',
                    }
                }
                found = true
            }
        }, this.ships[i])
        if(found) break
    }
    return sunk
}

GameBoard.prototype.testShips = function(coordinates) {

    var i,
        afloat = false

    for(i in this.ships) {
        if(this.ships[i].locations.length) afloat = true
        if(afloat) break
    }

    return afloat

}

module.exports = GameBoard