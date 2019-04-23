import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
export default class Loading extends Component {
  state = { active: false };
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
    inverted: PropTypes.bool,
  };

  componentDidMount() {
    //$(this.refs.loader).dimmer('show');
    this.setState({ active: true });
  }

  componentWillUnmount() {
    //$(this.refs.loader).dimmer('hide');
    this.setState({ active: false });
  }

  render() {
    const { message } = this.props;
    //const inverted = this.props.inverted ? 'inverted' : '';
    return (
      <Dimmer.Dimmable as={Segment} dimmed={this.state.active}>
        <Dimmer active={this.state.active}>
          <Loader>{message}</Loader>
        </Dimmer>
      </Dimmer.Dimmable>
    );
  }
}
