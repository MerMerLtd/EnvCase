// class
let OvalIcon = L.Icon.extend({
  options: {
    // shadowUrl: 'assets/img/icons/shadow.png',
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
  });

let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '<a href="https://www.openstreetmap.org/">OSM</a>',
  maxZoom: 18,
});

let cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": .01,
  "maxOpacity": .8,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};

let heatmapLayer = new HeatmapOverlay(cfg);

let map = L.map('mapid', {
  center: [25.009055, 121.464866],
  zoom: 11,
  layers: [baseLayer, heatmapLayer],
});

// var
let lastClickIcon, iconMarkers = {},
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
  dataList, coordinates = [],
  heatmapData = [],
  elements = {
    constructionEl: document.querySelector("#construction"),
    factoryEl: document.querySelector("#factory"),
    restaurantEl: document.querySelector("#restaurant"),
    cameraEl: document.querySelector("#camera"),
    iconMenu: document.querySelector(".icon-menu"),
    pieChart: document.querySelector(".pie-chart"),
    nameList: document.querySelector(".name-list"),
    myChart: document.getElementById('myChart').getContext('2d'),
    fileInput: document.querySelector('#excel-file'),
  },
  animateData = [];

const selectedIcon = (iconMarker) => {
  if (lastClickIcon) {
    lastClickIcon['options']['isSelected'] = false;
    // iconMarkers[lastClickIcon.options.id] = {
    //   ...lastClickIcon,
    //   options: {
    //     ...lastClickIcon["options"],
    //     isSelected: false,
    //   },
    // };
    // iconMarkers[lastClickIcon.options.id] = {
    //   ...{
    //     ...iconMarkers
    //   } [lastClickIcon.options.id],
    //   options: {
    //     ...{
    //       ...{
    //         ...iconMarkers
    //       } [lastClickIcon.options.id]
    //     } ['options'],
    //     isSelected: false,
    //   },
    // };
    switchIcon(lastClickIcon);
  }
  // console.log(iconMarker);
  iconMarker['options']['isSelected'] = true;
  // console.log(iconMarker);

  // iconMarkers[iconMarker.options.id] = {
  //   ...iconMarker,
  //   options: {
  //     ...iconMarker["options"],
  //     isSelected: true
  //   }
  // }
  switchIcon(iconMarker);

  lastClickIcon = iconMarker;
  // console.log(type, evt.target);
  //++ ask backend to get the nameList by passing latlng & type
  getNameList(iconMarker.options.type, iconMarker.getLatLng());
}

const switchIcon = (iconMarker) => {
  // console.log(iconMarker);
  let iconUrl = iconMarker.options.type;
  // if (iconMarker) {
  //     iconUrl = iconMarker.options.iconMarker.options.iconUrl;
  //     iconUrl = iconUrl.replace("assets/img/icons/", "");
  //     iconUrl = iconUrl.replace(".png", "");
  // }
  // iconMarker.options.type
  // switch (iconUrl) {
  switch (iconMarker.options.type) {
    case "Factory":
      // if(!iconMarker.options.isSelected){
      //     iconMarker.setIcon(factoryIcon);
      //     document.querySelector(`[data-id='${iconMarker.options.id}']`).style.color = "yellow";
      // }else{
      //     iconMarker.setIcon(selectedFactoryIcon);
      //     document.querySelector(`[data-id='${iconMarker.options.id}']`).style.color = "white";
      // }
      !iconMarker.options.isSelected ? iconMarker.setIcon(factoryIcon) : iconMarker.setIcon(selectedFactoryIcon);
      break;
    case "Construction":
      !iconMarker.options.isSelected ? iconMarker.setIcon(constructionIcon) : iconMarker.setIcon(selectedConstructionIcon);
      break;
    case "Restaurant":
      !iconMarker.options.isSelected ? iconMarker.setIcon(restaurantIcon) : iconMarker.setIcon(selectedRestaurantIcon);
      break;
    case "Transportation":
      !iconMarker.options.isSelected ? iconMarker.setIcon(cameraIcon) : iconMarker.setIcon(selectedCameraIcon);
      iconUrl = "Transportation"; // ++
      break;
      // case "Factory_selected":
      //     iconMarker.setIcon(factoryIcon);
      //     break;
      // case "Construction_selected":
      //     iconMarker.setIcon(constructionIcon);
      //     break;
      // case "Restaurant_selected":
      //     iconMarker.setIcon(restaurantIcon);
      //     break;
      // case "Camera_selected":
      //     iconMarker.setIcon(cameraIcon);
      //     break;
    default:
  }
  return iconUrl;
}

