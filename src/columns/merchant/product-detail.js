import React from 'react';

const ColumnProductDetail = () => [
  {
    title: 'Versions',
    name: 'label',
    tableItem: {},
  },
  {
    title: 'Barcode',
    name: 'barCode',
    tableItem: {},
  },
  {
    title: 'Description',
    name: 'description',
    tableItem: {},
  },
  {
    title: 'Cost price',
    name: 'costPrice',
    tableItem: {},
  },
  {
    title: 'Price',
    name: 'price',
    tableItem: {},
  },
  {
    title: 'Qty',
    name: 'quantity',
    tableItem: {},
  },
  {
    title: 'Temp qty',
    name: 'tempQuantity',
    tableItem: {},
  },
  {
    title: 'Image',
    name: 'imageUrl',
    tableItem: {
      render: (text) =>
        text && (
          <div className="w-10 h-10 p-1">
            <img className="w-full h-full object-cover" src={text} alt="img" />
          </div>
        ),
    },
  },
];

export default ColumnProductDetail;
