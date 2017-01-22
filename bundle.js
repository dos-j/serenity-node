'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var serenity = _interopDefault(require('serenitydi'));
var express = _interopDefault(require('express'));

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * The router is the start of all things serenity-node, each time we
 * receive a new request, it will have looked up a route from the specified
 * routes and will attempt to match to the dependency associated and invoke it 
 * as a function.
 *
 * @param di - the serenity instance to be used for dependencies
 * @param express - the express instance to use
 * @param routes {Object} - Key/Val store of route/dependency.
 */
function router(di, express$$1, routes) {

  for (var route in routes) {
    var routeExecutor = executeRoute.bind(this, di, routes[route]);

    var _route$split$map = route.split(' ').map(function (item) {
      return item.toLowerCase();
    }),
        _route$split$map2 = slicedToArray(_route$split$map, 2),
        method = _route$split$map2[0],
        uri = _route$split$map2[1];

    express$$1[method](uri, routeExecutor);
  }
}

function executeRoute(di, dependency) {
  var routeHandler = di.fetch(dependency);

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  routeHandler.apply(undefined, args);
}

var expressApp = express();

/**
 *
 * @param config - object
 * @example 
 * app({
 *  routes,
 *  services
 * });
 */
var index = function (config) {
  var routes = config.routes,
      services = config.services;


  if (!routes) {
    throw new Error('Serenity config had no property "routes". The routes should be a key value object of route:serenityDependencyFunc');
  }

  if (!services) {
    throw new Error('Serenity config had no property "services". Your root services file should be a function which registers dependencies with serenity');
  }

  //register the dependencies
  services(serenity);

  //bind the routes to our dependencies
  router(serenity, expressApp, routes);

  return expressApp;
};

module.exports = index;
