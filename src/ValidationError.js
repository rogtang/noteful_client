import React from 'react';
import propTypes from 'prop-types';

export default function ValidationError(props) {
  if(props.message) {
    return (
      <div className="error">{props.message}</div>
    );
  }

  return <></>
}

ValidationError.propTypes = {
    message: propTypes.string
  }