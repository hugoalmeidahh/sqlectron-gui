import React from 'react';
import TableExample from './GridExampleQuery';
import {  ResizableBox } from 'react-resizable';
import AceEditor from 'react-ace';
import 'brace/mode/sql';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class App extends React.Component{
  state={isScrollingCustomElement:false,loaded:false}
  loadData=()=>{
    // const {sqlectron} = window.myremote;
    // var serverConfig={client:sqlectron.db.CLIENTS[3].key}
    // var db=sqlectron.db.createServer(serverConfig);
    // var con=db.createConnection(window.myremote.config.get().servers[0].database);
    // con.connect().then(()=>{
    //   // console.log("connected");
    //   var q=con.executeQuery("select * from result limit 100;").then((data)=>{
    //     this.list=data;
    //     // console.log(this.list);
    //     this.setState({loaded:true});
    //   });
    // });
  }
  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
   // $(this.refs.previewModal).modal('hide');
  }

  render() {
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
              { table }
    </div>
    );
  }
}
export default App;