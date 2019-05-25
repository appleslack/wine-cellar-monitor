import React, {Component} from 'react';
import classes from './HumidityMonitor.module.css';
import baseclasses from './Monitor.module.css';

class HumidityMonitor extends Component {

  render () {
    var reading = this.props.currentState.humidity === undefined ? '--' :
      this.props.currentState.humidity;

    return (
      <div className={[ baseclasses.Monitor, classes.HumidityMonitor].join(' ')}>
        Humidity Monitor
        <div className="indicator">
          <h2>{reading + '  %'}</h2>
        </div>
      </div>
    );
  }
}

export default HumidityMonitor;
