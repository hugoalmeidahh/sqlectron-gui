import PropTypes from 'proptypes';
import React from 'react';
import TableSubmenu from './components/table-submenu.jsx'

class App extends React.Component{
  render() {

    return (<TableSubmenu 
    title="Columns" 
    table="table" 
    itemsByTable={{table:[{name:"n1",dataType:"int"},{name:"n2",dataType:"int"}]}}
    collapsed={true}
    database={{}}
    onDoubleClickItem={()=>{}} />);
  }
}
export default App;