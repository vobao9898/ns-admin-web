import React from 'react';
import { Form } from 'components';
import { Form as FormAnt } from 'antd';
import RemoveIcon from 'assets/svg/remove';

const CommissionForm = ({ getForm, index, moreSalaray, deleteForm }) => {
  const [form] = FormAnt.useForm();
  getForm(form);
  const cols = [
    {
      title: 'From',
      name: 'from',
      formItem: {
        col: 4,
        colTablet: 6,
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
      },
    },
    {
      title: 'To',
      name: 'to',
      formItem: {
        col: 4,
        colTablet: 6,
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            $
          </p>
        ),
      },
    },
    {
      title: 'Salary percented (%)',
      name: 'commission',
      formItem: {
        col: 4,
        colTablet: 6,
        placeholder: '0',
        addonBefore: () => (
          <p className="text-center" style={{ width: 40 }}>
            %
          </p>
        ),
      },
    },
  ];
  return (
    <div className="flex item-center justify-between">
      <div className=" w-11/12">
        <Form columns={cols} form={form} values={moreSalaray?.value} />
      </div>
      <div className="w-1/12 flex items-center justify-end">
        <RemoveIcon onClick={() => deleteForm(moreSalaray?.id)} />
      </div>
    </div>
  );
};

export default CommissionForm;
