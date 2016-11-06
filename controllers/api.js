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

  return Poll.addResponseToPoll(pollNumber, responseNumber, responseValue)
    .then(function(poll) {

      events.emit('new response', poll);

      return res.sendStatus(200);
    })
}
