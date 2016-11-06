var socket = io.connect('http://emoji-poll.herokuapp.com/');

var slug = $('.js-poll').data('slug');
socket.emit('subscribe', { slug: slug });
