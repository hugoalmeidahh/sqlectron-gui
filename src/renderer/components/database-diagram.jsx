import React, { Component } from 'react';
import PropTypes from 'proptypes';
import * as SRD from 'storm-react-diagrams';
//import joint from 'jointjs/dist/joint';
//import './jointjs-diagram-table';
//import './jointjs-diagram-table-cell';
//import "storm-react-diagrams/dist/style.min.css";
//require('jointjs/dist/joint.min.css');
//require('./database-diagram.css');
//import '../demo.css';
export default class DatabaseDiagram extends Component {
  static propTypes = {
    tables: PropTypes.array,
    columnsByTable: PropTypes.object,
    tableKeys: PropTypes.object,
    diagramJSON: PropTypes.string,
    isSaving: PropTypes.bool,
    addRelatedTables: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    //this.graph = new joint.dia.Graph();
    // 1) setup the diagram engine
    var engine = new SRD.DiagramEngine();
    engine.installDefaultFactories();

    // 2) setup the diagram model
    var model = new SRD.DiagramModel();

    // // 3) create a default node
    // var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
    // let port1 = node1.addOutPort("Out");
    // node1.setPosition(100, 100);

    // // 4) create another default node
    // var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
    // let port2 = node2.addInPort("In");
    // node2.setPosition(400, 100);

    // // 5) link the ports
    // let link1 = port1.link(port2);
    const { tables, columnsByTable, tableKeys } = this.props;
    // console.log(model);
    // console.log(node1);

    tables.forEach((table, index) => {
      var nodex = new SRD.DefaultNodeModel(table, 'rgb(192,255,0)');
      nodex.setPosition(100 + (index % 6) * 100, 20 + (index % 4) * 100);
      model.addNode(nodex);
      // console.log(columnsByTable);

      columnsByTable[table].forEach((column, idx) => {
        var columnKey = tableKeys[table].find(
          k => k.columnName === column.name
        );
        if (columnKey) console.log(columnKey.keyType);
        nodex.addOutPort(column.name);
      });
    });
    // let currentTable;
    // let newLink;
    // let targetIndex;

    // try {
    //   tables.forEach((table, index) => {
    //     currentTable = tableShapes[index];

    //     tableKeys[table].forEach((target) => {
    //       targetIndex = tables.findIndex((t) => t === target.referencedTable);
    //       if (targetIndex !== -1) {
    //         console.log(currentTable.id);
    //         console.log(tableShapes[targetIndex].id);
    //         // newLink = new joint.dia.Link({
    //         //   source: { id: currentTable.id },
    //         //   target: { id: tableShapes[targetIndex].id },
    //         // });
    //         // newLink.attr({ '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' } });
    //         // tableLinks.push(newLink);
    //       }
    //     });
    //   });
    // } catch (error) {
    //   this.setState({ error: `Error while generating links: ${error.message}` });
    // }
    //model.addAll(node1, node2, link1);

    // 7) load model into engine
    engine.setDiagramModel(model);
    this.state = { engine: engine };
  }

  componentDidMount() {
    const { diagramJSON } = this.props;
    // const tableShapes = [];
    // const tableCells = [];
    // const tableLinks = [];

    this.addGraphPaper();

    if (diagramJSON) {
      try {
        this.graph.fromJSON(JSON.parse(diagramJSON));
      } catch (error) {
        /* eslint react/no-did-mount-set-state: 0 */
        this.setState({
          error: `Error while reading graph from file: ${error.message}`,
        });
      }
      return;
    }

    // Generate graph if needed
    // this.generateTableElements(tableShapes, tableCells);
    // this.generateLinks(tableShapes, tableLinks);

    // this.putEverythingOnGraph(tableShapes, tableCells, tableLinks);
  }

  onTableRightClick(table) {
    const { tableKeys, addRelatedTables } = this.props;
    const relatedTables = tableKeys[table]
      .map(k => k.referencedTable)
      .filter(rt => rt !== null);
    addRelatedTables(relatedTables);
  }

  addGraphPaper() {
    //var node=ReactDOM.findDOMNode(this.refs.diagram);
    //console.log(node);
    // this.paper = new joint.dia.Paper({
    //   el: ReactDOM.findDOMNode(this.refs.diagram),
    //   width: ReactDOM.findDOMNode(this.refs.diagram).parentNode.clientWidth,
    //   height: 600,
    //   model: this.graph,
    //   gridSize: 1,
    //   restrictTranslate: true,
    // });
    // if (!this.props.diagramJSON) { // Only supported for newely generated diagrams
    //   this.paper.on('cell:contextmenu', (cellView) => {
    //     const table = cellView.model.attributes.name;
    //     this.onTableRightClick(table);
    //   });
    // }
  }

