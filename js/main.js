
function drawSingleChart(tagId, resultsSet) {

    console.log(resultsSet);
    var charXs = [];
    var charYs = [];
    for (var property in resultsSet) {        
        charXs.push(property)
        charYs.push(resultsSet[property])
    }
    console.log(charXs);
    console.log(charYs);

    charData = {
        labels: charXs.slice(0, 8),
        series: [ charYs.slice(0, 8) ]
    };

    var options = {        
        height: 200,
        chartPadding: {
            right: 80
          },
        axisY: {
            labelInterpolationFnc: function(value) {
              return (value / 1000) + 'k';
            }
        }
    };

    var responsiveOptions = [
        ['screen and (max-width: 800px)', {
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 2 === 0 ? value : null;
            }
          }
        }],
        ['screen and (max-width: 450px)', {
            axisX: {
              labelInterpolationFnc: function(value, index) {
                return index % 4 === 0 ? value : null;
              }
            }
          }]
    ];

    new Chartist.Bar(tagId, charData, options, responsiveOptions);
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