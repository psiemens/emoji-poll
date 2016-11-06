var socket = io.connect('http://emoji-poll.herokuapp.com/');
//var socket = io.connect('http://localhost:5000/');

var map = L.Mapzen.map('map', {
  'scene': '/emoji-map.yaml'
})

map.setView([37.7749, -122.4194], 4);

var citiesLayer;
var statesLayer;

var poll = $('.js-poll');

var slug = poll.data('slug');
var options = poll.data('options');

// Socket stuff
socket.emit('subscribe', { slug: slug });
socket.on('map update', renderLayers);

// d3.json('/api/polls/fave-fruit/map', function(data) {
//   citiesLayer = renderLayer(data.cities);
//   statesLayer = renderLayer(data.states);
//   updateLayers();
// });

function renderLayers(data) {

  if (map.hasLayer(citiesLayer)) {
    map.removeLayer(citiesLayer);
  }

  if (map.hasLayer(statesLayer)) {
    map.removeLayer(statesLayer);
  }

  citiesLayer = renderLayer(data.cities);
  statesLayer = renderLayer(data.states);
  updateLayers();
}

function renderLayer(geojsonFeature) {
  return L.geoJSON(
    geojsonFeature,
    {
      pointToLayer: function (feature, latlng) {
        var responses = feature.properties.responses;

        if (responses) {
          var option = options[responses.indexOf(d3.max(responses))];
          var emojiIcon = L.divIcon({className: 'map-emoji', html: option.emoji});
          return L.marker(latlng, {icon: emojiIcon});
        }
      }
    }
  );
}

function updateLayers() {

  if (!citiesLayer || !statesLayer) {
    return;
  }

  var zoomBreakpoint = 6;

  if (map.getZoom() > zoomBreakpoint) {
    if (!map.hasLayer(citiesLayer)) {
      map.addLayer(citiesLayer);
    }

    if (map.hasLayer(statesLayer)) {
      map.removeLayer(statesLayer);
    }
  }

  if (map.getZoom() < zoomBreakpoint) {
    if (map.hasLayer(citiesLayer)) {
      map.removeLayer(citiesLayer);
    }

    if (!map.hasLayer(statesLayer)) {
      map.addLayer(statesLayer);
    }
  }
}

map.on('zoomend', function () {
  updateLayers();
});

L.Mapzen.hash({
  map: map
});
