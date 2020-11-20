import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
const styles={
 container:(provided,state)=>{
  return{
    ...provided,
    minWidth:"200px",
    maxWidth:"300px",
  }
 },
};
const components={
  Option: (props) => {
    console.log(props)
    return (
      <div {...props.innerProps} 
      style={{ backgroundColor:props.isFocused?"#ff0000":"#00ff00"
      }}>
        <img src={props.data.img} style={{height:"1em"}} />{props.children}
      </div>
    );
  },
  SingleValue:(props)=>{
    const { children, innerProps } = props;
    return (
      <div {...innerProps}>
        <img src={props.data.img} style={{height:"1em"}} />{children}
      </div>
    );    
  }
};
const CLIENTS=[ 
  { value: 'chocolate', label: 'Chocolate',img:"./server-db-client-cassandra.png" },
  { value: 'strawberry', label: 'Strawberry' ,img:"./server-db-client-postgresql.png"},
  { value: 'vanilla', label: 'Vanilla',img:'./server-db-client-sqlite.png' }
  ]
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value:null};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  handleOnClientChange=(v)=>{
    this.setState({value:v});
  }
  render() {
    return (
      <div>
       <Select  name="client"
              components={components}
              styles={styles}
              placeholder="Select"
              options={CLIENTS}
              onChange={this.handleOnClientChange}
              value={this.state.value}
            />
      </div>
    );
  }
}
