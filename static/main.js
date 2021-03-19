function renderScreePlot() {
    document.getElementById("scree_plot").innerHTML = ""

    var width = 800,
        height = 750;

    var svg = d3.select("#scree_plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // svg.on("click", function () {
    //     console.log(d3.mouse(svg.node));
    // });

    // svg.append("text")
    // .attr("x", width * 3 / 4)
    // .attr("y", 30)
    // .style("font-size", "30px")
    // .attr("class", "title")
    // ("Bar Chart For " + field);
    svg.append("text")
        .attr("x", width * 1 / 2)
        .attr("y", 30)
        .style("font-size", "30px")
        // .attr("class", "title")
        .text("Screeplot");

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;


    var xScale = d3.scaleBand().range([0, width]).padding(0.4),
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
        // .attr("stroke", "black")
        .style("font-size", "15px")
        .text("Principle Components");


    g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale).tickFormat(function (d) { // Try with X Scaling too.
            return d;
        })
            .ticks(10)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("y", 20)
        .attr("x", -height / 4)
        .attr("transform", "rotate(-90)")
        .attr("dy", "-5.1em")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        // .attr("stroke", "black")
        .style("font-size", "15px")
        .text("Explained Variance");

    g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(data["exp_var"])
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return xScale(d.pc_number); })  //x scale created earlier and pass the year value from our data.
        .attr("y", function (d) { return yScale(d.exp_var); }) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("width", xScale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("height", function (d) { return height - yScale(parseFloat(d.exp_var)); }); //height of the bar would be calculated as height - yScale(d.value)
    //the height of the SVG minus the corresponding y-value of the bar from the y-scale
    // });

    var valueline2 = d3.line()
        .x(function (d) { return xScale(d.pc_number) + xScale.bandwidth() / 2; })
        .y(function (d, i) { return yScale(d.cumsum_exp_var); })

    g.append("path")
        .datum(data["exp_var"])
        .attr("class", "line")
        .attr("d", valueline2);

    g.selectAll(".dot2")
        .data(data["exp_var"])
        .enter().append("circle")
        .attr("class", "dot2")
        // .attr("cx", function (d) { return xScale(d.pc_number); })
        .attr("cx", function (d) { return xScale(d.pc_number) + xScale.bandwidth() / 2; })
        .attr("cy", function (d) { return yScale(d.cumsum_exp_var); })
        .attr("r", 5)
        .on("click", function (d) {
            console.log(d);
            renderScatterplotMatrix(d.p_number)
        });

    // });
}

function renderBiPlot() {
    // document.getElementById("biplot").innerHTML = "skhfsfigs"

    document.getElementById("biplot").innerHTML = ""
    var width = 800,
        height = 750;

    var svg = d3.select("#biplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    svg.append("text")
        .attr("x", width * 1 / 2)
        .attr("y", 30)
        .style("font-size", "30px")
        // .attr("class", "title")
        .text("Biplot");

    // svg.append("text")
    //     .attr("x", width / 4)
    //     .attr("y", 30)
    //     .style("font-size", "30px")
    //     .text("ScatterPlot For " + field_X + " vs " + field_Y);

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    const xAxisG = g.append('g')
        .attr('transform', "translate(0," + height + ")");
    const yAxisG = g.append('g');

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', 60)
        .style("font-size", "15px")
        .attr("class", "x label")
        // .attr("stroke", "black")
        .text("PC1");

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .attr("class", "y label")
        // .attr("stroke", "black")
        .text("PC2");

    //Read the data
    // d3.csv("all_players.csv", function (data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([d3.min(data["data_loading"], function (d) { return +d["PC1"]; }), d3.max(data["data_loading"], function (d) { return +d["PC1"]; })])
        .range([0, width]);
    var x_scatter_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([d3.min(data["data_loading"], function (d) { return +d["PC2"]; }), d3.max(data["data_loading"], function (d) { return +d["PC2"]; })])
        .range([height, 0]);
    g.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    var plotting_area = g.append('g')
    plotting_area.selectAll("dot")
        .data(data["data_loading"])
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return x(d["PC1"]); })
        .attr("cy", function (d) { return y(d["PC2"]); })
        .attr("r", 2.5);

    plotting_area.selectAll("line")
        .data(data["attribute_loading"])
        .enter()
        .append("line")         // attach a line
        .attr("class", "line")  // colour the line
        .attr("x1", x(0))     // x position of the first end of the line
        .attr("y1", y(0))      // y position of the first end of the line
        .attr("x2", function (d) { return x(d["PC1"]); })     // x position of the second end of the line
        .attr("y2", function (d) { return y(d["PC2"]); });

    plotting_area.selectAll("text")
        .data(data["attribute_loading"])
        .enter()
        .append("text")         // attach a line
        .attr("class", "text")  // colour the line
        .attr("transform", function (d) { return "translate(" + x(d["PC1"]) + "," + y(d["PC2"]) + ") rotate(" + -1 * Math.atan(d["PC2"] / d["PC1"]) * (180 / Math.PI) + ")"; })
        // .attr("x", function (d) { return x(d["PC1"]); })     // x position of the second end of the line
        // .attr("y", function (d) { return y(d["PC2"]); })
        // .attr("dx","1em")
        .text(function (d) { return d.features })
        // .style("fill","red")
        .attr("class", "biplot_text");

    // })
}

