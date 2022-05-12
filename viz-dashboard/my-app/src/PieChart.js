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
        { 
          label: 'renewables_consumption', 
          show_label: 'Renewable Energy',
          value: 0,
          per:0,
        }, 
        { 
          label: 'fossil_fuel_consumption', 
          show_label: 'Non-Renewable Energy',
          value: 0,
          per: 0,
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

      let total = data[0].value + data[1].value;
      data[0].per = data[0].value/total * 100;
      data[1].per = data[1].value/total * 100;
    
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
        .attr("y",-160)
        .attr("text-anchor", "middle")
        .text("Renewable Vs Non-renewable")
        
        let width = this.width;
        let height = this.height;

        var pie = d3.pie()
        .sort(null)
        .value(d => d.value);
    
        var arc = d3.arc()
        .innerRadius(Math.min(width, height) / 2 - 150)
        .outerRadius(Math.min(width, height) / 2 - 50)
        .cornerRadius(15);
    
        var arcLabel = function(){
            const radius = Math.min(width, height) / 2 * 0.8;
            return d3.arc().innerRadius(radius).outerRadius(radius);
        }
        
      let getColor = function(d){
        if(d == 0 && filter.country.size == 1){
          const [first] = filter.country;
          return colorScale(first);
        }else if(d==0 && filter.country.size != 1){
          return "#081d58";
        }else{
          return "#949494";
        }
      }

      const arcs = pie(data);
        svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .enter().append("path")
      .attr("fill", (_,d) => getColor(d))
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.show_label}: ${d.data.value.toLocaleString()}`);

      svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .enter().append("text")
      .attr("transform", d => `translate(${arcLabel().centroid(d)})`)
      .call(text => text.append("tspan")
      .attr("y", "-0.4em")
      .attr("font-weight", "bold")
      .text(d => d.data.show_label))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr("x", 0)
      .attr("y", "0.7em")
      .attr("fill-opacity", 0.7)
      .text(d => d.data.value.toLocaleString())
      .text(d => `${d.data.per.toLocaleString()}%`));
    }

    render() {
        return (
            <Container fluid id={Constants.INVENTORY_MULTILINE_CHART_SVG_CONTAINER_ID} style={{ height: "100%", padding: 0 }} />
        );
    }
}

export default PieChart;