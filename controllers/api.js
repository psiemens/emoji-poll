var Poll = require('../models/poll');

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
    return res.send(['test', 'test']);
  },

  createPoll: function(req, res) {
    return Poll.createAsync({
      title: req.body.title,
      body:  req.body.body,
      number: req.body.number,
      isActive: true
    })
      .then(function(poll) {
        res.send(poll);
      });
  }

}

function handleIncoming(params, res) {

  var number = params.to;

  Poll.getByNumber(number)
    .then(function(poll) {

      console.log(poll);

      return res.sendStatus(200);
    });

}
