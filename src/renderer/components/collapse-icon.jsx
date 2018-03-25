import React  from 'react';
import PropTypes from 'proptypes';
const CollapseIcon = ({ arrowDirection }) =>
  (<i
    className={`${arrowDirection} triangle icon`}
    style={{ float: 'left', margin: '0 0.15em 0 -1em' }}
  />);

CollapseIcon.propTypes = {
  arrowDirection: PropTypes.string.isRequired,
};

export default CollapseIcon;
