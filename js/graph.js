const d3 = require('d3');

export default (svg, container, width, height) => {

  var visualization = container.append('g');

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("reporters.json", function(error, graph) {

    if (error) throw error;

    var defs = svg.append("defs").attr("id", "imgdefs")

    var patterns = defs.selectAll('pattern')
                    .data(graph.reporters)
                    .enter()
                    .append("pattern")
                    .attr("id", function(d){ return d.id } )
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("viewBox", "0 0 100 100")
                    .attr("preserveAspectRatio", "none")
                    .attr("x", "0")
                    .attr("y", "0");

    patterns.append("image")
          .attr("preserveAspectRatio", "none")
          .attr("height", 100)
          .attr("width", 100)
          .attr("xlink:href", function(d){ return d.img_url})

    let samePublicationLinks = [];
    let oldPublicationLinks = [];

    graph.reporters.forEach((reporter1) => {
      graph.reporters.forEach((reporter2) => {
        if(reporter1.id !== reporter2.id && reporter1.publication === reporter2.publication){
          samePublicationLinks.push({"source": reporter1.id, "target": reporter2.id, "value": 250})
        }
      })
    })

    graph.reporters.forEach((reporter) => {
      graph.employments.forEach((employment) => {
        if(reporter.publication === employment.publication){
          oldPublicationLinks.push({"source": reporter.id, "target": employment.reporter, "value": 400})
        }
      })
    })

    let links = samePublicationLinks.concat(oldPublicationLinks);

    const calculateStrokeWidth = () => (d) => {
      return d.value > 300 ? 0.5 : 1.5;
    }

    var link = visualization.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", calculateStrokeWidth());

    var nodes = visualization
      .selectAll("g.nodes")
      .data(graph.reporters)
      .enter()
      .append("g")
      .attr("class", "nodes")

    var circles = nodes
        .append("circle")
          .attr("r", 30)
          .style("stroke", function(d) { return color(d.publication); })
          .style("stroke-width", 3)
          .attr("fill", function(d){ return `url('#${d.id}')` } )

    var reporterNames = nodes
         .append('text')
         .text((d) => d.id)
         .style('font-family', 'Arial')
         .style("font-size", "12px")
         .style("font-weight", "600")
         .attr("transform", "translate(-27,42)");

    nodes
          .on("mouseover", function(){
            d3.select(this).select('circle').style("stroke", "yellow")
          })
          .on("mouseout", function(){ d3.select(this).select('circle').style("stroke", function(d) { return color(d.publication); })})

    nodes
      .call(d3.drag()
          .on("start", nodedragstarted)
          .on("drag", nodedragged)
          .on("end", nodedragended));

    circles.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.reporters)
        .on("tick", ticked);

    simulation.force("link")
        .links(links)
        .distance((d) => d.value);

    function ticked() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      nodes
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

      // circles
      //   .attr("cx", function(d) { return d.x; })
      //   .attr("cy", function(d) { return d.y; });
    }
  });

  function nodedragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function nodedragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function nodedragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

}









//
//
//
// const d3 = require('d3');
//
// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");
//
// var color = d3.scaleOrdinal(d3.schemeCategory20);
//
// var simulation = d3.forceSimulation()
//     .force("link", d3.forceLink().id(function(d) { return d.id; }))
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(width / 2, height / 2));
//
// d3.json("miserables.json", function(error, graph) {
//   if (error) throw error;
//
//   var link = svg.append("g")
//       .attr("class", "links")
//     .selectAll("line")
//     .data(graph.links)
//     .enter().append("line")
//       .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
//
//   var node = svg.append("g")
//       .attr("class", "nodes")
//     .selectAll("circle")
//     .data(graph.nodes)
//     .enter().append("circle")
//       .attr("r", 10)
//       .attr("fill", function(d) { return color(d.publication); })
//       .call(d3.drag()
//           .on("start", dragstarted)
//           .on("drag", dragged)
//           .on("end", dragended));
//
//   node.append("title")
//       .text(function(d) { return d.id; });
//
//   simulation
//       .nodes(graph.nodes)
//       .on("tick", ticked);
//
//   simulation.force("link")
//       .links(graph.links);
//
//   function ticked() {
//     link
//         .attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });
//
//     node
//         .attr("cx", function(d) { return d.x; })
//         .attr("cy", function(d) { return d.y; });
//   }
// });
//
// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.3).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }
//
// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }
//
// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
// }
