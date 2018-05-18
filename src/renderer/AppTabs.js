import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AppQuery from "./AppQuery";
import AppD from "./AppD";
import AppSeman from './AppSeman';
import AppContext from "./AppContext";
import TableEx from "./AppV";
import SS from "./SS";
import Layout1 from "./Layout1";

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
          <Tab>AceEditor & GridExample</Tab>
          <Tab>Layout1</Tab> 
          <Tab>Semantic-ui</Tab>
          
          <Tab>storm diagrams</Tab>
          <Tab>react context</Tab>
          <Tab>Virtual Table Demo</Tab>
          <Tab>SS</Tab>
        </TabList>
        <TabPanel>
        <AppQuery />
          
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
          <TableEx />
        </TabPanel>
        <TabPanel>
          <SS />
        </TabPanel>
      </Tabs>
    );
  }
}
export default App;