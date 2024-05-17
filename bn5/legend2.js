// select the svg area
var SVG = d3.select("#legend2")

// create a list of keys
var keys = ["Average Delivery > 0", "Average Delivery < 0"]

// Usually you have a color scale in your chart already
var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["#556B2F", "#FA8072"]);

// Add one dot in the legend for each name.
var size = 20
SVG.selectAll("mydots")
  .data(keys)
  .enter()
  .append("rect")
    .attr("x", 100)
    .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function(d){ return color(d)})

// Add one dot in the legend for each name.
SVG.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 100 + size*1.2)
    .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")