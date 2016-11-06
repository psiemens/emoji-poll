var Poll = require('../models/poll');
var events = require('../helpers/events');

module.exports = {
  home: function(req, res) {
    return res.send({data: 'TEST'});
  },

  getIncoming: function(req, res) {
    return handleIncoming(req.query, res);
  },

  postIncoming: function(req, res) {
    return handleIncoming(req.body, res);
  },

  listPolls: function(req, res) {
    return Poll.findAsync({})
      .then(function(polls) {
        return res.send(polls);
      });
  },

  createPoll: function(req, res) {
    return Poll.updateAsync(
      {number: req.body.number},
      {'$set': {'isActive': false}}
    ).then(function() {
      return Poll.createAsync({
        title: req.body.title,
        body:  req.body.body,
        number: req.body.number,
        slug: req.body.slug,
        options: req.body.options,
        isActive: true
      })
        .then(function(poll) {
          res.send(poll);
        });
    });
  }

}

function handleIncoming(params, res) {
  var pollNumber = params.to,
      responseNumber = params.msisdn,
      responseValue = params.text;

  return Poll.getByNumber(pollNumber)
    .then(function(poll) {
      var options = poll.options;

      var letters = { a: 0, b: 1, c: 2, d: 3 };
      var labels = {};
      var emojis = {};

      options.map(function(option, i) {
        var label = option.label.toLowerCase()
        labels[label] = i;
        emojis[option.emoji] = i;
      });

      if (emojis.hasOwnProperty(responseValue)) {
        return emojis[responseValue[0]];
      }

      var lowerValue = responseValue.toLowerCase();

      if (letters.hasOwnProperty(lowerValue)) {
        return letters[lowerValue];
      }

      if (labels.hasOwnProperty(lowerValue)) {
        return labels[lowerValue];
      }

      return false;

    })
    .then(function(responseIndex) {
      if ( !(responseIndex === false) ) {
        // good response
        return Poll.addResponseToPoll(pollNumber, responseNumber, responseIndex)
          .then(function(poll) {
            events.emit('new response', poll.slug);
            return res.sendStatus(200);
          });
      } else {
        // bad response
        return res.sendStatus(200);
      }
    });

}
