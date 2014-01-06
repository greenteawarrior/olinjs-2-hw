//model definitions in the /models folder
var Cat = require('../models/catModel');

//helpful resources :D
  //about random things
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  
  //useful query info
  //http://mongoosejs.com/docs/queries.html

  // tells you how to remove things from the database
  // http://mongoosejs.com/docs/api.html#model_Model.remove


//random generation helper functions for the cats
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

  //mongoose stuff for a new cat
  var newKitty = new Cat({name: newCatName, age: newCatAge, color: newCatColor}) 
  
  newKitty.save(function (err) {
    if (err) 
      console.log("Problem saving newKitty", err);
  })

  //rendering stuff (see newCat.jade)
  res.render('newCat', {newCatColor: newCatColor, newCatAge: newCatAge, newCatName: newCatName});
}


// GET /cats - shows a sorted list of cats by age. displays names, colors, ages
exports.catList = function(req, res){
  //getting ALL the cats in the database, sorted by ascending age
  Cat.find().sort({age: 'asc'}).exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        //rendering stuff (see catList.jade) 
        //make sure you specify the key-value pair... grr
        res.render('catList', {cats:cats});
    }
  });
}


// GET /cats/color/:color - shows a sorted list of cats by age that have that specific color
exports.specificColorList = function(req, res){
  var desiredColor = req.params.color;

  //find those cats of desired color in the database
  Cat.find({color: desiredColor}).sort({age: 'asc'}).exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        //rendering stuff (see specificColorList.jade)
        res.render('specificColorList', {desiredColor: desiredColor, cats:cats});
    }
  });
}


// GET /cats/delete/old - deletes the oldest cat (no longer appears on the lists)
exports.deleteOldCat = function(req, res){  
  //removing the oldest cat from the database
  Cat.find().sort({age: 'desc'}).exec(function (err, cats) {
    if (err) {
        console.log(err);
    }
    else {
        var deadCat = cats[0];
        Cat.remove({name:deadCat.name}, function (err) {
            if (err) {
                console.log(err);
            }
        });

        //rendering stuff (see deleteOldCat.jade) 
        res.render('deleteOldCat', {deadCat:deadCat});
    }
  });
}