import moment from 'moment';
import React from 'react';

const ColumnLogs = () => {
  return [
    {
      title: 'Server Time',
      name: 'createdDate',
      tableItem: {
        render: (content, record) => {
          const date = new Date(content);
          return moment(date + ' UTC').format('MM/DD/YYYY hh:mm A');
        },
      },
    },
    {
      title: 'Merchant Request Status',
      name: 'status',
      tableItem: {
        render: (content, record) => {
          if (record?.isApproved === 1) return 'Approved';
          else if (record?.isRejected === 1) {
            return (
              <>
                Rejected
                <div>
                  <strong>Reason: </strong> {record?.reasonReject}
                </div>
              </>
            );
          } else return 'Handling';
        },
      },
    },
    {
      title: 'Merchant Request From',
      name: 'merchant',
      tableItem: {
        render: (content) => {
          return content?.email;
        },
      },
    },
    {
      title: 'User',
      name: 'adminUser',
      tableItem: {
        render: (content) => {
          return content?.firstName + ' ' + content?.lastName;
        },
      },
    },
  ];
};

export default ColumnLogs;
