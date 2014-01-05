//mongoose stuff. databases!
//perhaps this should be in a models subfolder??
var mongoose = require('mongoose');
var catSchema = mongoose.Schema({
    name: String,
    age: Number,
    color: String
})
var Cat = mongoose.model('Cat', catSchema);


//random math things 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//random cat generator things

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

  //user sees this on the webpage
  res.send("this new cat is " + newCatColor + " and " + newCatAge + " years old and its name is " + newCatName);
}


//useful query info
//http://mongoosejs.com/docs/queries.html

// GET /cats - shows a sorted list of cats by age. displays names, colors, ages
exports.catList = function(req, res){
  res.send('meow cat list');
  
  //cats in the database
  var query = Cat.find();
  query.sort({age: 'asc'})
  query.exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        for (var c in cats) {
            console.log(cats[c].age);
        }
    }
  });

  //soon to be render stuff here

}


// GET /cats/color/:color - shows a sorted list of cats by age that have that specific color
exports.specificColorList = function(req, res){
  var desiredColor = req.params.color;
  console.log(req.params.color)

  //find those colored cats in the database
  var query = Cat.find({ color: desiredColor });
  query.sort({age: 'asc'})
  query.exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        for (var c in cats) {
            console.log(cats[c].age);
        }
    }
  });

  //soon to be render stuff
  res.send('hello cats of this color');
}


// GET /cats/delete/old - deletes the oldest cat (no longer appears on the lists)
exports.deleteOldCat = function(req, res){
  var query = Cat.find();
  query.sort({age: 'desc'})
  query.exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(cats[0]);
    }
  });


  //soon to be render stuff
  res.send('farewell old cat');
}