let elements = {
    company: document.querySelector('.company'),
    companyPersonInCharge: document.querySelector('.company__person-in-charge li:last-child'),
    companyTel: document.querySelector('.company__tel li:last-child'),
    companyLatlng: document.querySelector('.company__latlng li:last-child'),
    companyAddress: document.querySelector('.company__address li:last-child'),
    companyServices: document.querySelector('.company__services li:last-child'),
    companyViolations: document.querySelector('.company__violations li:last-child'),
    companyReports: document.querySelector('.company__reports li:last-child'),
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
            elements.company.style.display = 'block';
            console.log(data.data);
            elements.companyPersonInCharge.innerText = data.data.personInCharge;
            elements.companyTel.innerText = data.data.tel;
            elements.companyLatlng.innerText = data.data.latlng;
            elements.companyAddress.innerText = data.data.address;
            elements.companyServices.innerText = data.data.services;
            elements.companyViolations.innerText = data.data.violations;
            elements.companyReports.innerText = data.data.reports;
            break;
        default:
            break;
    }

}