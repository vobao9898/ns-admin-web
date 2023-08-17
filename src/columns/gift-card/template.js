import React from 'react';
import { Tooltip, Checkbox } from 'antd';
import EditIcon from 'assets/svg/edit.js';

const ColumnsTemplate = ({ handleEdit, archiveHandle }) => {
  return [
    {
      title: 'fileId',
      name: 'fileId',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: 'Thumbnail',
      name: 'imageUrl',
      tableItem: {
        render: (text) => (
          <div
            className="w-28 h-16 bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url("${text}")` }}
          ></div>
        ),
      },
    },
    {
      title: 'Name',
      name: 'giftCardTemplateName',
      tableItem: {},
      formItem: {
        rules: [{ type: 'required' }],
        col: 4,
      },
    },
    {
      title: 'Group',
      name: 'giftCardType',
      tableItem: {},
      formItem: {
        type: 'select',
        rules: [{ type: 'required' }],
        list: [
          { label: 'Happy Anniversary', value: 'Happy Anniversary' },
          { label: 'Happy Birthday', value: 'Happy Birthday' },
          { label: 'Happy New Year', value: 'Happy New Year' },
          { label: 'Happy Valentine', value: 'Happy Valentine' },
          { label: 'Thank You', value: 'Thank You' },
          { label: 'I Love You', value: 'I Love You' },
          { label: 'Merry Christmas', value: 'Merry Christmas' },
        ],
        col: 4,
      },
    },
    {
      title: 'Status',
      name: 'isDisabled',
      tableItem: {
        width: 80,
        render: (text) => (text === 'active' ? 'Active' : 'Inactive'),
      },
      formItem: {
        type: 'select',
        rules: [{ type: 'required' }],
        list: [
          { label: 'Active', value: 0 },
          { label: 'Inactive', value: 1 },
        ],
        col: 4,
      },
    },
    {
      title: 'Image',
      name: 'imageUrl',
      formItem: {
        type: 'upload',
        col: 3,
        onlyImage: true,
        action: 'file?category=product',
      },
    },
    {
      title: 'Visible On App',
      name: 'isConsumer',
      tableItem: {
        type: 'checkbox',
        width: 140,
        render: (text) => (
          <div className="text-center">
            <Checkbox onChange={() => {}} checked={text}></Checkbox>
          </div>
        ),
      },
      formItem: {
        type: 'checkbox',
        col: 12,
      },
    },
    {
      title: 'Action',
      tableItem: {
        width: 110,
        onCell: () => ({
          style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
        }),
        render: (text, data) => {
          return (
            <>
              <div className="flex items-center justify-center">
                <Tooltip title={data?.isDisabled === 'active' ? 'Archive' : 'Restore'}>
                  <button
                    className={`${
                      data?.isDisabled === 'active' ? 'text-black' : 'text-pink-500'
                    } embed border border-gray-300 text-xs rounded-lg mr-2`}
                    onClick={() => archiveHandle(data?.isDisabled, data?.giftCardTemplateId)}
                  >
                    <div className="w-[30px] h-[30px] flex items-center justify-center">
                      <i className="las la-trash-restore text-xl" />
                    </div>
                  </button>
                </Tooltip>
                <Tooltip title={'Edit'}>
                  <button
                    className="embed border border-gray-300 text-xs rounded-lg mr-2"
                    onClick={() =>
                      handleEdit({
                        ...data,
                        id: data?.giftCardTemplateId,
                      })
                    }
                  >
                    <EditIcon />
                  </button>
                </Tooltip>
              </div>
            </>
          );
        },
      },
    },
  ];
};
export default ColumnsTemplate;
