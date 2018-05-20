import React, { Component } from 'react';
import PropTypes from 'proptypes';

export default class DatabaseFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  };

  onFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  focus() {
    this.refs.searchInput.focus();
  }

  render() {
    //console.log("render DatabaseFilter");
    //console.log(this.props);

    var { value, placeholder, isFetching } = this.props;
    if (!value) value = '';
    return (
      <div className={`ui icon input ${isFetching ? 'loading' : ''}`}>
        <input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={value}
          ref="searchInput"
          disabled={isFetching}
          onChange={this.onFilterChange.bind(this)}
        />
        <i className="search icon" />
      </div>
    );
  }
}
