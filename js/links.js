const d3 = require('d3');

export const prepareLinkData = (data, publicationColors) => {
  return createCurrentEmploymentLinks(data.reporters, publicationColors)
                .concat(createPreviousEmploymentsLinks(data.employments, publicationColors));
}

export const appendLinks = (visualization, linkData) => {
  const links = visualization.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(linkData)
    .enter().append("line")
      .attr("stroke-width", calculateStrokeWidth())
      .style("stroke", (d) => d.color)
      .attr('id', (d) => {
        return `${d.source.split(' ').join('')}${d.target.split(' ').join('')}Link`;
      });

    d3.select('#JakeShermanPoliticoLink')
      .attr('data-intro', 'Thick, short lines connect journalists to their current publications.')
      .attr('data-step', 3);

    d3.select('#JamesHohmannPoliticoLink')
      .attr('data-intro', 'Thin, long lines connect journalists to their former publications.')
      .attr('data-step', 4);

    return links;
}


const createCurrentEmploymentLinks = (reporters, publicationColors) => {
  return reporters.map((reporter) => {
    return {
      source: reporter.id,
      target: reporter.publication,
      value: 50,
      color: publicationColors[reporter.publication],
      current: true,
    };
  });
}


const createPreviousEmploymentsLinks = (employments, publicationColors) => {
  return employments.map((employment) => {
    return {
      source: employment.reporter,
      target: employment.publication,
      value: 150,
      color: publicationColors[employment.publication],
      current: false,
    };
  })
}

const calculateStrokeWidth = () => (d) => {
  return d.value > 60 ? 0.8 : 3;
}
