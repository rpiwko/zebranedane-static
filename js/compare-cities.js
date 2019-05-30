function callChartDrawing(tagId, charData, options, responsiveOptions) {
  new Chartist.Bar(tagId, charData, options, responsiveOptions);  
}

function drawCharts() {
  drawSingleChart("#apartment-renting-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-selling-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-square-meter-price", "AVG", "city", "prices_sum");
  drawSingleChart("#apartment-area", "AVG", "city", "areas_sum");
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../data/results.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})