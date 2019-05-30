function drawCharts() {
  drawSingleChart("#apartment-renting-price", "Bar", "city", "prices_sum");
  drawSingleChart("#apartment-selling-price", "Bar", "city", "prices_sum");
  drawSingleChart("#apartment-square-meter-price", "Bar", "city", "prices_sum");
  drawSingleChart("#apartment-area", "Bar", "city", "areas_sum");
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../data/results.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})