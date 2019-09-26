// // https://dev.to/kodnificent/how-to-build-a-router-with-vanilla-javascript-2a18

// //================================================================================
// // 1. 點擊螢幕任意一點跳換下一頁
// // 2. 主螢幕換下一頁同時，副螢幕也換下一頁
// // https://stackoverflow.com/questions/8454510/open-url-in-same-window-and-in-same-tab
// // https://www.geeksforgeeks.org/open-a-link-without-clicking-on-it-using-javascript/
// // window.location.replace("https://www.youtube.com/watch?v=94AZ3FhVdpM");
// // window.location.href("https://www.youtube.com/watch?v=94AZ3FhVdpM");
// // If you have your pages inside "frame" then "Window.open('logout.aspx','_self')" will be redirected inside same frame.
// // window.open('https://www.youtube.com/watch?v=94AZ3FhVdpM','_self'); 
// // window.open('https://www.youtube.com/watch?v=94AZ3FhVdpM','_top'); 

// class Router {
//     constructor() {
//         this.routes = [];
//     }

//     get(uri, callback) {
//         // ensure that the parameters are not empty
//         if (!uri || !callback) throw new Error('uri or callback must be given');

//         // ensure that the parameters have the correct types
//         if (typeof uri !== "string") throw new TypeError('typeof uri must be a string');
//         if (typeof callback !== "function") throw new TypeError('typeof callback must be a function');

//         // throw an error if the route uri already exists to avoid confilicting routes
//         this.routes.forEach(route => {
//             if (route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
//         })

//         // Step 5 - add route to the array of routes
//         const route = {
//             uri, // in javascript, this is the same as uri: uri, callback: callback, avoids repition
//             callback
//         }
//         this.routes.push(route);
//     }

//     init() {
//         this.routes.some(route => {
//             let regEx = new RegExp(`^${route.uri}$`); // converted route.uri to a regular expression because we'd want to match the exact value of the route.uri
//             let path = window.location.pathname;

//             if (path.match(regEx)) {
//                 // our route logic is true, return the corresponding callback

//                 let req = {
//                     path
//                 } // i'll also explain this code below
//                 return route.callback.call(this, req);
//             }
//         })
//     }
// }

// const router = new Router();

// router.get('/', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/index.html");
// });
// router.get('/slider-main', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/slider-main.html");
// }); 
// router.get('/slider-sub', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/slider-sub.html");
// });
// router.get('/analysis-main', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/analysis-main.html");
// }); 
// router.get('/analysis-sub', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/analysis-sub.html");
// });
// router.get('/pollution-main', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/pollution-main.html");
// }); 
// router.get('/pollution-sub', function(){
//     console.log("called")
//     window.location.replace("http://127.0.0.1:5500/build/frontend/pollution-sub.html");
// });

// router.init(); // this method will process the logics




function display(uri, from) {
    const rootUrl = 'http://127.0.0.1:80/';
    // const rootUrl = 'http://127.0.0.1:5500/build/frontend/';

    switch (uri) {
        case "index.html":
            window.location.href = `${rootUrl}slider-${from}.html`;
            break;
        case "slider-main.html":
            window.location.href = `${rootUrl}analysis-${from}.html`;
            break;
        case "analysis-main.html":
            // console.log(`${rootUrl}pollution-${from}.html`)
            window.location.href = `${rootUrl}pollution-${from}.html`;
            break;
        default:
            if (from === 'sub')
                window.location.href = `${rootUrl}slider-${from}.html`;
            if (from === 'main')
                window.location.href = `${rootUrl}index.html`;
            break;
    }
}