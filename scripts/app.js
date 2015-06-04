/**
 * loads sub modules and wraps them up into the main module
 */
define([
  // Libraries
  'domReady',
  'angular',
  'angular-route',
  'ngstorage',

  // External modules
  'nvd3ChartDirectives', // This is dirty. Pull Request: http://bit.ly/1BaBv33

  // Core modules
  'services/services',
  'controllers/controllers',
  'filters/filters',
  'directives/directives',
  'filters/ngFilterAdapter',

  // Services
  'services/qs-access', // Not checked in intentionally
  'services/transformers',
  'services/data-service',

  // Contollers
  'controllers/weekly-controller',
], function (domReady, ng) {
  'use strict';

  var app = ng.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.filters',
    'app.services',
    'nvd3ChartDirectives',
    'ngStorage'
  ]);

  // Kickstart application
  function bootstrap(){
    domReady(function (document) {
      ng.bootstrap(document, ['app']);
    });
  }

  return {
    bootstrap: bootstrap,
    getNgModule: function(){ return app; }
  };
});