  // generateTableElements(tableShapes, tableCells) {
  //   const { tables, columnsByTable} = this.props;
  //   //const { tableKeys } = this.props;
  //   let currentTable;
  //   //let columnKey;
  //   //let newTabCell;

  //   try {
  //     tables.forEach((table, index) => {
  //       tableShapes.push(new SRD.DefaultNodeModel({
  //         position: {
  //           x: 100 + (index % 6) * 100,
  //           y: 20 + (index % 4) * 100,
  //         },
  //         size: {
  //           width: 120,
  //           height: (columnsByTable[table].length + 1.5) * 20,
  //         },
  //         name: table,
  //       }));
  //       currentTable = tableShapes[index];

  //       // columnsByTable[table].forEach((column, idx) => {
  //       //   columnKey = tableKeys[table].find((k) => k.columnName === column.name);

  //       //   newTabCell = new joint.shapes.sqlectron.TableCell({
  //       //     position: {
  //       //       x: (currentTable.position().x),
  //       //       y: ((currentTable.position().y + 7) + (idx + 1) * 20),
  //       //     },
  //       //     size: {
  //       //       width: 100,
  //       //       height: 20,
  //       //     },
  //       //     name: column.name,
  //       //     tableName: table,
  //       //     keyType: columnKey ? columnKey.keyType : null,
  //       //   });
  //       //   currentTable.embed(newTabCell);
  //       //   tableCells.push(newTabCell);
  //       // });
  //     });
  //   } catch (error) {
  //     this.setState({ error: `Error while generating table elements: ${error.message}` });
  //   }
  // }

  // generateLinks(tableShapes, tableLinks) {
  //   // const { tables, tableKeys } = this.props;
  //   // let currentTable;
  //   // let newLink;
  //   // let targetIndex;

  //   // try {
  //   //   tables.forEach((table, index) => {
  //   //     currentTable = tableShapes[index];

  //   //     tableKeys[table].forEach((target) => {
  //   //       targetIndex = tables.findIndex((t) => t === target.referencedTable);
  //   //       if (targetIndex !== -1) {
  //   //         newLink = new joint.dia.Link({
  //   //           source: { id: currentTable.id },
  //   //           target: { id: tableShapes[targetIndex].id },
  //   //         });
  //   //         newLink.attr({ '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' } });
  //   //         tableLinks.push(newLink);
  //   //       }
  //   //     });
  //   //   });
  //   // } catch (error) {
  //   //   this.setState({ error: `Error while generating links: ${error.message}` });
  //   // }
  // }

  shouldDisableDiagram() {
    const { isSaving } = this.props;
    return isSaving ? { pointerEvents: 'none' } : { pointerEvents: 'auto' };
  }

  // putEverythingOnGraph(tableShapes, tableCells, tableLinks) {
  //   // this.graph.addCells(tableShapes.concat(tableCells, tableLinks));
  //   // this.resizeTableElements(tableShapes, tableCells);
  // }

  // // Resize table elements based on attributes text length
  // resizeTableElements(tableShapes, tableCells) {
  //   //const { tables, columnsByTable } = this.props;

  //   // tables.forEach((table) => {
  //   //   let biggestCellSize = $('span', `.sqlectron-table.${table} > p`).outerWidth();
  //   //   $('span', `.sqlectron-table-cell.${table}`).each(function() {
  //   //     if ($(this).outerWidth() > biggestCellSize) {
  //   //       biggestCellSize = $(this).outerWidth();
  //   //     }
  //   //   });

  //   //   if (biggestCellSize > 100) {
  //   //     // resize tables
  //   //     tableShapes.find((shape) => shape.attributes.name === table)
  //   //       .resize(biggestCellSize + 20, (columnsByTable[table].length + 1.5) * 20);
  //   //     // resize table cells
  //   //     tableCells.filter((cell) => cell.attributes.tableName === table)
  //   //       .map((cell) => cell.resize(biggestCellSize, 20));
  //   //   }
  //   // });
  // }

