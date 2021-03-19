let activeBrushes = new Map();
var selected_fields = [];
var field_coordinates = [];

function renderMDSData() {

    document.getElementById("data_mds_area").innerHTML = ""
    var width = 800,
        height = 750;

    var svg = d3.select("#data_mds_area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    svg.append("text")
        .attr("x", width * 0.65)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("MDS For Data");

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
        .text("MDS1");

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .attr("class", "y label")
        // .attr("stroke", "black")
        .text("MDS2");

    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["red", "green", "blue"]);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([d3.min(data["data_mds"], function (d) { return +d["MDS1"]; }), d3.max(data["data_mds"], function (d) { return +d["MDS1"]; })])
        .range([0, width]);
    var x_scatter_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([d3.min(data["data_mds"], function (d) { return +d["MDS2"]; }), d3.max(data["data_mds"], function (d) { return +d["MDS2"]; })])
        .range([height, 0]);
    g.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    var plotting_area = g.append('g')
    plotting_area.selectAll("dot")
        .data(data["data_mds"])
        .enter()
        .append("circle")
        // .attr("class", "dot")
        .attr("cx", function (d) { return x(d["MDS1"]); })
        .attr("cy", function (d) { return y(d["MDS2"]); })
        .attr("r", 4)
        .style("fill", function (d) { return color(d.clus_number) });
    // })
}

function renderMDSAttr() {

    document.getElementById("attr_mds_area").innerHTML = ""
    var width = 800,
        height = 750;

    var svg = d3.select("#attr_mds_area")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    svg.append("text")
        .attr("x", width * 3 / 4)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("MDS For Features");

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
        .text("MDS1");

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .attr("class", "y label")
        // .attr("stroke", "black")
        .text("MDS2");

    //Read the data
    // d3.csv("all_players.csv", function (data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([d3.min(data["attr_mds"], function (d) { return +d["MDS1"]; }), d3.max(data["attr_mds"], function (d) { return +d["MDS1"]; })])
        .range([0, width]);
    var x_scatter_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([d3.min(data["attr_mds"], function (d) { return +d["MDS2"]; }), d3.max(data["attr_mds"], function (d) { return +d["MDS2"]; })])
        .range([height, 0]);
    g.append("g")
        .call(d3.axisLeft(y));


    // Add dots
    var plotting_area = g.append('g')
    dots = plotting_area.selectAll("dot")
        .data(data["attr_mds"])
        .enter();
    dots.append("circle")
        .attr("class", "dot2")
        .attr("cx", function (d) { return x(d["MDS1"]); })
        .attr("cy", function (d) { return y(d["MDS2"]); })
        .attr("r", 6)
        .on("click", function (d, i) {
            function drawLine(attribute, chart_x, chart_y) {
                if (!selected_fields.includes(attribute)) {
                    selected_fields.push(attribute);
                    index = selected_fields.length - 1
                    field_coordinates.push([chart_x, chart_y])
                    if (selected_fields.length > 1) {
                        g.append("svg:line")
                            .attr("class", "chartline")
                            .attr("x1", field_coordinates[index - 1][0]).attr("y1", field_coordinates[index - 1][1])
                            .attr("x2", field_coordinates[index][0]).attr("y2", field_coordinates[index][1])
                            .style("stroke", "steelblue")
                            .style("stroke-width", 1);
                    }
                }
            }
            drawLine(d["features"], x(d["MDS1"]), y(d["MDS2"]));
        });

    dots.append("text")
        .text(function (d) { return d["features"]; })
        .style("font-size", "12px")
        .attr("x", function (d) { return x(d["MDS1"]) + 50; })
        .attr("y", function (d) { return y(d["MDS2"]) - 8; });

    // })
}

function renderPCP(custom_dimensions) {
    var margin = { top: 100, right: 100, bottom: 100, left: 100 },
        width = 1600 - margin.left - margin.right,
        height = 750 - margin.top - margin.bottom;

    var x = d3.scaleBand().range([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(),
        background,
        foreground;

    document.getElementById("task4_area").innerHTML = ""

    var svg = d3.select("#task4_area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select("#task4_area")
        .select("svg")
        .append("text")
        .attr("x", width * 0.67)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("Parallel Coordinates Plot");

    // d3.csv("cars.csv", function (error, cars) {

    // Extract the list of dimensions and create a scale for each.
    var dimensions = [];
    if (custom_dimensions.length <= 1) {
        dimensions = d3.keys(data["original_data"][0]);
        console.log(dimensions)
    }
    else {
        dimensions = custom_dimensions;
    }
    dimensions = dimensions.filter(function (d) {
        return d != "clus_number" && (y[d] = d3.scaleLinear()
            .domain(d3.extent(data["original_data"], function (p) {
                return +p[d];
            }))
            .range([height, 0]));
    })
    x.domain(dimensions);
    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["red", "green", "blue"]);

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data["original_data"])
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data["original_data"])
        .enter().append("path")
        .attr("d", path)
        .style("stroke", function (d) { return color(d.clus_number) });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .subject(function (d) { return { x: x(d) }; })
            .on("start", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; })
        .attr("class", "axis");

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            // d3.select(this).call(y[d].brush = d3.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
            d3.select(this).call(y[d].brush = d3.brushY().extent([[-10, 0], [10, height]]).on("brush", brushed).on("end", brushEnd));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);


    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
    }

   


    function updateBrushing() {
        svg.selectAll("path").classed("hidden", d => {

            var path_visible = true;

            //for every attribute, check if it is brushed
            dimensions.forEach(attribute => {
                var attr_visible = true;
                //if there is a brush for current attribute
                if (activeBrushes.get(attribute) != undefined) {
                    //get event.selection for attribute
                    const y0 = activeBrushes.get(attribute)[0]
                    const y1 = activeBrushes.get(attribute)[1]
                    if (d != null) {
                        //for current path, get the value for current attribute
                        const value = y[attribute](d[attribute])
                        // console.log(value)
                        //check if value in brush selection
                        if (y0 <= value && y1 >= value) { attr_visible = true; }
                        else { attr_visible = false; }
                    }
                }
                path_visible = (path_visible && attr_visible);
            })

            return !path_visible;
        })
    }

    function brushed(attribute) {
        activeBrushes.set(attribute, d3.event.selection);
        // console.log(activeBrushes)
        updateBrushing();
    }

    function brushEnd(attribute) {
        if (d3.event.selection !== null) return;
        activeBrushes.delete(attribute);
        updateBrushing();
    }
}

function updatePCP() {
    renderPCP(selected_fields);
    d3.select("#attr_mds_area").select("svg").select("g").selectAll('.chartline').remove();
    selected_fields = [];
    field_coordinates = [];
}

renderMDSData();
renderMDSAttr();
renderPCP([]);