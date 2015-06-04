define([
  './controllers'
  ], function (controllers) {
    'use strict';

    controllers.controller('weeklyCtrl',
      ['$scope', '$routeParams', 'DataService', '$sce', '$timeout', 'DataTransformer', '$log', '$window',
      function ($scope, $routeParams, DataService, $sce, $timeout, DataTransformer, $log, $window) {

    // ********************************************************
    //
    //  Initialization
    //
    //

    function syncData() {
      // Initialize data from Data Service
      DataService.getSampleData().then(function(dataSet){
        $scope.sampleData = dataSet;
      });

      DataService.getCumulativeWeek().then(function(d){
        // Get the week's raw data
        $scope.weekData = d;
      });

      DataService.getCumulativeWeekDiff().then(function(d){
        // Get Cumulative Week Diff. This allows us to plot them together
        $scope.weekDiff = d;
        $scope.weeklyDiff = $scope.weekDiff.map(function(d) {return [d]; }).reverse();;
      });

      DataService.getMonth().then(function(d){
        // Get Monthly Data sorted individually
        $scope.monthly = d;
      });

      DataService.getNormalizedMonth().then(function(d){
        // Since I don't meausre my weight every day, I use a normalized month in the sparkline
        $scope.normalized_month = d;
      })
    }

    // ********************************************************
    //
    //  Initialization
    //
    //

    // Initialize ghetto clock
    $scope.clock = "Loading…"
    var TICK_INTERVAL = 1000; // ms. 1000 ms
    var tick = function (){
      $scope.clock = Date.now();
      $timeout(tick, TICK_INTERVAL);
    }
    $timeout(tick, 0);

    $scope.colors = ['#fc8d59', '#91cf60'];

    $scope.qsData = '';

    $scope.updateQS = function () {
      DataTransformer.updateData($scope.qsData);
      $timeout($scope.reload, 1000);
    };

    $scope.clearQS = function () {
      DataTransformer.updateData('a');
      $timeout($scope.reload, 1000);
    };

    syncData();

    $scope.reload = function() {
      $window.location.reload();
    }

    // ********************************************************
    //
    // Display functions
    //
    //

    $scope.yFunction = function(){
      return function(d){
        return d[1];
      };
    }

    $scope.xFunction = function(){
      return function(d){
        return d[0];
      };
    }

    $scope.createPercentageString = function(diff_array){
      if (!diff_array) {return $sce.trustAsHtml("0");};
      var total = diff_array[0].values.reduce(function (a,b, i) { return a + b[1]; }, 0);
      var returned_str = "" + (total / 7 * 100).toFixed(0) + "%";
      if (total < 0)
        returned_str = " &#x2193; " + returned_str;
      else
        returned_str = " &#x2191; " + returned_str;
      return $sce.trustAsHtml(returned_str);


    }

    $scope.xAxisTickFormat = function(){
      return function(d){
        return d3.time.format('%x')(new Date(d));
      }
    };

    $scope.percentageTickFormat = function (){
      return function (d){
        return parseInt(d*100);
      }
    };

    $scope.axisFloatFormat = function(){
      return function(d){ return d3.format(',f')(d); }
    };

    $scope.axisMgFormat = function(){
      return function(d){
        return d3.format(',f')(d) + 'mg';
      }
    };

    $scope.axisGFormat = function(){
      return function(d){
        return d3.format(',f')(d) + 'g';
      }
    };

  }]);
});
