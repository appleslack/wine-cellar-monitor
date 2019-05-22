import React from 'react';
import classes from './Monitors.module.css';
import TemperatureMonitor from './Monitor/TemperatureMonitor';
import HumidityMonitor from './Monitor/HumidityMonitor';
import DoorMonitor from './Monitor/DoorMonitor';

const monitors = (props) => {

  return (
    <div className={classes.Monitors}>
      <TemperatureMonitor currentState={props.currentState}/>
      <HumidityMonitor currentState={props.currentState}/>
      <DoorMonitor currentState={props.currentState}/>
    </div>
  );
}

export default monitors;
