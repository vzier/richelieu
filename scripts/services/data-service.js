define([
  './services',
  ],
  function (services){
    'use strict';

/**
 * Data Service: This returns d3 compatible transformations / aggregations of data.
 *
 * TODO This api could be more consistent. Next 3 hour chunk, create consistency mapped to columns for each returned set of values. The returns would be akin to month["Body Fat Percentage (%)"]
 */
    services
    .factory('DataService', ['$q', 'DataTransformer', function ($q, DataTransformer){

      var HAS_VALUE = 0.001,
        COLUMNS = {
          BF: "Body Fat Percentage (%)",
          CAFFEINE : "Caffeine (mg)",
          CARBOHYDRATES : "Carbohydrates (mg)",
          PROTEIN : "Protein (g)",
          STEPS : "Steps (count)",
          WEIGHT : "Weight (lb)"
        };

      var COLUMNS_KEYS = Object.keys(COLUMNS);

      var sleep_caffeine = [
      {
        "key" : 'Sleep' ,
        "bar": true,
        "values" : [ [ 1423544459000 , 8.0] , [ 1423630859000 , 7.0] , [ 1423717259000 , 6.5] , [ 1423803659000 , 9] , [ 1423890059000 , 10.5] , [ 1423976459000 , 8.7] , [ 1424062859000 , 9] ]
        },
        {
        "key" : COLUMNS.CAFFEINE,

          "values" : DataTransformer.getWeekFor(COLUMNS.CAFFEINE)
        }
      ];
      var weight_protein = [
        {
          "key" : COLUMNS.WEIGHT,
          "values" : DataTransformer.getWeekFor(COLUMNS.WEIGHT)
        },
        {
          "key" : COLUMNS.PROTEIN,
          bar: true,
          "values" : DataTransformer.getWeekFor(COLUMNS.PROTEIN)
        }
      ];
      var steps_sleep = [
        {
          "key" : 'Steps' ,
          "values" : DataTransformer.getWeekFor(COLUMNS.STEPS)
        },
        {
          "key" : 'Proteins' ,
          bar: true,
          "values" : DataTransformer.getWeekFor(COLUMNS.PROTEIN)
        }
      ];

      function createCumulativeWeek() {
        var arr = [];
        for (var i = COLUMNS_KEYS.length - 1; i >= 0; i--) {
          arr.push({
            "key" : COLUMNS[COLUMNS_KEYS[i]],
            "values" : DataTransformer.getWeekFor(COLUMNS[COLUMNS_KEYS[i]])
          });
        };

        return arr;
      }

      function createMonth() {
        var arr = [];
        for (var i = COLUMNS_KEYS.length - 1; i >= 0; i--) {
          arr.push({
            "key" : COLUMNS[COLUMNS_KEYS[i]],
            "values" : DataTransformer.getDataForX(COLUMNS[COLUMNS_KEYS[i]],30)
          });
        };

        return arr;
      }

      function createRollingMonthlyAverage() {
        var averages = [], v, count, sum;
        for (var i = COLUMNS_KEYS.length - 1; i >= 0; i--) {
          v = DataTransformer.getDataForX(COLUMNS[COLUMNS_KEYS[i]],30),
            count = 0,
            sum = 0.0;

          // only count if item larger than some arbitrarily small number
          for (var j = v.length - 1; j >= 0; j--) {
            if (v[j][1] > HAS_VALUE || COLUMNS_KEYS[i] === "CARBOHYDRATES") {
              sum +=  v[j][1];
              count += 1;
            }
          };

          averages[COLUMNS[COLUMNS_KEYS[i]]] = sum / count;

        };
        return averages;
      }

      function createCumulativeWeekDiff(week, averages){
        var arr = [];

        for (var i = COLUMNS_KEYS.length - 1; i >= 0; i--) {

          arr.push({
            "key" : week[i].key,
            "values" : week[i].values.map(function(v){
              if (v[1] > HAS_VALUE) {
                return [v[0], (v[1]-averages[week[i].key])/ averages[week[i].key]];
              }
              // Else return no diff
              return [v[0], 0];
            })
          });
          // console.log ("Average: "+COLUMNS[COLUMNS_KEYS[i]], averages[COLUMNS[COLUMNS_KEYS[i]]], {
          //   "key" : COLUMNS[COLUMNS_KEYS[i]],
          //   "values" : week[i].values.map(function(v){
          //     if (v[1] > HAS_VALUE) {
          //       return [v[0], averages[COLUMNS[COLUMNS_KEYS[i]]] - v[1]];
          //     }
          //     // Else return no diff
          //     return [v[0], 0];
          //   })});
        };
        return arr;
      }

      var cumulativeWeek = createCumulativeWeek(),
        monthlyAverage = createRollingMonthlyAverage(),
        cumulativeWeekDiff = createCumulativeWeekDiff(cumulativeWeek, monthlyAverage);

      function getCumulativeWeek(callback){
        var deferred = $q.defer();
        setTimeout(function(){
          deferred.resolve(
            cumulativeWeek
          );
        });
        return deferred.promise;
      }

      function getMonth(callback){
        var deferred = $q.defer();
        var monthly = createMonth();
        setTimeout(function(){
          deferred.resolve(
            monthly
          );
        });
        return deferred.promise;
      }

      function getNormalizedMonth(callback){
        var deferred = $q.defer();
        var monthly = createMonth();


        for (var i = monthly.length - 1; i >= 0; i--) {
          // Must find first valid value. Assume that at least one reading was taken in past month
          var first_valid_value;
          for (var j = 0; j < monthly[i].values.length; j++) {
            if (!!monthly[i].values[j][1]){
              first_valid_value = monthly[i].values[j][1];
              break;
            }
          };

          for (var j = 0; j < monthly[i].values.length; j++) {
            if (!monthly[i].values[j][1]){
              // If it's empty, we insert this normal value
              monthly[i].values[j][1] = first_valid_value;
            } else {
              first_valid_value = monthly[i].values[j][1];
            }
          };

        };
        setTimeout(function(){
          deferred.resolve(
            monthly
          );
        });
        return deferred.promise;
      }

      function getSampleData(callback){
        var deferred = $q.defer();
        setTimeout(function(){
          deferred.resolve({
            sleep_caffeine: sleep_caffeine,
            weight_protein: weight_protein,
            steps_sleep: steps_sleep,
            all_steps: DataTransformer.getDataFor(COLUMNS.STEPS),
            testData:       'This is a test.'
          });
        });
        return deferred.promise;
      }

      function getCumulativeWeekDiff(callback){
        var deferred = $q.defer();
        setTimeout(function(){
          deferred.resolve(
            cumulativeWeekDiff
          );
        });
        return deferred.promise;
      }

      return{
        getSampleData: getSampleData,
        getMonth: getMonth,
        getNormalizedMonth: getNormalizedMonth,
        getCumulativeWeek: getCumulativeWeek,
        getCumulativeWeekDiff: getCumulativeWeekDiff
      };
    }]);
});
