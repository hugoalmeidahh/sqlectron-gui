import isPlainObject from 'lodash.isplainobject';
//import { remote } from 'electron'; // eslint-disable-line import/no-unresolved
//import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { valueToString } from '../utils/convert';
import { Label } from 'semantic-ui-react';
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

  onContextMenu(event) {
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
        click: () => this.props.onOpenPreviewClick(value),
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
    return (
      <Label style={this.props.style} basic={true} onContextMenu={this.onContextMenu.bind(this)}>
        {
          value === null
            ? <span >NULL</span>
            : valueToString(value)
        }
      </Label>
    );
  }
}
