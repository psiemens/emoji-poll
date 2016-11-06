var Poll = require('../models/poll');
var events = require('../helpers/events');
var fs = require('fs');

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
  },

  getMapData: function(req, res) {

    var cities = JSON.parse(fs.readFileSync('data/cities.geojson', 'utf8'));

    return Poll.getBySlug(req.params.slug)
      .then(function(poll) {
        var cityData = poll.getCityData();

        var features = [];

        cities.features.map(function(feature) {
          feature.properties.responses = cityData[feature.id];
          if (feature.properties.responses) {
            features.push(feature);
          }
        })

        cities.features = features;

        res.send(cities);

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
        return emojis[responseValue];
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