function topFourAttributes(n_components) {
    var calculatedData = {},
        top_attributes, topValues;
    data["attribute_loading"].forEach(record => {
        var value = 0,
            key;
        for (i = 0; i < n_components; i++) {
            key = "PC" + (i + 1)
            value += (record[key]) * (record[key])
        }
        calculatedData[value] = record["features"]
    })
    // console.log(calculatedData)
    topValues = Object.keys(calculatedData).sort(function (a1, a2) { return a2 - a1 }).splice(0, 4)
    top_attributes = topValues.map(value => { return calculatedData[value] })
    return top_attributes
}

function renderScatterplotMatrix(intrinsic_index) {

    // console.log("In scatterMatrix")
    var topAttributes = topFourAttributes(intrinsic_index);

    var width = 1250,
        size = 250,
        padding = 25;
    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);
    // .range([padding / di, size - padding / di]);
    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);
    // .range([size - padding / di, padding / di]);
    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);
    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);
    // var color = d3.scaleOrdinal(d3.schemeCategory10);
    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["red", "green", "blue"]);
    // fetchScatterMatrixData(function (data['original_data']) {
    scatter_data = data["original_data"]
    // if (error) throw error;
    document.getElementById('task2_area').innerHTML = ""
    d3.select("#task2_area")
        .append("h1")
        .text("Scatterplot Matrix")
        .style("font-size", "30px")
        // .attr("class", "title")
        .attr("align", "center");

    n = topAttributes.length //scatter plot matrix length
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
    // Titles for the diagonal.
    cell.filter(function (d) { return d.i === d.j; }).append("text")
        .attr("x", size / 2)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function (d) { return d.x; })
        // .attr("class","title")
        .style("font-size", "17px");
    // cell.call(brush);
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
                // .attr("class", "dot")
                .attr("cx", function (d) { return x(d[p.x]); })
                // .attr("cx", function (d) { return x(d[p.x]) + (x.bandwidth()/2; })
                .attr("cy", function (d) { return y(d[p.y]); })
                .attr("r", 4)
                .style("fill", function (d) { return color(d.clus_number) });
        }
    }
    // });
    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({ x: a[i], i: i, y: b[j], j: j });
        return c;
    }
    var trim_table_data = tableDataTrim(intrinsic_index, topAttributes);
    console.log(trim_table_data)
    displayTable(trim_table_data);
}

function displayTable(data) {
    var title = d3.keys(data[0]);
    document.getElementById("task2_table").innerHTML = ""
    d3.select("#task2_table")
        .append("h1")
        .text("Table for PC Loadings For Top 4 Features")
        .style("font-size", "30px")
        // .attr("class", "title")
        .attr("align", "center");

    var table = d3.select('#task2_table').append('table');
    table.append('thead').append('tr')
        .selectAll('th')
        .data(title).enter()
        .append("th")
        .text(function (d) { return d; });
    var rows = table.append('tbody').selectAll('tr')
        .data(data).enter()
        .append('tr');
    rows.selectAll('td')
        .data(function (d) {
            return title.map(function (k) {
                return { 'value': d[k], 'name': k };
            });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
            return d.name;
        })
        .text(function (d) {
            return d.value;
        });
}

function tableDataTrim(intrinsic_index, topAttributes) {
    var attributes_processed = 0, index = 0,
        tableData = [],
        pc_components = [],
        tableRecord;
    for (i = 1; i <= intrinsic_index; i++) {
        pc_components.push("PC" + i);
    }
    while (attributes_processed < topAttributes.length && index < data["attribute_loading"].length) {
        tableRecord = {}
        if (topAttributes.includes(data["attribute_loading"][index]["features"])) {
            tableRecord["features"] = data["attribute_loading"][index]["features"]
            pc_components.forEach(pc => {
                tableRecord[pc] = data["attribute_loading"][index][pc]
            })
            tableData.push(tableRecord)
            attributes_processed += 1
        }
        index += 1
    }
    // console.log(tableData)
    return tableData
}

renderScreePlot();
renderBiPlot();
