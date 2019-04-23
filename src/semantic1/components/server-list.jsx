import React, { Component } from 'react';
import PropTypes from 'proptypes';
import ServerListItem from './server-list-item.jsx';
import Message from './message.jsx';

//require('./server-list.scss');

export default class ServerList extends Component {
  static propTypes = {
    servers: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onConnectClick: PropTypes.func.isRequired,
  };

  groupItemsInRows(items) {
    const itemsPerRow = 4;
    return items.reduce((rows, item, index) => {
      const position = Math.floor(index / itemsPerRow);
      if (!rows[position]) {
        rows[position] = []; // eslint-disable-line no-param-reassign
      }

      rows[position].push(item);
      return rows;
    }, []);
  }

  render() {
    const { servers, onEditClick, onConnectClick } = this.props;

    if (!servers.length) {
      return <Message message="No results" type="info" />;
    }

    return (
      <div id="server-list">
        {this.groupItemsInRows(servers).map((row, rowIdx) => (
          <div key={rowIdx} className="ui cards">
            {row.map(server => (
              <ServerListItem
                key={server.id}
                onConnectClick={() => onConnectClick(server)}
                onEditClick={() => onEditClick(server)}
                server={server}
              />
            ))}
          </div>
        ))}
        <style jsx="true">{`
          #server-list {
            /**
   * 1 card per row
   */
            /**
   * 2 cards per row
   */
            /**
   * 4 cards per row
   */
          }
          #server-list .ui.cards > .card {
            width: 100%;
          }
          #server-list .ui.cards {
            margin-left: -1em;
            margin-right: -1em;
          }
          #server-list .ui.cards > .card {
            width: calc(50% - 2em);
            margin-left: 1em;
            margin-right: 1em;
          }
          #server-list .ui.cards {
            margin-left: -0.75em;
            margin-right: -0.75em;
          }
          #server-list .ui.cards > .card {
            width: calc(25% - 1.5em);
            margin-left: 0.75em;
            margin-right: 0.75em;
          }
          #server-list .card .content .header,
          #server-list .card .content .meta {
            word-break: break-all;
          }
        `}</style>
      </div>
    );
  }
}
