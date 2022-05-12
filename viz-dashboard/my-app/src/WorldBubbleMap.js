import * as d3 from "d3";
import { Component } from 'react';
import Container from 'react-bootstrap/Container';
import * as topojson from "topojson-client";
import { Constants } from './utils/labels';
import countries_data from './data/countries-110m.json';
import countries_data_1 from './data/country_code.json';
import { getFilteredData } from './utils/utility';
import { LABEL } from "./utils/labels";

class WorldBubbleMap extends Component {

    width;
    height;

    componentDidMount() {
        const container = d3.select("#" + Constants.WORLD_MAP_SVG_CONTAINER_ID);
        this.width = container.node().getBoundingClientRect().width;
        this.height = container.node().getBoundingClientRect().height;
        this.drawChart();
    }

    componentDidUpdate(prevProps) {
        if (this.props.explosionsData.length !== prevProps.explosionsData.length
            || this.props.explosionsData !== prevProps.explosionsData
            || this.props.filter !== prevProps.filter
        ) {
            const svg = d3.select("#" + Constants.WORLD_MAP_SVG_CONTAINER_ID).select("svg");
            svg.remove();
            this.drawChart();
        }
    }

    drawChart() {

        const {
            countries_map,
            explosionsData,
            top_15_data,
            colorScale,
            nuclearCountries,
            filter,
            addToFilter,
            removeFromFilter
        } = this.props;

        const projection = d3.geoNaturalEarth1();
        const path = d3.geoPath(projection);

        const filteredData = getFilteredData(top_15_data, filter, "");
        const filteredData_all = getFilteredData(explosionsData, filter, "");

        let country_short = Object.keys(countries_map);
        let country_long = Object.values(countries_map);


        const data = filteredData.map(d => Object.assign({}, d, {
            "position": path.centroid({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [d.longitude, d.latitude]
                }
            })
        }));

        let hydro_map = new Map();
        let solar_map = new Map();
        for(let row in filteredData_all){
            let country = filteredData_all[row].country;
            let country_code = countries_data_1.filter(d => d["alpha-3"] == country);
            if(typeof country_code !== 'undefined'){
                let h = filteredData_all[row].hydro_consumption;
                let s = filteredData_all[row].solar_consumption;
                if(typeof country_code[0] !== 'undefined'){
                    let cc = country_code[0]["country-code"];

                    let h_value = hydro_map.get(cc) || 0;
                    hydro_map.set(cc, h_value + h)

                    let s_value = solar_map.get(cc) || 0;
                    solar_map.set(cc, s_value + s)
                }
            }
        }

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed);

        const countries = topojson.feature(countries_data, countries_data.objects.countries);

        const magScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.points))
            .range([3, 15]);

        const svg = d3.select("#" + Constants.WORLD_MAP_SVG_CONTAINER_ID)
            .append("svg")
            .attr("viewBox", [0, 0, this.width, this.height])
            .style("max-height", "100%")
            .style("width", "auto");

        svg.call(zoom);


        let mouseOver = function(d) {
            d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .5)
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "black")
        }

        let mouseLeave = function(d) {
            d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .8)
            d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
        }

    
        let fillColour = function(d){

            var colorScale_blue = d3.scaleThreshold()
                        .domain([10, 1000, 5000, 25000, 50000 ,80000])
                        .range(d3.schemeBlues[7]);
            
            var colorScale_green = d3.scaleThreshold()
                .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
                .range(d3.schemeGreens[7]);

            var colorScale_gray = d3.scaleThreshold()
                .domain([10, 1000, 5000, 25000, 50000 ,80000])
                .range(d3.schemeGreys[7]);
            

            if(filter.type.size === 0){
                if (country_long.indexOf(d.properties.name) !== -1) {
                    return colorScale(country_short[country_long.indexOf(d.properties.name)]);
                } else {
                    return Constants.DISABLED_COLOR;
                } 
            }
            else if(filter.type.has("renewable_consupmtion")){
                d.total = 100000000;
                return colorScale_green(d.total);
            }
            else if(filter.type.has("solar_consumption")){
                let value = solar_map.get(d.id);
                return colorScale_gray(d.total);
            }else if(filter.type.has("hydro_consumption")){
                // d.total = map["hydro_consumption"][country_short[country_long.indexOf(d.properties.name)]] || 0;
                let value = hydro_map.get(d.id);
                return colorScale_blue(value);
            }

        } 
        const countriesGroup = svg.append("g");

        countriesGroup
            .append("g")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("fill", d => fillColour(d))
            .attr("fill-opacity", d => {
                if(filter.country.has([d.properties.name])){
                    return 0.6
                }else{
                    return 0.3;
                }
            })   
            .attr("d", path)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .on("click", function(e, d){
                // let c = renew_map[d.properties.name]
                let c = country_short[country_long.indexOf(d.properties.name)]
                if(filter.country.has(c)){
                    removeFromFilter("country",c)
                }else{
                    addToFilter("country",c)
                }
            })

        countriesGroup
            .append("path")
            .datum(topojson.mesh(countries_data, countries_data.objects.countries, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-opacity", "1")
            .attr("stroke-width", "1")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        function zoomed(event) {
            const { transform } = event;
            countriesGroup.attr("transform", transform);
            countriesGroup.attr("stroke-width", 1 / transform.k);
        }

        svg.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", 16)
            .attr("font-weight", "bold")
            .attr("x", this.width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text(LABEL.WORLD_MAP_TITLE)

    }

    render() {
        return (
            <Container fluid id={Constants.WORLD_MAP_SVG_CONTAINER_ID} style={{ height: "100%", padding: 0 }} />
        );
    }
}

export default WorldBubbleMap;