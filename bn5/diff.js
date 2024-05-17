// Assume data is loaded here as `data`
d3.json('final2.json').then(function(data)
{
    console.log(data)
    const width = 1000;
    const height = 900;
    const format = d3.format(",d");

    const pack = d3.pack()
        .size([width - 2, height - 2])
        .padding(20);

    const root = d3.hierarchy(data, d => d.children)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });
    const vendors = new Set();

    root.each(d => {
        if (d.depth===1)
            {
            vendors.add(d.data.name);
        }
    });

    // Define the div for the tooltip
    var tip = d3.select("body").append("div")
                .attr("id", "tooltip")
                .style("opacity", 0)
    // Add events to circles
    
    const colors = d3.scaleOrdinal(["red", "blue", "orange"])
        .domain(Array.from(vendors))

    console.log(pack)

    const svg = d3.select("#bars")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", "10")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

    const node = svg.selectAll("g")
        .data(pack(root).descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "#000", "50");

            // Append tooltip div
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
      
            // Position tooltip relative to mouse cursor
            tooltip.html(d.data.name + "<br/> Sales: "+ d.data.value)
                .style("left", (event.pageX + 18) + "px")
                .style("top", (event.pageY - 18) + "px")
                .transition()
                // .duration(2)
                .style("opacity", .9)
                .style("background-color", "gray")
                .style("font-weight", 600);
         })
        .on("mouseout", function(d) {
            d3.select(this).attr("stroke", null);
            // tooltip.style("visibility", "hidden");
            d3.select(".tooltip").remove(); // Optionally clear the donut chart
        })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));;
    
    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => {
            if(d.depth < 1){return 'white'}
            else if (d.depth === 1) {
                if (d.data.name === "Vendor 1001") return "orange";
                if (d.data.name === "Vendor 1002") return "#4682B4";
                if (d.data.name === "Vendor 1003") return "teal";
            }else if (d.depth === 2) {
                    if (d.data.name === "ANT2" || d.data.name === "BIR2") return "orange";
                    if (d.data.name === "GOT2" || d.data.name === "WRO2") return "#4682B4"; // Note: This case was not specified, assuming default color
                    if (d.data.name === "LYO2") return "teal"; // Conflict resolved to "red" as priority
                } 
            else if (d.depth === 3) {
                if (d.data.color < 0) return "#556B2F";
                if (d.data.color > 0) return "#FA8072"; // Note: This case was not specified, assuming default color
                if (d.data.name === "Vendor 1003") return "teal"; // Conflict resolved to "red" as priority
            } 
            return "lightgray"; // Default color for cases not covered
        })
        .attr("opacity", d => d.children ? 0.5 : 1);


    node.filter(d => !d.children).append("text")
        .attr("dy", "0.5em")
        .text(d => d.data.name)
        .style();
    node.filter(d => d.depth === 2) // Filter to get only the vendors
        .append("text")
        .attr("y", d => d.r + 14) // Place the text below the circle, slightly lower than the circle (adjust the value as needed)
        .text(d => d.data.name)

    node.filter(d => d.depth === 1) // Filter to get only the vendors
        .append("text")
        .attr("y", d => d.r + 25 ) // Place the text below the circle, slightly lower than the circle (adjust the value as needed)
        .text(d => d.data.name) // Set the text to the vendor name
        ; // Set the text color to black
    
    // export value = 
    
    
    })