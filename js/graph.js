const d3 = require('d3');
import { appendPublications } from './publications.js';
import { appendJournalists } from './journalists.js';
import { appendLinks, prepareLinkData } from './links.js';

const getPublicationColors = (data) => {
  const publicationColors = {};
  data.publications.map( (publication) => publicationColors[publication.id] = publication.color );
  return publicationColors;
}

export default (svg, container, width, height) => {

  const visualization = container.append('g')
    .classed('visualization', true);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }) )
      .force("charge", d3.forceManyBody().strength(-5000) )
      .force("center", d3.forceCenter(width/2, height/2) );


  d3.json("data.json", function(error, graph) {

    const publicationColors = getPublicationColors(graph);

    const publications = appendPublications(svg, visualization, graph, width, height);

    if (error) throw error;

    const linkData = prepareLinkData(graph, publicationColors);

    const links = appendLinks(visualization, linkData);

    const nodes = appendJournalists(visualization, graph, publicationColors, width, height);

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

    simulation
        .force("link")
        .links(linkData)
        .distance((d) => d.value)
        .strength((d) => d.current === true ? 3 : 1);

    simulation.velocityDecay(0.2);



    // var publicationSimulation = d3.forceSimulation(graph.publications)
    //     .force("charge", d3.forceManyBody().strength(3000) );




    function ticked() {

      publications
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      nodes
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

    }

  });

  function nodedragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.01).restart();
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
