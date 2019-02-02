import isPlainObject from 'lodash.isplainobject';
import React, { Component } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import { Modal } from 'semantic-ui-react';

export default class PreviewModal extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onCloseClick: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    // $(this.refs.previewModal).modal({
    //   context: 'body',
    //   closable: false,
    //   detachable: false,
    //   onDeny: () => {
    //     this.props.onCloseClick();
    //     return true;
    //   },
    // }).modal('show');
  }

  componentWillUnmount() {
    // $(this.refs.previewModal).modal('hide');
  }

  onClick(type) {
    this.setState({ selected: type });
  }

  getPreviewValue(type) {
    const { value } = this.props;
    try {
      switch (type) {
        case 'plain':
          return isPlainObject(value) ? JSON.stringify(value) : value;
        case 'json':
          return <pre>{JSON.stringify(value, null, 2)}</pre>;
        default:
          return value;
      }
    } catch (err) {
      return 'Not valid format';
    }
  }

  renderMenu() {
    const { selected } = this.state;
    const items = [
      { type: 'plain', name: 'Plain Text', default: true },
      { type: 'json', name: 'JSON' },
    ];

    return (
      <div className="ui fluid two item menu">
        {items.map(item => {
          const className = classNames({
            item: true,
            active: (!selected && item.default) || selected === item.type,
          });

          /* eslint react/jsx-no-bind:0 */
          return (
            <a
              key={item.type}
              onClick={this.onClick.bind(this, item.type)}
              className={className}
            >
              {item.name}
            </a>
          );
        })}
      </div>
    );
  }

  render() {
    const selected = this.state.selected || 'plain';
    const previewValue = this.getPreviewValue(selected);
    return (
      <Modal
        ref="previewModal"
        closable="false"
        detachable="false"
        open={this.props.modalOpen}
        dimmer={'inverted'}
      >
        <Modal.Header>Content Preview</Modal.Header>
        <Modal.Content>
          {this.renderMenu()}
          <div className="ui segment">
            <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
              {previewValue}
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <div
            className="small ui black deny right button"
            onClick={this.props.onCloseClick}
            tabIndex="0"
          >
            Close
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}
