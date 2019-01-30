import React, { Component } from 'react';
import PropTypes from 'proptypes';
//import {Input} from 'semantic-ui-react';
import { Checkbox } from 'semantic-ui-react';
export default class CheckboxMe extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    onChecked: PropTypes.func.isRequired,
    onUnchecked: PropTypes.func.isRequired,
  };
  onChange = () => {
    if (!this.props.defaultChecked) {
      this.props.onChecked();
    } else {
      this.props.onUnchecked();
    }
  };
  render() {
    const { name, label, disabled } = this.props;
    return (
      <Checkbox
        toggle
        name={name}
        disabled={disabled}
        checked={this.props.defaultChecked}
        onChange={this.onChange}
        label={label}
      />
    );
  }
}
