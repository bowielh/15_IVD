function buildMetadata(sample) {

    // Use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + sample;
    d3.json(url).then(handleSuccess).catch(handleError)

    function handleSuccess(result) {
        var data = result;

        d3.select("#sample-metadata").html(""); //clear any existing metadata

        for (datum in data) {
            var panel = d3.select("#sample-metadata") //select element
            panel.append("div").text(`${datum}: ${data[datum]}`); //append new div's with key and value
        };
    };

    function handleError(error) {
        console.log(`Error is: ${error}`);
    };

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = "/samples/" + sample;
    d3.json(url).then(handleSuccess).catch(handleError)

    function handleSuccess(result) {

        //Build a Bubble Chart using the sample data
        var bubbleData = result;
        var xValue = bubbleData.otu_ids;
        var yValue = bubbleData.sample_values;
        var markerSize = bubbleData.sample_values;
        var markerColor = bubbleData.otu_ids;
        var textValue = bubbleData.otu_labels;

        var trace1 = {
            x: xValue,
            y: yValue,
            text: textValue,
            mode: 'markers',
            marker: {
                color: markerColor,
                size: markerSize,
            }
        }

        var data = [trace1];

        var layout = {
            title: 'Bubble Chart Hover Text',
            showlegend: false,
        };

        Plotly.newPlot("bubble-chart", data, layout, {responsive: true});

        // Build a Pie Chart
        var rawData = result

        // Sort otu_ids by the values in sample_values; use slice() to create a
        // copy of the array
        var sortOtuIds = rawData.otu_ids.slice().sort((a,b) =>
          rawData.sample_values[rawData.otu_ids.indexOf(b)] -
          rawData.sample_values[rawData.otu_ids.indexOf(a)]);

        // Sort otu_labels by the values in sample_values; use slice() to create
        // a copy of the array
        var sortOtuLabels = rawData.otu_labels.slice().sort((a,b) =>
          rawData.sample_values[rawData.otu_labels.indexOf(b)] -
          rawData.sample_values[rawData.otu_labels.indexOf(a)]);

        // Sort sample_value; use slice() to create a copy of the array
        var sortSampleValues = rawData.sample_values.slice().sort((a,b) => b - a);

        // Slice the arrays for the top ten values
        var label = sortOtuIds.slice(0,10)
        var text = sortOtuLabels.slice(0,10)
        var value = sortSampleValues.slice(0,10)

        var data2 = [{
          values: value,
          labels: label,
          hovertext: text,
          type: 'pie'
        }];

        Plotly.newPlot("pie-chart", data2, {responsive: true});

    };

    function handleError(error) {
        console.log(`Error is: ${error}`);
    };
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
