var socket = io.connect('http://emoji-poll.herokuapp.com/');
//var socket = io.connect('http://localhost:5000/');

var poll = $('.js-poll');
var slug = poll.data('slug');
var options = poll.data('options');

// Socket stuff
socket.emit('subscribe', { slug: slug });

socket.on('update', renderChart);

var chart = d3.select('.poll-results-chart');
var x = d3.scaleLinear().range([0, 100]);

function renderChart(data) {

  x.domain(d3.extent(data));

  var bars = chart.selectAll('.poll-results-chart-bar')
    .data(data);

  bars.enter().append('div')
    .attr('class', 'poll-results-chart-bar')
    .style('width', function(d) { console.log('inserting'); return x(d) + '%'; })
    .append('div')
      .append('div')
        .attr('class', 'poll-results-chart-bar-value')
        .html(function(d) {return d; });

  bars.exit().remove();

  bars.style('width', function(d) { console.log('updating'); return x(d) + '%'; });

}
