var map = L.Mapzen.map('map', {
  'scene': '/emoji-map.yaml'
})


map.setView([37.7749, -122.4194], 4);


var citiesLayer;

d3.json('/api/polls/fave-fruit/map', function(geojsonFeature) {
  citiesLayer = L.geoJSON(
    geojsonFeature,
    {
      pointToLayer: function (feature, latlng) {
        var emojiIcon = L.divIcon({className: 'map-emoji', html: feature.properties.emoji});
        return L.marker(latlng, {icon: emojiIcon});
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
