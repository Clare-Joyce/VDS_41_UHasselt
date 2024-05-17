
// select the svg area
var Svg = d3.select("#legend")

// create a list of keys
var keys = ["Vendor 1001", "Vendor 1002", "Vendor 1003"]

// Usually you have a color scale in your chart already
var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["orange", "#4682B4", "teal"]);

// Add one dot in the legend for each name.
Svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 200)
    .attr("cy", function(d,i){ return 100 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
Svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 120)
    .attr("y", function(d,i){ return 100 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("display", "inline")
    .style("alignment-baseline", "middle")
