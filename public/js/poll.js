var socket = io.connect('http://localhost:5000/');

var slug = $('.js-poll').data('slug');
socket.emit('subscribe', { slug: slug });
