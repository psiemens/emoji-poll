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

function getState(areaCodes, number) {
  var areaCode = getAreaCode(number);

  return areaCodes[areaCode].state;
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

pollSchema.methods.getMapData = function() {

  var data = {
    cities: {},
    states: {}
  };

  var areaCodes = JSON.parse(fs.readFileSync('data/area-codes.json', 'utf8'));
  var cities = JSON.parse(fs.readFileSync('data/cities.geojson', 'utf8'));
  var states = JSON.parse(fs.readFileSync('data/states.geojson', 'utf8'));

  var options = this.options;

  // Add responses
  this.responses.map(function(response) {
    var city = getCity(areaCodes, response.number);
    var state = getState(areaCodes, response.number);

    if (!data.cities.hasOwnProperty(city)) {
      data.cities[city] = options.map(function(option) { return 0; });
    }

    data.cities[city][response.value] = data.cities[city][response.value] + 1;

    if (!data.states.hasOwnProperty(state)) {
      data.states[state] = options.map(function(option) { return 0; });
    }

    data.states[state][response.value] = data.states[state][response.value] + 1;
  });

  var cityData = data.cities,
      stateData = data.states;

  var cityFeatures = [];

  cities.features.map(function(feature) {
    feature.properties.responses = cityData[feature.id];
    if (feature.properties.responses) {
      cityFeatures.push(feature);
    }
  });

  cities.features = cityFeatures;

  var stateFeatures = [];

  states.features.map(function(feature) {
    feature.properties.responses = stateData[feature.id];
    if (feature.properties.responses) {
      stateFeatures.push(feature);
    }
  })

  states.features = stateFeatures;

  return {
    cities: cities,
    states: states
  };

};

pollSchema.index({'number' : 1});

var Model = db.model('Poll', pollSchema);

module.exports = Poll = Promise.promisifyAll(Model);
