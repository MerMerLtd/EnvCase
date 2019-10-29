let elements = {
    company: document.querySelector('.company'),
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
    switch (data.event) {
        case 'renderShopDetails':
            elements.company.innerHTML = '';
            console.log(data.data);
            const markup = `  <div class="company__detail-box">
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
            elements.company.insertAdjacentHTML("afterbegin", markup);
            elements.company.style.display = 'block';

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
        default:
            break;
    }

}