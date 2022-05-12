import React, { useEffect } from 'react';
import * as d3 from 'd3';
import Container from 'react-bootstrap/Container';
import { Component } from 'react';
import { Constants } from './utils/labels';
import { LABEL } from './utils/labels';
import { getFilteredData } from './utils/utility';

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
      if (this.props.explosionsData.length !== prevProps.explosionsData.length
        || this.props.explosionsData !== prevProps.explosionsData
        || this.props.filter !== prevProps.filter
      )   
      { const svg = d3.select("#" + Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID).select("svg");
        svg.remove();
        this.drawChart();
      }
    }

    drawChart = () => {

      const {
        explosionsData,
        colorScale,
        nuclearCountries,
        filter,
        addToFilter,
        removeFromFilter
      } = this.props;


      const filteredData = getFilteredData(explosionsData, filter, "");


      const data = [
        { label: 'renewables_consumption', 
          value: 0 
        }, 
        { 
          label: 'fossil_fuel_consumption', 
          value: 0 
        }
      ];

      for(let row in filteredData){
        for(let d in data){
          if(data[d].label == 'renewables_consumption'){
              data[d].value += filteredData[row]['renewables_consumption']
          }
          if(data[d].label == 'fossil_fuel_consumption'){
              data[d].value += filteredData[row]['fossil_fuel_consumption']
          }
      }
      }
      
      const outerRadius = 120;
      const innerRadius = 0;

      // const colorScale = d3     
      //       .scaleSequential()      
      //       .interpolator(d3.interpolateBuGn)      
      //       .domain([0, data.length]);
          
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
    
        let getColor = function(d){
          if(d == 0 && filter.country.size == 1){
            const [first] = filter.country;
            return colorScale(first);
          }else if(d==0 && filter.country.size != 1){
            return "#081d58";
          }else{
            return "#625D5D";
          }

        }
        // Append arcs
        arc
          .append('path')
          .attr('d', arcGenerator)
          .style('fill', (_, i) => getColor(i))
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
            return `translate(${x+10}, ${y})`;
          });
        
    }

    render() {
        return (
            <Container fluid id={Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID} style={{ height: "100%", padding: 0 }} />
        );
    }
}

export default PieChart;