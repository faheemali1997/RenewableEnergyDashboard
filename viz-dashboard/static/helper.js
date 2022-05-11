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
    topValues = Object.keys(calculatedData).sort(function (a1, a2) { return a2 - a1 }).splice(0, 4)
    top_attributes = topValues.map(value => { return calculatedData[value] })
    return top_attributes
}


function displayTable(data) {
    var title = d3.keys(data[0]);
    document.getElementById("task2_table").innerHTML = ""
    d3.select("#task2_table")
        .append("h1")
        .text("Table for PC Loadings For Top 4 Features")
        .style("font-size", "30px")
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
    return tableData
}