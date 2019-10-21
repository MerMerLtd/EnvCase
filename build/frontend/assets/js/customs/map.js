// polyfill for Element.closest from MDN
if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
    Element.prototype.closest = function (s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement;
        } while (el !== null);
        return null;
    };

// XHR
const to = promise => {
  return promise.then(data => {
      return [null, data];
    })
    .catch(err => [err, null]);
}

const maxConnection = Infinity;
const maxRetry = 3;
let connection = 0;
let queue = [];


const closeConnection = () => {
  connection--;

  if (queue.length > 0 && connection < maxConnection) {
    let next = queue.pop();
    if (typeof next === "function") {
      next();
    }
  }

  return true;
}

const makeRequest = opts => {
  // 工作排程 && 重傳
  if (connection >= maxConnection) {
    queue.push(opts); // ??
  } else {
    connection++;
    const xhr = new XMLHttpRequest();
    // xhr.responseType = "arraybuffer";
    if (opts.responseType === "arraybuffer") {
      xhr.responseType = "arraybuffer";
    }
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        // only run if the request is complete
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          // If successful
          closeConnection();
          opts.responseType === "arraybuffer" ?
            resolve(new Uint8Array(xhr.response)) :
            resolve(JSON.parse(xhr.responseText));
        } else {
          // If false  
          closeConnection();
          reject(xhr.response);
        }
      }
      // Setup HTTP request
      xhr.open(opts.method || "GET", opts.url, true);
      if (opts.headers) {
        Object.keys(opts.headers).forEach(key => xhr.setRequestHeader(key, opts.headers[key]));
      }
      // Send the request
      if (opts.contentType === 'application/json') {
        xhr.setRequestHeader('content-type', 'application/json');
        // xhr.send(JSON.stringify(opts.payload)); //++
      } else {
        // xhr.send(opts.payload); //++
      }
    });
  }
}

// class
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

// var
let dataList, map = L.map('mapid').setView([25.009055, 121.464866], 11),
  marker = L.marker(map.getCenter(), {
    draggable: true,
    autoPan: true,
    opacity: 0,
  }).addTo(map),
  circle = L.circle(map.getCenter(), {
    color: '#fff00',
    fillColor: '#fff',
    fillOpacity: 0, //0.3,
    radius: 1000
  }).addTo(map),
  layerGroup = L.layerGroup().addTo(map),
  constructionIcon = new OvalIcon({
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
  }),
  selectedConstructionIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Construction_selected.png'
  }),
  selectedCameraIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Camera_selected.png'
  }),
  selectedFactoryIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Factory_selected.png'
  }),
  selectedRestaurantIcon = new OvalIcon({
    iconUrl: 'assets/img/icons/Restaurant_selected.png'
  }),
  elements = {
    constructionEl: document.querySelector("#construction"),
    factoryEl: document.querySelector("#factory"),
    restaurantEl: document.querySelector("#restaurant"),
    cameraEl: document.querySelector("#camera"),
    iconMenu: document.querySelector(".icon-menu"),
    pieChart: document.querySelector(".pie-chart"),
    nameList: document.querySelector(".name-list"),
    ctx: document.getElementById('myChart').getContext('2d')
  };

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '<a href="https://www.openstreetmap.org/">OSM</a>',
  maxZoom: 18,
}).addTo(map);
const switchIcon = (evt) => {
  let iconUrl = evt.sourceTarget.options.icon.options.iconUrl;
  iconUrl = iconUrl.replace("assets/img/icons/", "");
  iconUrl = iconUrl.replace(".png", "");
  console.log(iconUrl);
  switch (iconUrl) {
    case "Factory":
      evt.target.setIcon(selectedFactoryIcon);
      break;
    case "Construction":
      evt.target.setIcon(selectedConstructionIcon);
      break;
    case "Restaurant":
      evt.target.setIcon(selectedRestaurantIcon);
      break;
    case "Camera":
      evt.target.setIcon(selectedCameraIcon);
      break;
    case "Factory_selected":
      evt.target.setIcon(factoryIcon);
      break;
    case "Construction_selected":
      evt.target.setIcon(constructionIcon);
      break;
    case "Restaurant_selected":
      evt.target.setIcon(restaurantIcon);
      break;
    case "Camera_selected":
      evt.target.setIcon(cameraIcon);
      break;
    default:
  }
  return iconUrl;
}

