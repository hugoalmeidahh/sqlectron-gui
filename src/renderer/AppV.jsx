import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
// import styles from './demo/Application.css';
// import './GridExample.css';
//import GridExample from './GridExample.jsx';
import TableExample from './TableExample.jsx';
import {generateRandomList} from './demo/utils';

const list = Immutable.List(generateRandomList());
class App extends React.Component{
  state={isScrollingCustomElement:false}
  getChildContext() {
    return {list:list};//[["a"],["b"],["c"]]};
  }
  render() {
    const {isScrollingCustomElement} = this.state;
    const bodyStyle = isScrollingCustomElement
      ? styles.ScrollingBody
      : styles.Body;
    return (
      <div>
        <div className={styles.demo}>
          <div className={styles.headerRow}>

            <div className={styles.ComponentList}>
              <TableExample />
            </div>

          </div>

        </div>
      </div>

    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;