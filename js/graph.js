const d3 = require('d3');
import { appendPublications } from './circles.js'

export default (svg, container, width, height) => {

  var visualization = container.append('g');

  var colors = {
    "New York Times": "gray",
    "Politico": "darkred",
  }

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-3000))


  const createCurrentEmploymentLinks = (data) => {
    return data.map((reporter) => {
      return {
        source: reporter.id,
        target: reporter.publication,
        value: 20,
        color: colors[reporter.publication]
      };
    });
  }


  const createPreviousEmploymentsLinks = (data) => {
    return data.map((employment) => {
      return {
        source: employment.reporter,
        target: employment.publication,
        value: 250,
        color: colors[employment.publication]
      };
    })
  }


  d3.json("data.json", function(error, graph) {

    const publications = appendPublications(svg, visualization, graph);

    if (error) throw error;

    const linkData = createCurrentEmploymentLinks(graph.reporters)
                  .concat(createPreviousEmploymentsLinks(graph.employments));

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

    var nodes = visualization
      .selectAll("g.nodes")
      .data(graph.reporters)
      .enter()
      .append("g")
        .attr("class", "nodes")

    var circles = nodes
        .append("circle")
          .attr("r", 20)
          .style("stroke", function(d) { return colors[d.publication]; })
          .style("stroke-width", 3)
          .attr("fill", function(d){ return `url('#${d.id}')` } )


    var reporterNames = nodes
         .append('text')
           .text((d) => d.id)
           .style('font-family', 'Arial')
           .style("font-size", "12px")
           .style("font-weight", "600")
           .attr("text-anchor", "middle")
           .style("text-shadow", "1px 1px 2px white")
           .attr("transform", "translate(0,35)");

    nodes
          .on("mouseover", function(){
            d3.select(this).select('circle').style("stroke", "yellow")
          })
          .on("mouseout", function(){ d3.select(this).select('circle').style("stroke", function(d) { return colors[d.publication]; })})

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

    circles.append("title")
        .text(function(d) { return d.id; });

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
