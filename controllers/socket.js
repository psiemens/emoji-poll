var Poll = require('../models/poll');
var events = require('../helpers/events');

module.exports = function(socket) {
  var subscribedSlug = null;

  socket.on('subscribe', function (data) {
    subscribedSlug = data.slug;
  });

  events.on('new response', function (slug) {
    if (subscribedSlug === slug) {
      Poll.getBySlug(slug)
        .then(function(poll) {
          socket.emit('update', poll.getResponseData());
        });
    }
  });
}
