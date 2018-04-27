import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { Grid,List,AutoSizer, Column, Table,SortDirection,SortIndicator } from 'react-virtualized';
// import 'react-virtualized/styles.css';
// import  './TableExample.css';

export default class GridExample extends React.PureComponent {

  constructor(props, context) {
    super(props, context);

    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: this.props.list.rowCount,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      disableHeader,
      columnCount,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToColumn,
      scrollToRow,
      useDynamicRowHeight,
      sortBy,
      sortDirection,
      sortedList,
      headerHeight,
      scrollToIndex,
      hideIndexRow,
    } = this.state;
    const rowGetter = ({index}) => this._getDatum(sortedList, index);
    var columns=this.props.list.fields.map((field, idx)=>{
       return (<Column key={idx} label={field.name} flexShrink={0} flexGrow={0}
                  cellDataGetter={({rowData}) => rowData[field.name]}
                  dataKey={field.name}
                  width={100}></Column>);
    })
    return (
        <AutoSizer disableHeight>
          {({width}) => (
                          <Table
                ref="Table"
                disableHeader={disableHeader}
                headerClassName={"headerColumn"}
                headerHeight={headerHeight}
                height={height}
                noRowsRenderer={this._noRowsRenderer}
                overscanRowCount={overscanRowCount}
                rowClassName={this._rowClassName}
                rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
                rowGetter={rowGetter}
                rowCount={rowCount}
                scrollToIndex={scrollToIndex}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                width={width}>
                {columns}
              </Table>
          )}
        </AutoSizer>
    );
  }

  _getDatum(list, index) {
    // console.log(list);
    // console.log(index);
    return list.rows[index];
  }

  _getRowHeight({index}) {
    const {list} = this.props;
    console.log(list);

    return this._getDatum(list, index).size;
  }

  _headerRenderer({dataKey, sortBy, sortDirection}) {
    return (
      <div>
        yiqibh
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _isSortEnabled() {
    return false;
    // const {list} = this.props;
    // const {rowCount} = this.state;

    // return rowCount <= list.size;
  }

  _noRowsRenderer() {
    return <div className={"noRows"}>No rows</div>;
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({rowCount});
  }

  _onScrollToRowChange(event) {
    const {rowCount} = this.state;
    let scrollToIndex = Math.min(
      rowCount - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({scrollToIndex});
  }

  _rowClassName({index}) {
    if (index < 0) {
      return "headerRow";
    } else {
      return index % 2 === 0 ? "evenRow" : "oddRow";
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({sortBy, sortDirection}) {

    const {list} = this.props;
    return list;
    // return list
    //   .sortBy(item => item[sortBy])
    //   .update(
    //     list => (sortDirection === SortDirection.DESC ? list.reverse() : list),
    //   );
  }

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
  }
}