const controlPannel = evt => {
  // console.log("click");
  layerGroup.clearLayers(); // https://stackoverflow.com/questions/41256026/clear-marker-layers-leaflet;
  let icon;
  // render iconMarkers on the layerGroup layer
  // 1. decide Icon Image by type
  if (dataList)
    dataList.list.forEach(data => {
      icon = ((data) => {
        // console.log(data.type);
        switch (data.type) {
          case "Factory":
            // elements.factoryEl.checked ? null : toggleUnSelectedType(elements.factoryEl);
            return factoryIcon;
          case "Transportation":
            // return elements.cameraEl.checked ? cameraIcon : null;
            // elements.cameraEl.checked ? null : toggleUnSelectedType(elements.cameraEl);
            return cameraIcon;
          case "Restaurant":
            // return elements.restaurantEl.checked ? restaurantIcon : null;
            // elements.restaurantEl.checked ? null : toggleUnSelectedType(elements.restaurantEl);
            return restaurantIcon;
          case "Construction":
            // return elements.constructionEl.checked ? constructionIcon : null;
            // elements.constructionEl.checked ? null : toggleUnSelectedType(elements.constructionEl);
            return constructionIcon;
          default:
        }
      })(data);
      // console.log(icon);
      if (icon) {
        iconMarkers[data.id] =
          L.marker(data.latlng, {
            icon: icon,
            id: data.id,
            isSelected: false,
            type: data.type,
          }).addTo(layerGroup).on("click", evt => {
            // console.log(evt.target === iconMarkers[evt.target.options.id]);
            selectedIcon(evt.target);
          }); //evt => selectedIcon(evt)
        // ++ control heatmap
        // (if icon !== null => that type of pollute is selected )
      }
    });
  toggleUnSelectedType();
}

const getDetails = async selectedId => {
  Array.from(elements.nameList.children).forEach(el => el.style.color = "#fff");
  // console.log(selectedId);
  document.querySelector(`[data-id='${selectedId}']`).style.color = "yellow";
  // xhr request
  let err, data;
  const opts = {
    contentType: 'application/json',
    method: "GET",
    url: "/details",
    payload: {
      "selectedId": selectedId,
    }
  };
  // [err, data] = await to(makeRequest(opts));
  if (err) throw new Error(err);
  // dummy data  
  data = {
    ...details[selectedId],
    latlng: iconMarkers[selectedId].getLatLng()
  };
  if (data) { //++ will need to remove ! later
    // call websokect;
    websocket.send(
      JSON.stringify({
        // event: elements.nameList.dataset.type === "Transportation" ? "renderTransportationDetail" : "renderCompanyDetails",
        event: data.type === "Transportation" ? "renderTransportationDetail" : "renderCompanyDetails",
        data: data,
      })
    );
    // render data to the second view.
  };
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

const onMarkerMoveEnd = async _ => {
  //-- 
  let num = 100;
  circle.setLatLng(marker.getLatLng());
  circle.setStyle({
    color: '#fff',
    fillOpacity: 0.3,
  });
  map.setView(marker.getLatLng(), 14);
  marker.bindPopup(`You clicked the map at ${marker.getLatLng().toString()}`).openPopup();
  setTimeout(_ => marker.closePopup(), 1000);
  // 呼叫API，回傳附近（方圓？？）營建、餐飲、工廠、路肩攝影機的坐標
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
  // 把資料存在最外面
  dataList = {
    list: [{
        id: "234jdbuw923",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * 0.0075,
          lng: marker.getLatLng().lng + Math.random() * 0.0075,
        },
        type: "Construction",
        name: "大漢預拌廠股份有限公司",
      },
      {
        id: "234jdajw923",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * 0.0075,
          lng: marker.getLatLng().lng + Math.random() * 0.0075,
        },
        type: "Construction",
        name: "漢鼎建設股份有限公司",
      }, {
        id: "234jdhyw923",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * -0.0075,
          lng: marker.getLatLng().lng + Math.random() * 0.0075,
        },
        type: "Factory",
        name: "宏穎真空鍍金股份有限公司",
      },
      {
        id: "234jdasw923",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * -0.0075,
          lng: marker.getLatLng().lng + Math.random() * 0.0075,
        },
        type: "Factory",
        name: "積體電路股份有限公司",
      }, {
        id: "234jdbuw123",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * 0.0075,
          lng: marker.getLatLng().lng + Math.random() * -0.0075,
        },
        type: "Restaurant",
        name: "珍好味小吃店",
      },
      {
        id: "234jdb0w123",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * 0.0075,
          lng: marker.getLatLng().lng + Math.random() * -0.0075,
        },
        type: "Restaurant",
        name: "廟口鴨肉飯",
      }, {
        id: "234jklouw923",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * -0.0075,
          lng: marker.getLatLng().lng + Math.random() * -0.0075,
        },
        type: "Transportation",
        name: "橋中二街街口",
      }, {
        id: "sasdkmskkw12",
        latlng: {
          lat: marker.getLatLng().lat + Math.random() * -0.0075,
          lng: marker.getLatLng().lng + Math.random() * -0.0075,
        },
        type: "Transportation",
        name: "新北市環保局街口",
      },
    ],
    pollutionRatio: {
      Construction: num -= Math.round(Math.random() * 30),
      Factory: num -= Math.round(Math.random() * 25),
      Restaurant: num -= Math.round(Math.random() * 25),
      Transportation: num -= Math.round(Math.random() * 15),
      Other: num -= Math.round(Math.random() * 5),
    },
    other: {
      note: "還有一部份污染推斷是來至其他線上，請參考空氣網的大氣流動模擬圖"
    },
  }
  // UI - 根據坐標 render company 到地圖上
  controlPannel(dataList);
  console.log(dataList);
  return dataList;

  // 6. 在地圖上加上功能選單 - 點選PM2.5污染源分析圓餅圖上的移動污染源（帶入參數呼叫API）副: 呈現實時的監視器畫面（還未確定來源)
}

