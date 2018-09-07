import * as React from 'react';
import { AutoSizer,Grid, ScrollSync } from 'react-virtualized';
import cloneDeep from 'lodash.clonedeep';

export class GridExample extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      columnWidth: 75,
      columnCount: 50,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount:300,
    };
  }

  render() {
    const {
      columnCount,
      columnWidth,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount
    } = this.state;

    return (
        <ScrollSync>
          {(params) => {
            // console.log(params);
            let {
            // clientHeight,
            // clientWidth,
            onScroll,
            // scrollHeight,
            scrollLeft,
            // scrollTop,
            // scrollWidth,
          }=params;
            // clientWidth=this.props.w;
            // clientHeight=this.props.h;
            // const x = scrollLeft / (scrollWidth - clientWidth);
            // const y = scrollTop / (scrollHeight - clientHeight);

            // const leftBackgroundColor = mixColors(
            //   LEFT_COLOR_FROM,
            //   LEFT_COLOR_TO,
            //   y,
            // );
            // const leftColor = '#ffffff';
            // const topBackgroundColor = mixColors(
            //   TOP_COLOR_FROM,
            //   TOP_COLOR_TO,
            //   x,
            // );
            // const topColor = '#ffffff';
            // const middleBackgroundColor = mixColors(
            //   leftBackgroundColor,
            //   topBackgroundColor,
            //   0.5,
            // );
            // const middleColor = '#ffffff';
            // let rowHeight=(this.props.h-scrollbarSize())/(rowCountShow+1);//border width
            return (
                        <div
                          style={{
                            height: rowHeight,
                            width: this.props.w,
                          }}>
                          <Grid
                            style={{overflow:"hidden"}}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this._renderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={this.props.w}
                          />
                          <Grid
                            style={{overflow:"auto"}}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={this.props.h-rowHeight}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={this._renderCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
                            width={this.props.w}
                          />
              </div>
            );
          }}
        </ScrollSync>
    );
  }
  _renderCell=({columnIndex, key, style})=>{
    var style2=cloneDeep(style);
    style2.backgroundColor="#FA0";
    style2.borderRight="solid 1px";
    style2.borderBottom="solid 1px";
    return (
      <div  key={key} style={style2}>
        {`C${columnIndex}`}
      </div>
    );
  }
}
export default class Me extends React.PureComponent {
  render=()=>{
    return(<AutoSizer>
          {
            ({width,height}) =>{
              console.log(width+","+height);
              return (
                <GridExample w={width} h={height}/>
                );
            }
         }
        </AutoSizer>)
  }
}