let lastClickIcon;
const getShopDetails = async selectedShopId => {
  Array.from(elements.nameList.children).forEach(el => el.style.color = "#fff");
  console.log(selectedShopId);
  document.querySelector(`[data-id=${selectedShopId}]`).style.color = "yellow";
  // xhr request
  let err, data;
  const opts = {
    contentType: 'application/json',
    method: "GET",
    url: "/shopdetails",
    payload: {
      "selectedShopId": selectedShopId,
    }
  };
  [err, data] = await to(makeRequest(opts));
  if (err) throw new Error(err);
  if (!data) { //++ will need to remove ! later
    // call websokect;
    // render data to the second view.
  };
}

const renderNameListItem = data => {
  const markup = `<li class="name-list__item" data-id = ${data.id} >
  ${data.details.name}
</li>`
  elements.nameList.insertAdjacentHTML("beforeend", markup)
}

const getNameList = async (markerCoordinate, type, selectedIconCoordinate) => {
  console.log(markerCoordinate, type, selectedIconCoordinate);
  // xhr request
  let err, data;
  const opts = {
    contentType: 'application/json',
    method: "GET",
    url: "/namelist",
    payload: {
      "markerCoordinate": markerCoordinate,
      "type": type,
    }
  };
  // [err, data] = await to(makeRequest(opts)); // ++ remove comment //
  if (err) throw new Error(err);
  if (!data) { //++ remove !
    // ++renderNameList
    //case1:¸ return all kinds of company
    data = [{
        id: "sdjk123",
        details: {
          type: "Construction",
          name: "大漢預拌廠股份有限公司",
          latlng: {
            lat: 25.065569,
            lng: 121.656042
          }
        }
      },
      {
        id: "sedk123",
        details: {
          type: "Construction",
          name: "漢鼎股份有限公司",
          latlng: {
            lat: 25.0659,
            lng: 121.6542
          }
        }
      },
      {
        id: "sdjksad",
        details: {
          type: "Factory",
          name: "宏穎真空鍍金股份有限公司",
          latlng: {
            lat: 25.060057,
            lng: 121.439981
          }
        }
      },
      {
        id: "sdjkfrc",
        details: {
          type: "Restaurant",
          name: "珍好味小吃店",
          latlng: {
            lat: 25.065569,
            lng: 121.656042
          }
        }
      },
      {
        id: "sdjkfdc",
        details: {
          type: "Camera",
          name: "橋中二街街口",
          latlng: {
            lat: 24.981897448103847,
            lng: 121.40645541699797
          }
        }
      }
    ];
    // case2: return one type of company
    //   data = [{
    //     id: "sdjk123",
    //     details: {
    //       type: "factory",
    //       name: "大漢預拌廠股份有限公司",
    //       latlng: {
    //         lat: 25.065569,
    //         lng: 121.656042
    //       }
    //     }
    //   },
    //   {
    //     id: "sdjksad",
    //     details: {
    //       type: "factory",
    //       name: "宏穎預拌廠股份有限公司",
    //       latlng: {
    //         lat: 25.060057,
    //         lng: 121.439981
    //       }
    //     }
    //   },
    //   {
    //     id: "sdjkfrc",
    //     details: {
    //       type: "factory",
    //       name: "珍漢預拌廠股份有限公司",
    //       latlng: {
    //         lat: 25.065569,
    //         lng: 121.656042
    //       }
    //     }
    //   },
    //   {
    //     id: "sdjkfdc",
    //     details: {
    //       type: "factory",
    //       name: "興欣PBC股份有限公司",
    //       latlng: {
    //         lat: 24.981897448103847,
    //         lng: 121.40645541699797
    //       }
    //     }
    //   }
    // ];
    elements.nameList.style.display = 'block';
    elements.nameList.innerHTML = '';
    data.forEach(data => {
      // console.log(data.details.type);
      // console.log(type);
      if (data.details.type === type)
        renderNameListItem(data)
    });
  };
  if (selectedIconCoordinate)
    // make another request to get the shop detail and render to the second view.
    // ?? why let is not working but var is?
    var selectedShopId = data.filter(data => data.details.type === type).find(data => data.details.latlng !== selectedIconCoordinate).id; // !== will be changed to === ++
  console.log(selectedShopId);
  getShopDetails(selectedShopId);
  // select main view nameList Pannel item
}
const selectNameListItem = evt => {
  // console.log(evt);
  if(evt.target.matches("li, .name-list__item")){
    console.log(evt.target.dataset.id);
    getShopDetails(evt.target.dataset.id);
  }
}

