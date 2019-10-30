let elements = {
    detailBox: document.querySelector('.detail__box'),
    iframeContainer: document.querySelector('.iframe__container'),

    // companyPersonInCharge: document.querySelector('.company__person-in-charge li:last-child'),
    // companyTel: document.querySelector('.company__tel li:last-child'),
    // companyLatlng: document.querySelector('.company__latlng li:last-child'),
    // companyAddress: document.querySelector('.company__address li:last-child'),
    // companyServices: document.querySelector('.company__services li:last-child'),
    // companyViolations: document.querySelector('.company__violations li:last-child'),
    // companyReports: document.querySelector('.company__reports li:last-child'),
    // companyRate: document.querySelector('.company__rate p:last-child'),
    // companyImgBox: document.querySelector('.company__img-box'),
}


function onOpen(evt) {
    state.className = "success";
    state.innerHTML = "Connected to server";
    // 告訴server 我是副螢幕
}

function onClose(evt) {
    state.className = "fail";
    state.innerHTML = "Not connected";
    // connected.innerHTML = "0";
}

function onMessage(evt) {
    // There are two types of messages:
    // 1. a chat participant message itself
    // 2. a message with a number of connected chat participants

    // var data = JSON.parse(evt.data);
    // console.log(data);
    // switch (data.event) {
    //     case 'playSlide':
    //         playSlide();
    //         break;
    //     case 'changePage':
    //         console.log('called');
    //         display(data.currentPage, 'sub');
    //         break;
    //     case 'changeImage':
    //         const imgContainer = document.querySelector('.slide-wrap img');
    //         if (htmlAssets[`sub_${parseInt(data.index)+1}`])
    //             imgContainer.src = htmlAssets[`sub_${parseInt(data.index)+1}`];
    //         break;
    //     default:

    // }
    var data = JSON.parse(evt.data);
    let markup = ``;
    switch (data.event) {
        case 'renderCompanyDetails':
            // console.log(data.data);
            elements.iframeContainer.classList.add('not-display');
            elements.detailBox.innerHTML = '';
            elements.detailBox.classList.contains('not-display') ? elements.detailBox.classList.remove('not-display') : null;
            markup = `  <div class="company">
            <div class="company__left">
              <div class="company__img-box">
                <img src="${data.data.image}" alt="" />
              </div>
              <div class="company__rate">
                <p>整體評分:</p>
                <p>${data.data.rate}</p>
              </div>
            </div>
            <div class="company__right">
              <div class="company__basic-info">
                <ul class="company__person-in-charge">
                  <li>負責人:</li>
                  <li>${data.data.personInCharge}</li>
                </ul>
                <ul class="company__tel">
                  <li>聯絡電話:</li>
                  <li>${data.data.tel}</li>
                </ul>
                <ul class="company__latlng">
                  <li>經緯度:</li>
                  <li>${data.data.latlng.lat}, ${data.data.latlng.lng}</li>
                </ul>
              </div>
              <ul class="company__address">
                <li>地址:</li>
                <li>${data.data.address}</li>
              </ul>
              <ul class="company__services">
                <li>營業項目:</li>
                <li>${data.data.services}</li>
              </ul>
              <ul class="company__violations">
                <li>違規案例:</li>
                <li>${data.data.violations}</li>
              </ul>
              <ul class="company__reports">
                <li>檢舉案例:</li>
                <li>${data.data.reports}</li>
              </ul>
            </div>
          </div>`;
            elements.detailBox.insertAdjacentHTML("afterbegin", markup);

            // elements.companyPersonInCharge.innerText = data.data.personInCharge;
            // elements.companyTel.innerText = data.data.tel;
            // elements.companyLatlng.innerText = data.data.latlng;
            // elements.companyAddress.innerText = data.data.address;
            // elements.companyServices.innerText = data.data.services;
            // elements.companyViolations.innerText = data.data.violations;
            // elements.companyReports.innerText = data.data.reports;
            // elements.companyRate.innerText = data.data.rate;
            // elements.companyRate.innerHTML = `<img src = ${data.data.image}/>`;
            break;
        case "renderTransportationDetail":
            elements.iframeContainer.classList.contains('not-display') ? elements.iframeContainer.classList.remove('not-display') : null;
            elements.detailBox.innerHTML = '';
            elements.detailBox.classList.contains('not-display') ? elements.detailBox.classList.remove('not-display') : null;
            markup = ` <div class="transportation">
            <div class="transportation__img">
              <p>道路檢測畫面</p>
              <div class="transportation__img--box">
                <img
                  src="https://images.unsplash.com/photo-1492666918209-d0a9ea801f2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="monitor-view"
                />
              </div>
            </div>
            <div class="transportation__license">
              <p>72小時內監測到的車牌號</p>
              <div class="transportation__license--list">
                <ul>
                  <li class="is-polluted">AKA - 969</li>
                  <li>YHU - 122</li>
                  <li>AYA - 293</li>
                  <li class="is-polluted">QSX - 378</li>
                  <li>YHU - 122</li>
                  <li class="is-polluted">AYA - 293</li>
                  <li>QSX - 378</li>
                  <li>YHU - 122</li>
                </ul>
              </div>
            </div>
            <div class="transportation__owner-info">
              <p>烏賊車主資訊</p>
              <div>
                <ul class="license-plate">
                  <li>車牌號</li>
                  <li>AKA - 969</li>
                </ul>
                <ul>
                  <li class="checked-data">檢測日期</li>
                  <li>2019/09/04</li>
                </ul>
                <ul>
                  <li class="car-owner">車主</li>
                  <li>張順發</li>
                </ul>
                <ul>
                  <li class="contact-info">聯絡資訊</li>
                  <li>
                    <span> 0981881128/ </span>
                    <span> 台北市信義區松高路9號25F </span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="license-plate">
                  <li>車牌號</li>
                  <li>AKA - 969</li>
                </ul>
                <ul>
                  <li class="checked-data">檢測日期</li>
                  <li>2019/09/04</li>
                </ul>
                <ul>
                  <li class="car-owner">車主</li>
                  <li>張順發</li>
                </ul>
                <ul>
                  <li class="contact-info">聯絡資訊</li>
                  <li>
                    <span> 0981881128/ </span>
                    <span> 台北市信義區松高路9號25F </span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="license-plate">
                  <li>車牌號</li>
                  <li>AKA - 969</li>
                </ul>
                <ul>
                  <li class="checked-data">檢測日期</li>
                  <li>2019/09/04</li>
                </ul>
                <ul>
                  <li class="car-owner">車主</li>
                  <li>張順發</li>
                </ul>
                <ul>
                  <li class="contact-info">聯絡資訊</li>
                  <li>
                    <span> 0981881128/ </span>
                    <span> 台北市信義區松高路9號25F </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>`;
            elements.detailBox.insertAdjacentHTML("afterbegin", markup);
            elements = {
                ...elements,
                pollutedList: document.querySelector('.transportation__license--list > ul'),
                ownerInfo: document.querySelector('.transportation__owner-info'),
            };
            elements.pollutedList.innerHTML = '';
            elements.ownerInfo.innerHTML = '<p>烏賊車主資訊</p>';
            data.data.licensePlate.forEach(item => {
                let markup = ` <li class=${item.isPolluted?"is-polluted":null}>${item.license}</li>`;
                elements.pollutedList.insertAdjacentHTML('beforeend', markup);
            });
            data.data.pollutedCarOwnerInfo.forEach(item => {
                let markup = `<div>
                <ul class="license-plate">
                  <li>車牌號</li>
                  <li>${item.license}</li>
                </ul>
                <ul>
                  <li class="checked-data">檢測日期</li>
                  <li>${item.checkedDate}</li>
                </ul>
                <ul>
                  <li class="car-owner">車主</li>
                  <li>${item.owner}</li>
                </ul>
                <ul>
                  <li class="contact-info">聯絡資訊</li>
                  <li>${item.contactInfo}</li>
                </ul>
              </div>`;
                elements.ownerInfo.insertAdjacentHTML('beforeend', markup);
            });
            break;
        default:
            break;
    }

}