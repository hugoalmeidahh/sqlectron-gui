import React, { Component } from 'react';
import PropTypes from 'proptypes';
import debounce from 'lodash.debounce';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
export default class ServerFilter extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onSettingsClick: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.delayedCallback = debounce(this.props.onFilterChange, 200);
  }

  onFilterChange(event) {
    event.persist();
    this.delayedCallback(event);
  }

  render() {
    return (
      <form style={{ display: 'flex',
    flexWrap: 'wrap'}}>
        <SearchIcon />
        <TextField variant="outlined"
          type="text"
          label="Search..."
          onChange={this.onFilterChange.bind(this)}
        />
        <Button variant="outlined" onClick={this.props.onAddClick.bind(this)}>
          Add
        </Button>
        <Button
          variant="outlined"
          onClick={this.props.onSettingsClick.bind(this)}
        >
          Settings
        </Button>
      </form>
    );
  }
}
