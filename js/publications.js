const d3 = require('d3');

export const appendPublications = (svg, visualization, data, width, height) => {
  const publications = visualization.selectAll('g.publication')
      .data(data.publications, (d) => d.id)
      .enter()
      .append('g')
      .attr('id', (d) => d.id)
      .classed('publication', true)
      .attr('id', (d) => `${d.id}Publication`)
      .attr('transform', 'translate(' + height*(-2/5) + ',' + width*(-2/5) + ')');
      // .attr('fx', 2500)
      // .attr('fy', 2500)
      // .attr('transform', (d, i) => {
      //   d.x = (i+3)**5;
      //   d.y = 250;
      //   return `translate(${(i+3)**5}, 250)`;
      // })

  prepareCircleImages(svg, data);
  appendCirclesToPublications(publications);
  appendTextToPublications(publications);

  // d3.select('#PoliticoPublication')
  //     .attr('data-intro', 'Large circles are publications.')
  //     .attr('data-step', 1);

  return publications;
}

const appendCirclesToPublications = (publications) => {
  return publications
      .append('circle')
      .style('fill', (d) => d.color)
      .attr('r', 30)
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .attr("fill", function(d){ return `url('#${d.id}')` } );
}

const appendTextToPublications = (publications) => {
  return publications.append('text')
      .text((d) => d.id)
      .style('font-family', 'Arial')
      .style("font-size", "9px")
      .style("fill", (d) => d.textColor || "white")
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .style("text-shadow", (d) => d.textShadowColor ? `1px 1px 2px ${d.textShadowColor}` : "1px 1px 2px black");
}

const prepareCircleImages = (svg, data) => {
  const defs = svg.append("defs").attr("id", "imgdefs");

  const patterns = defs
      .selectAll('pattern')
      .data(data.reporters.concat(data.publications))
      .enter()
      .append("pattern")
        .attr("id", function(d){ return d.id } )
        .attr("height", 1)
        .attr("width", 1)
        .attr("viewBox", "0 0 100 100")
        .attr("preserveAspectRatio", "none")
        .attr("x", "0")
        .attr("y", "0");

  patterns
      .append("image")
        .attr("preserveAspectRatio", "none")
        .attr("height", 100)
        .attr("width", 100)
        .attr("xlink:href", function(d){ return d.img_url});
}
