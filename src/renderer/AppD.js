import React from 'react';
import * as SRD from "storm-react-diagrams"
// import "storm-react-diagrams/dist/style.min.css";
// import './demo.css';

// 1) setup the diagram engine
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
class App extends React.Component{

  render() {
    console.log(engine);
    return (
      <div>
      <SRD.DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />
      </div>
    );
  }
}
export default App;