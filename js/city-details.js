function drawCharts() {

  drawSingleChart("#apartment-monthly-renting-price", "prices_sum");
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../data/cities-details.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})