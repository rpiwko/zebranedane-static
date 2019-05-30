

function getCheckedOptions (formToCheck) {
  // Checks selected checkboxes and radio buttons on formToCheck
  console.log("Getting checked checkBoxes for " + formToCheck)

  var form = document.getElementById(formToCheck);
  var enabledValues = [];

  for (var i = 0; i < form.children.length; i++) {
    if (form.children[i].type == "checkbox" || form.children[i].type == "radio") {
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

  filters.city = getCheckedOptions("filters-cities-1");
  filters.city = filters.city.concat(getCheckedOptions("filters-cities-2"));

  filters.rooms_no = getCheckedOptions("filters-rooms-no");
  if (filters.rooms_no.includes("4")) {
    // Include all other values present in DB in rooms_no column
    extraValues = [ "5", "6", "7", "8", "9", "10", "WIĘCEJ NIŻ 10", "więcej niż 10" ];
    filters.rooms_no = filters.rooms_no.concat(extraValues);
  }

  filters.condition_id = getCheckedOptions("filters-condition");
  if (filters.condition_id.includes("NA")) {
    // Include offers where condition_id was not provided
    filters.condition_id.push("");
  }

  console.log("Found filters:");
  console.log(filters);

  return filters;
}

function applyFilters(arrayToFilter) {

  var filters = getFiltersFromUi();

  for (var filterName in filters) {
    if (filters.hasOwnProperty(filterName)) {
      arrayToFilter = arrayToFilter.filter(x => filters[filterName].includes(x[filterName]));
    }
  }

  console.log("Chart data after filtering:");
  console.log(arrayToFilter);

  return arrayToFilter;
}

function calculateAvgforCities(inputData, aggColumnName, measureColumnName) {
  aggregatedValues = {};

  for (const record of inputData) {
    if (!aggregatedValues[record[aggColumnName]]) {
      // City not available yet so create it
      aggregatedValues[record[aggColumnName]] = {"sum" : record[measureColumnName], "offersNo" : record.offers_no}
    }
    else{
      // City already present in aggregatedValue so sum up values
      aggregatedValues[record[aggColumnName]].sum = aggregatedValues[record[aggColumnName]].sum + record[measureColumnName];
      aggregatedValues[record[aggColumnName]].offersNo = aggregatedValues[record[aggColumnName]].offersNo + record.offers_no;
    }
  }

  console.log("aggregatedValues:");
  console.log(aggregatedValues);

  avgValuesForCities = {}

  for (city in aggregatedValues) {
    if (aggregatedValues.hasOwnProperty(city)) {
      var avgValue = aggregatedValues[city].sum / aggregatedValues[city].offersNo;
      avgValuesForCities[city] = avgValue;
    }
  }

  console.log("avgValuesForCities:");
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

  var dbExtract = JSON.parse(JSON.stringify(window.originalDbExtract));
  var chartData = dbExtract.results.find(x => x.queryName == tagId.substring(1));

  console.log("Data found for chart:");
  console.log(chartData.records);

  return chartData.records;
}

function drawSingleChart(tagId, chartType, aggColumnName, measureColumnName) {
  console.log("Starting drawSingleChart() for tagId=" + tagId);

  // Prepare data for chart  
  var chartData = getRawChartData(tagId);
  chartData = applyFilters(chartData);
  chartData = calculateAvgforCities(chartData, aggColumnName, measureColumnName);
  chartData = sortObjectPropertiesByValues(chartData);
  
  var charXs = [];
  var charYs = [];
  for (var keyValuePair of chartData) {        
      charXs.push(keyValuePair[0])
      charYs.push(keyValuePair[1])
  }
  console.log("charXs:");
  console.log(charXs);
  console.log("charYs:");
  console.log(charYs);

  // Configure the chart
  charData = {
      labels: charXs.slice(0, 10),
      series: [ charYs.slice(0, 10) ]
  };

  var options = {        
      height: 200,
      chartPadding: {
          right: 80
        }
  };

  if (measureColumnName == "prices_sum") {
    var axixYlabelFormat = {
      labelInterpolationFnc: function(value) {
        return (value / 1000) + 'k';}};
    options.axisY = axixYlabelFormat;
  }

  if (measureColumnName == "areas_sum") {
    var axixYlabelFormat = {
      labelInterpolationFnc: function(value) {
        return value + 'm2';}};
    options.axisY = axixYlabelFormat;
  }

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

  if (chartType == "Bar") {
    new Chartist.Bar(tagId, charData, options, responsiveOptions);
  }

  if (chartType == "Line") {
    new Chartist.Line(tagId, charData, options, responsiveOptions);
  }
}
