import * as React from 'react';
import {Button, Modal } from 'semantic-ui-react';
import * as QueryActions from '../actions/queries';
import { connect } from 'react-redux';
import Elem, { A, Tag } from './Elem';
import Ace from './Ace';
const table_css=`
  display:block;
  width:800px;
  height:500px;
  overflow:scroll;
  td { border:1px solid #0094ff; }
`;
const query_id=1;
class App extends React.Component{
  constructor(props){
    super();
    this.state={
      css:table_css
      ,sql:"select * from "+props.item.name+" limit 6 offset 0"
      ,start:0
      ,limit:6
    };
    // this.props.dispatch(QueryActions.newQuery(this.props.database));
  }

 componentDidMount() {
    // this.props.dispatch(QueryActions.newQuery(this.props.database));
    this.handleGo();
  }

  onClick=()=>{
  }
  handlePrev=()=>{
    let start=this.state.start;
    start-=this.state.limit;
    if(start<0) start=0;
    this.setState({start:start,sql:"select * from "+this.props.item.name+" limit "+this.state.limit+" offset "+start
    },()=>{
      this.handleGo();
    })
  }
  handleNext=()=>{
    let start=this.state.start;
    start+=this.state.limit
    this.setState({start:start
      ,sql:"select * from "+this.props.item.name+" limit "+this.state.limit+" offset "+start
    },()=>{
      this.handleGo();
    })

  }
  handleGo=()=>{
    let sql= this.state.sql;// "select * from "+this.props.item.name+" limit "+this.state.limit+" offset "+this.state.start
    this.props.dispatch(
      QueryActions.executeQueryIfNeeded(sql, query_id)
    );
  }
  onChange_css = newValue => {
    this.setState({
      css: newValue,
    },()=>{
      console.log(this.state.css);
    });
  };
  render=()=>{
    console.log(this.props);
    let query_id=this.props.queries.currentQueryId
    let q=this.props.queries.queriesById[query_id];
    let result=null;
    let rows,rows_show,fields,heads_show;
    if(q && q.results && q.results[0]){
      result=q.results[0].rowCount;
      rows=q.results[0].rows;
      fields=q.results[0].fields;
      heads_show=[];
      for(var i=0;i<fields.length;i++){
        heads_show.push(<td key={i}>{fields[i].name}</td>);
      }
      rows_show=rows.map((one,index)=>{
        let one_show=[];
        for(var i=0;i<fields.length;i++){
          one_show.push(<td key={i}>{one[fields[i].name]}</td>);
        }
        return(<tr key={index}>{one_show}</tr>)
      })
    }
    console.log(result);
    // let result=results[0];
    return <Modal
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        dimmer={"inverted"}
      >
        <Modal.Header content='Edit Table' />
        <Modal.Content>
        <div>database name:{this.props.database.name},table:{this.props.item.name}</div>
          <textarea rows="3" cols="20" style={{width:"100%"}} value={this.state.sql} onChange={(e)=>{
            this.setState({sql:e.target.value})
          }} />
          <Tag name="table" css={this.state.css}>
          <thead>
          <tr>{heads_show}</tr>
          </thead>
          <tbody>
          {rows_show}
          </tbody>
          </Tag>
          <Ace css={this.state.css} cssChange={this.onChange_css} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handlePrev}>
            prev
          </Button>
          <Button onClick={this.handleNext}>
            next
          </Button>
          <Button onClick={this.handleGo}>
            go
          </Button>
          <Button onClick={this.props.handleClose}>
            ok
          </Button>
        </Modal.Actions>
      </Modal>;
    }
}
function mapStateToProps(state) {
  // console.log("mapStateToProps");
  // console.log(state)
  const {
    connections,
    databases,
    schemas,
    tables,
    columns,
    triggers,
    indexes,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
    tableEdit,
  } = state;

  return {
    connections,
    databases,
    schemas,
    tables,
    columns,
    triggers,
    indexes,
    views,
    routines,
    queries,
    sqlscripts,
    keys,
    status,
    tableEdit,
  };
}
export default connect(mapStateToProps)(App);