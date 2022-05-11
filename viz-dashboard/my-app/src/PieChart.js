import React, { useEffect } from 'react';
import * as d3 from 'd3';
import Container from 'react-bootstrap/Container';
import { Component } from 'react';
import { Constants } from './utils/labels';
import { LABEL } from './utils/labels';

class PieChart extends Component {
    
    width;
    height;

    componentDidMount() {
        const container = d3.select("#" + Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID);
        this.width = container.node().getBoundingClientRect().width;
        this.height = container.node().getBoundingClientRect().height;
        this.drawChart();
    }


    componentDidUpdate(prevProps) {
        // const svg = d3.select("#" + Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID).select("svg");
        // svg.remove();
        // this.drawChart();
    }

    // useEffect(() => {
    //     drawChart();
    //   }, [data]);

    drawChart = () => {
        const data = [{ label: 'Solar Energy', value: 20 }, { label: 'Wind Energy', value: 10 }, { label: 'Hydro Energy', value: 5 }, { label: 'Nuclear Energy', value: 5 }, { label: 'Coal Energy', value: 30 }, { label: 'Gas Energy', value: 30 }];

        const outerRadius = 120;
        const innerRadius = 0;

        const colorScale = d3     
            .scaleSequential()      
            .interpolator(d3.interpolateCool)      
            .domain([0, data.length]);
          
        d3.select("#" + Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID)
        .select('svg')
        .remove();
      
          // Create new svg
          const svg = d3
            .select("#" + Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

          svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 16)
            .attr("font-weight", "bold")
            .attr("x", (this.width) / 12)
            .attr("y", -140)
            .attr("text-anchor", "middle")
            .text("Electricity Consumption by Type")
      
          const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
      
          const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);
      
          const arc = svg
            .selectAll()
            .data(pieGenerator(data))
            .enter();
      
          // Append arcs
          arc
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0);
      
          // Append text labels
          arc
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label)
            .style('fill', (_, i) => colorScale(data.length - i))
            .attr('transform', (d) => {
              const [x, y] = arcGenerator.centroid(d);
              return `translate(${x}, ${y})`;
            });
        
    }

    render() {
        return (
            <Container fluid id={Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID} style={{ height: "100%", padding: 0 }} />
        );
    }
}

export default PieChart;