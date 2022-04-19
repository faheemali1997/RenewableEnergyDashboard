import './App.css';

import { Component } from 'react';
import * as d3 from "d3";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import { LABEL } from "./utils/labels";

class App extends Component {

  colorScale;

  constructor(props) {
      super(props);

      this.state = {
        countries: []
      }

      this.colorScale = d3.scaleOrdinal()
            .domain(this.state.countries)
            .range(d3.schemeCategory10)
  }

  componentDidMount() {
      fetch("/data_info")
          .then(res => res.json())
          .then(
              (res) => {
                  let countries = res["original_data_w_catergorical"].map(d => d.country);
                  this.setState({
                    countries: [...new Set(countries)]
                  })
                  console.log(countries);

                  this.colorScale = d3.scaleOrdinal()
                        .domain(countries)
                        .range(d3.schemeCategory10)
              }
          )
  }

  render() {
      return (
            <div style={{ height: "100vh" }}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" style={{ height: "4vh" }}>
                    <Nav className="justify-content-start" onSelect={this.resetFilters} style={{ width: "10%" }}>
                        <Nav.Link href="#"> Reset Filters </Nav.Link>
                    </Nav>
                    <Navbar.Brand className="justify-content-center" style={{ width: "100%", textAlign: "center" }}> {LABEL.PAGE_HEADING} </Navbar.Brand>
                </Navbar>
                <Container fluid style={{ height: "96vh", paddingTop: "40px" }}>
                    <Row>
                        <Col sm={3}>
                            <Row>
                                <Col className="main-col-cards" sm={12}>
                                    <Card style={{ height: "24vh" }}>
                                        {/* <BarchartCountries
                                            explosionsData={this.state.explosionsData}
                                            colorScale={this.colorScale}
                                            filter={this.state.filter}
                                            addToFilter={this.addToFilter}
                                            removeFromFilter={this.removeFromFilter}
                                        /> */}
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="main-col-cards" sm={12}>
                                    <Card style={{ height: "24vh" }}>
                                        {/* <StackedBarchartType
                                            explosionsData={this.state.explosionsData}
                                            colorScale={this.colorScale}
                                            nuclearCountries={this.state.nuclearCountries}
                                            filter={this.state.filter}
                                            addToFilter={this.addToFilter}
                                            removeFromFilter={this.removeFromFilter}
                                        /> */}
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="main-col-cards" sm={3}>
                            <Card style={{ height: "48vh" }}>
                                {/* <StackedHorizontalBarchartPurpose
                                    explosionsData={this.state.explosionsData}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.nuclearCountries}
                                    filter={this.state.filter}
                                    addToFilter={this.addToFilter}
                                    removeFromFilter={this.removeFromFilter}
                                /> */}
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={6}>
                            <Card style={{ height: "48vh" }}>
                                {/* <WorldBubbleMap
                                    explosionsData={this.state.explosionsData}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.nuclearCountries}
                                    filter={this.state.filter}
                                /> */}
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="main-col-cards" sm={4}>
                            <Card style={{ height: "47vh" }}>
                                {/* <ExplosionsStackedAreaChart
                                    explosionsData={this.state.explosionsData}
                                    explosionsFeatures={this.state.explosionsFeatures}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.nuclearCountries}
                                    filter={this.state.filter}
                                    addRangeFilter={this.addRangeFilter}
                                /> */}
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={4}>
                            <Card style={{ height: "47vh" }}>
                                {/* <ParallelCoordinatePlot
                                    explosionsData={this.state.explosionsData}
                                    colorScale={this.colorScale}
                                    filter={this.state.filter}
                                    addRangeFilter={this.addRangeFilter}
                                    addToFilter={this.addToFilter}
                                    removeFromFilter={this.removeFromFilter}
                                /> */}
                            </Card>
                        </Col>
                        <Col className="main-col-cards" sm={4}>
                            <Card style={{ height: "47vh" }}>
                                {/* <InventoryMultiLineChart
                                    inventoryData={this.state.inventoryData}
                                    inventoryFeatures={this.state.inventoryFeatures}
                                    colorScale={this.colorScale}
                                    nuclearCountries={this.state.nuclearCountries}
                                    filter={this.state.filter}
                                /> */}
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>  
      );
  }
}

export default App;
