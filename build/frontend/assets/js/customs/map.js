let map = L.map('mapid').setView([25.009055, 121.464866], 11);
let OvalIcon = L.Icon.extend({
  options: {
    shadowUrl: 'assets/img/icons/shadow.png',
    iconSize: [30, 30], // size of the icon
    shadowSize: [15, 15], // size of the shadow
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 15], // the same for the shadow
    popupAnchor: [30, 30] // point from which the popup should open relative to the iconAnchor
  }
});
let constructionIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Construction.png'
  }),
  cameraIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Camera.png'
  }),
  factoryIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Factory.png'
  }),
  restaurantIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Restaurant.png'
  });
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
var layerGroup = L.layerGroup().addTo(map);

const addIcons = dataList => {
   // dataList.forEach(data => {
  //   let icon = (data) => {
  //     switch (data.type) {
  //       case factory:
  //         return factoryIcon;
  //       case camera:
  //         return cameraIcon;
  //       case restaurant:
  //         return restaurantIcon;
  //       case construcion:
  //         return construcionIcon;
  //       default:
  //     }
  //   };
  //   L.marker([data.lat, data.lng], {
  //     icon: icon,
  //   }).addTo(map);
  // });

  L.marker([`${marker.getLatLng().lat + Math.random()*0.0075}`,`${marker.getLatLng().lng + Math.random()*0.0075}`], {
    icon: constructionIcon
  }).addTo(layerGroup);
  L.marker([`${marker.getLatLng().lat + Math.random()*0.0075}`,`${marker.getLatLng().lng + Math.random()*-0.0075}`], {
    icon: cameraIcon
  }).addTo(layerGroup);
  L.marker([`${marker.getLatLng().lat + Math.random()*-0.0075}`,`${marker.getLatLng().lng + Math.random()*0.0075}`], {
    icon: restaurantIcon
  }).addTo(layerGroup);
  L.marker([`${marker.getLatLng().lat + Math.random()*-0.0075}`,`${marker.getLatLng().lng + Math.random()*-0.0075}`], {
    icon: factoryIcon
  }).addTo(layerGroup);
}
const onMarkerMoveStart = _ => {
  circle.setStyle({
    color: '#fff00',
    fillOpacity: 0,
    radius: 0
  });
  // console.log("I am expired");
  layerGroup.clearLayers(); // https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet
}
const onMarkerMoveEnd = _ => {
  circle.setLatLng(marker.getLatLng());
  circle.setStyle({
    color: '#fff',
    fillOpacity: 0.3,
  });
  map.setView(marker.getLatLng(), 14);
  marker.bindPopup(`You clicked the map at ${marker.getLatLng().toString()}`).openPopup();
  setTimeout(_ => marker.closePopup(), 1000);
  // 1. 呼叫API，回傳附近（方圓？？）營建、餐飲、工廠、路肩攝影機的坐標
  let dataList = [{
    id: 'asd123',
    type: 'construcion',
    lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
    lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
  }, {
    id: 'asdqr2',
    type: 'restaurant',
    lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
    lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
  }, {
    id: 'asd341',
    type: 'camera',
    lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
    lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
  }, {
    id: 'addvf2',
    type: 'factory',
    lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
    lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
  }, ];
  addIcons(dataList);
  // 2. 在地圖上加上功能選單 - 顯示控制該區塊類別的checkbox list
  // 3. 在地圖上加上功能選單 -  跳出PM2.5污染源分析資料（帶入坐標呼叫API）
  // 4. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖,主: 列出可疑名單（根據可疑程度排名）
  // 5. 在地圖上加上功能選單 - 點選名單（帶入參數呼叫API）副: 列出工廠、公司、店家相關資訊
  // 6. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖上的移動污染源（帶入參數呼叫API）副: 呈現實時的監視器畫面（還未確定來源)
}
const onMapClick = evt => {
  layerGroup.clearLayers();
  marker.setLatLng(evt.latlng); //.update()
  marker.setOpacity(1);
  onMarkerMoveEnd();
}


const addMultiListener = (evts, el, func) => evts.forEach(evt => el.on(evt, func));
addMultiListener(["movestart, dragstart, move, drag"], marker, onMarkerMoveStart);
addMultiListener(["moveend, dragend"], marker, onMarkerMoveEnd);

map.on("click", onMapClick);