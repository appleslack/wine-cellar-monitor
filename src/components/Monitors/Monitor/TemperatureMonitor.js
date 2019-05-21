import React, {Component} from 'react';
import classes from './TemperatureMonitor.module.css';
import baseclasses from './Monitor.module.css';

class TemperatureMonitor extends Component {
  render () {
    return (
      <div className={[ baseclasses.Monitor, classes.TemperatureMonitor].join(' ')}>
        Temperature Monitor
      </div>
    );
  }
}

export default TemperatureMonitor;
