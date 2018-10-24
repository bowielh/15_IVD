function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + sample;
    d3.json(url).then(handleSuccess).catch(handleError)

    function handleSuccess(result) {
        data = result;

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
    // @TODO: Build a Bubble Chart using the sample data
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

        plotData = result;
        xValue = plotData.otu_ids;
        yValue = plotData.sample_values;
        markerSize = plotData.sample_values;
        markerColor = plotData.otu_ids;
        textValue = plotData.otu_lables;

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
            height: 600,
            width: 600
        };

        Plotly.newPlot("bubble-chart", data, layout);
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
