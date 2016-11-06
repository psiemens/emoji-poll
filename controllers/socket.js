var events = require('../helpers/events');

module.exports = function(socket) {
  var poll = null;

  socket.on('subscribe', function (data) {
    console.log('subscribe', data);
    poll = data.slug;
  });

  events.on('new response', function (data) {
    console.log('response', data);
    if (poll === data.slug) {
      socket.emit('update', data.responses);
    }
  });
}
