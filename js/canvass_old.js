const d3 = require('d3');
import renderGraph from './graph';

// var margin = {top: -5, right: -5, bottom: -5, left: -5},
    var width = 5000,
      height = 5000;
    // width = window.screen.availWidth - margin.left - margin.right,
    // height = window.screen.availHeight - margin.top - margin.bottom;

var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

// var drag = d3.drag()
//     // .origin(function(d) { return d; })
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    // .attr('transform', 'translate(' + height*(-2/5) + ',' + width*(-2/5) + ')')
    .attr('transform', 'translate(600,500)')
    .classed('viewport', true)
    .call(zoom);

var rect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

var container = svg.append("g")
  .classed('container', true)

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

// function dottype(d) {
//   d.x = +d.x;
//   d.y = +d.y;
//   return d;
// }

function zoomed() {
  console.log('zoomed')
  container.attr("transform", d3.event.transform);
}

// function dragstarted(d) {
//   console.log('dragstarted')
//   d3.event.sourceEvent.stopPropagation();
//   d3.select(this).classed("dragging", true);
// }
//
// function dragged(d) {
//   console.log('dragged')
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }
//
// function dragended(d) {
//   console.log('dragended')
//   d3.select(this).classed("dragging", false);
// }


// renderGraph(svg, container, width, height);
