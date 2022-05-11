function renderScreePlot() {
    document.getElementById("scree_plot").innerHTML = ""
    
    var width = 800, height = 750;

    var svg = d3.select("#scree_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("text")
        .attr("x", width * 1 / 2)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("Screeplot Chart");

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand().range([0, width]).padding(0.3),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(data["exp_var"].map(function (d) { return d.pc_number; }));
    yScale.domain([0, 100]);

    var svg_x_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
    svg_x_scale.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    svg_x_scale.append("text")
        .attr("y", 60)
        .attr("x", width / 2)
        .attr("text-anchor", "end")
        .attr("class", "x label")
        .style("font-size", "15px")
        .text("Principle Components");

    g.append("g") 
        .call(d3.axisLeft(yScale).tickFormat(function (d) {
            return d;
        })
        .ticks(10)) 
        .append("text")
        .attr("y", 20)
        .attr("x", -height / 4)
        .attr("transform", "rotate(-90)")
        .attr("dy", "-5.1em")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .style("font-size", "15px")
        .text("Eigen Vector / Explained Variance");

    g.selectAll(".bar") 
        .data(data["exp_var"])
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.pc_number); }) 
        .attr("y", function (d) { return yScale(d.exp_var); }) 
        .attr("width", xScale.bandwidth()) 
        .attr("height", function (d) { return height - yScale(parseFloat(d.exp_var)); }); 

    var valueline2 = d3.line()
        .x(function (d) { return xScale(d.pc_number) + xScale.bandwidth() / 2; })
        .y(function (d, i) { return yScale(d.cumsum_exp_var); })

    g.append("path")
        .datum(data["exp_var"])
        .attr("class", "line")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", valueline2);

    g.selectAll(".dot2")
        .data(data["exp_var"])
        .enter().append("circle")
        .attr("class", "dot2")
        .style("fill", "#1DB954")
        .attr("cx", function (d) { return xScale(d.pc_number) + xScale.bandwidth() / 2; })
        .attr("cy", function (d) { return yScale(d.cumsum_exp_var); })
        .attr("r", 5)
        .on("click", function (d) { renderScatterplotMatrix(d.p_number)});
}

renderScreePlot()