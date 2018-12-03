function buildMetadata(sample) {
  console.log("buildMetadata", sample);
    // build the metadata panel
    // select the panel with id of `#sample-metadata`
  metaData=d3.select("#sample-metadata");
      //  to clear any existing metadata
  metaData.html("");
  metaData.append("ul");

 //  fetch the metadata for a sample
    // add each key and value pair to the panel
  d3.json(`/metadata/${sample}`).then(function(result){
    Object.entries(result).forEach(([key,value]) => {
          switch(key) {
            case "sample":
              newKey="SAMPLE";
              break;
            case "BBTYPE":
              newKey="BB TYPE";
              break;
            case "WFREQ":
              newKey="W FREQ"
              break;
            default:
              newKey=key;
          }
            // append new tags for each key-value in the metadata.
          metaData.append("li").text(`${newKey}: ${value}`);
      });

    //  Build the Gauge Chart
    buildGauge(result.WFREQ);
    });
  

}
//****************************************************** */
function buildGauge(freq) {

  // Enter a speed between 0 and 180
var level = freq * 20 ;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'Scrubs per Week',
   // text: level,
    hoverinfo: 'text+name'},
    // slices of a pie chart
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50 ],
  rotation: 90,
  text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['#FF00BF', '#FF1EE5','#F335FF', 
                    '#CE45FF','#A54BFF', '#7745FF',
                    '#4135FF','#1E37FF','#0040FF','white']},
  labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency',
  height: 400,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
}
//************************************************************************
function buildCharts(sample) {
  console.log("buildCharts",sample);

  // select the div with id "pie"
  var pieDiv= d3.select("#pie");
  // clear existing data
  pieDiv.html("");
  // select the div with id "bubble"
  var bubbleDiv= d3.select("#bubble");
  // clear existing data
  bubbleDiv.html("");

  // fetch the sample data
  d3.json(`/samples/${sample}`).then(function(result){

       //build the pie chart
    console.log(result);
  var pieTrace ={
      labels :result.otu_ids.slice(0,10),
      values :result.sample_values.slice(0,10),
      type :'pie',
      hovertext:result.otu_labels.slice(0,10),
      hoverinfo:"text",
    };

  var pieLayout = {
      title: 'Bacteria Sample Values',
      height: 400,
      width: 400,
     };

  console.log(pieTrace);
  var pieData = [pieTrace];
  Plotly.newPlot("pie",pieData,pieLayout);

  //build the bubble chart
  var bubbleTrace= {
    x:result.otu_ids,
    y:result.sample_values,
    mode: 'markers',
    marker: {
      color: result.otu_ids,
      opacity:0.8,
      size: result.sample_values,
      hovertext:result.otu_labels,
      hoverinfo:"text",
      }
    };

  var bubbleLayout = {
      title: 'Sample Values',
      height: 500,
      width: 1100,
     };

  console.log(bubbleTrace);
  var bubbleData=[bubbleTrace];
  Plotly.newPlot("bubble",bubbleData,bubbleLayout)
  })
};
 

//************************************************************************
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  console.log("init");
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
    // console.log("firstSample", firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
//*************************************************************************
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
