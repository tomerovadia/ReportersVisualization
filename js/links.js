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
      .attr("stroke-width", calculateStrokeWidth)
      .attr('class', calculateStrokeType)
      .style("stroke", (d) => d.color)
      .attr('id', (d) => {
        return `${d.source.split(' ').join('')}${d.target.split(' ').join('')}Link`;
      });

    return links;
}


const createCurrentEmploymentLinks = (reporters, publicationColors) => {
  return reporters.map((reporter) => {
    return {
      source: reporter.id,
      target: reporter.publication,
      value: 30,
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
      value: 80,
      color: publicationColors[employment.publication],
      current: false,
    };
  })
}

const calculateStrokeWidth = (d) => {
  return d.value > 60 ? 1 : 3;
}

const calculateStrokeType = (d) => {
  return d.value > 60 ? 'dashed' : 'solid';
}
