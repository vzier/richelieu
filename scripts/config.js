requirejs.config({
  appDir: '.',
  baseUrl: 'scripts',
  // Set paths
  paths:{
    'angular':              ['../bower_components/angular/angular.min'],
    'angular-route':        ['../bower_components/angular-route/angular-route.min'],
    'bootstrap':            ['../vendor/bootstrap-3.0.1/js/bootstrap.min'],
    'd3':                   ['../bower_components/d3/d3.min'],
    'domReady':             ['../bower_components/requirejs-domready/domReady'],
    'jquery':               ['../vendor/jquery-1.10.2/jquery.min'],
    'nvd3':                 ['../bower_components/nvd3/build/nv.d3'], // Dirty. Updated showValue for Sparkline
    'nvd3ChartDirectives':  ['../bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives'], // This is dirty. Pull Request: http://bit.ly/1BaBv33
    'ngstorage':            ['../bower_components/ngstorage/ngStorage.min']

  },
  // Set dependencies
  shim: {
    'angular':              {exports: 'angular'},
    'angular-route':        ['angular'],
    'bootstrap':            ['jquery'],
    'ngstorage':            ['angular'],
    'nvd3':                 ['d3'],
    'nvd3ChartDirectives':  ['angular', 'nvd3']
  }
});
