import React, {Component} from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

class DataChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      threshold: 100000
    }
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    if(nextProps.data != nextState.data)
    {
        this.setState({
            data: nextProps.data
        });
    }

    if(nextProps.maxCount != nextState.maxCount)
    {
        this.setState({
            maxCount: nextProps.maxCount
        });
    }

    if(nextProps.threshold != nextState.threshold)
    {
        this.setState({
            threshold: nextProps.threshold
        });
    }
    
    return true;
  }

  static defaultProps = {
    country:'',
    age:''
  }

  render(){
    var exceptions = (1 - this.state.threshold/this.state.maxCount)*100 + "%";
    return (
      <div className="chart">
        <LineChart width={1000} height={400} data={this.props.data}>
            <defs>
            <linearGradient id="colorUv" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset={exceptions} stopColor="red" />
                <stop offset="0%" stopColor="green" />
            </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="year">
                <Label value="Year" dy={15} />
            </XAxis>
            <YAxis dataKey="total" label={{ value: 'count', angle: -90, position: 'insideLeft' }} />
            <Tooltip/>
            <Legend verticalAlign="top" height={36}/>
            <ReferenceLine y={this.state.threshold} label="" stroke="red"/>
            <Line type="monotone" dataKey="total" stroke="#8884d8"/>
            <Line
                type="monotone"
                dataKey="total"
                stroke="url(#colorUv)"
                strokeWidth={5}
                dot={false}
                activeDot={false}
            />
        </LineChart>
      </div>
    )
  }
}

export default DataChart;