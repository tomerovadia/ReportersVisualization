const d3 = require('d3');
import { appendPublications } from './publications.js'
import { appendJournalists } from './journalists.js'
import { createLinks } from './links.js'

const getPublicationColors = (data) => {
  const publicationColors = {};
  data.publications.map( (publication) => publicationColors[publication.id] = publication.color );
  return publicationColors;
}


export default (svg, container, width, height) => {

  const visualization = container.append('g');

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-3000))

  d3.json("data.json", function(error, graph) {

    const publicationColors = getPublicationColors(graph);

    const publications = appendPublications(svg, visualization, graph);

    if (error) throw error;

    const linkData = createLinks(graph, publicationColors);

    const calculateStrokeWidth = () => (d) => {
      return d.value > 200 ? 0.8 : 2.3;
    }

    var links = visualization.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(linkData)
      .enter().append("line")
        .attr("stroke-width", calculateStrokeWidth())
        .style("stroke", (d) => d.color);

    const nodes = appendJournalists(visualization, graph, publicationColors);

    nodes
      .call(d3.drag()
          .on("start", nodedragstarted)
          .on("drag", nodedragged)
          .on("end", nodedragended));


    // publications
    //   .call(d3.drag()
    //       .on("start", nodedragstarted)
    //       .on("drag", nodedragged)
    //       .on("end", nodedragended));

    simulation
        .nodes(graph.reporters.concat(graph.publications))
        .on("tick", ticked);


    simulation.force("link")
        .links(linkData)
        .distance((d) => d.value)
        .strength(1);

    function ticked() {

      publications
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.fx; })
        .attr("y2", function(d) { return d.target.fy; });

      nodes
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

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
