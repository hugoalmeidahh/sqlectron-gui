import React from 'react';
import MessageList from './MessageList';

class App extends React.Component{

  // getChildContext() {
  //   return {list: [{name:"a"},{name:"b"},{name:"c"}]};
  // }
  render() {
    const arr1=[{text:"a"},{text:"b"},{text:"c"}];
    return (
      <MessageList messages={arr1}/>
    );
  }
}
// App.childContextTypes = {
//   list: PropTypes.instanceOf(Object)
// };
export default App;