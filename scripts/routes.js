/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
  'use strict';
  return app.getNgModule().config(['$routeProvider', function ($routeProvider) {
    // This is currently deprecated
    // TODO: Use ui-router
  }]);
});
