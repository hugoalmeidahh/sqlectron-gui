//use with react-scripts
import AppSql from './renderer/AppSql';
import React from 'react';
import ReactDOM from 'react-dom';
import "react-tabs/style/react-tabs.css";
import "storm-react-diagrams/dist/style.min.css";
import "react-virtualized/styles.css";
import "react-select/dist/react-select.css";
import "./renderer/semantic-ui/semantic.css";
import "renderer/components/react-resizable.css";

ReactDOM.render(
  <AppSql />,  document.getElementById('root')
);

