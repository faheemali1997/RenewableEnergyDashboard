function renderScatterplotMatrix(intrinsic_index) {
    var topAttributes = topFourAttributes(intrinsic_index);
    var width = 1250,
        size = 250,
        padding = 25;
    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);
    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);
    
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["#1DB954", "red", "black"]);

    scatter_data = data["original_data"]
    document.getElementById('task2_area').innerHTML = ""
    d3.select("#task2_area")
        .append("h1")
        .text("Scatterplot Matrix")
        .style("font-size", "30px")
        .attr("align", "center");

    n = topAttributes.length 
    topAttributes_domain = {}
    for (i = 0; i < n; i++) {
        topAttributes_domain[topAttributes[i]] = d3.extent(scatter_data.map(record => { return record[topAttributes[i]] }))
    }
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);
    var svg = d3.select("#task2_area").append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(topAttributes)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function (d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function (d) { x.domain(topAttributes_domain[d]); d3.select(this).call(xAxis); });
    svg.selectAll(".y.axis")
        .data(topAttributes)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function (d, i) { return "translate(0," + i * size + ")"; })
        .each(function (d) { y.domain(topAttributes_domain[d]); d3.select(this).call(yAxis); });
    var cell = svg.selectAll(".cell")
        .data(cross(topAttributes, topAttributes))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);
    
    cell.filter(function (d) { return d.i === d.j; }).append("text")
        .attr("x", size / 2)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function (d) { return d.x; })
        .style("font-size", "17px");
    function plot(p) {
        var cell = d3.select(this);
        x.domain(topAttributes_domain[p.x]);
        y.domain(topAttributes_domain[p.y]);
        cell.append("rect")
            .attr("class", "scatterRect")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);
        if (p.x != p.y) {
            cell.selectAll("circle")
                .data(scatter_data)
                .enter().append("circle")
                .attr("cx", function (d) { return x(d[p.x]); })
                .attr("cy", function (d) { return y(d[p.y]); })
                .attr("r", 4)
                .style("fill", function (d) { return color(d.clus_number) });
        }
    }
    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({ x: a[i], i: i, y: b[j], j: j });
        return c;
    }
    var trim_table_data = tableDataTrim(intrinsic_index, topAttributes);
    displayTable(trim_table_data);
}
