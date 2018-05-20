import debounce from 'lodash.debounce';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Grid, ScrollSync,AutoSizer } from 'react-virtualized';
import Draggable from 'react-draggable';
import cloneDeep from 'lodash.clonedeep';
import TableCell from './query-result-table-cell.jsx';
import PreviewModal from './preview-modal.jsx';
import { valueToString } from '../utils/convert';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

// import 'react-virtualized/styles.css';
// import './query-result-table.scss';
const headerTopBar_h=40;
const rowHeight = 28;

/* eslint react/sort-comp:0 */
export default class QueryResultTable extends Component {
  static propTypes = {
    // widthOffset: PropTypes.number.isRequired,
    // heigthOffset: PropTypes.number.isRequired,
    onCopyToClipboardClick: PropTypes.func.isRequired,
    onSaveToFileClick: PropTypes.func.isRequired,
    resultItemsPerPage: PropTypes.number.isRequired,
    copied: PropTypes.bool,
    saved: PropTypes.bool,
    query: PropTypes.string,
    fields: PropTypes.array,
    rows: PropTypes.array,
    cellClass: PropTypes.string,
    nullCellClass: PropTypes.string,
    rowCount: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      columnWidths: {},
      autoColumnWidths: [],
    };
    // this.resizeHandler = debounce(this.onResize.bind(this), 20);
  }

  componentDidMount() {
    // window.addEventListener('resize', this.resizeHandler, false);
     this.resize();
  }

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps");
    // console.log(nextProps);

    this.resize(nextProps);

    // if (nextProps.widthOffset !== this.props.widthOffset) {
    //   if (this.rowsGrid) {
    //     this.rowsGrid.recomputeGridSize();
    //   }
    //   if (this.headerGrid) {
    //     this.headerGrid.recomputeGridSize();
    //   }
    // }

    if (nextProps.copied) {
      this.setState({ showCopied: true });
    }

    if (nextProps.saved) {
      this.setState({ showSaved: true });
    }
  }

  componentDidUpdate() {
    if (this.state.showCopied) {
      /* eslint react/no-did-update-set-state: 0 */
      setTimeout(() => this.setState({ showCopied: false }), 1000);
    }

    if (this.state.showSaved) {
      /* eslint react/no-did-update-set-state: 0 */
      setTimeout(() => this.setState({ showSaved: false }), 1000);
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.resizeHandler, false);
  }

  onColumnResizeEndCallback(newColumnWidth, columnKey) {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      },
    }));
  }

  onOpenPreviewClick = value => {
    console.log('onOpenPreviewClick');
    this.setState({ showPreview: true, valuePreview: value });
  };

  onClosePreviewClick() {
    this.setState({ showPreview: false, valuePreview: null });
  }

  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(this.resize.bind(this), 16);
  }

  getTextWidth(text, font) {
    // additional spacing
    const padding = 28;
    const element = document.createElement('canvas');
    const context = element.getContext('2d');
    context.font = font;
    return context.measureText(text).width + padding;
  }

  autoResizeColumnsWidth(fields, rows, tableWidth) {
    const averageTableCellWidth = tableWidth / fields.length;
    let totalColumnWidths = 0;

    const autoColumnWidths = fields.map((name, index) => {
      const cellWidth = this.resolveCellWidth(
        name,
        fields,
        rows,
        averageTableCellWidth
      );
      totalColumnWidths = totalColumnWidths + cellWidth;

      const isLastColumn = index + 1 === fields.length;
      if (isLastColumn && totalColumnWidths < tableWidth) {
        totalColumnWidths = totalColumnWidths - cellWidth;
        return tableWidth - totalColumnWidths;
      }

      return cellWidth;
    });

    this.setState({ autoColumnWidths });
  }

  renderHeaderCell(params) {
    const field = this.props.fields[params.columnIndex];
    const handleStop = this.handleStop.bind(this, {
      name: field.name,
      index: params.columnIndex,
    });

    // We don't want the resizable handle on the last column for layout reasons
    let resizeDrag = null;
    if (this.props.fields.length - 1 !== params.columnIndex) {
      resizeDrag = (
        <Draggable
          axis="x"
          onStop={handleStop}
          position={{ x: 0, y: 0 }}
          zIndex={999}
        >
          <div className="draggable-handle" />
        </Draggable>
      );
    }
    // var style=cloneDeep(params.style);
    // style.backgroundClip="border-box";
    // style.display="block";
    // style.lineHeight="20px"
    // style.overflow="hidden";
    return (
      <span style={params.style} key={params.key} className="cell">
        <strong>{field.name}</strong>
        {resizeDrag}
      </span>
    );
  }

  renderNoRows() {
    return (
      <div style={{ textAlign: 'center', fontSize: '16px' }}>
        No results found
      </div>
    );
  }

  handleStop(data, e, move) {
    const { columnWidths } = this.state;
    const originalWidth = this.getColumnWidth(data);

    // update dragged column width
    this.setState({
      columnWidths: {
        ...columnWidths,
        [data.name]: Math.max(originalWidth + move.x, 10),
      },
    });

    if (this.headerGrid) {
      this.headerGrid.measureAllCells();
      this.headerGrid.recomputeGridSize();
      this.headerGrid.forceUpdate();
    }

    if (this.rowsGrid) {
      this.rowsGrid.measureAllCells();
      this.rowsGrid.recomputeGridSize();
      this.rowsGrid.forceUpdate();
    }
  }

  resize(nextProps) {
    // console.log("============table resize");

     const props = nextProps || this.props;
    // let tableWidth;
    // //if(this.props.collapseV){
    // // console.log(props.widthOffset);

    // tableWidth = window.innerWidth - (props.widthOffset + 27);
    // // console.log(props.heigthOffset);

    // const tableHeight = window.innerHeight - (props.heigthOffset + 225);

    // // trigger columns resize
     this.autoResizeColumnsWidth(props.fields, props.rows,this.mystate.tableWidth);

    // this.setMyState({ tableWidth, tableHeight });
  }
  setMyState=(data)=>{
    this.mystate=data;
  }
  renderHeaderTopBar() {
    const {
      rows,
      rowCount,
      onCopyToClipboardClick,
      onSaveToFileClick,
    } = this.props;
    const styleCopied = {
      display: this.state.showCopied ? 'inline-block' : 'none',
    };
    const styleSaved = {
      display: this.state.showSaved ? 'inline-block' : 'none',
    };
    const styleCopyButtons = {
      display: this.state.showCopied ? 'none' : 'inline-block',
    };
    const styleSaveButtons = {
      display: this.state.showSaved ? 'none' : 'inline-block',
    };

    let copyPanel = null;
    let savePanel = null;
    if (rowCount) {
      copyPanel = (
        <div
          className="ui small label"
          title="Copy as"
          style={{ float: 'right'}}
        >
          <i className="copy icon" />
          <a className="detail" style={styleCopied}>
            Copied
          </a>
          <a
            className="detail"
            style={styleCopyButtons}
            onClick={() => onCopyToClipboardClick(rows, 'CSV')}
          >
            CSV
          </a>
          <a
            className="detail"
            style={styleCopyButtons}
            onClick={() => onCopyToClipboardClick(rows, 'JSON')}
          >
            JSON
          </a>
        </div>
      );

      savePanel = (
        <div
          className="ui small label"
          title="Save as"
          style={{ float: 'right', }}
        >
          <i className="save icon" />
          <a className="detail" style={styleSaved}>
            Saved
          </a>
          <a
            className="detail"
            style={styleSaveButtons}
            onClick={() => onSaveToFileClick(rows, 'CSV')}
          >
            CSV
          </a>
          <a
            className="detail"
            style={styleSaveButtons}
            onClick={() => onSaveToFileClick(rows, 'JSON')}
          >
            JSON
          </a>
        </div>
      );
    }

    return (
      <div style={{
        width:this.mystate.tableWidth
        ,height:headerTopBar_h
        ,overflow:"hidden" 
        ,background: 'rgba(0, 0, 0, 0.05)'}}>
        <div className="ui label" style={{  float: 'left' }}>
          <i className="table icon" />
          Rows
          <div className="detail">{rowCount}</div>
        </div>
        {savePanel}
        {copyPanel}
      </div>
    );
  }

  renderPreviewModal() {
    if (!this.state.showPreview) {
      return null;
    }

    return (
      <PreviewModal
        modalOpen={this.state.showPreview}
        value={this.state.valuePreview}
        onCloseClick={this.onClosePreviewClick.bind(this)}
      />
    );
  }

  renderTableBody(onScroll) {
    const { rowCount, fields } = this.props;
    let  { tableWidth, tableHeight } = this.mystate;


    // if(tableHeight<=80) tableHeight=80;
    // const headerHeight = 62; // value of 2 headers together
    // const scrollBarHeight = 15;
    // const fixedHeightRows = (rowCount || 1) * rowHeight + scrollBarHeight;
    var h=tableHeight- headerTopBar_h-rowHeight;
    console.log("body height"+h);
    return (
      <Grid
        className="grid-body"
        ref={ref => {
          this.rowsGrid = ref;
        }}
        cellRenderer={this.renderCell.bind(this)}
        width={tableWidth}
        height={h}
        rowHeight={rowHeight}
        onScroll={onScroll}
        rowCount={rowCount}
        columnCount={fields.length}
        columnWidth={this.getColumnWidth.bind(this)}
        rowsCount={rowCount}
        noContentRenderer={this.renderNoRows.bind(this)}
      />
    );
  }

  renderTableHeader(scrollLeft) {
    const { fields } = this.props;
    const { tableWidth } = this.mystate;

    if (!fields.length) {
      return null;
    }

    return (
      <Grid
        style={{overflow:"hidden"}}
        ref={ref => {
          this.headerGrid = ref;
        }}
        columnWidth={this.getColumnWidth.bind(this)}
        columnCount={fields.length}
        height={rowHeight}
        cellRenderer={this.renderHeaderCell.bind(this)}
        className={'HeaderGrid'}
        rowHeight={rowHeight}
        rowCount={1}
        getScrollbarSize={() => {
          return 0;
        }}
        width={tableWidth- scrollbarSize()}
        scrollLeft={scrollLeft}
      />
    );
  }

  getColumnWidth({ index }) {
    const { columnWidths, autoColumnWidths } = this.state;
    const field = this.props.fields[index];

    if (field && columnWidths && columnWidths[field.name] !== undefined) {
      return columnWidths[field.name];
    } else if (autoColumnWidths && autoColumnWidths[index] !== undefined) {
      return autoColumnWidths[index];
    }
    return 50;
  }

  /**
   * Resolve the cell width based in the header name and the top 30 rows data.
   * It gives a better UX since the column adapts better to the table width.
   */
  resolveCellWidth(fieldName, fields, rows) {
    const font = "14px 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif";
    const numRowsToFindAverage = rows.length > 30 ? 30 : rows.length;
    const maxWidth = 220;

    const headerWidth = this.getTextWidth(fieldName, `bold ${font}`);

    let averageRowsCellWidth = 0;
    if (rows.length) {
      averageRowsCellWidth =
        rows
          .slice(0, numRowsToFindAverage)
          .map(row => {
            const value = valueToString(row[fieldName]);
            return this.getTextWidth(value, font);
          })
          .reduce((prev, curr) => prev + curr, 0) / numRowsToFindAverage;
    }

    if (headerWidth > averageRowsCellWidth) {
      return headerWidth > maxWidth ? maxWidth : headerWidth;
    }

    return averageRowsCellWidth > maxWidth ? maxWidth : averageRowsCellWidth;
  }

  renderCell(params) {
    const field = this.props.fields[params.columnIndex];
    return (
      <TableCell
        style={params.style}
        key={params.key}
        rowIndex={params.rowIndex}
        data={this.props.rows}
        col={field.name}
        onOpenPreviewClick={this.onOpenPreviewClick}
      />
    );
  }

  render() {
    // not completed loaded yet
    // if (!this.state.tableWidth) {
    //   return null;
    // }
    return (<AutoSizer id="autosizer">
    {
      ({width,height}) => {
         console.log(width+","+height);
         this.setMyState({tableWidth:width,tableHeight:height});

         return(
    <div id="inside AutoSizer">
          <ScrollSync>
          {
            (params2) =>{ 
              console.log(params2);
              let {
                onScroll,
                scrollLeft,
              }=params2;
              return (
                <div style={{display:"flex",flexDirection:"column"}}className="grid-query-wrapper">
                  {
                    this.renderHeaderTopBar()
                  }
                  {this.renderTableHeader(scrollLeft)}
                  {this.renderTableBody(onScroll)}
                </div>
              )
            }
          }
          </ScrollSync>
          {this.renderPreviewModal()}
          <style jsx="true">{`
            .grid-query-wrapper {
            }

            .Grid {
              outline: none;
            }

            .draggable-handle {
              width: 5px;
              cursor: col-resize;
              height: 30px;
              position: absolute;
              right: 0;
              border-right: 1px solid #bfbfbf;
              top: 0;
              z-index: 10000;
            }

            .Grid.grid-header-row .Grid__cell .draggable-handle:hover,
            .Grid.grid-header-row .Grid__cell .react-draggable-dragging {
              border-right: 3px solid #0284ff;
            }

            .Grid.grid-body {
              background: whitesmoke;
              overflow: hidden !important;
            }

            .Grid.grid-body ::-webkit-scrollbar {
              display: none;
            }

            .Grid.grid-body:hover {
              overflow: auto !important;
            }

            .Grid.grid-body:hover ::-webkit-scrollbar {
              display: block;
            }

            .Grid.grid-body > .Grid__innerScrollContainer {
              background: #fff;
            }

            .Grid__cell {
              overflow: hidden;
            }

            .Grid__cell > .item {
              border: 1px solid #eee;
              padding-left: 3px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .Grid.grid-header-row .Grid__cell {
              overflow: visible;
              font-weight: bold;
              padding-left: 10px;
              padding-right: 10px;
            }

            .Grid.grid-header-row .Grid__cell span {
              overflow: hidden;
              width: 100%;
              text-overflow: ellipsis;
              display: block;
            }

            .Grid.grid-header-row .Grid__cell > .item {
              border: none;
            }

            .Grid.grid-header-row {
              overflow: hidden !important;
              background: #f9fafb;
              border: solid rgba(34, 36, 38, 0.1);
              border-right: none;
            }

            .grid-header-row .Grid__cell > .item {
              border:        solid #dadada;
            }

            .Grid .table-cell-type-null {
              vertical-align: text-bottom;
            }
            .cell {
              overflow: hidden;
              width: 100%;
              height: 100%;
              text-align: center;
              border-right: solid 1px #e0e0e0;
              border-bottom: solid 1px #e0e0e0;
            }
            .HeaderGrid {
              width: 100%;
              overflow: hidden !important;
            }
          `}</style>
      </div>
        );
      }
    }
    </AutoSizer>
    );
  }
}
