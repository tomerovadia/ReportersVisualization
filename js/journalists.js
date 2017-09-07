const d3 = require('d3');


export const appendJournalists = (visualization, data, publicationColors, width, height) => {

  const nodes = visualization
      .selectAll("g.nodes")
      .data(data.reporters, (d) => d.id)
      .enter()
      .append("g")
        // .attr('fx', 2500)
        // .attr('fy', 2500)
        .attr('id', (d) => `${d.id.split(' ').join('')}Node`)
        .attr("class", "nodes")
        .attr('transform', 'translate(' + height*(-2/5) + ',' + width*(-2/5) + ')');

  const circles = appendCircles(nodes, publicationColors);

  setListenersForCircleHighlighting(nodes, publicationColors);

  // Hover text
  circles.append("title")
            .text(function(d) { return d.id; });

  appendTextToJournalists(nodes);

  return nodes;
}




const appendCircles = (nodes, publicationColors) => {
  return nodes
      .append("circle")
        .attr("r", 10)
        .style("stroke", function(d) { return publicationColors[d.publication]; })
        .style("stroke-width", 1.5)
        .attr("fill", function(d){ return `url('#${d.id}')` } );
}



const setListenersForCircleHighlighting = (nodes, publicationColors) => {
  nodes
      .on("mouseover", function(){
        d3.select(this).select('circle').style("stroke", "yellow")
      })
      .on("mouseout", function(){
        d3.select(this).select('circle').style("stroke", (d) => publicationColors[d.publication] )
      });
}



const appendTextToJournalists = (nodes) => {
  return nodes
       .append('text')
         .text((d) => d.id)
         .style('font-family', 'Roboto')
         .style("font-size", "9px")
         .style("font-weight", "700")
         .attr("text-anchor", "middle")
         .style("text-shadow", "1px 1px 2px white")
         .attr("transform", "translate(0,20)");
}
