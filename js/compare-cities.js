function callChartDrawing(tagId, charData, options, responsiveOptions) {
  new Chartist.Bar(tagId, charData, options, responsiveOptions);  
}

function drawCharts() {
  drawSingleChart("#apartment-renting-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-renting-year", "AVG", "city", "years_sum");
  drawSingleChart("#apartment-renting-area", "AVG", "city", "areas_sum");
  drawSingleChart("#apartment-renting-offers-no", "SUM", "city", "offers_no");

  drawSingleChart("#apartment-selling-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-square-meter-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-selling-year", "AVG", "city", "years_sum");
  drawSingleChart("#apartment-selling-area", "AVG", "city", "areas_sum");
  drawSingleChart("#apartment-selling-offers-no", "SUM", "city", "offers_no");
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../data/compare-cities.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})