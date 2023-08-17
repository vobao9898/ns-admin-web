import React from 'react';
import moment from 'moment';
// import { Select } from 'antd';

const Column = ({ formatDate }) => {
  return [
    {
      title: 'NailSoft ID',
      name: 'accountId',
      tableItem: {
        sorter: true,
        width: 200,
        fixed: true,
        render: (text, item) => {
          if (item?.type === 'total') {
            return <p className="font-semibold">Total Rows: {item?.count}</p>;
          }
          return <p>{item?.accountId}</p>;
        },
      },
    },
    {
      title: 'First Name',
      name: 'firstName',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Last Name',
      name: 'lastName',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    // Tam thoi tat, ko cho edit Phone

    // {
    //   name: 'codePhone',
    //   formItem: {
    //     type: 'hidden',
    //   },
    // },
    {
      title: 'Phone Number',
      name: 'phone',
      tableItem: {
        sorter: true,
      },
      // formItem: {
      //   rules: [{ type: 'required' }, { type: 'min', value: 4 }],
      //   mask: {
      //     mask: '[9{1,3}][ 9{1,3}][-9{1,4}]',
      //   },
      //   addonBefore: (form) => (
      //     <Select
      //       className="code-select"
      //       style={{ width: 100, textAlign: 'center' }}
      //       defaultValue={form.getFieldValue('codePhone') || '+1'}
      //       onChange={(codePhone) => {
      //         form.setFieldsValue({ codePhone });
      //       }}
      //     >
      //       <Select.Option value="+1">
      //         <p className={'inline-flex items-center'}>
      //           +1
      //         </p>
      //       </Select.Option>
      //       <Select.Option value="+84">
      //         <span className={'inline-flex items-center'}>
      //           +84
      //         </span>
      //       </Select.Option>
      //     </Select>
      //   ),
      // },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        sorter: true,
        width: 180,
      },
      formItem: {
        rules: [{ type: 'required' }, { type: 'email' }],
      },
    },
    {
      title: 'Balance',
      name: 'credit',
      tableItem: {
        sorter: true,
        render: (text, item) => {
          if (item?.type !== 'total') return <p>${text}</p>;
          return <p className="font-semibold">${text}</p>;
        },
      },
    },
    {
      title: 'Money Spent/Daily',
      name: 'totalAmount',
      tableItem: {
        sorter: true,
        width: 180,
        render: (text, item) => {
          if (item?.type !== 'total') return <p>${text}</p>;
          return <p className="font-semibold">${text}</p>;
        },
      },
    },
    {
      name: 'limitAmount',
      formItem: { type: 'hidden' },
    },
    {
      title: 'Verify',
      name: 'isVerified',
      tableItem: {
        sorter: true,
        render: (text) => text === 1 && <i className="las la-check-circle la-2x" />,
      },
    },
    {
      title: 'Last Active',
      name: 'lastActivity',
      tableItem: {
        sorter: true,
        render: (text) => !!text && moment(text).format(formatDate + ' h:mm:ss A'),
      },
    },
  ];
};
export default Column;
