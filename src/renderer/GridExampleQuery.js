//import Immutable from 'immutable';
//import PropTypes from 'prop-types';
import React from 'react';
// import {
//   ContentBox,
//   ContentBoxHeader,
//   ContentBoxParagraph,
// } from './demo/ContentBox';
// import {LabeledInput, InputRow} from './demo/LabeledInput';
import cn from 'classnames';
import { Grid,AutoSizer  } from 'react-virtualized';
import { Label } from 'semantic-ui-react';

export default class GridExample extends React.PureComponent {


  constructor(props, context) {
    super(props, context);

    this.state = {
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 10,
      rowHeight: 40,
      scrollToColumn: undefined,
      scrollToRow: undefined,
      useDynamicRowHeight: false,
    };

    this._cellRenderer = this._cellRenderer.bind(this);
    this._getColumnWidth = this._getColumnWidth.bind(this);
    this._getRowClassName = this._getRowClassName.bind(this);
    this._getRowHeight = this._getRowHeight.bind(this);
    this._noContentRenderer = this._noContentRenderer.bind(this);
    this._onColumnCountChange = this._onColumnCountChange.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToColumnChange = this._onScrollToColumnChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
  }

  render() {
    const {
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      scrollToColumn,
      scrollToRow,
      useDynamicRowHeight,
    } = this.state;

    return (
        <AutoSizer disableHeight>
          {({width}) => (
            <Grid
              cellRenderer={this._cellRenderer}
              className={"BodyGrid"}
              columnWidth={this._getColumnWidth}
              columnCount={this.props.list.fields.length}
              height={height}
              noContentRenderer={this._noContentRenderer}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowCount={this.props.list.rows.length}
              scrollToColumn={scrollToColumn}
              scrollToRow={scrollToRow}
              width={width}
            />
          )}
        </AutoSizer>
    );
  }

  _cellRenderer({columnIndex, key, rowIndex, style}) {
    // if (columnIndex === 0) {
    //   return this._renderLeftSideCell({columnIndex, key, rowIndex, style});
    // } else {
      return this._renderBodyCell({columnIndex, key, rowIndex, style});
    // }
  }

  _getColumnWidth({index}) {
    switch (index) {
      case 0:
        return 50;
      // case 1:
      //   return 100;
      // case 2:
      //   return 300;
      default:
        return 80;
    }
  }

  _getDatum(index) {
    const {list} = this.props;

    return list.rows[index % list.length];
  }

  _getRowClassName(row) {
    return row % 2 === 0 ? "evenRow" : "oddRow";
  }

  _getRowHeight({index}) {
    return this._getDatum(index).size;
  }

  _noContentRenderer() {
    return <div className={"noCells"}>No cells</div>;
  }

  _renderBodyCell({columnIndex, key, rowIndex, style}) {
    // const rowClass = this._getRowClassName(rowIndex);
    // const datum = this._getDatum(rowIndex);

    let content;

    switch (columnIndex) {
      // case 1:
      //   content = datum.name;
      //   break;
      // case 2:
      //   content = datum.random;
      //   break;
      default:
        if(this.props.list.rows[rowIndex])
          content = this.props.list.rows[rowIndex][this.props.list.fields[columnIndex].name];//`r:${rowIndex}, c:${columnIndex}`;
        else
          content="";
        break;
    }

    // const classNames = cn("rowClass", "cell", {
    //   "centeredCell": columnIndex > 2,"headerCell": rowIndex ===0
    // });
    // console.log(rowClass);
    // console.log(styles.cell);
    // console.log(styles.centeredCell);
    // console.log(classNames)    ;

    return (
      <Label basic key={key} style={style}>
        {content}
      </Label>
    );
  }

  _renderLeftSideCell({key, rowIndex, style}) {
    const datum = this._getDatum(rowIndex);

    const classNames = cn("cell", "letterCell");

    // Don't modify styles.
    // These are frozen by React now (as of 16.0.0).
    // Since Grid caches and re-uses them, they aren't safe to modify.
    style = {
      ...style,
      backgroundColor: datum.color,
    };
    console.log(datum);
    
    return (
      <div className={classNames} key={key} style={style}>
        {datum.name.charAt(0)}
      </div>
    );
  }

  _updateUseDynamicRowHeights(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
  }

  _onColumnCountChange(event) {
    const columnCount = parseInt(event.target.value, 10) || 0;

    this.setState({columnCount});
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({rowCount});
  }

  _onScrollToColumnChange(event) {
    const {columnCount} = this.state;
    let scrollToColumn = Math.min(
      columnCount - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToColumn)) {
      scrollToColumn = undefined;
    }

    this.setState({scrollToColumn});
  }

  _onScrollToRowChange(event) {
    const {rowCount} = this.state;
    let scrollToRow = Math.min(rowCount - 1, parseInt(event.target.value, 10));

    if (isNaN(scrollToRow)) {
      scrollToRow = undefined;
    }

    this.setState({scrollToRow});
  }
}
