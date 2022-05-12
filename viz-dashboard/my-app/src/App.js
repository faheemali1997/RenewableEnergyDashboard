import './App.css';

import { Component } from 'react';
import * as d3 from "d3";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import WorldBubbleMap from './WorldBubbleMap';
import StackedBarchartType from './StackedBarchartType';
import ParallelCoordinatePlot from './ParallelCoordinatePlot';
import ExplosionsStackedAreaChart from './ExplosionsStackedAreaChart';
import PieChart from './PieChart';

import { LABEL } from "./utils/labels";

class App extends Component {

    colorScale;

    top_15_countries = {
        "CHN" : "China",
        "USA" : "United States of America",
        "BRA" : "Brazil",
        "CAN" : "Canada",
        "IND" : "India",
        "DEU" : "Germany",
        "RUS" : "Russia",
        "JPN" : "Japan",
        "NOR" : "Norway",
        "ITA" : "Italy",
        // "SWE" : "Sweden",
        // "ESP" : "Spain",
        // "FRA" : "France",
        // "GBR" : "United Kingdom",
        // "AUS" : "Australia"
    }
    
    constructor(props) {
        super(props);

        this.state = {
            countries_map: {},
			countries: [],
			original_data: [],
            top_15_data: [],
            features:[],
			filter: {
				country: new Set(),
				type: new Set(),
				purpose: new Set(),
				yearRange: [1940, 2020],
				magnitude_body: [],
				magnitude_surface: [],
				depth: [],
				yield_lower: [],
				yield_upper: [],
			}
        }

        this.colorScale = d3.scaleOrdinal()
            .domain(this.state.countries)
            .range(["#ffffd9","#edf8ba","#cdebb4","#97d7b9","#5dc0c0","#32a5c2","#217fb7","#2255a4","#1e3489","#081d58"])
        // this.colorScale = d3.scaleLinear().domain(this.state.countries)
        //                  .range(["white", "blue"]);
    }

    componentDidMount() {
        fetch("/data_energy")
            .then(res => res.json())
            .then(
                (res) => {
                    let c = {}
                    for(let row in res["data"]){
                        let country = res["data"][row].country
                        if(Object.keys(c).indexOf(country) == -1){
                            c[country] = res["data"][row].country_x;
                        }
                    }
                    let top_15_data = res["data"].filter(d => Object.keys(this.top_15_countries).indexOf(d.country) != -1)
                    let countries = new Set(top_15_data.map(d=>d.country))
                    this.setState({
                        countries_map: c,
                    	countries: [...new Set(countries)],
						original_data: res["data"],
                        top_15_data: top_15_data,
                        features: res["features"],
                    })
                    this.colorScale = d3.scaleOrdinal()
                        .domain(countries)
                        .range(["#ffffd9","#edf8ba","#cdebb4","#97d7b9","#5dc0c0","#32a5c2","#217fb7","#2255a4","#1e3489","#081d58"])
                    // this.colorScale = d3.scaleLinear().domain(countries)
                    // .range(["white", "blue"]);

                    console.log(countries);
                    console.log(this.colorScale("USA"));
                    console.log(this.colorScale("IND"));

                }
            )
    }

    addToFilter = (key, value) => {
        let newFilter = Object.assign({}, this.state.filter)
        newFilter[key] = new Set(this.state.filter[key]);
        newFilter[key].add(value);
        console.log("key", key, "val", value, "new filter", newFilter, "old filter", this.state.filter);
        this.setState({
            filter: newFilter
        })
    }

    addRangeFilter = (key, value) => {
        let newFilter = Object.assign({}, this.state.filter)
        if (this.state.filter[key].length !== 2 || this.state.filter[key][0] !== value[0] || this.state.filter[key][1] !== value[1]) {
            newFilter[key] = value.slice();

            console.log("key", key, "val", value, "new filter", newFilter, "old filter", this.state.filter);
            this.setState({
                filter: newFilter
            })
        }
    }

    removeFromFilter = (key, value) => {
        let newFilter = Object.assign({}, this.state.filter)
        newFilter[key] = new Set(this.state.filter[key]);
        newFilter[key].delete(value)
        console.log("new filter", newFilter, this.state.filter);

        if (newFilter.country.size === 0 && newFilter.type.size === 0 && newFilter.purpose.size === 0) {
            newFilter["yearRange"] = [1940, 2020];
        }
        this.setState({
            filter: newFilter
        })
    }

    resetFilters = () => {
		this.setState({
			filter: {
				country: new Set(),
				type: new Set(),
				purpose: new Set(),
				yearRange: [1940, 2020],
				magnitude_body: [],
				magnitude_surface: [],
				depth: [],
				yield_lower: [],
				yield_upper: [],
			}
		})
    }

    render() {
      return (
            <div style={{ height: "100vh" }} >
                <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" fixed="top" style={{ height: "4vh" }}>
                    <Nav className="justify-content-start" onSelect={this.resetFilters} style={{ width: "10%" }}>
                        <Nav.Link href="#"> Reset </Nav.Link>
                    </Nav>
                    <Navbar.Brand className="justify-content-center" style={{ width: "100%", textAlign: "center" }}> {LABEL.PAGE_HEADING} </Navbar.Brand>
                </Navbar>
                <Container fluid style={{ height: "96vh", paddingTop: "40px" }}>
                    <Row>
						<Col className="main-col-cards" sm={6}>
                            <Card style={{ height: "48vh" }}>
                                <WorldBubbleMap
                                    countries_map={this.top_15_countries}
                                    explosionsData={this.state.original_data}
                                    top_15_data={this.state.top_15_data}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.countries}
                                    filter={this.state.filter}
                                    addToFilter={this.addToFilter}
                                    removeFromFilter={this.removeFromFilter}
                                />
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={6}>
                            <Card style={{ height: "48vh" }}>
                                <StackedBarchartType
                                    explosionsData={this.state.top_15_data}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.countries}
                                    filter={this.state.filter}
                                    addToFilter={this.addToFilter}
                                    removeFromFilter={this.removeFromFilter}
                                />
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={0}>
                            
                        </Col>
                    </Row>
                    <Row>
                        <Col className="main-col-cards" sm={4}>
                            <Card style={{ height: "47vh" }}>
                                <ExplosionsStackedAreaChart
                                    explosionsData={this.state.top_15_data}
                                    explosionsFeatures={this.state.features}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.countries}
                                    filter={this.state.filter}
                                    addRangeFilter={this.addRangeFilter}
                                />
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={5}>
                            <Card style={{ height: "47vh" }}>
                                <ParallelCoordinatePlot
                                    explosionsData={this.state.top_15_data}
                                    colorScale={this.colorScale}
                                    filter={this.state.filter}
                                    addRangeFilter={this.addRangeFilter}
                                    addToFilter={this.addToFilter}
                                    removeFromFilter={this.removeFromFilter}
                                />
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={3}>
                            <Card style={{ height: "47vh" }}>
                            <PieChart
                                explosionsData={this.state.top_15_data}
                                colorScale={this.colorScale}
                                nuclearCountries={this.state.countries}
                                filter={this.state.filter}
                                addToFilter={this.addToFilter}
                                removeFromFilter={this.removeFromFilter}
                            />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>  
      );
    }
}

export default App;
