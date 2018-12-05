//****************************************************** */
function buildGauge(freq) {
// this gauge is really a donut pie chart 
//where the lower half of the chart is white
    //level must be between 0 and 180
    // freq is between 0 and 9
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
      // name: 'Scrubs per Week',
      text: 'Scrubs per Week',
      textinfo:'text',
      textposition:'inside',
      hoverinfo: 'text'
      },
      // slices of a donut pie chart are percentages
    //  the last slice is the lower half of the donut
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50 ],
    rotation: 90,
    // name: 'Scrubs per Week',
    text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
    textinfo: 'text',
    textposition:'inside',
    //colors for slices lower half is white
    marker: {colors:['#c9c9c9','#bdbdc9', '#9b9bc1','#7878ba', 
                      '#6161b5','#4747ad', '#3131aa',
                      '#1818a5','#05058e','white']},
    labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
    // last label is empty so it doesn't show under the chart
    hoverinfo: 'text',
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
    // HTML in string passes through and allows for subtitle
    title: `<b>Belly Button Washing Frequency</b> <br> Scrubs per Week`,
    height:500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  
  Plotly.newPlot('gauge', data, layout);
  }
