import React, {Component} from 'react';
import classes from './TemperatureMonitor.module.css';
import baseclasses from './Monitor.module.css';

class TemperatureMonitor extends Component {

  render () {
    var reading = '---';
    if( this.props.currentState.temperature !== undefined ) {
      // Temperature readings are in celcius - convert if units set to farenheit
      if( this.props.currentState.temperatureUnit === 'farenheit' ) {
        reading = (this.props.currentState.temperature *  1.8 + 32).toFixed(1);
      }
      else {
        reading = this.props.currentState.temperature;
      }
    }
    // var reading = this.props.currentState.temperature === undefined ? '--' :
    //   this.props.currentState.temperature;;
    return (
      <div className={[ baseclasses.Monitor, classes.TemperatureMonitor].join(' ')}>
        Temperature
        <div className="indicator">
          <h2>{reading + '  ˚f'}</h2>
        </div>
      </div>
    );
  }
}

export default TemperatureMonitor;
