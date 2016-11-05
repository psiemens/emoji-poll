var Poll;

var db        = require('mongoose');
var Promise   = require('bluebird');

var pollSchema = new db.Schema({
  title:      String,
  body:       String,
  number:     String,
  isActive:   Boolean,
  responses:  [{
    number: String,
    value: String,
    timestamp: Date
  }]
});

pollSchema.statics.getByNumber = function(number) {
  return Poll.findOneAsync({
    'number': number
  });
};

pollSchema.statics.addResponseToPoll = function(pollNumber, responseNumber, responseValue) {
  return Poll.updateAsync(
    {'number': pollNumber, isActive: true},
    {'$set': {
      'responses.$.number': responseNumber,
      'responses.$.value': responseValue,
      'responses.$.timestamp': Date.now()
    }});
}

pollSchema.index({'number' : 1});

var Model = db.model('Poll', pollSchema);

module.exports = Poll = Promise.promisifyAll(Model);
