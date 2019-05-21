import React from 'react';
import classes from './Logo.module.css';
// We have to import the image because of Webpack
import logoImage from '../../assets/images/logo.png'

const logo = (props) => {
  return (
    <div>
      <img className={classes.Logo} src={logoImage} alt="MyBurger"/>
    </div>

  );
}

export default logo;
