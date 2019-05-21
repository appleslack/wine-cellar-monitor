import React from 'react';
import Logo from '../../../components/Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './Toolbar.module.css';

const toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <Logo />
      <nav>
        <NavigationItems />
      </nav>
    </header>
  );
}

export default toolbar;
