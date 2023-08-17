import React from 'react';

const Column = ({ listState, pinExists = [], modalRef }) => {
  return [
    {
      title: 'Services (Assign services this staff can be perform)',
      formItem: {
        render: () => (
          <h4 className="font-semibold text-xl text-blue-500">Services (Assign services this staff can be perform)</h4>
        ),
      },
    },
  ];
};

export default Column;
