import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import styles from './demo/Application.css';
import './GridExample.css';
import TableExample from './TableExampleQuery.jsx';
class App extends React.Component{
  state={isScrollingCustomElement:false,loaded:false}
  loadData=()=>{
    const {sqlectron} = window.myremote;
    var serverConfig={client:sqlectron.db.CLIENTS[3].key}
    var db=sqlectron.db.createServer(serverConfig);
    var con=db.createConnection("D:/parts/data.sqlite");
    con.connect().then(()=>{
      console.log("connected");
      var q=con.executeQuery("select * from parts_contact;").then((data)=>{
        this.list=data;
        console.log(this.list);
        this.setState({loaded:true});
      });
    });
  }
  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
   // $(this.refs.previewModal).modal('hide');
  }

  render() {
    const {isScrollingCustomElement} = this.state;
    const bodyStyle = isScrollingCustomElement
      ? styles.ScrollingBody
      : styles.Body;
    let table;
    if(this.state.loaded){
      table=<TableExample list={this.list[0]} />;
    }
    return (
      <div>
        <div className={styles.demo}>
          <div className={styles.headerRow}>

            <div className={styles.ComponentList}>
              { table }
            </div>

          </div>

        </div>
      </div>

    );
  }
}
export default App;