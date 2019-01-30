import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import AppQuery from "./AppQuery";
import AppD from "./AppD";
import AppSeman from './AppSeman';
import AppContext from "./AppContext";
// import TableEx from "./AppV";
import SS from "./SS";
import Layout1 from "./Layout1";
import DatabaseList from './DatabaseList';

class App extends React.Component{
  render() {
    return (
      <Tabs>
        <TabList style={{
          display:"flex",
          height:"40px",
          overflowX:"auto",
          overflowY:"hidden"
        }}>
          <Tab>database list</Tab>
          <Tab>AceEditor & GridExample</Tab>
          <Tab>Layout1</Tab> 
          <Tab>Semantic-ui</Tab>
          
          <Tab>storm diagrams</Tab>
          <Tab>react context</Tab>
          <Tab>Virtual Table Demo</Tab>
          <Tab>SS</Tab>
        </TabList>
        <TabPanel>
          <DatabaseList />
        </TabPanel>
        <TabPanel>
            <div />
          
        </TabPanel>
         <TabPanel>
          <Layout1 />
        </TabPanel>
        <TabPanel>
          <AppSeman />
        </TabPanel>
      
        <TabPanel>
          <AppD />
        </TabPanel>
        <TabPanel>
          <AppContext />
        </TabPanel>
        <TabPanel>
          <div />
        </TabPanel>
        <TabPanel>
          <SS />
        </TabPanel>
        <style jsx="true">{`
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  padding: 0;
  font-size: 14px;
  line-height: 30px;
  color: rgba(0,0,0,.87);
}

p.help {
  font-size: 0.8em;
}

/* Override semantic ui style */
.ui.secondary.menu {
  max-width: 100%;
}

.ui.message pre {
  margin-top: 1em;
  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
}

/* Custom css for tables, views and routines lists */
span.list-title {
  cursor: pointer;
  padding: 0.33em;
}

span.list-item {
  word-break: break-all;
}

span.clickable {
  cursor: pointer;
}

::-webkit-scrollbar { width:8px; height:8px }
::-webkit-scrollbar-track { background: #fff; }
::-webkit-scrollbar-thumb { background: #666; border-radius:5px }


/* Dark theme */
body.dark-theme {
  filter: invert(100%);
  background-color: #333;
}

body.dark-theme .Select-control,
body.dark-theme .ui.form input:not([type]),
body.dark-theme .ui.form input[type="date"],
body.dark-theme .ui.form input[type="datetime-local"],
body.dark-theme .ui.form input[type="email"],
body.dark-theme .ui.form input[type="number"],
body.dark-theme .ui.form input[type="password"],
body.dark-theme .ui.form input[type="search"],
body.dark-theme .ui.form input[type="tel"],
body.dark-theme .ui.form input[type="time"],
body.dark-theme .ui.form input[type="text"],
body.dark-theme .ui.form input[type="url"] {
  border-color: #000;
}
body.dark-theme .ui.toggle.checkbox .box:before,
body.dark-theme .ui.toggle.checkbox label:before {
  border: 1px solid #333;
  background: #ccc;
}
body.dark-theme .ui.toggle.checkbox .box:after,
body.dark-theme .ui.toggle.checkbox label:after {
  box-shadow: 0px 1px 2px 0 #333, 0px 0px 0px 1px #333 inset;
}

          `}</style>
      </Tabs>
    );
  }
}
export default App;