const renderNameListItem = data => {
  // console.log(data);
  const markup = `<li class="name-list__item" data-id = ${data.id} data-latlng = ${data.latlng.lat}_${data.latlng.lng}>
  ${data.name}
</li>`
  elements.nameList.insertAdjacentHTML("beforeend", markup);
  // if (iconMarkers[data.id].options.isSelected) document.querySelector(`[data-id='${data.id}']`).style.color = "yellow";
  // if (iconMarkers[data.id].options.alt) getDetails(data.id);
}

const getNameList = async (type, selectedIconCoordinate) => {
  elements.nameList.classList.add('display');
  if (elements.nameList.classList.contains('not-display'))
    elements.nameList.classList.remove('not-display');
  elements.nameList.innerHTML = '';
  elements.nameList.dataset.type = type;
  if (type === "Other") {
    const markup = `<li class="name-list__item" data-id = other >
    ${dataList.other.note}
  </li>`
    elements.nameList.insertAdjacentHTML("beforeend", markup)
    return;
  }
  dataList.list.forEach(data => {
    if (data.type === type)
      renderNameListItem(data);
  });
  if (selectedIconCoordinate) {
    // make another request to get the shop detail and render to the second view.
    // ?? why let is not working but var is?
    var selectedId = dataList.list.filter(data => data.type === type).find(data => data.latlng.lat === selectedIconCoordinate.lat && data.latlng.lng === selectedIconCoordinate.lng).id; // !== will be changed to === ++
    // console.log(selectedId);
    getDetails(selectedId);
    // select main view nameList Pannel item
  }
};

const selectNameListItem = evt => {
  // console.log(evt);
  if (evt.target.matches("li, .name-list__item")) {
    // console.log(evt.target.dataset.id);
    // console.log(evt.target.dataset.latlng.split("_").map(data => parseFloat(data)));
    // lastClickIcon = iconMarkers[evt.target.dataset.id];
    selectedIcon(iconMarkers[evt.target.dataset.id]);
    getDetails(evt.target.dataset.id);
  }
}

const openNameListPannel = type => {
  switch (type) {
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
    case "Other":
      getNameList("Other");
      break;
  }
}

