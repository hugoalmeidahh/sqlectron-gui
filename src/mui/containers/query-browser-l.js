import React, { Component } from 'react';
import { ResizableBox } from 'react-resizable';
import AppTabs from '../AppTabs';
const SIDEBAR_WIDTH = 235;
const STYLES = {
  wrapper:{
    position:"relative"
  },
  footer:{
    position:"absolute",
    bottom:0,
    height:40,
  },
  header:{
    backgroundColor:"#666",
    height:"50px",
    top:0,
    position:"absolute"
  },
  container: {
    display: 'flex',
    boxSizing: 'border-box',
    padding: '50px 10px 40px 10px',
  },
  sidebar: { 
    transition: 'all .2s' ,
    backgroundColor:"#777"
  },
  content: { flex: 1, overflow: 'auto', paddingLeft: '5px',backgroundColor:"#888" },
  collapse: {
    position: 'fixed',
    color: '#fff',
    cursor: 'pointer',
    width: 10,
    left: 0,
    height: '100vh',
    backgroundColor: 'rgb(102,102,102)',
    zIndex: 1,
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  },
  resizeable: { width: 'auto', maxWidth: '100%' },
};
class LongSide extends Component {
  render() {
    var arr1=[];
    for(var i=0;i<1000;i++){
        arr1.push(i);
    }
    var ps=arr1.map((one,key)=>{
          return <p key={key}>hello</p>
    });
    return (<div>
            {ps}
          </div>)
  }
}
class Long extends Component {
  render() {
    var arr1=[];
    for(var i=0;i<1000;i++){
        arr1.push(i);
    }
    var ps=arr1.map((one,key)=>{
          return <p key={key}>hello</p>
    });
    return (<div>
            {ps}
          </div>)
  }
}
class QueryContainer extends Component {
  render() {
    return (<div style={STYLES.content}>
             <Long />
          </div>)
  }
}
class QueryBrowserContainer extends Component {
  state={
    sideBarWidth:SIDEBAR_WIDTH,
    sidebarCollapsed:false,
  }
  constructor(props, context) {
    super(props, context);
  }

  onCollapseClick=()=> {
    this.setState({ sidebarCollapsed: !this.state.sidebarCollapsed });
  }


  render() {
    return (
      <div style={STYLES.wrapper}>
        <div style={STYLES.header}>
           header
        </div>
        <div onClick={this.onCollapseClick} style={STYLES.collapse}>
          <i
            className={`${this.state.sidebarCollapsed ? 'right' : 'left'} triangle icon`}
            style={{ top: 'calc(100vh/2 - 7px)', position: 'absolute', marginLeft: -3 }}
          />
        </div>
        <div style={STYLES.container}>
          <div id="sidebar" style={{
            ...STYLES.sidebar,
            marginLeft: this.state.sidebarCollapsed ? (- this.state.sideBarWidth) : 0,
          }}>
            <ResizableBox className="react-resizable react-resizable-ew-resize"
              onResizeStop={(event, { size }) =>{} }
              width={this.state.sideBarWidth || SIDEBAR_WIDTH}
              height={NaN}
              minConstraints={[SIDEBAR_WIDTH, 300]}
              maxConstraints={[750, 10000]}>
              <div>
                <LongSide />
              </div>
            </ResizableBox>
          </div>
          <QueryContainer />
        </div>
           <div style={STYLES.footer}>
             footer
           </div>
        <style jsx="true">{`
#sidebar { overflow-y: hidden; overflow-x: hidden; }
#sidebar ::-webkit-scrollbar{ display:none }

#sidebar:hover { overflow-y:auto; overflow-y:overlay }
#sidebar:hover ::-webkit-scrollbar { display:block }

#sidebar ::-webkit-scrollbar { -webkit-appearance:none }
#sidebar ::-webkit-scrollbar-thumb {
  box-shadow: inset 0 -2px,inset 0 -8px,inset 0 2px,inset 0 8px;
  min-height: 36px
}
          `}</style>
      </div>
    );
  }
}


export default QueryBrowserContainer;
