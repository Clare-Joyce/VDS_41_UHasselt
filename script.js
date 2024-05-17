let chartData = [];

function readJsonData(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data);
}

function getData() {
  const jsonUrl = "converted_data.json";
  return readJsonData(jsonUrl)
    .then((dataArray) => {
      chartData = dataArray;
      drawChart(1, 2, "EV-Car Battery", "EV-Home Battery");
      return dataArray;
    })
    .catch((error) => {
      console.error("An error occurred :", error);
    });
}

function getDatasetByProduct(productKey) {
  if (chartData) {
    const firstProductData = chartData.filter(
      (p) => p.MaterialKey == productKey
    );
    const axesSales = [];
    const axesForecast = [];
    firstProductData.forEach((p) => {
      const axisSales = { 
        axis: p.PlantKey, 
        value: parseFloat(p.SalesValue),
        text: "Sales amount:" 
    };
      axesSales.push(axisSales);
      const axisForecast = {
        axis: p.PlantKey,
        value: parseFloat(p.ForecastValue),
        text: "Forecast amount:"
      };
      axesForecast.push(axisForecast);
    });
    return [
      {
        className: "sales",
        axes: axesSales,
      },
      {
        className: "forecast",
        axes: axesForecast,
      },
    ];
  }
  return [];
}

function drawChart(productKey1, productKey2, chartTitle1, chartTitle2) {
  var chart = RadarChart.chart();
  var cfg = chart.config(); // retrieve default config
  var titleText1 = chartTitle1;
  var titleText2 = chartTitle2;

  var svg1 = d3
    .select("body")
    .append("svg")
    .attr("width", cfg.w + cfg.w / 2)
    .attr("height", cfg.h + cfg.h / 4)
    .style("float", "left");

  var svg2 = d3
    .select("body")
    .append("svg")
    .attr("width", cfg.w + cfg.w / 2)
    .attr("height", cfg.h + cfg.h / 4)
    .style("float", "left");

  svg1
    .append("text")
    .attr("x", cfg.w / 4)
    .attr("y", cfg.h)
    .style("text-anchor", "middle")
    .text(titleText1);


  svg2
    .append("text")
    .attr("x", cfg.w / 4)
    .attr("y", cfg.h)
    .style("text-anchor", "middle")
    .text(titleText2);

  svg1
    .append("g")
    .classed("single", 1)
    .datum(getDatasetByProduct(productKey1))
    .call(chart);

  svg2
    .append("g")
    .classed("single", 1)
    .datum(getDatasetByProduct(productKey2))
    .call(chart);

  // legend
  var legend = d3
    .select("body")
    .append("svg")
    .attr("class", "legend-svg")
    .attr("width", 200)
    .attr("height", 100)
    .style("clear", "both"); // Clear floating elements

  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "blueviolet");

  legend.append("text").attr("x", 30).attr("y", 20).text("Sales");

  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", 40)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "red");

  legend.append("text").attr("x", 30).attr("y", 50).text("Forecast");
}

getData();
