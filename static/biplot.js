function renderBiPlot() {
    document.getElementById("biplot").innerHTML = ""
    //Setting the dimensions of the chart
    var width = 800, height = 750;
    
    //Adding a SVG element to the chart
    var svg = d3.select("#biplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    //Adding title for the Biplot graph
    svg.append("text")
        .attr("x", width * 1 / 2)
        .attr("y", 30)
        .style("font-size", "30px")
        .attr("class", "title")
        .text("Biplot Chart");

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    const xAxis = g.append('g')
        .attr('transform', "translate(0," + height + ")");
    const yAxis = g.append('g');

    //Adding x-axis label
    xAxis.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', 60)
        .style("font-size", "15px")
        .attr("class", "x label")
        .attr("stroke", "black")
        .text("PC1");

    //Adding y-axis label
    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .attr("class", "y label")
        .attr("stroke", "black")
        .text("PC2");

    // Add X axis to the chart
    var xMin = d3.min(data["data_loading"], function (d) { return +d["PC1"]; });
    var xMax = d3.max(data["data_loading"], function (d) { return +d["PC1"]; });
    var x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, width]);

    // Add Y axis to the chart
    var yMin = d3.min(data["data_loading"], function (d) { return +d["PC2"]; });
    var yMax = d3.max(data["data_loading"], function (d) { return +d["PC2"]; });
    var y = d3.scaleLinear()
        .domain([yMin,yMax])
        .range([height, 0]);
    
    //Positioning the axis 
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    g.append("g")
        .call(d3.axisLeft(y));

    // Adding the dots to the biplot
    var plotting_area = g.append('g')
    plotting_area.selectAll("dot")
        .data(data["data_loading"])
        .enter()
        .append("circle")
        .style("fill","#1DB954")
        .attr("cx", function (d) { return x(d["PC1"]); })
        .attr("cy", function (d) { return y(d["PC2"]); })
        .attr("r", 2.5);

    //Attaching a line to the graph with the x,y position of the first end to be x(0) and y(0) resp.
    plotting_area.selectAll("line")
        .data(data["attribute_loading"])
        .enter()
        .append("line")  
        .transition()
        .delay(100)       
        .style("fill","black")  
        .attr("class", "line")
        .attr("x1", x(0))     
        .attr("y1", y(0))     
        .attr("x2", function (d) { return x(d["PC1"]); })     
        .attr("y2", function (d) { return y(d["PC2"]); });
    
    console.log(data); 

    plotting_area.selectAll("text")
        .data(data["attribute_loading"])
        .enter()
        .append("text") 
        .transition()
        .delay(100)        
        .attr("class", "text") 
        .attr("transform", function (d) { return "translate(" + x(d["PC1"]) + "," + y(d["PC2"]) + ") rotate(" + -1 * Math.atan(d["PC2"] / d["PC1"]) * (180 / Math.PI) + ")"; })
        .text(function (d) { return d.features })
        .style("fill","black")
        .attr("class", "biplot_text");
}
renderBiPlot();