const toggleUnSelectedType = () => {
  // console.log(evt.target.checked, elements.nameList.dataset.type);
  // console.log(evt.target.dataset.type);
  // let el = evt.target ? evt.target : evt;
  Array.from(elements.iconMenu.children).forEach(el => {
    // console.log(el.firstElementChild.checked);
    if (el.firstElementChild.checked) {
      // console.log("true");
      Object.values(iconMarkers).filter(iconMarker => iconMarker.options.type === el.firstElementChild.dataset.type).forEach(iconMarker => {
        // console.log(iconMarker.options.type, el.firstElementChild.dataset.type);
        iconMarker._icon.classList.remove("not-display");
        iconMarker._icon.classList.add("display");
        // unSelectIcon
        iconMarker['options']['isSelected'] = false;
        switchIcon(iconMarker);
        document.querySelector(`[data-id='${iconMarker.options.id}']`) ? document.querySelector(`[data-id='${iconMarker.options.id}']`).style.color = "white" : null;
      });
      if (el.firstElementChild.dataset.type === elements.nameList.dataset.type) {
        elements.nameList.classList.add('display');
        elements.nameList.classList.remove('not-display');
      }
    } else {
      // console.log(false);
      Object.values(iconMarkers).filter(iconMarker => iconMarker.options.type === el.firstElementChild.dataset.type).forEach(iconMarker => {
        iconMarker._icon.classList.remove("display");
        iconMarker._icon.classList.add("not-display");
      });
      if (el.firstElementChild.dataset.type === elements.nameList.dataset.type) {
        elements.nameList.classList.remove('display');
        elements.nameList.classList.add('not-display');
      }

    }
    // let unSelectedIconMarkers = Object.values(iconMarkers).filter(iconMarker => iconMarker.type === elements.nameList.dataset.type);
    // console.log(unSelectedIconMarkers);
    // console.log(evt.target.checked && elements.nameList.dataset.type);
    // if (elements.nameList.classList.contains('display') && !evt.target.checked) {
    //   elements.nameList.classList.remove('display');

    // }
    // if (elements.nameList.dataset.type === evt.target.dataset.type && !evt.target.checked)
    //   elements.nameList.classList.add('not-display');
    // if (evt.target.checked && elements.nameList.dataset.type) {
    //   elements.nameList.classList.remove('not-display');
    //   elements.nameList.classList.add('display');
    // }

  });
}

const getLabelTag = type => {
  switch (type) {
    case 'Construction':
      return '營建業';
    case 'Factory':
      return '工廠';
    case 'Restaurant':
      return '餐飲業';
    case 'Transportation':
      return '移動污染源';
    default:
      return '其他';
  }
}
// ++ add arguments, like pollute type and need to fetch or get new dataList to draw pieChart
const renderPieChart = _ => {
  if (elements.pieChartTitle)
    elements.pieChart.removeChild(elements.pieChartTitle) //--
  // console.log(dataList);
  let pieChart = new Chart(elements.myChart, {
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
      // https://www.chartjs.org/docs/latest/configuration/legend.html

      onClick: function (evt) {
        let ci = this.chart;
        if (ci.getElementAtEvent(evt)[0]) {
          // https://www.chartjs.org/docs/latest/developers/api.html#getelementatevente
          openNameListPannel(Object.keys(dataList.pollutionRatio)[pieChart.getElementAtEvent(evt)[0]._index]);
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
              console.log(data.datasets[0], chart.getDatasetMeta(0).data);
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
                // console.log(chart.config.data.datasets[chart.getDatasetMeta(0).data[i]._datasetIndex]);
                return {
                  text: getLabelTag(label), //label + ": " + value + "%",
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
        },
        onClick: function (evt, legendItem) {
          // console.log(evt, legendItem);
          openNameListPannel(Object.keys(dataList.pollutionRatio)[legendItem.index]);
        },
        //https://codepen.io/jordanwillis/pen/BWKKKo 
        //👆 That looks legit, but mine is not working
        onHover: function (evt, legendItem) {
          document.getElementById("myChart").style.cursor = 'pointer';
        },
      }
    },
  });
  const markup = ` <p class="pie-chart__title">PM2.5 污染原分析</p>`;
  elements.pieChart.insertAdjacentHTML('afterbegin', markup);
  // elements.pieChart.classList.remove('not-display');
  elements.pieChart.style.backgroundColor = "#000000c0";
  elements.pieChart.style.display = "block";
  elements = {
    ...elements,
    pieChartTitle: document.querySelector('.pie-chart__title')
  };
  multiElsAddListener([elements.pieChartTitle], 'click', evt => {
    evt.target.style.color = '#ffc100';
    renderPieChart();
  });

}

