
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;

  // Create the color scale.
  // const color = d3.scaleLinear()
  //     .domain([0, 5])
  //     .range(["gray", "hsl(228,30%,40%)"])
  //     .interpolate(d3.interpolateHcl);

  // Compute the layout.
  const data = d3.json("final2.json")
  const pack = data => d3.pack()
      .size([width, height])
      .padding(3)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
  const root = pack(data);
  console.log(root);

  // Create the SVG container.
  const svg = d3.select("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: "white"; cursor: pointer;`);

  // Append the nodes.
  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => {
            if(d.depth < 1){return 'white'}
            else if (d.depth === 1) {
                if (d.data.name === "Vendor 1001") return "orange";
                if (d.data.name === "Vendor 1002") return "#4682B4";
                if (d.data.name === "Vendor 1003") return "teal";
            } else if (d.depth === 2) {
                if (d.data.name === "ANT2" || d.data.name === "BIR2") return "orange";
                if (d.data.name === "GOT2" || d.data.name === "WRO2") return "#4682B4";
                if (d.data.name === "LYO2") return "teal"; 
            } else if (d.depth === 3) {
                if (d.data.color < 0) return "#556B2F";
                if (d.data.color > 0) return "#FA8072"; // Note: This case was not specified, assuming default color
                if (d.data.name === "Vendor 1003") return "teal"; // Conflict resolved to "red" as priority
            } 
            return "lightgray"; // Default color for cases not covered
        })
      .attr("opacity", d => d.children ? 0.5 : 1)
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke", "black").attr("stroke-width", "0.5%");})
      .on("mouseout", function(d) { d3.select(this).attr("stroke", null); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));


  // Append the text labels.
  const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("font-size", d => d.parent === root ? 16 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .html(d => `${d.data.name} <br/> Sales: ${d.data.value} `);

  // Create the zoom behavior and zoom immediately in to the initial focus node.
  svg.on("click", (event) => zoom(event, root));
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
    
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "inline"; });
  }
