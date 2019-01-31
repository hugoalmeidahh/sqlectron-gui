import React from 'react';
import * as SRD from "storm-react-diagrams"
// import "storm-react-diagrams/dist/style.min.css";
// import './demo.css';

// 1) setup the diagram engine

class App extends React.Component{
  constructor(){
    super();
    var engine = new SRD.DiagramEngine();
    engine.installDefaultFactories();

    // 2) setup the diagram model
    var model = new SRD.DiagramModel();

    // 3) create a default node
    var node1 = new SRD.DefaultNodeModel("Node 1", "rgb(0,192,255)");
    console.log(node1);
    let port1 = node1.addOutPort("Out======");
    node1.setPosition(100, 100);

    // 4) create another default node
    var node2 = new SRD.DefaultNodeModel("Node 2", "rgb(192,255,0)");
    let port21 = node2.addInPort("In===========");
    let port22 = node2.addInPort("In 1===========");
    node2.addInPort("In 2===========");



    node2.setPosition(400, 100);

    var node3 = new SRD.DefaultNodeModel("Node 3", "rgb(192,255,0)");
    let port3 = node3.addInPort("=========In");
    node3.setPosition(500, 100);

    // 5) link the ports
    let link1 = port1.link(port21);
    let link2 = port22.link(port3);

    // 6) add the models to the root graph
    model.addAll(node1, node2, link1,node3,link2);

    // 7) load model into engine
    engine.setDiagramModel(model);
    this.engine=engine;
  }
  render() {
    console.log(this.engine);
    return (
      <div>
      <SRD.DiagramWidget className="srd-demo-canvas" diagramEngine={this.engine} />
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
.srd-port:hover, .srd-port.selected {
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
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
}
.srd-default-node__in, .srd-default-node__out {
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
  background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
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
export default App;