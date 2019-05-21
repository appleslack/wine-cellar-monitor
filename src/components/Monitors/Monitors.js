import React from 'react';
import classes from './Monitors.module.css';
import Monitor from './Monitors/Monitor/Monitor';
import TemperatureMonitor from './Monitors/Monitor/TemperatureMonitor';
import HumidifyMonitor from './Monitors/Monitor/HumidifyMonitor';
import DoorMonitor from './Monitors/Monitor/DoorMonitor';

const monitors = (props) => {
  return (
    <div className={classes.Monitors}>
      <TemperatureMonitor />
      <HumidityMonitor />
      <DoorMonitor />
    </div>
  );
}

export default monitors;
