function callChartDrawing(tagId, charData, options, responsiveOptions) {
  options.lineSmooth = Chartist.Interpolation.simple({
    divisor: 2
  });
  
  new Chartist.Line(tagId, charData, options, responsiveOptions);
}

function drawCharts() {
  drawSingleChart("#apartment-monthly-renting-price", "AVG", "offer_date", "prices_sum");
  drawSingleChart("#apartment-monthly-renting-offers-no", "SUM", "offer_date", "offers_no");
  drawSingleChart("#apartment-monthly-selling-price", "AVG", "offer_date", "prices_sum");
  drawSingleChart("#apartment-monthly-selling-offers-no", "SUM", "offer_date", "offers_no");  
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../data/cities-details.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})