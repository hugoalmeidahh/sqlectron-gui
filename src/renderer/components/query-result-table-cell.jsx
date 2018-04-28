import isPlainObject from 'lodash.isplainobject';
//import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
import cloneDeep from 'lodash.clonedeep';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { valueToString } from '../utils/convert';
//import { Label,Item } from 'semantic-ui-react';
var { remote} =window.myremote.electron;
const { Menu, MenuItem } = remote;

export default class TableCell extends Component {
  static propTypes = {
    rowIndex: PropTypes.number.isRequired,
    data: PropTypes.any.isRequired,
    col: PropTypes.string.isRequired,
    onOpenPreviewClick: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.contextMenu = null;
  }

  onContextMenu=(event)=> {
    event.preventDefault();

    const value = this.getValue();

    const hasPreview = (
      typeof value === 'string'
      || isPlainObject(value)
    );

    if (!this.contextMenu && hasPreview) {
      this.contextMenu = new Menu();
      this.contextMenu.append(new MenuItem({
        label: 'Open Preview',
        click: () => {
          console.log("click pv");
          console.log(this.props.onOpenPreviewClick);
          this.props.onOpenPreviewClick(value);
      },
      }));
    }

    if (this.contextMenu) {
      this.contextMenu.popup(event.clientX, event.clientY);
    }
  }

  getValue() {
    const { rowIndex, data, col } = this.props;
    return data[rowIndex][col];
  }

  render() {
    const value = this.getValue();
    // const className = classNames({
    //   'ui mini grey label table-cell-type-null': value === null,
    // });
    //const classnames = classNames("rowClass", "cell","item");
    //   , {
    //   "centeredCell": columnIndex > 2,"headerCell": rowIndex ===0
    // });
    // console.log(rowClass);
    // console.log(styles.cell);
    // console.log(styles.centeredCell);
    // console.log(classNames)    ;
    var style=cloneDeep(this.props.style);
    style.backgroundClip="border-box";
    style.display="block";
    style.lineHeight="20px"
    style.overflow="hidden";

    // font-weight: bold;
    // border: 0px solid transparent;
    // border-radius: 0.28571429rem;
    // -webkit-transition: background 0.1s ease;
    // transition: background 0.1s ease;

    return (
      <span className="rowClass cell" style={style}  onContextMenu={this.onContextMenu}>
      {
          value === null
            ? "NULL"
            : valueToString(value)
      }
      </span>
    );
    // return (
    //   <Label style={this.props.style} basic={true}  onContextMenu={this.onContextMenu.bind(this)}>
    //     {
    //       value === null
    //         ? <span >NULL</span>
    //         : valueToString(value)
    //     }
    //   </Label>
    // );
  }
}
