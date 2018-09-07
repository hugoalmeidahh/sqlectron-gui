import Immutable from 'immutable';
import PropTypes from 'proptypes';
import React from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import SSAuto from './SSAuto';
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
<div style={{height:"60vh",overflow:"auto",
  backgroundColor:"#777", 
  flexDirection:"column",
  padding:"0 0 0 0",
  margin:"0 0 0 0",
  display: 'flex' }}>
  <AceEditor style={{  flex: 2  
                       ,backgroundColor:"green"
                       ,width:"100%"
                    }}
                    mode="sql"
                    theme="github"
                    value="select * from table1;"
                    onChange={()=>{}}
                    name="edit1"
                    editorProps={{$blockScrolling: true}} />
  <div style={{ flex: 3 ,backgroundColor:"#999"
                       ,width:"100%"}}>
    <SSAuto />
  </div>
</div>
    );
  }
}
App.childContextTypes = {
  list: PropTypes.instanceOf(Object)
};
export default App;