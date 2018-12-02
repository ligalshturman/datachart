import React, { Component } from 'react';
import { LineChart, Line } from 'recharts';
import './App.css';
import {
  DropdownButton,
  MenuItem,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Well } from 'react-bootstrap';
import DataChart from './components/DataChart';
import './generalStyle.css'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      visibleData: [],
      fromYear: '',
      toYear: '',
      minYear: '',
      maxYear: '',
      threshold: '100000',
      value: 100000,
      age: '18',
      maxCount: 0
    };

    this.getDataForChart = this.getDataForChart.bind(this);
    this.getVisibleData = this.getVisibleData.bind(this);
    this.renderFromDataRange = this.renderFromDataRange.bind(this);
    this.renderToDataRange = this.renderToDataRange.bind(this);
    this.setThreshold = this.setThreshold.bind(this);
    this.setRange = this.setRange.bind(this);
    this.setAge = this.setAge.bind(this);
    this.updateMaxCount = this.updateMaxCount.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.getDataForChart();
  }

  getDataForChart() {
    let url = 'http://api.population.io/1.0/population/Israel/' + this.state.age;
    fetch(url)
    .then(response => response.json()).then((data) => {
      if(data) {
        let maxYear = new Date().getFullYear();
        if(data[data.length - 1].year < new Date().getFullYear()) {
          maxYear = data[data.length - 1].year;
        }

        let updatedVisibleData = [];
        for(let i = 0; i <= data.length-1; i++) {
          if(data[i].year <= maxYear) {
            updatedVisibleData.push(data[i]);
          }
        }
        
        this.setState({
          data: data,
          visibleData: updatedVisibleData,
          fromYear: data[0].year,
          toYear: maxYear,
          minYear: data[0].year,
          maxYear: maxYear,
          threshold: '100000'
        });
        
        this.updateMaxCount(updatedVisibleData);
      } else {
        throw new Error('Something went wrong');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  updateMaxCount(data) {
    var maxCount = 0;
    for(let i = 0; i <= data.length-1; i++) {
      if(data[i].total > maxCount) {
          maxCount = data[i].total;
      }
    }

    this.setState({
      maxCount: maxCount
    });
  }

  setThreshold() {
    if(this.inputThresholdNode.value >= 0 && this.inputThresholdNode.value <= this.state.maxCount)
    {
      this.setState({
        threshold: this.inputThresholdNode.value
      });
    }
  }

  setAge() {
    if(this.inputAgeNode.value >= 1 && this.inputAgeNode.value <= 200)
    {
      this.setState({
        age: this.inputAgeNode.value
      });
    }

    this.getDataForChart();
  }

  onChange(e) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
       this.setState({value: e.target.value})
    }
  }

  renderFromDataRange() {
    let items = [];
    for(let y = this.state.minYear; y <= this.state.maxYear; y++) {
      items.push(
        <MenuItem
          key={y}
          value={y}
          onSelect={() => { if(y < this.state.toYear){this.setState({fromYear: y})} }}>
        {y}
        </MenuItem>);   
    }

    return items;
  }

  renderToDataRange()
  {
    let items = [];
    for(let y = this.state.minYear; y <= this.state.maxYear; y++) {
      items.push(
        <MenuItem
          key={y}
          value={y}
          onSelect={() => { if(y > this.state.fromYear){this.setState({toYear: y})} }}>
        {y}
        </MenuItem>);    
    }

    return items;
  }

  setRange() {
    this.setState({
      visibleData: this.getVisibleData()
    });
  }

  getVisibleData() {
    let visibleData = [];
    for(let i = 0; i <= this.state.data.length-1; i++) {
      if(this.state.data[i].year >= this.state.fromYear && this.state.data[i].year <= this.state.toYear) {
          visibleData.push(this.state.data[i]);
      }
    }
    return visibleData;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Population count in Israel (age {this.state.age})
          </p>
        </header>
        <div className="container">
          <div className="menu">
            <Well>
              <div className="select_option">
                <Form inline>
                  <FormGroup controlId="formInlineName">
                    <ControlLabel>Years Range</ControlLabel>{' '}
                    <DropdownButton
                    title={this.state.fromYear}
                    bsSize="small"
                    id="from-year">
                    { this.renderFromDataRange() }
                  </DropdownButton>{' '}
                  <DropdownButton
                    title={this.state.toYear}
                    bsSize="small"
                    id="to-year">
                    { this.renderToDataRange() }
                  </DropdownButton>
                  </FormGroup>{' '}
                  <Button type="button" onClick={this.setRange}>Set Range</Button>
                </Form>
              </div>
              <div className="set_threshold">
                <Form inline>
                  <FormGroup controlId="formInlineName">
                    <ControlLabel>Threshold</ControlLabel>{' '}
                    <FormControl type="text" placeholder="100000" value={this.state.value} inputRef={node => this.inputThresholdNode = node} onChange={this.onChange} />
                  </FormGroup>{' '}
                  <Button type="button" onClick={this.setThreshold}>Set Threshold</Button>
                </Form>
              </div>
              <div className="set_age">
                <Form inline>
                  <FormGroup controlId="formInlineName">
                    <ControlLabel>Age</ControlLabel>{' '}
                    <FormControl type="text" placeholder="18" inputRef={node => this.inputAgeNode = node} onChange={this.onChangeAge} />
                  </FormGroup>{' '}
                  <Button type="button" onClick={this.setAge}>Set Age</Button>
                </Form>
              </div>
            </Well>
          </div>
          <div className="chart">
            <DataChart 
              data={this.state.visibleData}
              country="Israel"
              age="18"
              fromYear={this.state.fromYear}
              toYear={this.state.toYear}
              threshold={this.state.threshold }
              maxCount={this.state.maxCount}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
