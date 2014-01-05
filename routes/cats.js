//mongoose stuff. databases!
//perhaps this should be in a models subfolder??
var mongoose = require('mongoose');
var catSchema = mongoose.Schema({
    name: String,
    age: Number,
    color: String
})
var Cat = mongoose.model('Cat', catSchema);


//Maybe the math things should be in another file... #reflectingonrepodesigndecisions

//random math things 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//randomly creates a 10-letter name for the cat and returns the name string
var generateCatName = function() {
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var randomCatName = "";
    for (var i = 0; i < 11; i++) {
        randomCatName += alphabet[getRandomInt(0, 25)];
    }
    return randomCatName;
}

//randomly generates an age for the cat and returns the number
var generateCatAge = function() {
    return Math.floor(Math.random() * 100);
}

//randomly selects a color from the catColorArray and returns the string
var generateCatColor = function() {
    var catColorArray = ['red', 'orange', 'yellow', 'brown', 'gray', 'black'];
    var randomIndex = getRandomInt(0, catColorArray.length-1);
    var randomCatColor = catColorArray[randomIndex];
    return randomCatColor;
}


// GET /cats/new - creates a new cat. 
exports.newCat = function(req, res){
  //generating new cat traits
  var newCatColor = generateCatColor();
  var newCatAge =  generateCatAge();
  var newCatName = generateCatName();

  //mongoose stuff
  var newKitty = new Cat({name: newCatName, age: newCatAge, color: newCatColor}) 
  
  newKitty.save(function (err) {
    if (err) 
        console.log("Problem saving newKitty", err);
    else 
        console.log("database save! " + newCatName + " the cat");
  })

  //rendering stuff (see newCat.jade)
  res.render('newCat', {newCatColor: newCatColor, newCatAge: newCatAge, newCatName: newCatName});
}


//useful query info
//http://mongoosejs.com/docs/queries.html

// GET /cats - shows a sorted list of cats by age. displays names, colors, ages
exports.catList = function(req, res){
  //cats in the database
  var query = Cat.find();
  query.sort({age: 'asc'});
  query.exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(cats);
        //rendering stuff (see catList.jade) 
        //make sure you specify the key-value pair... grr
        res.render('catList', {cats:cats});
    }
  });
}

// GET /cats/color/:color - shows a sorted list of cats by age that have that specific color
exports.specificColorList = function(req, res){
  var desiredColor = req.params.color;

  //find those colored cats in the database
  var query = Cat.find({ color: desiredColor });
  query.sort({age: 'asc'})
  query.exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        //rendering stuff (see specificColorList.jade)
        res.render('specificColorList', {desiredColor: desiredColor, cats:cats});
    }
  });
}

