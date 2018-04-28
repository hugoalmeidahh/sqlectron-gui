import Immutable from 'immutable';
import React  from 'react';
import PropTypes from 'proptypes';
import TableExample from './TableExample';
import GridExample from './GridExample';

import {generateRandomList} from './demo/utils';

// console.log("Immutable");
// console.log(Immutable);

const list = Immutable.List(generateRandomList());
// console.log(list);
class App extends React.Component{

  getChildContext() {
    // console.log("getChildContext");
    // console.log(list);

    return {list:list};//[["a"],["b"],["c"]]};
  }
  render() {
    return (
      <div>
      {
         <TableExample size={{width:300,height:300}}/>
      }
         <GridExample />
      </div>
    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;