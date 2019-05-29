

function getCheckedCheckBoxes (formToCheck) {
  console.log("Getting checked checkBoxes for " + formToCheck)

  var form = document.getElementById(formToCheck);
  var enabledValues = [];

  for (var i = 0; i < form.children.length; i++) {
    if (form.children[i].type == "checkbox") {
      if (form.children[i].checked) {
        enabledValues.push(form.children[i].value);
      }
    }
  }
  return enabledValues;
}

function getFiltersFromUi() {
  var filters = {
    city : [],
    condition_id : [],
    rooms_no : []
  };

  filters.city = getCheckedCheckBoxes("filters-cities-1");
  filters.city = filters.city.concat(getCheckedCheckBoxes("filters-cities-2"));

  filters.rooms_no = getCheckedCheckBoxes("filters-rooms-no");
  if (filters.rooms_no.includes("4")) {
    // Include all other values present in DB in rooms_no column
    extraValues = [ "5", "6", "7", "8", "9", "10", "WIĘCEJ NIŻ 10", "więcej niż 10" ];
    filters.rooms_no = filters.rooms_no.concat(extraValues);
  }

  filters.condition_id = getCheckedCheckBoxes("filters-condition");
  if (filters.condition_id.includes("NA")) {
    // Include offers where condition_id was not provided
    filters.condition_id.push("");
  }

  console.log("Found filters: ");
  console.log(filters);
  return filters;
}

function applyFilters(arrayToFilter) {
  console.log("Starting applyFilters()");

  var filters = getFiltersFromUi();

  for (var filterName in filters) {
    if (filters.hasOwnProperty(filterName)) {
      arrayToFilter = arrayToFilter.filter(x => filters[filterName].includes(x[filterName]));
    }
  }

  console.log("After filtering: ");
  console.log(arrayToFilter);

  return arrayToFilter;
}

function calculateAvgforCities(inputArray) {
  aggregatedValues = {};

  for (const record of inputArray) {
    console.log(record.city.toString());
    if (!aggregatedValues[record.city]) {
      console.log("New city!");      
      // City not available yet so create it
      aggregatedValues[record.city] = {"pricesSum" : record.prices_sum, "offersNo" : record.offers_no}
    }
    else{
      console.log("Existing city!");
      // City already present in aggregatedValue so sum up values
      aggregatedValues[record.city].pricesSum = aggregatedValues[record.city].pricesSum + record.prices_sum;
      aggregatedValues[record.city].offersNo = aggregatedValues[record.city].offersNo + record.offers_no;
    }
  }

  console.log("aggregatedValues");
  console.log(aggregatedValues);

  avgValuesForCities = {}

  for (city in aggregatedValues) {
    if (aggregatedValues.hasOwnProperty(city)) {
      var avgValue = aggregatedValues[city].pricesSum / aggregatedValues[city].offersNo;
      avgValuesForCities[city] = avgValue;
    }
  }

  console.log("avgValuesForCities");
  console.log(avgValuesForCities);
  
  return avgValuesForCities;
}

function sortObjectPropertiesByValues(objectToSort) {
  var sortedArray = []

  // Convert object to array
  for (var property in objectToSort) {
    if (objectToSort.hasOwnProperty(property)) {
      sortedArray.push([property, objectToSort[property]]);
    }
  }

  // Actual sorting (descending)
  sortedArray.sort(function(a, b) {
    return b[1] - a[1];
  })

  return sortedArray;
}

function getRawChartData(tagId) {
  console.log("Starting getDataForChart() for tagId=" + tagId);

  var dbExtract = JSON.parse(JSON.stringify(window.originalDbExtract));
  var chartData = dbExtract.results.find(x => x.queryName == tagId.substring(1));

  console.log("Data found for chart: ");
  console.log(chartData.records);

  return chartData.records;
}

function drawSingleChart(tagId) {
  console.log("Starting drawSingleChart() for tagId=" + tagId);

  var chartData = getRawChartData(tagId);
  chartData = applyFilters(chartData);

  console.log("After filtering: ");
  console.log(chartData);

  chartData = calculateAvgforCities(chartData);
  chartDataArray = sortObjectPropertiesByValues(chartData);
  
  var charXs = [];
  var charYs = [];
  for (var keyValuePair of chartDataArray) {        
      charXs.push(keyValuePair[0])
      charYs.push(keyValuePair[1])
  }
  console.log("charXs:");
  console.log(charXs);
  console.log("charYs:");
  console.log(charYs);

  charData = {
      labels: charXs.slice(0, 10),
      series: [ charYs.slice(0, 10) ]
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

function drawCharts() {

    drawSingleChart("#apartment-renting-price");
    //drawSingleChart("#avg-apartment-selling-price");
    //drawSingleChart("#avg-apartment-square-meter-price");
}

document.addEventListener("DOMContentLoaded", function() {
    $.getJSON("../../data/results.json", function(dbExtract) {
      console.log("dbExtract type: " + typeof(dbExtract));
      window.originalDbExtract = JSON.parse(JSON.stringify(dbExtract));
      console.log("window.originalDbExtract type: " + typeof(window.originalDbExtract));
      drawCharts();
    });    
})