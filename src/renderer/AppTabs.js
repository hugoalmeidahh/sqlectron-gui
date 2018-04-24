import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Resizable, ResizableBox } from 'react-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AppQuery from "./AppQuery";
import AppD from "./AppD";
import AppSeman from './AppSeman.jsx';
import AppContext from "./AppContext.jsx";
import TableEx from "./AppV.jsx";
import SS from "./SS"
class App extends React.Component{
  render() {
    return (
      <Tabs>
        <TabList>
          <Tab>Semantic-ui</Tab>
          <Tab>AceEditor & GridExample</Tab>
          <Tab>storm diagrams</Tab>
          <Tab>react context</Tab>
          <Tab>Virtual Table Demo</Tab>
          <Tab>SS</Tab>
        </TabList>
        <TabPanel>
          <AppSeman />
        </TabPanel>
        <TabPanel>
          <AppQuery />
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