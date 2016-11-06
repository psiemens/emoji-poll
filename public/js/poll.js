var socket = io.connect('http://emoji-poll.herokuapp.com/');
//var socket = io.connect('http://localhost:5000/');

var poll = $('.js-poll');
var slug = poll.data('slug');
var options = poll.data('options');

// Socket stuff
socket.emit('subscribe', { slug: slug });

socket.on('update', renderChart);

var chart = d3.select('.poll-results-bars');
var x = d3.scaleLinear().range([10, 100]);

function renderChart(data) {

  // Set end of domain to be the max value in data
  x.domain([0, d3.max(data)]);

  // Determine total number of responses
  var totalResponses = d3.sum(data);

  // Select bars
  var bars = chart.selectAll('.poll-results-bar')
    .data(data);

  // Enter
  bars.enter().append('div')
    .attr('class', 'poll-results-bar')
    .style('width', function(d) { return x(d) + '%'; })
    .append('div')
      .append('div')
        .attr('class', 'poll-results-bar-value')
        .html(function(d) { return d; });

  // Update
  bars
    .style('width', function(d) { return x(d) + '%'; })
    .select('.poll-results-bar-value')
      .html(function(d) {return d; });

  // Update results count
  d3.select('.poll-results-count')
    .html(totalResponses + ' responses');

  // Show results
  if (totalResponses) {
    d3.select('.poll-results')
      .style('display', 'block');
  }

}
