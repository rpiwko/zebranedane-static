

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

function calculateAvg(inputData, aggColumnName, measureColumnName) {

  // Count whole sum and total offers no, then group by aggColumnName (e.g. city, month etc.)  
  var aggregatedValues = {};
  for (const record of inputData) {
    if (!aggregatedValues[record[aggColumnName]]) {
      // Value (city or month) not available yet so create it
      aggregatedValues[record[aggColumnName]] = {"sum" : record[measureColumnName], "offersNo" : record.offers_no}
    }
    else{
      // Value (city or month) already present in aggregatedValue so sum up values
      aggregatedValues[record[aggColumnName]].sum = aggregatedValues[record[aggColumnName]].sum + record[measureColumnName];
      aggregatedValues[record[aggColumnName]].offersNo = aggregatedValues[record[aggColumnName]].offersNo + record.offers_no;
    }
  }

  console.log("aggregatedValues:");
  console.log(aggregatedValues);

  // Count the average base on sum and total offers no counted in previous step
  avgValues = {}
  for (aggColumn in aggregatedValues) {
    if (aggregatedValues.hasOwnProperty(aggColumn)) {
      var avgValue = aggregatedValues[aggColumn].sum / aggregatedValues[aggColumn].offersNo;
      avgValues[aggColumn] = avgValue;
    }
  }

  console.log("avgValues:");
  console.log(avgValues);
  
  return avgValues;
}

function calculateSum(inputData, aggColumnName, measureColumnName) {
  var sumValues = {};
  for (const record of inputData) {
    if (!sumValues[record[aggColumnName]]) {
      // Value (e.g. month) not available yet so create it
      sumValues[record[aggColumnName]] = record[measureColumnName];
    }
    else{
      // Value (e.g. month) already present in aggregatedValue so sum up values
      sumValues[record[aggColumnName]] = sumValues[record[aggColumnName]] + record[measureColumnName];
    }
  }

  console.log("sumValues:");
  console.log(sumValues);
  
  return sumValues;
}

function sortObjectPropertiesByNames(objectToSort) {
  var sortedArray = []

  // Convert object to array
  for (var property in objectToSort) {
    if (objectToSort.hasOwnProperty(property)) {
      sortedArray.push([property, objectToSort[property]]);
    }
  }

  // Actual sorting (descending)
  sortedArray.sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  })

  console.log("sortedArray:");
  console.log(sortedArray);

  return sortedArray;
}

function getRawChartData(tagId) {

  var dbExtract = JSON.parse(JSON.stringify(window.originalDbExtract));
  var chartData = dbExtract.results.find(x => x.queryName == tagId.substring(1));

  console.log("Data found for chart:");
  console.log(chartData.records);

  return chartData.records;
}

function drawSingleLineChart() {

}

function drawSingleChart(tagId, chartType, aggColumnName, measureColumnName) {
  console.log("Starting drawSingleChart() for tagId=" + tagId);

  // Prepare data for chart  
  var chartData = getRawChartData(tagId);
  chartData = applyFilters(chartData);
  if (chartType == "AVG") {
    chartData = calculateAvg(chartData, aggColumnName, measureColumnName);
  }
  if (chartType == "SUM") {
    chartData = calculateSum(chartData, aggColumnName, measureColumnName);
  }
  chartData = sortObjectPropertiesByNames(chartData, aggColumnName);
  
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
      // limit number of Y-axis values to 10
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

  // Call chart drawing (specific for each page)
  callChartDrawing(tagId, charData, options, responsiveOptions);  
}
