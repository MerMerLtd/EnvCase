// https://dev.to/kodnificent/how-to-build-a-router-with-vanilla-javascript-2a18
class Router {
    constructor() {
        this.routes = [];
    }

    get(uri, callback) {
        // ensure that the parameters are not empty
        if (!uri || !callback) throw new Error('uri or callback must be given');

        // ensure that the parameters have the correct types
        if (typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if (typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        // throw an error if the route uri already exists to avoid confilicting routes
        this.routes.forEach(route => {
            if (route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        })

        // Step 5 - add route to the array of routes
        const route = {
            uri, // in javascript, this is the same as uri: uri, callback: callback, avoids repition
            callback
        }
        this.routes.push(route);
    }

    init() {
        this.routes.some(route => {
            let regEx = new RegExp(`^${route.uri}$`); // converted route.uri to a regular expression because we'd want to match the exact value of the route.uri
            let path = window.location.pathname;

            if (path.match(regEx)) {
                // our route logic is true, return the corresponding callback

                let req = {
                    path
                } // i'll also explain this code below
                return route.callback.call(this, req);
            }
        })
    }
}

const router = new Router();

// the get() method would store the '/' logic and callback in an array;
router.get('/', function(){
   // code to be executed if '/' is matched
});

// here get() method would push '/another-page' and the callback to the existing array
router.get('/another-page', function(){
   // code to be executed if '/another-page' is matched
}); 

router.init(); // this method will process the logics