import React from 'react';

const Button = ({ name, type, moreClass, onClick }) => {
  const generateClass = () => {
    const base = 'px-4 py-1.5 text-base font-medium rounded border duration-150';
    const normalStyle = 'text-blue-500 bg-white border-black/20 hover:opacity-60';
    const cancelStyle = 'text-black bg-white border-black/20 hover:opacity-60';
    const okStyle = 'text-white bg-blue-500 hover:bg-white hover:text-blue-500 border-blue-500';

    if (type === 'cancel') {
      return `${base} ${cancelStyle} ${moreClass}`;
    }
    if (type === 'ok') {
      return `${base} ${okStyle} ${moreClass}`;
    }
    return `${base} ${normalStyle} ${moreClass}`;
  };

  return (
    <button type={'button'} className={generateClass()} onClick={() => onClick()}>
      {name}
    </button>
  );
};

export default Button;
