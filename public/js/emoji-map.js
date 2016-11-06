var map = L.Mapzen.map('map', {
  'scene': '/emoji-map.yaml'
})


map.setView([37.7749, -122.4194], 4);


var citiesLayer;

var poll = $('.js-poll');

var slug = poll.data('slug');
var options = poll.data('options');

d3.json('/api/polls/fave-fruit/map', function(geojsonFeature) {
  citiesLayer = L.geoJSON(
    geojsonFeature,
    {
      pointToLayer: function (feature, latlng) {
        console.log(feature);
        console.log(latlng);
        var responses = feature.properties.responses;

        console.log(responses);

        if (responses) {
          console.log('rendering');
          var option = options[responses.indexOf(d3.max(responses))];
          var emojiIcon = L.divIcon({className: 'map-emoji', html: option.emoji});
          return L.marker(latlng, {icon: emojiIcon});
        }
      }
    }
  );

  updateLayers();
});

function updateLayers() {

  if (!citiesLayer) {
    return;
  }

  var zoomBreakpoint = 6;

  if (map.getZoom() > zoomBreakpoint && !map.hasLayer(citiesLayer)) {
    map.addLayer(citiesLayer);
  }

  if (map.getZoom() < zoomBreakpoint && map.hasLayer(citiesLayer)) {
    map.removeLayer(citiesLayer);
  }
}

map.on('zoomend', function () {
  updateLayers();
});

L.Mapzen.hash({
  map: map
});