const onMapClick = evt => {
  // 1. get marker latlng
  marker.setOpacity(1);
  marker.setLatLng(evt.latlng); //.update()
  // 2. 取得附近（方圓？？，在最一開始就設定了，現在不可更改 // ++ ）營建、餐飲、工廠、路肩攝影機的坐標，並畫到畫面上
  onMarkerMoveEnd();
  // 3. 在地圖上加上功能選單 - 顯示控制該區塊類別的checkbox list
  elements.iconMenu.style.display = "block";
  // 4. 在地圖上加上功能選單 -  跳出PM2.5污染源分析資料（帶入坐標呼叫API）
  renderPieChart();
  // http://no2don.blogspot.com/2018/07/javascript-chartjs-pie-chart.html

}

const setHeatmapPollutedType = type => {
  if (!heatmapData) return;
  let heatmapDataWithType = heatmapData.map(data => ({
    lat: data['lat'],
    lng: data['lng'],
    count: data[type]
  }));
  return heatmapDataWithType;
}

const parseExcelFile = evt => {
  var files = evt.target.files;
  var fileReader = new FileReader();
  fileReader.onload = function (ev) {
    try {
      var data = ev.target.result;
      var workbook = XLSX.read(data, {
        type: "binary"
      }); // 以二進位制流方式讀取得到整份excel表格物件
      var result = []; // 儲存獲取到的資料
    } catch (e) {
      console.log("檔案型別不正確");
      return;
    }
    // 表格的表格範圍，可用於判斷表頭是否數量是否正確
    var fromTo = "";
    // 遍歷每張表讀取
    for (var sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        fromTo = workbook.Sheets[sheet]["!ref"];
        console.log(fromTo);
        result = result.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        );
        // break; // 如果只取第一張表，就取消註釋這行
      }
    }
    //在控制檯打印出來表格中的資料
    // console.log(result);
    // result.map(data => console.log(data,data['TSP'],!!data['TSP']));
    // coordinates = result.filter(data => !!data['PM25'] && (data['UTMN'] || data['UTM_N']));//.map(data => [parseFloat(data['UTME'] || data['UTM_E']), parseFloat(data['UTMN'] || data['UTM_N']), parseFloat(data['PM25'])]);
    // console.log(coordinates);
    heatmapData = result
      .filter(data => !!data['PM25'] && (data['UTMN'] || data['UTM_N']))
      .map((data, i) => {
        coordinates.push(TWD97_To_lonlat(parseFloat(data['UTME'] || data['UTM_E']), data['UTMN'] || data['UTM_N'], 2));
        // console.log(data[' NMHC']);
        data = {
          ...data,
          lat: coordinates[i][0],
          lng: coordinates[i][1],
          NOX: parseFloat(data['NOX']),
          PM25: parseFloat(data['PM25']),
          SOX: parseFloat(data['SOX']),
          TSP: parseFloat(data['TSP']),
          NMHC: parseFloat(data[' NMHC'] || data['NMHC']),
        };
        data[' NMHC'] ? delete data[' NMHC'] : null;
        return data;
      });
    console.log(setHeatmapPollutedType('PM25'));
    heatmapLayer.setData({
      // max: 8,
      data: setHeatmapPollutedType('PM25'),
    });

    for (let i = 0; i <  Math.round(1000 * Math.random()); i++) {
      let heatmapDataWithType = setHeatmapPollutedType('PM25').map(data => ({
        ...data,
        count: data['count'] * Math.random() * 1.5,
      }));
      animateData.push(heatmapDataWithType);
      // console.log(animateData[i][0]);
      // console.log(animateData[i][0]['count']);
    }

  };
  // 以二進位制方式開啟檔案
  fileReader.readAsBinaryString(files[0]);
}

elements.fileInput.addEventListener('change', parseExcelFile, false);

addMultiListener(["movestart, dragstart, move, drag"], marker, onMarkerMoveStart);
addMultiListener(["moveend, dragend"], marker, onMarkerMoveEnd);
multiElsAddListener([elements.nameList], "click", selectNameListItem);
multiElsAddListener([elements.constructionEl, elements.cameraEl, elements.factoryEl, elements.restaurantEl], "click", toggleUnSelectedType);

map.on("click", onMapClick);