var map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    //EPSG:XXXX 代表的是什麼。這是由歐洲石油探勘組織(EPSG)標準所定義的空間參考識別系統(SRID)，為了地圖製作、探勘和測地資料儲存所開發的一套標準。
    fromProjection: "EPSG:4326", //Cannot read property 'getExtent' of null
    toProjection: "EPSG:90091",
    // 初始化地圖中心地點
    center: ol.proj.fromLonLat([121.464866, 25.009055]),
    // 初始化視圖縮放等級
    zoom: 11,
    // 限制視圖最小縮放等級。預設 0
    minZoom: 1,
    // 限制視圖最大縮放等級。預設 28
    maxZoom: 26,
  })
});

map.on('click', function (evt) {
  console.info(evt.pixel);
  console.info(map.getPixelFromCoordinate(evt.coordinate));
  console.info(ol.proj.toLonLat(evt.coordinate));

  var coords = ol.proj.toLonLat(evt.coordinate);
  var lat = coords[1];
  var lon = coords[0];
  var locTxt = "Latitude: " + lat + " Longitude: " + lon;
  // coords is a div in HTML below the map to display
  document.getElementById('coords').innerHTML = locTxt;
});

const mapEl = document.querySelector("#map");
mapEl.addEventListener("click", evt =>
  getClickPosition(evt, mapEl)
);