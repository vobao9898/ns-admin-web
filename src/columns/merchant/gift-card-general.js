import React, { Fragment } from 'react';
import { Tooltip, Checkbox } from 'antd';
import moment from 'moment';
import { MerchantService } from 'services/merchant';

const Column = ({ t, formatDate, handleEdit, handleDelete, handleExport, setOldData, handleModalInfo }) => {
  return [
    {
      title: 'ID',
      name: 'giftCardId',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Serial',
      name: 'serialNumber',
      tableItem: {
        sorter: true,
      },
    },
    {
      title: 'Created On',
      name: 'createdDate',
      tableItem: {
        sorter: true,
        render: (text, data) => moment(text).format('MM/DD/YYYY'),
      },
    },
    {
      title: 'Value',
      name: 'amount',
      tableItem: {
        sorter: true,
        render: (text, data) => '$ ' + text,
      },
    },
    {
      title: 'Is Active',
      name: 'isActive',
      tableItem: {
        sorter: true,
        render: (text, data) => <Checkbox className="ml-9" checked={text}></Checkbox>,
      },
    },
    {
      title: 'Actions',
      tableItem: {
        width: 180,
        align: 'center',
        onCell: () => ({
          style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
        }),
        render: (text, record) => (
          <Fragment>
            <div className="flex items-center justify-center">
              <Tooltip title="Info">
                <button
                  className="embed border border-gray-300 text-xs rounded-lg mr-2 "
                  onClick={async () => {
                    const { data } = await MerchantService.getInfoGeneralById(record?.giftCardId);
                    handleModalInfo({
                      data,
                      title: record?.serialNumber,
                    });
                  }}
                >
                  <div className="w-[30px] h-[30px] flex items-center justify-center">
                    <i className="las la-info-circle text-xl" />
                  </div>
                </button>
              </Tooltip>
            </div>
          </Fragment>
        ),
      },
    },
  ];
};
export default Column;
