const addMultiListener = (evts, el, func) => evts.forEach(evt => el.on(evt, func));
const multiElsAddListener = (els, evt, func) => els.forEach(el => el.addEventListener(evt, func, false));
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
                xhr.send(JSON.stringify(opts.payload)); //++
            } else {
                xhr.send(opts.payload); //++
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

const renderPin = (parentEl, posX, posY) => {
    let pin = document.querySelector(`.pin`);
    pin ? pin.remove() : null;
    const markup = `<div class="pin"></div>`;
    parentEl.insertAdjacentHTML("afterbegin", markup);
    pin = document.querySelector(`.pin`);
    pin.style.left = `${posX}px`;
    pin.style.top = `${posY}px`;
}


const switchIcon = (icon) => {
    console.log(icon);
    let iconUrl;
    if (icon) {
        iconUrl = icon.options.icon.options.iconUrl;
        iconUrl = iconUrl.replace("assets/img/icons/", "");
        iconUrl = iconUrl.replace(".png", "");
    }
    switch (iconUrl) {
        case "Factory":
            icon.setIcon(selectedFactoryIcon);
            break;
        case "Construction":
            icon.setIcon(selectedConstructionIcon);
            break;
        case "Restaurant":
            icon.setIcon(selectedRestaurantIcon);
            break;
        case "Camera":
            icon.setIcon(selectedCameraIcon);
            iconUrl = "Transportation"; // ++
            break;
        case "Factory_selected":
            icon.setIcon(factoryIcon);
            break;
        case "Construction_selected":
            icon.setIcon(constructionIcon);
            break;
        case "Restaurant_selected":
            icon.setIcon(restaurantIcon);
            break;
        case "Camera_selected":
            icon.setIcon(cameraIcon);
            break;
        default:
    }
    return iconUrl;
}

function getClickPosition(e, parentEl) {
    var posX = e.clientX;
    var posY = e.clientY;
    console.log(posX, posY, parentEl);
    renderPin(parentEl, posX, posY);
}