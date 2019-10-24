// var
let dataList, lastClickIcon, map = L.map('mapid').setView([25.009055, 121.464866], 11),
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

const onMarkerMoveEnd = async _ => {
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
  let err, data;
  const opts = {
    contentType: 'application/json',
    method: "GET",
    url: `/datalist?lat=${marker.getLatLng().lat}&lng=${marker.getLatLng().lng}&radius=1000`,
    // payload: 
  };
  // [err, data] = await to(makeRequest(opts));
  if (err) throw new Error(err);
  if (data) {
    // dataList = data
  }
  // dummy data
  dataList = {
    list: [{
        id: "234jdbuw923",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
        },
        type: "Construction", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "大漢預拌廠股份有限公司", //dummyData[i]["type"]
      },
      {
        id: "234jdajw923",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
        },
        type: "Construction", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "漢鼎建設股份有限公司", //dummyData[i]["type"]
      }, {
        id: "234jdhyw923",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
        },
        type: "Factory", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "宏穎真空鍍金股份有限公司", //dummyData[i]["type"]
      },
      {
        id: "234jdasw923",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*0.0075}`,
        },
        type: "Factory", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "積體電路股份有限公司", //dummyData[i]["type"]
      }, {
        id: "234jdbuw123",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
        },
        type: "Restaurant", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "珍好味小吃店", //dummyData[i]["type"]
      },
      {
        id: "234jdb0w123",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
        },
        type: "Restaurant", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "廟口鴨肉飯", //dummyData[i]["type"]
      }, {
        id: "234jklouw923",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
        },
        type: "Transportation", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "橋中二街街口", //dummyData[i]["type"]
      }, {
        id: "sasdkmskkw12",
        latlng: {
          lat: `${marker.getLatLng().lat + Math.random()*-0.0075}`,
          lng: `${marker.getLatLng().lng + Math.random()*-0.0075}`,
        },
        type: "Transportation", // (dummy data: create a dummy int i between 0 - 3, pick one in type array, ex dummyData[i]["type"])
        name: "新北市環保局街口", //dummyData[i]["type"]
      },
    ],
    pollutionRatio: {
      Construction: num -= Math.round(Math.random() * 30), //0.1,
      Factory: num -= Math.round(Math.random() * 25), //0.2,
      Restaurant: num -= Math.round(Math.random() * 25), //0.3,
      Transportation: num -= Math.round(Math.random() * 15), //0.3,
      Other: num -= Math.round(Math.random() * 5), // 0.1,
    },
    other: {
      note: "還有一部份污染推斷是來至其他線上，請參考空氣網的大氣流動模擬圖"
    },
  }
  console.log();
  controlPannel(dataList);
  // 2. 在地圖上加上功能選單 - 顯示控制該區塊類別的checkbox list

  // 3. 在地圖上加上功能選單 -  跳出PM2.5污染源分析資料（帶入坐標呼叫API）
  // 4. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖,主: 列出可疑名單（根據可疑程度排名）
  // 5. 在地圖上加上功能選單 - 點選名單（帶入參數呼叫API）副: 列出工廠、公司、店家相關資訊
  // 6. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖上的移動污染源（帶入參數呼叫API）副: 呈現實時的監視器畫面（還未確定來源)
}

const renderNameListItem = data => {
  const markup = `<li class="name-list__item" data-id = ${data.id} data-latlng = ${data.latlng.lat}_${data.latlng.lng}>
  ${data.name}
</li>`
  elements.nameList.insertAdjacentHTML("beforeend", markup)
}

const getNameList = async (type, selectedIconCoordinate) => {
  console.log(type, selectedIconCoordinate);
  elements.nameList.style.display = 'block';
  elements.nameList.innerHTML = '';
  dataList.list.forEach(data => {
    if (data.type === type)
      renderNameListItem(data);
  });
  if (selectedIconCoordinate) {
    // make another request to get the shop detail and render to the second view.
    // ?? why let is not working but var is?
    var selectedShopId = dataList.list.filter(data => data.type === type).find(data => data.latlng !== selectedIconCoordinate).id; // !== will be changed to === ++
    console.log(selectedShopId);
    getShopDetails(selectedShopId);
    // select main view nameList Pannel item
  }
};


const getShopDetails = async selectedShopId => {
  Array.from(elements.nameList.children).forEach(el => el.style.color = "#fff");
  console.log(selectedShopId);
  document.querySelector(`[data-id='${selectedShopId}']`).style.color = "yellow";
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
  // [err, data] = await to(makeRequest(opts));
  if (err) throw new Error(err);
  if (!data) { //++ will need to remove ! later
    // call websokect;
    // render data to the second view.
  };
}



const selectNameListItem = evt => {
  console.log(evt);
  if (evt.target.matches("li, .name-list__item")) {
    console.log(evt.target.dataset.id);
    console.log(evt.target.dataset.latlng.split("_").map(data => parseFloat(data)));
    // get icon by latlng ++++ 
    L.marker(evt.target.dataset.latlng.split("_").map(data => parseFloat(data))).setIcon(selectedFactoryIcon)
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
  console.log(type, evt);
  //++ ask backend to get the nameList by passing latlng & type
  getNameList(type, evt.latlng);

}

const controlPannel = () => {
  layerGroup.clearLayers(); // https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet;
  let icon;
  if (dataList)
    dataList.list.forEach((data, i) => {
      icon = ((data) => {
        // console.log(data.type);
        switch (data.type) {
          case "Factory":
            return elements.factoryEl.checked ? factoryIcon : null;
          case "Transportation":
            return elements.cameraEl.checked ? cameraIcon : null;
          case "Restaurant":
            return elements.restaurantEl.checked ? restaurantIcon : null;
          case "Construction":
            return elements.constructionEl.checked ? constructionIcon : null;
          default:
        }
      })(data);
      // console.log(icon);
      if (icon) {
        //  dataList[i] = {...[...dataList[i]], iconMarker:}
        L.marker(data.latlng, {
          icon: icon,
        }).addTo(layerGroup).on("click", selectedIcon); //evt => selectedIcon(evt)
        // ++ control heatmap
        // (if icon !== null => that type of pollute is selected )
      }
    });
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
      labels: Object.keys(dataList.pollutionRatio),
      datasets: [{
        //預設資料
        data: Object.values(dataList.pollutionRatio),
        backgroundColor: [
          //資料顏色
          "#70D49D",
          "#5599FF",
          "#FFFF77",
          "#FF8888",
          "#7B7B7B"
        ],
      }],
    },
    options: {
      onClick: function (evt) {
        // console.log(evt);
        // console.log(pieChart.getElementAtEvent(evt));
        // console.log(pieChart.getElementAtEvent(evt)[0]._index);
        // console.log(Object.keys(dataList.pollutionRatio)[pieChart.getElementAtEvent(evt)[0]._index]);
        controlPannel();
        // console.log("pieChart: onClick");
        switch (Object.keys(dataList.pollutionRatio)[pieChart.getElementAtEvent(evt)[0]._index]) {
          case "Factory":
            getNameList("Factory");
            break;
          case "Construction":
            getNameList("Construction");
            break;
          case "Restaurant":
            getNameList("Restaurant");
            break;
          case "Transportation": // ++ change
            getNameList("Transportation");
            break;
        }

      },
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



addMultiListener(["movestart, dragstart, move, drag"], marker, onMarkerMoveStart);
addMultiListener(["moveend, dragend"], marker, onMarkerMoveEnd);
multiElsAddListener([elements.constructionEl, elements.cameraEl, elements.factoryEl, elements.restaurantEl], "click", controlPannel);

map.on("click", onMapClick);