import Immutable from 'immutable';
import PropTypes from 'proptypes';
import React from 'react';
import {  ResizableBox } from 'react-resizable';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import GridExample from './GridExample';
import {generateRandomList} from './demo/utils';
import Ace2 from './Ace2'
// console.log("Immutable");
// console.log(Immutable);

const list = Immutable.List(generateRandomList());
class App extends React.Component{
  state={rw:window.innerWidth
    ,rh:500}
  getChildContext() {
    // console.log("getChildContext");
    // console.log(list);

    return {list:list};//[["a"],["b"],["c"]]};
  }
  componentWillUnmount() {
   // $(this.refs.previewModal).modal('hide');
  }

  render() {

    return (
      <div style={{height:"600px"
      ,display:"flex"
      ,flexDirection:"column"
      ,overflow:"auto"
      ,backgroundColor:"#777"
        }}>
      <Ace2 style={{flex:1}} css="" cssChange={()=>{}} />
      <div style={{flex:1}}>
        <GridExample >
        </GridExample>
      </div>
  </div>
    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;