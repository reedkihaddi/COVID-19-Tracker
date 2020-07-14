import React, { Component } from 'react';
import { Cards, SearchBar, HeadBar, Chart, RadialChart, LineChart} from './Components';
import { fetchNationalData } from './api';


class App extends Component {

  state = {
    data: {},
    location: '',
  }

  async componentDidMount() {
    const fetchedData = await fetchNationalData();
    this.setState({ data: fetchedData })
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <HeadBar></HeadBar>
        <SearchBar></SearchBar>
        <Cards data={data}></Cards>
        <Chart></Chart>
        <RadialChart></RadialChart>
        <LineChart></LineChart>
      </div>
    )
  }
}

export default App;

