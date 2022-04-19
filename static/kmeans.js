function renderKmeansPlot(){

    var outerWidth  = 960, outerHeight = 500;    
    var margin = {top: 100, right: 100, bottom: 80, left: 200};   
    var width = outerWidth - margin.left - margin.right,       
        height = outerHeight - margin.top - margin.bottom;     

    var data = data1["distortions"]
    
    function xValue(d) { return d.x; }      
    function yValue(d) { return d.y; }

    var x = d3.scaleLinear()                
        .domain(d3.extent(data,xValue))
        .range([0,width]);

    var y = d3.scaleLinear()                
        .domain(d3.extent(data,yValue))
        .range([height,0]);                 

    var line = d3.line()                     
        .x(function(d) { return x(d.x); } )
        .y(function(d) { return y(d.y); } );

    var xAxis = d3.axisBottom(x)
        .ticks(15)                           

    var yAxis = d3.axisLeft(y)               
        .ticks(11)

    var svg = d3.select("#kmeans").append("svg")
        .attr("width",  outerWidth)
        .attr("height", outerHeight);    

    var g = svg.append("g")                
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")                           
        .attr("class", "y axis")
        .call(yAxis);

    g.append("g")                            
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") 
        .call(xAxis);

    g.append("text")                         
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height + 2*margin.bottom/3 + 6)
        .style("font-size", "15px")
        .text("Value of K");

    g.append("text")                        
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width/2 + 180)
        .attr("y", -margin.top/2)
        .attr("dy", "+.75em")
        .style("font-size", "30px")
        .text("Kmeans clustering - Elbow Plot");

    g.append("text")                         
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height/3 + 50)
        .attr("y", -1 - margin.left/3+30)
        .attr("dy", "-.75em")
        .attr("transform", "rotate(-90)")
        .style("font-size", "15px")
        .text("Sum of Squared Errors(SSE) in 10e15");

    g.append("path")                         
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style('fill', 'none')
        .style('stroke', '#fff')
        .transition()
        .delay(100)
        .duration(1000)
        .style('stroke', '#000')

    g.selectAll(".dot")                      
        .data(data)
        .enter().append("circle")
        .style("fill", "#1DB954")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.x); } )
        .attr("cy", function(d) { return y(d.y); } )
        .attr("r", 5);
}

renderKmeansPlot()