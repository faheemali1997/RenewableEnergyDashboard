var fields_selected = [];
var fields_coordinates = [];

/**
 * This function renders the data MDS plot which uses the Euclidian distance and visualizes it via a scatterplot.
 */
function renderMDSData() {
    //Gets the document element by id
    document.getElementById("mds_data").innerHTML = ""
    var width = 800,
        height = 700;

    var svg = d3.select("#mds_data")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //Append title text
    svg.append("text")
        .attr("x", width * 0.65)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("Task4 (a): MDS Plot - Data");

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    //Append X-axis to the plot
    const xAxis = g.append('g')
        .attr('transform', "translate(0," + height + ")");

    //Append Y-axis to the plot    
    const yAxis = g.append('g');

    xAxis.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', 60)
        .attr("class", "x label")
        .style("font-size", "15px")
        .text("MDS_1");

    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .attr("class", "y label")
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .text("MDS_2");

    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["red", "#1DB954", "black"]);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([d3.min(data["data_mds"], function (d) { return +d["MDS1"]; }), d3.max(data["data_mds"], function (d) { return +d["MDS1"]; })])
        .range([0, width]);
    var x_scatter_scale = g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // Add Y axis
    var xMin = d3.min(data["data_mds"], function (d) { return +d["MDS2"]; });
    var xMax = d3.max(data["data_mds"], function (d) { return +d["MDS2"]; });
    
    var y = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([height, 0]);

    g.append("g")
        .call(d3.axisLeft(y));

    var plotting_area = g.append('g')
    
    //Addin dots to the scatter plot coloured based on there cluster id.
    plotting_area.selectAll("dot")
        .data(data["data_mds"])
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d["MDS1"]); })
        .attr("cy", function (d) { return y(d["MDS2"]); })
        .attr("r", 4)
        .style("fill", function (d) { return color(d.clus_number) });
}

/**
 * This function renders the data MDS plot which uses the use the (1-|correlation|) distance and visualizes it via a scatterplot.
 */
function renderMDSAttr() {
    document.getElementById("mds_attr").innerHTML = ""
    var width = 800,
        height = 700;

    var svg = d3.select("#mds_attr")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    svg.append("text")
        .attr("x", width * 3 / 4)
        .attr("y", 30)
        .style("font-size", "30px")
        .text("Task4 (b): MDS Plot - Features");

    var margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    const xAxis = g.append('g')
        .attr('transform', "translate(0," + height + ")");
    const yAxis = g.append('g');

    xAxis.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', 60)
        .style("font-size", "15px")
        .attr("class", "x label")
        .text("MDS_1");

    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .attr("class", "y label")
        .text("MDS_2");

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

    // Adds the data to scatter plot and also listens for any clicks on the feature points.
    // On click it adds the feature to feature list and also the x,y coordinated to the coordinate list.
    dots.append("circle")
        .attr("class", "dot2")
        .attr("cx", function (d) { return x(d["MDS1"]); })
        .attr("cy", function (d) { return y(d["MDS2"]); })
        .attr("r", 6)
        .on("click", function (d, i) {
            drawLine(d["features"], x(d["MDS1"]), y(d["MDS2"]));
        });

    dots.append("text")
        .text(function (d) { return d["features"]; })
        .style("font-size", "12px")
        .attr("x", function (d) { return x(d["MDS1"]) + 35; })
        .attr("y", function (d) { return y(d["MDS2"]) - 8; });

    /*
    *  This function adds the selected features to the fields list and also draws a line between the two points.
    *  In case the feature is already selected it does not add it to the list.
    *  The order of the list is also maintained
    */
    function drawLine(feature, chart_x, chart_y) {
        if (!fields_selected.includes(feature)) {
            fields_selected.push(feature);
            index = fields_selected.length - 1
            fields_coordinates.push([chart_x, chart_y])
            if (fields_selected.length > 1) {
                g.append("svg:line")
                    .attr("class", "chartline")
                    .attr("x1", fields_coordinates[index - 1][0]).attr("y1", fields_coordinates[index - 1][1])
                    .attr("x2", fields_coordinates[index][0]).attr("y2", fields_coordinates[index][1])
                    .style("stroke", "black")
                    .style("stroke-width", 4);
            }
        }
    }
}

let activeBrushes = new Map();

/**
 * This function visualizes the data in a parallel coordinates plot(all data dimensions, 
 * categorical and numerical) and also color codes the polylines based on the cluster id.
 * 
 * A user can interact with the features scatter plot to meaningfully order the features based on the user preference.
 * 
 * Reference: https://bl.ocks.org/jasondavies/1341281
 */
function renderPCP(new_dimensions) {
    var margin = { top: 100, right: 100, bottom: 100, left: 100 };
    var width = 1600 - margin.left - margin.right;
    var height = 750 - margin.top - margin.bottom;

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
        .text("Task5: Parallel Coordinates Plot");

    // Extract the list of dimensions and create a scale for each.
    var dimensions = [];
    if (new_dimensions.length > 1) {
        dimensions = new_dimensions;
    }
    else {
        dimensions = d3.keys(data["original_data"][0]);
    }

    dimensions = dimensions.filter(function (d) {
        return d != "clus_number" && (y[d] = d3.scaleLinear()
            .domain(d3.extent(data["original_data"], function (p) {
                return +p[d];
            }))
            .range([height, 0]));
    })
    x.domain(dimensions);
    
    var color = d3.scaleOrdinal().domain([0, 1, 2]).range(["red", "green", "black"]);

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

    function path(d) {
        return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
    }

    function updateBrushing() {
        svg.selectAll("path").classed("hidden", d => {

            var path_visible = true;

            dimensions.forEach(attribute => {
                var attr_visible = true;
                if (activeBrushes.get(attribute) != undefined) {
                    const y0 = activeBrushes.get(attribute)[0]
                    const y1 = activeBrushes.get(attribute)[1]
                    if (d != null) {
                        const value = y[attribute](d[attribute])
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
        updateBrushing();
    }

    function brushEnd(attribute) {
        if (d3.event.selection !== null) return;
        activeBrushes.delete(attribute);
        updateBrushing();
    }
}

function onPCPUpdate() {
    renderPCP(fields_selected);
    d3.select("#mds_attr").select("svg").select("g").selectAll('.chartline').remove();
    fields_selected = [];
    fields_coordinates = [];
}

renderMDSData();
renderMDSAttr();
renderPCP([]);