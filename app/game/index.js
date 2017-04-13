var config = require('./config');
var game = require('./core')(config);

module.exports = {

  create: function(req, res) {  
    var positions = req.body.positions
     
    // Fill in body to initialize the game and return a response that indicates success.
    game.create(positions,function(results){
      console.log(results)
      res.json({ message: results })
    })
  },

  update: function(req, res) {
   
   // Fill in body to take x and y coordinates and return result as "miss", "hit" or "sunk"

    game.move({"x":req.body.x, "y":req.body.y},function(result,message){
      res.json({ message: message })
    })
  }
}
