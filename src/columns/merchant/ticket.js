import React from 'react';
import moment from "moment";

const backGroundStatus = (data) =>{
  switch(data) {
    case "backlog":
      return "#cccccc"
    case "waiting":
      return "#4a90e2"
    case "inprogress":
      return "#f5a623"
    default:
      return "#d0021b"
  }
}

const Column = ({ t, handleEdit, merchantId, handleRestoreProduct, handleArchiveProduct, setOldData }) => {
  return [
    {
      title: 'ID',
      name: 'id',
      tableItem: {},
    },
    {
      title: 'Title',
      name: 'title',
      tableItem: {},
      formItem: {
        rules: [{ type: 'required' }],
      },
    },
    {
      title: 'Created by',
      name: 'requestedUserName',
      tableItem: {},
    },
    {
      title: 'Last updated',
      name: 'modifiedDate',
      tableItem: {
        render: (text, data) => {
          return data.modifiedBy !== 0 ? moment(text).format('L') : '';
        },
      }
    },
    {
      title: 'Status',
      name: 'status',
      tableItem: {
        render: (text, data) => (
          <div style={{background: backGroundStatus(text), textAlign: 'center', borderRadius: '4px', padding: "5px"}}>
          {text}
        </div>
        )
      }
    }
  ];
};
export default Column;