  render() {
    if (!!this.state.error) {
      return (
        <div className="ui negative message" style={{ textAlign: 'center' }}>
          {this.state.error}
        </div>
      );
    }

    //return <div ref="diagram" style={this.shouldDisableDiagram()}></div>;
    return (
      <div>
        <SRD.DiagramWidget
          className="srd-demo-canvas"
          diagramEngine={this.state.engine}
        />
        <style jsx="true">{`
          .srd-diagram {
            position: relative;
            flex-grow: 1;
            display: flex;
            cursor: move;
            overflow: hidden;
          }
          .srd-diagram__selector {
            position: absolute;
            background-color: rgba(0, 192, 255, 0.2);
            border: solid 2px #00c0ff;
          }

          .srd-link-layer {
            position: absolute;
            height: 100%;
            width: 100%;
            transform-origin: 0 0;
            overflow: visible !important;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }

          .srd-node-layer {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            position: absolute;
            pointer-events: none;
            transform-origin: 0 0;
            width: 100%;
            height: 100%;
          }

          .srd-node {
            position: absolute;
            -webkit-touch-callout: none;
            /* iOS Safari */
            -webkit-user-select: none;
            /* Chrome/Safari/Opera */
            user-select: none;
            cursor: move;
            pointer-events: all;
          }
          .srd-node--selected > * {
            border-color: #00c0ff !important;
          }

          .srd-port {
            width: 15px;
            height: 15px;
            background: rgba(255, 255, 255, 0.1);
          }
          .srd-port:hover,
          .srd-port.selected {
            background: #c0ff00;
          }

          .srd-default-node {
            background-color: #1e1e1e;
            border-radius: 5px;
            font-family: sans-serif;
            color: white;
            border: solid 2px black;
            overflow: visible;
            font-size: 11px;
          }
          .srd-default-node__title {
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            white-space: nowrap;
          }
          .srd-default-node__title > * {
            align-self: center;
          }
          .srd-default-node__title .fa {
            padding: 5px;
            opacity: 0.2;
            cursor: pointer;
          }
          .srd-default-node__title .fa:hover {
            opacity: 1;
          }
          .srd-default-node__name {
            flex-grow: 1;
            padding: 5px 5px;
          }
          .srd-default-node__ports {
            display: flex;
            background-image: linear-gradient(
              rgba(0, 0, 0, 0.1),
              rgba(0, 0, 0, 0.2)
            );
          }
          .srd-default-node__in,
          .srd-default-node__out {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }

          .srd-default-port {
            display: flex;
            margin-top: 1px;
          }
          .srd-default-port > * {
            align-self: center;
          }
          .srd-default-port__name {
            padding: 0 5px;
          }
          .srd-default-port--out {
            justify-content: flex-end;
          }
          .srd-default-port--out .srd-default-port__name {
            justify-content: flex-end;
            text-align: right;
          }

          .srd-default-label {
            background: rgba(70, 70, 70, 0.8);
            border: 1px solid #333;
            border-radius: 4px;
            color: #fff;
            display: inline-block;
            font-size: smaller;
            padding: 5px;
          }

          @keyframes dash {
            from {
              stroke-dashoffset: 24;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .srd-default-link path {
            fill: none;
            pointer-events: all;
          }
          .srd-default-link--path-selected {
            stroke: #00c0ff !important;
            stroke-dasharray: 10, 2;
            animation: dash 1s linear infinite;
          }
          .srd-default-link__label {
            pointer-events: none;
          }
          .srd-default-link__label > div {
            display: inline-block;
            position: absolute;
          }
          .srd-default-link__point {
            fill: rgba(255, 255, 255, 0.5);
          }
          .srd-default-link--point-selected {
            fill: #00c0ff;
          }

          .srd-demo-workspace {
            background: black;
            display: flex;
            flex-direction: column;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
          }
          .srd-demo-workspace__toolbar {
            padding: 5px;
            display: flex;
            flex-shrink: 0;
          }
          .srd-demo-workspace__toolbar button {
            background: #3c3c3c;
            font-size: 14px;
            padding: 5px 10px;
            border: none;
            color: white;
            outline: none;
            cursor: pointer;
            margin: 2px;
            border-radius: 3px;
          }
          .srd-demo-workspace__toolbar button:hover {
            background: #00c0ff;
          }
          .srd-demo-workspace__content {
            flex-grow: 1;
            height: 100%;
          }

          .docs-preview-wrapper {
            background: #3c3c3c;
            border-radius: 10px;
            overflow: hidden;
            padding: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
          }

          .srd-demo-canvas {
            height: 100%;
            min-height: 500px;
            background-color: #3c3c3c !important;
            background-image: linear-gradient(
                0deg,
                transparent 24%,
                rgba(255, 255, 255, 0.05) 25%,
                rgba(255, 255, 255, 0.05) 26%,
                transparent 27%,
                transparent 74%,
                rgba(255, 255, 255, 0.05) 75%,
                rgba(255, 255, 255, 0.05) 76%,
                transparent 77%,
                transparent
              ),
              linear-gradient(
                90deg,
                transparent 24%,
                rgba(255, 255, 255, 0.05) 25%,
                rgba(255, 255, 255, 0.05) 26%,
                transparent 27%,
                transparent 74%,
                rgba(255, 255, 255, 0.05) 75%,
                rgba(255, 255, 255, 0.05) 76%,
                transparent 77%,
                transparent
              );
            background-size: 50px 50px;
          }
          .srd-demo-canvas .pointui {
            fill: rgba(255, 255, 255, 0.5);
          }
        `}</style>
      </div>
    );
  }
}