elements.nameList.addEventListener("click", selectNameListItem, false);

const selectedIcon = (evt) => {
  if (lastClickIcon) {
    switchIcon(lastClickIcon);
  }
  let type = switchIcon(evt);
  lastClickIcon = evt;
  console.log(evt);
  //++ ask backend to get the nameList by passing latlng & type
  getNameList(marker.getLatLng(), type, evt.latlng);

}


const controlPannel = () => {
  layerGroup.clearLayers(); // https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet;
  let icon;
  if (dataList)
    dataList.list.forEach(data => {
      icon = ((data) => {
        switch (data.type) {
          case "factory":
            return elements.factoryEl.checked ? factoryIcon : null;
          case "camera":
            return elements.cameraEl.checked ? cameraIcon : null;
          case "restaurant":
            return elements.restaurantEl.checked ? restaurantIcon : null;
          case "construcion":
            return elements.constructionEl.checked ? constructionIcon : null;
          default:
        }
      })(data);
      // console.log(icon);
      if (icon) {

        L.marker([data.lat, data.lng], {
          icon: icon,
        }).addTo(layerGroup).on("click", selectedIcon); //evt => selectedIcon(evt)
        // ++ control heatmap
        // (if icon !== null => that type of pollute is selected )
      }
    });

  // 1. clear all icon-markers
  // 2. check icon-menu checkList
  // 3. if checked draw icon-marker
  // console.log("construction: " + elements.constructionEl.checked);
  // console.log("factory: " + elements.factoryEl.checked);
  // console.log("restaurant: " + elements.restaurantEl.checked);
  // console.log("camera: " + elements.cameraEl.checked);

  // L.marker([`${marker.getLatLng().lat + Math.random()*0.0075}`, `${marker.getLatLng().lng + Math.random()*0.0075}`], {
  //   icon: constructionIcon
  // }).addTo(layerGroup);
  // L.marker([`${marker.getLatLng().lat + Math.random()*0.0075}`, `${marker.getLatLng().lng + Math.random()*-0.0075}`], {
  //   icon: cameraIcon
  // }).addTo(layerGroup);
  // L.marker([`${marker.getLatLng().lat + Math.random()*-0.0075}`, `${marker.getLatLng().lng + Math.random()*0.0075}`], {
  //   icon: restaurantIcon
  // }).addTo(layerGroup);
  // L.marker([`${marker.getLatLng().lat + Math.random()*-0.0075}`, `${marker.getLatLng().lng + Math.random()*-0.0075}`], {
  //   icon: factoryIcon
  // }).addTo(layerGroup);
}
const onMarkerMoveStart = _ => {
  circle.setStyle({
    color: '#fff00',
    fillOpacity: 0,
    radius: 0
  });
  layerGroup.clearLayers(); // https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet
  // console.log("I am expired");
}
const onMarkerMoveEnd = _ => {
  let num = 100;
  circle.setLatLng(marker.getLatLng());
  circle.setStyle({
    color: '#fff',
    fillOpacity: 0.3,
  });
  map.setView(marker.getLatLng(), 14);
  marker.bindPopup(`You clicked the map at ${marker.getLatLng().toString()}`).openPopup();
  setTimeout(_ => marker.closePopup(), 1000);
  // 1. 呼叫API，回傳附近（方圓？？）營建、餐飲、工廠、路肩攝影機的坐標
  dataList = {
    analysis: [{
        type: "工廠",
        percentage: num -= Math.round(Math.random() * 30),
      },
      {
        type: "餐飲",
        percentage: num -= Math.round(Math.random() * 25),
      },
      {
        type: "營建",
        percentage: num -= Math.round(Math.random() * 45),
      },
      {
        type: "移動污染源",
        percentage: num,
      },
    ],
    list: [{
      id: 'asd123',
      type: 'construcion',
      lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
      lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
    }, {
      id: 'asdqr2',
      type: 'restaurant',
      lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
      lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
    }, {
      id: 'asd341',
      type: 'camera',
      lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
      lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
    }, {
      id: 'addvf2',
      type: 'factory',
      lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
      lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
    }, ],
  };
  controlPannel(dataList);
  // 2. 在地圖上加上功能選單 - 顯示控制該區塊類別的checkbox list

  // 3. 在地圖上加上功能選單 -  跳出PM2.5污染源分析資料（帶入坐標呼叫API）
  // 4. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖,主: 列出可疑名單（根據可疑程度排名）
  // 5. 在地圖上加上功能選單 - 點選名單（帶入參數呼叫API）副: 列出工廠、公司、店家相關資訊
  // 6. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖上的移動污染源（帶入參數呼叫API）副: 呈現實時的監視器畫面（還未確定來源)
}
const onMapClick = evt => {
  elements.iconMenu.style.display = "block";
  elements.pieChart.style.display = "block";
  marker.setLatLng(evt.latlng); //.update()
  marker.setOpacity(1);
  onMarkerMoveEnd();

  // http://no2don.blogspot.com/2018/07/javascript-chartjs-pie-chart.html
  let pieChart = new Chart(elements.ctx, {
    type: 'pie',
    data: {
      labels: dataList.analysis.map(data => data.type),
      datasets: [{
        //預設資料
        data: dataList.analysis.map(data => data.percentage),
        backgroundColor: [
          //資料顏色
          "#70D49D",
          "#5599FF",
          "#FFFF77",
          "#FF8888"
        ],
      }],
    },
    options: {
      animation: {
        animateScale: true,
        animateRotate: true
      },
      // 關於滑過後的 顯示
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            //計算總和
            var sum = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            var currentValue = dataset.data[tooltipItem.index];
            var percent = Math.round(((currentValue / sum) * 100));
            return " " + data.labels[tooltipItem.index] + ": " + percent + "%";
          }
        }
      },

      //提示項目的處理
      legend: {
        display: true,
        position: 'left',
        labels: {
          fontColor: "#fff",
          generateLabels: function (chart) {
            var data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                var ds = data.datasets[0];
                var arc = chart.getDatasetMeta(0).data[i];
                var custom = arc && arc.custom || {};
                var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                var arcOpts = chart.options.elements.arc;
                var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

                var value = chart.config.data.datasets[chart.getDatasetMeta(0).data[i]._datasetIndex].data[chart.getDatasetMeta(0).data[i]._index];

                return {
                  text: label + ": " + value + "%",
                  fillStyle: fill,
                  strokeStyle: stroke,
                  lineWidth: bw,
                  hidden: isNaN(ds.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                  index: i
                };
              });
            } else {
              return [];
            }
          }
        }
      }
    },
  });
  elements.pieChart.style.backgroundColor = "#000000c0";
}


const addMultiListener = (evts, el, func) => evts.forEach(evt => el.on(evt, func));
addMultiListener(["movestart, dragstart, move, drag"], marker, onMarkerMoveStart);
addMultiListener(["moveend, dragend"], marker, onMarkerMoveEnd);

const multiElsAddListener = (els, evt, func) => els.forEach(el => el.addEventListener(evt, func, false));
multiElsAddListener([elements.constructionEl, elements.cameraEl, elements.factoryEl, elements.restaurantEl], "click", controlPannel);

map.on("click", onMapClick);