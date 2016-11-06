var Poll = require('../models/poll');
var events = require('../helpers/events');

module.exports = function(socket) {
  var poll = null;

  socket.on('subscribe', function (data) {
    poll = data.slug;
  });

  events.on('new response', function (slug) {
    if (poll === slug) {
      Poll.getBySlug(poll)
        .then(function(data) {
          socket.emit('update', data.responses);
        });
    }
  });
}
