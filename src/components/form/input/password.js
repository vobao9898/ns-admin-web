import React, { useState } from 'react';
import classNames from 'classnames';

const Component = ({ disabled, ...prop }) => {
  const [toggle, set_toggle] = useState(true);
  if (prop.value === undefined) {
    prop.value = '';
  }

  return (
    <div className="relative">
      <input
        {...prop}
        type={toggle ? 'password' : 'text'}
        className={classNames(
          'w-full h-10 rounded-xl text-gray-600 border border-solid py-2 pr-9 pl-4 ant-input pr-9',
          {
            'bg-[#EDEDED]': disabled,
            'bg-white': !disabled,
          },
        )}
        disabled={disabled}
      />
      <i
        onClick={() => set_toggle(!toggle)}
        className={classNames('text-lg las absolute top-1.5 right-3 z-10', {
          'la-eye-slash': toggle,
          'la-eye': !toggle,
        })}
      />
    </div>
  );
};
export default Component;
