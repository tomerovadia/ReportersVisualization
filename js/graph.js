const d3 = require('d3');

export default (svg, container, width, height) => {

  var visualization = container.append('g');

  var colors = {
    "New York Times": "gray",
    "Politico": "darkred",
  }

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const appendPublications = (parent, data) => {
    const publications = parent.selectAll('g.publication')
        .data(data, (d) => d.id)
        .enter()
        .append('g')
        .classed('publication', true)
        .attr('transform', (d, i) => {
          d.fx = (i+3)**5;
          d.fy = 250;
          return `translate(${(i+3)**5}, 250)`;
        })

    appendCirclesToPublications(publications);

    return publications;
  }

  const appendCirclesToPublications = (publications) => {
    return publications
        .append('circle')
        .style('fill', (d) => d.color)
        .attr('r', 80)
        .style('stroke', 'black')
        .style('stroke-width', 2);
  }

  d3.json("data.json", function(error, graph) {

    const publications = appendPublications(visualization, graph.publications)



    var publicationNames = publications.append('text')
            .text((d) => d.id)
            .style('font-family', 'Arial')
            .style("font-size", "15px")
            .style("fill", "white")
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .style("text-shadow", "1px 1px 2px black");

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

    graph.reporters.forEach((reporter) => {
      samePublicationLinks.push({"source": reporter.id, "target": reporter.publication, "value": 20, color: colors[reporter.publication] })
    })

    graph.employments.forEach((employment) => {
      samePublicationLinks.push({"source": employment.reporter, "target": employment.publication, "value": 250, color: colors[employment.publication] })
    })

    let links = samePublicationLinks.concat(oldPublicationLinks);

    const calculateStrokeWidth = () => (d) => {
      return d.value > 200 ? 0.8 : 2.3;
    }

    var link = visualization.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
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
        .links(links)
        .distance((d) => d.value)
        .strength(1);

    function ticked() {

      publications
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

      link
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
