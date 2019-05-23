function drawChart() {
    var data = {
        // A labels array that can contain any sort of values
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [5, 2, 4, 2, 0]
        ]
        };

    var options = {
        width: 500,
        height: 300
        };

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line("#avg-renting-price", data, options);
    new Chartist.Line("#avg-selling-price", data, options);    
    new Chartist.Line("#avg-square-meter-price", data, options);
    console.log("Done!");
}

document.addEventListener("DOMContentLoaded", function() {
    drawChart();
})