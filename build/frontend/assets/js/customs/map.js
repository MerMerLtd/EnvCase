let map = L.map('mapid').setView([25.009055, 121.464866], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '<a href="https://www.openstreetmap.org/">OSM</a>',
  maxZoom: 18,
}).addTo(map);

let marker = L.marker(map.getCenter(), {
  draggable: true,
  autoPan: true,
  opacity: 0,
}).addTo(map);

let circle = L.circle(map.getCenter(), {
  color: '#fff00',
  fillColor: '#fff',
  fillOpacity: 0, //0.3,
  radius: 1000
}).addTo(map);

const onMapClick = evt => {
  marker.setLatLng(evt.latlng); //.update()
  marker.setOpacity(1);
  circle.setLatLng(evt.latlng);
  circle.setStyle({
    color: '#fff',
    fillOpacity: 0.3,
  });
  marker.bindPopup(`You clicked the map at ${evt.latlng.toString()}`).openPopup();
  map.setView(evt.latlng, 13);
  // 1. 呼叫API，回傳附近（方圓？？）營建、餐飲、工廠、路肩攝影機的坐標

}

const onDragMarker = evt => {
  
}

map.on("click", onMapClick);




// marker.setLatLng(evt.latlng).addTo(map);
// marker.dragging.enable();
// let popup = L.popup();
// popup
//   .setLatLng(evt.latlng)
//   .setContent("You clicked the map at " + evt.latlng.toString())
//   .openOn(map);
// console.log(lat, lng);