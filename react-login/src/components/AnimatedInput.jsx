import React from 'react';

const AnimatedInput = ({ type, id, label, value, onChange, required = true, readOnly = false }) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        id={id}
        name={id}
        className="animated-input"
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
      />
      <label htmlFor={id} className="input-label">
        {label}
      </label>
    </div>
  );
};

export default AnimatedInput;
