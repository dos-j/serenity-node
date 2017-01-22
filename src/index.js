import router from './router';
import serenity from 'serenitydi';
import express from 'express';

const expressApp = express();

/**
 *
 * @param config - object
 * @example 
 * app({
 *  routes,
 *  services
 * });
 */
export default function(config) {
  const {
    routes,
    services
  } = config;

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
}
