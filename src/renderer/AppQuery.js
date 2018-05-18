import Immutable from 'immutable';
import PropTypes from 'proptypes';
import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import GridExample from './GridExample';
import {generateRandomList} from './demo/utils';

// console.log("Immutable");
// console.log(Immutable);

const list = Immutable.List(generateRandomList());
class App extends React.Component{
 
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
<div style={{height:"90vh",overflow:"auto",
  backgroundColor:"#777", 
  flexDirection:"column",
  display: 'flex' }}>
  <AceEditor style={{  flex: 2  
                       ,border:"solid gray 5px"
                       ,width:"100%"
                    }}
                    mode="sql"
                    theme="github"
                    value="select * from table1;"
                    onChange={()=>{}}
                    name="edit1"
                    editorProps={{$blockScrolling: true}} />
  <div style={{ flex: 3 }}>
    <GridExample />
  </div>
</div>
    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;