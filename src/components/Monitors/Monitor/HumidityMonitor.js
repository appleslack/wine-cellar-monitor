import React, {Component} from 'react';
import classes from './HumidityMonitor.module.css';
import baseclasses from './Monitor.module.css';

class HumidityMonitor extends Component {
  
  render () {
    return (
      <div className={[ baseclasses.Monitor, classes.HumidityMonitor].join(' ')}>
        Humidity Monitor
        <div className="indicator">
          <h2>{this.props.currentState.humidity}</h2>
        </div>
      </div>
    );
  }
}

export default HumidityMonitor;
