var Poll = require('../models/poll');
var events = require('../helpers/events');

module.exports = function(socket) {
  var subscribedSlug = null;

  function emitPollData(slug) {
    Poll.getBySlug(slug)
      .then(function(poll) {
        console.log('emitting', poll.getResponseData());
        socket.emit('update', poll.getResponseData());
      });
  }

  socket.on('subscribe', function(data) {
    subscribedSlug = data.slug;
    emitPollData(subscribedSlug);
  });

  events.on('new response', function (slug) {
    if (subscribedSlug === slug) {
      emitPollData(subscribedSlug);
    }
  });
}
