define([
  './directives'
],
function (directives) {
  'use strict';
//---------------------------------------------------
// BEGIN code for this directive
//---------------------------------------------------

directives.directive('vzBarchart', [function (){
  /* TODO http://jsfiddle.net/nicooprat/GDdtS/ */
  /* TODO https://material.angularjs.org/#/layout/container */
  return {
    restrict: 'E',
    replace: true,
    scope:{
      data: '='
    },
    link: function(scope, element, attrs) {
      var margin = {top: 30, right: 10, bottom: 10, left: 10},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x = d3.scale.linear()
          .range([0, width])

      var y = d3.scale.ordinal()
          .rangeRoundBands([0, height], .2);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("top");

      var svg = d3.select(element).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.tsv("data.tsv", type, function(error, data) {
        x.domain(d3.extent(data, function(d) { return d.value; })).nice();
        y.domain(data.map(function(d) { return d.name; }));

        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
            .attr("x", function(d) { return x(Math.min(0, d.value)); })
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
            .attr("height", y.rangeBand());

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
          .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

      });

      function type(d) {
        d.value = +d.value;
        return d;
      }

    }
  };
}])
.directive('card', [function (){
  /* TODO http://jsfiddle.net/nicooprat/GDdtS/ */
  /* TODO https://material.angularjs.org/#/layout/container */
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'partial/sample-directive.html',
    scope:{
      data: '='
    },
    link: function(scope, element, attrs) {

    }
  };
}]).directive('vzClock', [function (){
  return {
    restrict: 'AE',
    replace: true,
    link: function(scope, element, attrs) {
      element.attr("style", "background: black");
      element.attr("style", "height: 400");
var width = 360,
    height = 360,
    radius = Math.min(width, height) / 1.9,
    spacing = .09;

var formatSecond = d3.time.format("%S s"),
    formatMinute = d3.time.format("%M m"),
    formatHour = d3.time.format("%H h"),
    formatDay = d3.time.format("%a"),
    formatDate = d3.time.format("%d d"),
    formatMonth = d3.time.format("%b");

var color = d3.scale.linear()
    .range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
    .interpolate(interpolateHsl);

var arc = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; });

var svg = d3.selectAll(element).append("svg")
    .attr("preserveAspectRatio", "xMidYMin slice")
    .attr("style", "width: 100%; padding-bottom: 92%; height: 1px; overflow: visible")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var field = svg.selectAll("g")
    .data(fields)
  .enter().append("g");

field.append("path");

field.append("text");

d3.transition().duration(0).each(tick);

d3.select(self.frameElement).style("height", height + "px");

function tick() {
  field = field
      .each(function(d) { this._value = d.value; })
      .data(fields)
      .each(function(d) { d.previousValue = this._value; });

  field.select("path")
    .transition()
      .ease("elastic")
      .attrTween("d", arcTween)
      .style("fill", function(d) { return color(d.value); });

  field.select("text")
      .attr("dy", function(d) { return d.value < .5 ? "-.5em" : "1em"; })
      .text(function(d) { return d.text; })
    .transition()
      .ease("elastic")
      .attr("transform", function(d) {
        return "rotate(" + 360 * d.value + ")"
            + "translate(0," + -(d.index + spacing / 2) * radius + ")"
            + "rotate(" + (d.value < .5 ? -90 : 90) + ")"
      });

  setTimeout(tick, 1000 - Date.now() % 1000);
}

function arcTween(d) {
  var i = d3.interpolateNumber(d.previousValue, d.value);
  return function(t) { d.value = i(t); return arc(d); };
}

function fields() {
  var now = new Date;
  return [
    {index: .7, text: formatSecond(now), value: now.getSeconds() / 60},
    {index: .6, text: formatMinute(now), value: now.getMinutes() / 60},
    {index: .5, text: formatHour(now),   value: now.getHours() / 24},
    {index: .3, text: formatDay(now),    value: now.getDay() / 7},
    {index: .2, text: formatDate(now),   value: (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())},
    {index: .1, text: formatMonth(now),  value: now.getMonth() / 12}
  ];
}

// Avoid shortest-path interpolation.
function interpolateHsl(a, b) {
  var i = d3.interpolateString(a, b);
  return function(t) {
    return d3.hsl(i(t));
  };
}

    }
  };
}]);

//---------------------------------------------------
// END code for this directive
//---------------------------------------------------
});
