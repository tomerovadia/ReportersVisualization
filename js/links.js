export const prepareLinkData = (data, publicationColors) => {
  return createCurrentEmploymentLinks(data.reporters, publicationColors)
                .concat(createPreviousEmploymentsLinks(data.employments, publicationColors));
}

export const appendLinks = (visualization, linkData) => {
  return visualization.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(linkData)
    .enter().append("line")
      .attr("stroke-width", calculateStrokeWidth())
      .style("stroke", (d) => d.color);
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
      value: 75,
      color: publicationColors[employment.publication],
      current: false,
    };
  })
}

const calculateStrokeWidth = () => (d) => {
  return d.value > 60 ? 0.8 : 2.3;
}
