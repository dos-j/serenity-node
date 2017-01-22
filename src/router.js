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
export default function router(di, express, routes) {
  
  for (const route in routes) {
    const routeExecutor = executeRoute.bind(this, di, routes[route]);

    const [
      method,
      uri
    ] = route.split(' ').map(item => item.toLowerCase());

    express[method](uri, routeExecutor);
  }
}

function executeRoute(di, dependency, ...args) {
  const routeHandler = di.fetch(dependency);
  routeHandler(...args);
}
