
function drawSingleChart(tagId, resultsSet) {

    console.log(resultsSet);
    var charXs = [];
    var charYs = [];
    for (var property in resultsSet) {        
        charXs.push(property)
        charYs.push(resultsSet[property] / 1000)
    }
    console.log(charXs);
    console.log(charYs);

    charData = {
        labels: charXs.slice(0, 8),
        series: [ charYs.slice(0, 8) ]
    };

    var options = {
        width: 800,
        height: 200
    };

    new Chartist.Line(tagId, charData, options);
}

function drawCharts(dbExtract) {

    drawSingleChart("#avg-apartment-renting-price", dbExtract.results[0].results);
    drawSingleChart("#avg-apartment-selling-price", dbExtract.results[1].results);
    drawSingleChart("#avg-apartment-square-meter-price", dbExtract.results[2].results);
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../../data/results.json", function(dbExtract) {        
        drawCharts(dbExtract);
    });    
})