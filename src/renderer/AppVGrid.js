//import Immutable from 'immutable';
import React from 'react';
//import PropTypes from 'proptypes';
// import './semantic-ui/semantic.css';
// import './GridExample.css';
import TableExample from './GridExampleQuery.jsx';
//import TableExample from './TableExample.jsx';
// import {generateRandomList} from './demo/utils';

// const list = Immutable.List(generateRandomList());
class App extends React.Component{
  state={isScrollingCustomElement:false,loaded:false}
  componentDidMount() {
    this.loadData();
  }
  loadData=()=>{
    const {sqlectron} = window.myremote;
    var serverConfig={client:sqlectron.db.CLIENTS[3].key}
    var db=sqlectron.db.createServer(serverConfig);
    var con=db.createConnection("D:/parts/data.sqlite");
    con.connect().then(()=>{
      console.log("connected");
      con.executeQuery("select * from parts_contact;").then((data)=>{
        this.list=data;
        console.log(this.list);
        this.setState({loaded:true});
      });
    });
  }
  // getChildContext() {
  //   return {list:list};//[["a"],["b"],["c"]]};
  // }
  render() {
    let table;
    if(this.state.loaded){
      table=<TableExample list={this.list[0]} size={{width:1000,height:600}} />;
    }
    return (
      <div>
           {table}
      </div>

    );
  }
}
export default App;