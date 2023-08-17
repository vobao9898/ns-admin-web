import React, { useState, Fragment, useEffect } from 'react';
import { Form, Checkbox } from 'antd';
import { Form as FormComponent } from 'components';
import { Mask } from 'components/form/input';
import ListForm from './list-form';

const Page = ({ location, handSubmit = () => {}, salary }) => {
  const [isSalaryPerHour, setIsSalaryPerHour] = useState(false);
  const [isSalaryCommission, setIsSalaryCommission] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [isTipPercent, setIsTipPercent] = useState(false);
  const [isTipFixed, setIsTipFixed] = useState(false);
  const [salaryCommission, setSalaryCommision] = useState({});
  const [count, setCount] = useState([]);

  let commissionForms = [];

  const [form] = Form.useForm();
  const [formSalary] = Form.useForm();
  // 1. Chinh lai giao dien form-> gan giong voi hp cu, co title, an hien
  // next chuaw lay duoc value cua form dong

  useEffect(() => {
    form.setFieldsValue({
      salaryPerHour: salary?.salaryPerHour,
      productCommission: salary?.productCommission,
      cashPercent: salary?.cashPercent,
      tipPercent: salary?.tipPercent,
      tipFixedAmount: salary?.tipFixedAmount,
    });
    salary?.isSalaryPerHour !== undefined && setIsSalaryPerHour(salary?.isSalaryPerHour);
    salary?.isSalaryCommission !== undefined && setIsSalaryCommission(salary?.isSalaryCommission);
    salary?.isProduct !== undefined && setIsProduct(salary?.isProduct);
    salary?.isTipPercent !== undefined && setIsTipPercent(salary?.isTipPercent);
    salary?.isTipFixed !== undefined && setIsTipFixed(salary?.isTipFixed);

    if (salary?.salaryCommissions) {
      const newCount = salary?.salaryCommissions.map((item) => ({ id: Math.random(), value: item }));
      setCount(newCount);
    }

    setSalaryCommision(salary?.defaultSalaryCommission || {});
  }, [salary]);

  const handleNext = async () => {
    let value = await form.validateFields();
    const defaultSalaryCommission = await formSalary.validateFields();
    const promisses = commissionForms.map((item) => item?.getFieldsValue());
    const result = await Promise.all(promisses);
    value = {
      ...value,
      isSalaryPerHour,
      isSalaryCommission,
      isTipPercent,
      isTipFixed,
      isProduct,
      salaryCommissions: result,
      defaultSalaryCommission,
    };
    handSubmit(value);
  };

  const handleAddmore = () => {
    const newCount = {
      id: Math.random(),
      value: {},
    };
    // save current value
    const res = formSalary.getFieldsValue();
    const arr = count;
    const values = commissionForms?.map((item) => item?.getFieldsValue());
    values.map((item, index) => {
      arr[index].value = item;
      return item;
    });
    setCount([...arr, newCount]);
    setSalaryCommision(res);
  };

  const deleteForm = (id) => {
    const newCount = count;
    commissionForms.map((item, index) => {
      newCount[index].value = item?.getFieldsValue();
      return item;
    });
    const res = newCount?.filter((item) => item.id !== id);
    setCount(res);
  };

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
        onChange: (value, form) => {
          form.setFieldsValue({ to: '' });
        },
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
        rules: [
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                const fromValue = getFieldValue('from');
                if (fromValue) {
                  if (!value) {
                    return Promise.reject(new Error('From value can not be higher than To value'));
                  }
                  if (value && +value >= +fromValue) {
                    return Promise.resolve();
                  } else return Promise.reject(new Error('From value can not be higher than To value'));
                }
              },
            }),
          },
        ],
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
    <Fragment>
      <div className="my-5">
        <Form form={form}>
          <h4 className="font-semibold text-blue-500 text-lg">Salary</h4>
          <div className="flex items-center">
            <div>
              <Form.Item name="">
                <Checkbox
                  onChange={() => {
                    setIsSalaryPerHour(!isSalaryPerHour);
                    setIsSalaryCommission(isSalaryPerHour);
                  }}
                  checked={isSalaryPerHour}
                >
                  Salary Per Hour
                </Checkbox>
              </Form.Item>
              {isSalaryPerHour && (
                <div className="grid grid-cols-3 gap-3">
                  <Form.Item name={'salaryPerHour'} initialValue="">
                    <Mask
                      placeholder={'0.00'}
                      addonBefore={() => (
                        <p className="text-center" style={{ width: 40 }}>
                          $
                        </p>
                      )}
                    />
                  </Form.Item>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5">
            <Form.Item name="">
              <Checkbox
                checked={isSalaryCommission}
                onChange={() => {
                  setIsSalaryCommission(!isSalaryCommission);
                  setIsSalaryPerHour(isSalaryCommission);
                }}
              >
                Salary Commission
              </Checkbox>
            </Form.Item>
          </div>
        </Form>

        {isSalaryCommission && (
          <div className="">
            <div>
              <div className="w-11/12">
                <FormComponent columns={cols} form={formSalary} values={salaryCommission} />
              </div>
            </div>
            <ListForm
              count={count}
              getForm={(form) => {
                commissionForms = [...commissionForms, form];
              }}
              deleteForm={deleteForm}
            />
            <div className="w-fit text-blue-500 font-semibold mt-3 cursor-pointer" onClick={handleAddmore}>
              + Add more
            </div>
          </div>
        )}

        <Form form={form}>
          <h4 className="font-semibold text-blue-500 text-lg mt-5">Product Salary</h4>
          <Form.Item name="isProduct">
            <Checkbox onChange={() => setIsProduct(!isProduct)} checked={isProduct}>
              Product Commission
            </Checkbox>
          </Form.Item>
          <div className="grid grid-cols-3 gap-3">
            {isProduct && (
              <Form.Item name={'productCommission'} initialValue="">
                <Mask
                  placeholder={'0.00'}
                  addonBefore={() => (
                    <p className="text-center" style={{ width: 40 }}>
                      %
                    </p>
                  )}
                />
              </Form.Item>
            )}
          </div>

          <h4 className="font-semibold text-blue-500 text-lg">Tip Fee</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="">
              <Form.Item name="isTipPercent">
                <Checkbox
                  onChange={() => {
                    setIsTipPercent(!isTipPercent);
                    setIsTipFixed(isTipPercent);
                  }}
                  checked={isTipPercent}
                >
                  Tip Percent
                </Checkbox>
              </Form.Item>
              <div className="">
                {isTipPercent && (
                  <Form.Item name={'tipPercent'} initialValue="">
                    <Mask
                      placeholder={'0.00'}
                      addonBefore={() => (
                        <p className="text-center" style={{ width: 40 }}>
                          %
                        </p>
                      )}
                    />
                  </Form.Item>
                )}
              </div>
            </div>
            <div className="">
              <Form.Item name="isTipFixed">
                <Checkbox
                  onChange={() => {
                    setIsTipFixed(!isTipFixed);
                    setIsTipPercent(isTipFixed);
                  }}
                  checked={isTipFixed}
                >
                  Tip Fixed Amount
                </Checkbox>
              </Form.Item>
              <div className="">
                {isTipFixed && (
                  <Form.Item name={'tipFixedAmount'} initialValue="">
                    <Mask
                      placeholder={'0.00'}
                      addonBefore={() => (
                        <p className="text-center" style={{ width: 40 }}>
                          $
                        </p>
                      )}
                    />
                  </Form.Item>
                )}
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-blue-500 text-lg">Payout by Cash</h4>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item name={'cashPercent'} label={'Percent'} initialValue="">
              <Mask
                placeholder={'0.00'}
                addonBefore={() => (
                  <p className="text-center" style={{ width: 40 }}>
                    %
                  </p>
                )}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
      <button
        className="bg-blue-500 text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1 mr-2"
        id="submit-form"
        onClick={handleNext}
      >
        Next
      </button>
    </Fragment>
  );
};
export default Page;
