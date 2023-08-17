import React, { Fragment } from 'react';
import { Button } from 'layouts/components';
import { Form } from '../../../../components';
import { Form as FormAnt } from 'antd';
import { UserService } from '../../../../services/user';

const Setting = ({ data, getDetail }) => {
  const [form] = FormAnt.useForm();

  return (
    <Fragment>
      <div className="font-bold text-lg mb-4 text-blue-500">Daily transactions limit</div>
      <div className="grid grid-cols-12 mb-4">
        <div className="col-span-12">
          <div className="text-sm font-semibold mb-2">
            The NailSoftPay system will aleat any user and prevent any use involved monetary transfer or transfers that
            are :
          </div>
        </div>
        <div className="sm:col-span-6 col-span-12">
          <div className="text-sm mb-4">
            <ol className={'list-decimal list-inside'}>
              <li>More than $10000 in total from either cash-in orr cash-out</li>
              <li>Is con ducted by the same person</li>
              <li>Is conducted on the same bussiness day</li>
            </ol>
          </div>
          <Form
            className="w-12"
            form={form}
            values={data}
            columns={[
              {
                name: 'firstName',
                formItem: { type: 'hidden' },
              },
              {
                name: 'lastName',
                formItem: { type: 'hidden' },
              },
              {
                name: 'phone',
                formItem: { type: 'hidden' },
              },
              {
                name: 'email',
                formItem: { type: 'hidden' },
              },
              {
                title: 'Limit',
                name: 'limitAmount',
                formItem: {
                  addonBefore: () => <div className={'px-2 py-2'}>$</div>,
                  mask: {
                    alias: 'numeric',
                    groupSeparator: ',',
                    placeholder: '0',
                  },
                },
              },
            ]}
          />
        </div>
      </div>
      <Button
        name="SAVE"
        type="ok"
        onClick={() => {
          form
            .validateFields()
            .then(async (values) => {
              await UserService.put(values, data?.id);
              await getDetail();
            })
            .catch(() => false);
        }}
      />
    </Fragment>
  );
};

export default Setting;
