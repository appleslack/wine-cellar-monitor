
import React from 'react';
import classes from './Layout.module.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';

// /Users/stu/projects/reactUdemy/burger-builder/src/components/Layout

function Layout(props) {

  return (
    <React.Fragment>
      <Toolbar />
      <main className={classes.Content}>
        {props.children}
      </main>
    </React.Fragment>
  );
}

export default Layout;
