define([
  './services'
  ],
  function (services){
    'use strict';

/**
 * Data Transformer: abstracts how to get data from different data sources. Returns arrays of d3 formatted array-tuples
 */
  services.factory('DataTransformer', ['$q', 'qsAcess', '$localStorage',
    function ($q, qsAcess, $localStorage) {
    var dataTransformer = {};
    var internal_data = null;

    if($localStorage.qsAccess){
      internal_data = d3.csv.parse($localStorage.qsAccess);
    }
    else {
      internal_data = d3.csv.parse(qsAcess);
    }

    function timeof(str) {
      var t = new Date(str)
      return t.getTime();
    }

    dataTransformer.updateData = function (str) {
      internal_data = d3.csv.parse(str);
      $localStorage.qsAccess = str;
    };

    dataTransformer.clearData = function(){
      $localStorage.qsAccess = '';
    };

    dataTransformer.getData = function () {
      return internal_data;
    };

    dataTransformer.getDataFor = function (typeName) {
      return internal_data.map(function (d) {
        return [timeof(d.Start).valueOf(), parseFloat(d[typeName])];
      });
    };

    dataTransformer.getWeekFor = function(typeName) {
      return internal_data.slice(-7).map( function (d) {
        return [timeof(d.Start), d[typeName]];
      });
    };

    // Technically, this is 30 days
    dataTransformer.getDataForX = function(typeName, days) {
      return internal_data.slice(-1 * days).map( function (d) {
        return [timeof(d.Start).valueOf(), parseFloat(d[typeName])];
      });
    };
    return dataTransformer;
  }]);
});
