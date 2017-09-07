const d3 = require('d3');
var introJs = require("intro.js");
import renderGraph from './graph';

var width = 5000,
  height = 5000;

var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

// var drag = d3.drag()
//     // .origin(function(d) { return d; })
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended);

var svg = d3.select("body").append("svg")
    .classed('svg', true)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .classed('viewport', true)
    // .attr('transform', 'translate(' + -1600 + ',' + -600 + ')')
    .attr('transform', 'translate(' + height*(-2/5) + ',' + width*(-2/5) + ')')
    // .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);

var rect = svg.append("rect")
    .classed('rect', true)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

var container = svg.append("g").classed('container', true);

container.append("g")
    .attr("class", "x axis")
  .selectAll("line")
    .data(d3.range(0, width, 10))
  .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d; })
    .attr("y2", height);

container.append("g")
    .attr("class", "y axis")
  .selectAll("line")
    .data(d3.range(0, height, 10))
  .enter().append("line")
    .attr("x1", 0)
    .attr("y1", function(d) { return d; })
    .attr("x2", width)
    .attr("y2", function(d) { return d; });

// d3.tsv("dots.tsv", dottype, function(error, dots) {
//   dot = container.append("g")
//       .attr("class", "dot")
//     .selectAll("circle")
//       .data(dots)
//     .enter().append("circle")
//       .attr("r", 5)
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; })
//       .call(drag);
// });

// function dottype(d) {
//   d.x = +d.x;
//   d.y = +d.y;
//   return d;
// }

function zoomed() {
  // container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  container.attr("transform", d3.event.transform);
}

// function dragstarted(d) {
//   d3.event.sourceEvent.stopPropagation();
//   d3.select(this).classed("dragging", true);
// }
//
// function dragged(d) {
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }
//
// function dragended(d) {
//   d3.select(this).classed("dragging", false);
// }

renderGraph(svg, container, width, height);

setTimeout(() => {
  introJs.introJs().setOptions({
    exitOnOverlayClick: true,
    showStepNumbers: false,
    showProgress: true,
    steps: [
      {intro: "<div style='font-size:15px;'><h3><b>Journalist Graph</b></h3>This visualization depicts relationships between journalists.<br><br>It's a work in progress, so please send me feedback at <b>tomerbovadia@gmail.com</b>. <br><br>May I take you on a tour?<br><br><i>-Tomer Ovadia</i><br><br></div>"},
      {
        intro: '<b>Large circles</b> are media outlets.',
        element: document.querySelector('#PoliticoPublication')
      },
      {
        intro: 'Small circles are journalists.',
        element: document.querySelector('#GlennThrushNode')
      },
      {
        intro: 'Thick, short lines connect journalists to their <i>current</i> media outlets.',
        element: document.querySelector('#JakeShermanPoliticoLink')
      },
      {
        intro: 'Thin, long lines connect journalists to their <i>former</i> media outlets.',
        element: document.querySelector('#JamesHohmannPoliticoLink')
      },
      {intro: "That should be enough to get you started. Enjoy!"},
    ]
  }).start();
}, 3000)
