import { Fragment, React } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import ArchiveIcon from 'assets/svg/archive.js';

const Column = ({ handleExport }) => {
  return [
    {
      title: 'History ID',
      name: 'subscripitonHistoryId',
      tableItem: {
        sorter: true,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 3,
        colTablet: 6,
      },
    },
    {
      title: 'Subscription Plan',
      name: 'packageName',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Pricing Model',
      name: 'pricingType',
      tableItem: {
        sorter: true,
        render: (text) => {
          return <div>Paid {text}</div>;
        },
      },
    },
    {
      title: 'Expired Date',
      name: 'expiredDate',
      tableItem: {
        sorter: true,
        render: (text) => {

          return moment(text).format("MMM DD, YYYY");
        },
      },
    },
    {
      title: 'Payment Date',
      name: 'createdDate',
      tableItem: {
        sorter: true,
        render: (text) => {

          return moment(text).format("MMM DD, YYYY");
        },
      },
    },
    {
      title: 'Amount',
      name: 'totalPrice',
      tableItem: {
        sorter: true,
        render: (text, data) => <div>{`$${text}`}</div>,
      },
      formItem: {
        rules: [{ type: 'required' }],
        col: 12,
      },
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        sorter: false,
      },
    },
    {
      title: 'Actions',
      tableItem: {
        width: 180,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <Fragment>
            <Tooltip title={"Download"}>
              <button
                className="embed border text-xs rounded-lg mr-2 text-red-500"
                onClick={() => handleExport(data?.subscripitonHistoryId)}
              >
                <ArchiveIcon color={data?.isDisabled === 1 ? 'rgba(0,0,255,0.5)' : ''} />
              </button>
            </Tooltip>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
