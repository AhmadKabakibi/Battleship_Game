var Player = require('./player')

function Game(config) {
   this.config = config;
   this.player= null;
   var game = this;
   
   this.move = function(coordinates,callback) {
       game.player.turn(coordinates,game.player,function(status,message){
       		return callback(status,message)
       })
   }

   this.create = function(positions,callback){
   	game.player=new Player(this.config,positions);
   	return callback("Success")
   }
}

module.exports = function(config) {
    return new Game(config)
}
