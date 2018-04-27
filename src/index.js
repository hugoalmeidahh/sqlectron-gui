//use with react-scripts
import AppSql from './renderer/AppSql';
import React from 'react';
import ReactDOM from 'react-dom';
import "./renderer/semantic-ui/semantic.css";
import "./renderer/containers/app.css";
import "./renderer/containers/query-browser.css";
import "react-tabs/style/react-tabs.css";
import "./renderer/components/react-resizable.css";
import "./renderer/components/header.css";
import "./renderer/components/query-result-table.css";
import "./renderer/components/server-list.css";

import "./react-select.css";
import "./renderer/components/override-select.css";

import "react-virtualized/styles.css";
import "./renderer/GridExample.css";

import "storm-react-diagrams/dist/style.min.css";
import "./renderer/demo.css";   
import "./renderer/grid.css";   

ReactDOM.render(
  <AppSql />,  document.getElementById('root')
);
