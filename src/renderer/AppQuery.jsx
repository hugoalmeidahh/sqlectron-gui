import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
//import styles from './demo/Application.css';
//import './GridExample.css';
import TableExample from './TableExampleQuery.jsx';
import { Resizable, ResizableBox } from 'react-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AceEditor from 'react-ace';
import ace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
var styles={};
// import 'react-resizable/css/styles.css';
// import 'react-tabs/style/react-tabs.css';
class App extends React.Component{
  state={isScrollingCustomElement:false,loaded:false}
  loadData=()=>{
    const {sqlectron} = window.myremote;
    var serverConfig={client:sqlectron.db.CLIENTS[3].key}
    var db=sqlectron.db.createServer(serverConfig);
    var con=db.createConnection("D:/parts/data.sqlite");
    con.connect().then(()=>{
      // console.log("connected");
      var q=con.executeQuery("select * from parts_contact;").then((data)=>{
        this.list=data;
        // console.log(this.list);
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
      table=<TableExample list={this.list[0]} size={{width:1000,height:600}} />;
    }
    return (
    <div>
    <ResizableBox width={800} height={300} >
       <AceEditor
              mode="sql"
              theme="github"
              height="calc(100% - 15px)"
              width="100%"
              ref="queryBoxTextarea"
              showPrintMargin={false}
              editorProps={{ $blockScrolling: Infinity }}
              enableBasicAutocompletion
              enableLiveAutocompletion />
    </ResizableBox>
    <Tabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel>
       <div className={styles.demo}>
          <div className={styles.headerRow}>

            <div className={styles.ComponentList}>
              { table }
            </div>

          </div>

    </div>
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
    </TabPanel>
  </Tabs>
   
    </div>
    );
  }
}
export default App;