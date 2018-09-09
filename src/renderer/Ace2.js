import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'brace/mode/css';
import 'brace/theme/github';
export default class Root extends Component<Props> {
     constructor(){
      super();
      this.state= {
        mode:"css",
      }
    }
   
    render=()=>{
        return(
            <AceEditor ref="editor"
                    style={{  margin:"auto",maxWidth:"600px",height:"300px"
                                ,border:"solid gray 5px"
                              }}
                    mode={this.state.mode}
                    theme="github"
                    value={this.props.css}
                    onChange={this.props.cssChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{$blockScrolling: true}} />
        );
    }
}