import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Primary UI component for user interaction
 */
export const Button = ({ children, type, className, ...props }) => {
  return (
    <button
      type="button"
      className={classNames(className, {
        'border border-gray-300 rounded-lg px-1 bg-white': type === 'icon',
        'h-10 bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-400 inline-flex items-center':
          type === 'primary',
      })}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  /**
   * Button contents
   */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  /**
   * How large should the button be?
   */
  type: PropTypes.oneOf(['primary', 'icon']),
  /**
   * Button class
   */
  className: PropTypes.string,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  type: 'primary',
  className: '',
  onClick: undefined,
};
