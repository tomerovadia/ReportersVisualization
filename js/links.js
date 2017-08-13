export const createLinks = (data, publicationColors) => {
  return createCurrentEmploymentLinks(data.reporters, publicationColors)
                .concat(createPreviousEmploymentsLinks(data.employments, publicationColors));
}


const createCurrentEmploymentLinks = (reporters, publicationColors) => {
  return reporters.map((reporter) => {
    return {
      source: reporter.id,
      target: reporter.publication,
      value: 20,
      color: publicationColors[reporter.publication]
    };
  });
}


const createPreviousEmploymentsLinks = (employments, publicationColors) => {
  return employments.map((employment) => {
    return {
      source: employment.reporter,
      target: employment.publication,
      value: 250,
      color: publicationColors[employment.publication]
    };
  })
}
