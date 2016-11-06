var map = L.Mapzen.map('map', {
  'scene': 'test.yaml'
})
map.setView([37.7749, -122.4194], 4);

L.Mapzen.hash({
  map: map
});
