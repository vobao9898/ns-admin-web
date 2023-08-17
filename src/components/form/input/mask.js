import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

const Component = ({
  typePassword = false,
  mask,
  value,
  addonBefore,
  addonAfter,
  form,
  disabled,
  onFirstChange,
  ...prop
}) => {
  const [toggle, set_toggle] = useState(false);
  const input = useRef();
  if (prop.condition) {
    delete prop.condition;
  }
  useEffect(() => {
    set_toggle(typePassword);
    setTimeout(() => {
      if (mask && input.current) {
        import('inputmask').then(({ default: Inputmask }) => Inputmask(mask).mask(input.current));
      }
    });
  }, []);
  return (
    <div
      className={classNames('relative ant-input flex items-center', {
        'border rounded-xl': !!addonBefore || !!addonAfter,
      })}
    >
      {!!addonBefore && <div>{addonBefore(form, onFirstChange)}</div>}
      <input
        ref={input}
        type={toggle ? 'password' : 'text'}
        className={classNames('w-full h-10 text-gray-600 px-4 ant-input', {
          'border rounded-xl': !addonBefore && !addonAfter,
          'rounded-l-xl border-r': !addonBefore && !!addonAfter,
          'rounded-r-xl border-l': !!addonBefore && !addonAfter,
          'border-r border-l': !!addonBefore && !!addonAfter,
          'bg-[#EDEDED] text-gray-400 disabled': disabled,
          'bg-white': !disabled,
        })}
        readOnly={disabled}
        value={value || ''}
        {...prop}
      />
      {typePassword ? (
        <i
          onClick={() => set_toggle(!toggle)}
          className={classNames('text-lg las absolute top-1.5 right-3 z-10', {
            'la-eye-slash': toggle,
            'la-eye': !toggle,
          })}
        />
      ) : (
        ''
      )}
      {!!addonAfter && <div>{addonAfter(form, onFirstChange)}</div>}
    </div>
  );
};
export default Component;
