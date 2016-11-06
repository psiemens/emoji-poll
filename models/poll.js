var Poll;

var db = require('mongoose');
var Promise = require('bluebird');
var fs = require('fs');

var pollSchema = new db.Schema({
  title:      String,
  body:       String,
  number:     String,
  slug:       {type: String, unique: true},
  isActive:   Boolean,
  options:    [{
    label: String,
    emoji: String
  }],
  responses:  [{
    number: String,
    value: Number,
    timestamp: Date
  }]
});

pollSchema.statics.getByNumber = function(number) {
  return Poll.findOneAsync({
    'number': number
  });
};

pollSchema.statics.getBySlug = function(slug) {
  return Poll.findOneAsync({
    'slug': slug
  });
};

pollSchema.statics.addResponseToPoll = function(pollNumber, responseNumber, responseValue) {
  return Poll.findOneAndUpdateAsync(
    {'number': pollNumber, isActive: true},
    {'$push': {'responses': {
      number: responseNumber,
      value: responseValue,
      timestamp: Date.now()
    }}});
};

function getAreaCode(number) {
  return number.slice(1, 4);
}

function getCity(areaCodes, number) {
  var areaCode = getAreaCode(number);

  return areaCodes[areaCode].city;
}

pollSchema.methods.getResponseData = function() {
  var data = [];

  // Initialize values to 0
  this.options.map(function(option, i) {
    data[i] = 0;
  });

  // Add responses
  this.responses.map(function(response) {
    data[response.value] = data[response.value] + 1;
  });

  return data;
};

pollSchema.methods.getCityData = function() {

  var data = {};

  var areaCodes = JSON.parse(fs.readFileSync('data/area-codes.json', 'utf8'));

  var options = this.options;

  // Add responses
  this.responses.map(function(response) {
    var city = getCity(areaCodes, response.number);

    if (!data.hasOwnProperty(city)) {
      data[city] = options.map(function(option) { return 0; });
    }

    data[city][response.value] = data[city][response.value] + 1;
  });

  return data;
}

pollSchema.index({'number' : 1});

var Model = db.model('Poll', pollSchema);

module.exports = Poll = Promise.promisifyAll(Model);
