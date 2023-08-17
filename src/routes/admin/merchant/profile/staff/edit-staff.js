import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Checkbox, Form as FormAnt, Select, Spin, Tabs, Tree } from 'antd';
import { Avatar, Form, Message, Modal, ModalForm } from 'components';
import { Button } from 'layouts/components';
import { ColumnGeneralInformationEdit, ColumnWorkingTime, ColumnStaffSalary } from 'columns/merchant/detail/staff';
import { MerchantService } from 'services/merchant';

const EditStaff = ({ staffId, state, id, setIsEditStaff, onChange, pinExists, categorys, services }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [staff, setStaff] = useState();
  const [showPin, setshowPin] = useState(false);
  const [isChecks, setIsChecks] = useState({});

  const [form] = FormAnt.useForm();
  const [formService] = FormAnt.useForm();

  const [keyChecks, setKeyChecks] = useState([]);

  const getStaff = useCallback(async () => {
    const data = await MerchantService.getStaffById(staffId, +id);
    [data.codePhone, data.phone] = handlePhone(data?.phone);
    setStaff(data);
    setIsChecks({
      isSalaryPerHour: data?.salaries?.perHour?.isCheck,
      isSalaryCommission: data?.salaries?.commission?.isCheck,
      isProductCommission: data?.productSalaries?.commission?.isCheck,
      isTipPercent: data?.tipFees?.percent?.isCheck,
      isTipFixed: data?.tipFees?.fixedAmount?.isCheck,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getStaff();
  }, [getStaff]);

  useEffect(async () => {
    const data = await MerchantService.getStaffById(staffId, +id);
    setKeyChecks(getDefaultKey(data));
  }, []);

  const dayOfWeeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const listState =
    state &&
    state.map((item) => {
      return { label: item?.name, value: item?.stateId };
    });

  const handlePhone = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length === 0) return ['', phoneNumber];
    let [code, phone] = getInfoPhone(phoneNumber);
    phone = getPhoneOnlyNumber(phone);
    return [code, phone];
  };

  const getInfoPhone = (phone) => {
    let code = '';
    if (phone.indexOf('+1') > -1 && phone.indexOf(' +1') === -1) {
      code = '+1';
      phone = phone.replace('+1', '');
    }
    if (phone.indexOf(' +1') > -1) {
      code = ' +1';
      phone = phone.replace(' +1', '');
    }
    if (phone.indexOf('+84') > -1) {
      code = '+84';
      phone = phone.replace('+84', '');
    }
    return [code, phone];
  };

  const getPhoneOnlyNumber = (phone) => {
    let result = '';
    phone = '' + phone;
    phone = phone.replaceAll('-', '');
    phone = phone.replaceAll('(', '');
    phone = phone.replaceAll(')', '');
    phone = phone.replaceAll(' ', '');
    const str1 = phone.substring(0, 3);
    const str2 = phone.substring(3, 6);
    const str3 = phone.substring(6, phone.length);
    result = result + str1;
    if (phone.length > 3) {
      result = result + ' ' + str2;
    }
    if (phone.length > 6) {
      result = result + '-' + str3;
    }
    return result;
  };

  const salary = {
    id: staff?.staffId,
    salaryPerHour: staff?.salaries?.perHour?.value,
    salaryCommission: staff?.salaries?.commission?.value,
    productCommission: staff?.productSalaries?.commission?.value,
    tipPercent: staff?.tipFees?.percent?.value,
    tipFixed: staff?.tipFees?.fixedAmount?.value,
    cashPercent: staff?.cashPercent,
    isSalaryPerHour: staff?.salaries?.perHour?.isCheck,
    isSalaryCommission: staff?.salaries?.commission?.isCheck,
    isProductCommission: staff?.productSalaries?.commission?.isCheck,
    isTipPercent: staff?.tipFees?.percent?.isCheck,
    isTipFixed: staff?.tipFees?.fixedAmount?.isCheck,
  };

  const getDefaultKey = (data) => {
    let defaultCheckedKeys = [];
    if (!data) data = staff;

    data?.categories?.map((item) => {
      if (item?.selected) {
        if (item?.staffServices.length === 0) {
          defaultCheckedKeys = [...defaultCheckedKeys, item?.categoryId];
        }

        item?.staffServices?.map((service) => {
          if (service?.selected) {
            defaultCheckedKeys = [...defaultCheckedKeys, item?.categoryId + '-' + service?.serviceId];
          }
          return service;
        });
      }
      return item;
    });
    if (data?.categories?.length === 0) {
      defaultCheckedKeys = ['all'];
    }
    return defaultCheckedKeys;
  };

  const generateTreeData = () => {
    const categoryTreData =
      categorys &&
      categorys
        ?.filter((item) => item?.categoryType === 'Service' && item?.isDisabled === 0)
        ?.map((category) => ({
          title: category?.name,
          key: category?.categoryId,
          children:
            services &&
            services
              ?.filter((service) => service?.categoryId === category?.categoryId && service?.isDisabled === 0)
              ?.map((service) => ({
                title: service?.name,
                key: category?.categoryId + '-' + service?.serviceId,
                // bo category id di
              })),
        }));

    let defaultCheckedKeys = [];

    categoryTreData &&
      categoryTreData?.map((category) => {
        defaultCheckedKeys = [...defaultCheckedKeys, category?.key];
        if (category?.children) {
          category?.children.map((service) => {
            defaultCheckedKeys = [...defaultCheckedKeys, service?.key];
            return service;
          });
        }
        return category;
      });
    if (!categorys) {
      defaultCheckedKeys = ['all'];
    }

    const treeData = [
      {
        title: 'Select All',
        key: 'all',
        children: categoryTreData,
      },
    ];

    return treeData;
  };

  const onCheck = (checks) => {
    setKeyChecks(checks);
  };

  const generalEl = (
    <div className="">
      <h4 className="font-semibold text-xl text-blue-500 mb-5">General Information</h4>
      <div className="grid grid-cols-3 gap-5">
        <div className="">
          <p className="font-semibold">First Name</p>
          <p>{staff?.firstName}</p>
        </div>
        <div className="">
          <p className="font-semibold">Last Name</p>
          <p>{staff?.lastName}</p>
        </div>
        <div className="">
          <p className="font-semibold">Display Name</p>
          <p>{staff?.displayName}</p>
        </div>
        <div className="col-span-3">
          <p className="font-semibold">Address</p>
          <p>{staff?.address}</p>
        </div>
        <div className="">
          <p className="font-semibold">City</p>
          <p>{staff?.city}</p>
        </div>
        <div className="">
          <p className="font-semibold">State</p>
          <p>{staff?.stateName}</p>
        </div>
        <div className="">
          <p className="font-semibold">Zip Code</p>
          <p>{staff?.zip}</p>
        </div>
        <div className="">
          <p className="font-semibold">Cell Phone</p>
          <p>{staff?.phone ? staff?.codePhone + ' ' + staff?.phone : ''}</p>
        </div>
        <div className="">
          <p className="font-semibold">Contact Email</p>
          <p>{staff?.email}</p>
        </div>
        <div className="">
          <p className="font-semibold">Create PIN</p>
          <div className="text-sm flex items-center justify-between">
            <div>{showPin ? staff && staff?.pin : '****'}</div>
            <div className="" onClick={() => setshowPin(!showPin)}>
              {showPin ? <i className="las la-eye-slash"></i> : <i className="las la-eye cursor-pointer"></i>}
            </div>
          </div>
        </div>
        <div className="">
          {/* <p className=''>State</p> */}
          <Checkbox checked={staff?.isActive}>Visible on App</Checkbox>
        </div>
        <div className="">
          <p className="font-semibold">Roles</p>
          <p>{staff?.roleName}</p>
        </div>
        <div className="">
          <p className="font-semibold">Status</p>
          <p>{staff?.isDisabled === 0 ? 'Active' : 'Inactive'}</p>
        </div>
        <div className="col-span-3">
          <p className="mb-2 font-semibold">Avatar</p>
          <div className="">
            {
              // 2214 is fileId image fail in Database
              staff?.fileId !== 2214 && <Avatar src={staff?.imageUrl} size={12} />
            }
          </div>
        </div>
      </div>

      <div className="flex items-center mt-5">
        <Button
          name="EDIT"
          type="ok"
          onClick={() => {
            modalRef?.current?.handleShow &&
              modalRef?.current?.handleShow({ ...staff, id: staffId, isDisabled: staff?.isDisabled });
            setTimeout(() => {
              reRender();
            }, [100]);
          }}
        />
        <Button name="BACK" type="cancel" onClick={() => setIsEditStaff(false)} moreClass="ml-5" />
      </div>
    </div>
  );

  const workingTimeEl = (
    <div className="">
      <div className="grid grid-cols-3">
        <p className="text-blue-500 text-lg fomt-semibold mb-2 col-span-1">Date</p>
        <p className="text-blue-500 text-lg fomt-semibold mb-2 col-span-1">Shift Start</p>
        <p className="text-blue-500 text-lg fomt-semibold mb-2 col-span-1">Shift End</p>
      </div>
      {dayOfWeeks.map((day) => {
        const value = staff?.workingTimes?.[day];
        return (
          <div className="py-5 flex items-center border-b" key={day}>
            <Checkbox className="w-1/3" checked={value?.isCheck}>
              {day}
            </Checkbox>
            <div className="w-1/3 pr-10">
              <Select className="w-full" value={value?.timeStart} disabled></Select>
            </div>
            <div className="w-1/3 pr-10">
              <Select className="w-full" value={value?.timeEnd} disabled></Select>
            </div>
          </div>
        );
      })}

      <div className="flex items-center mt-5">
        <Button
          name="EDIT"
          type="ok"
          onClick={() => modalFormWorkingRef?.current?.handleEdit({ id: 1, ...staff?.workingTimes })}
        />
        <Button name="BACK" type="cancel" onClick={() => setIsEditStaff(false)} moreClass="ml-5" />
      </div>
    </div>
  );

  const salaryEl = (
    <div className="">
      <h4 className="text-xl font-semibold text-blue-500 pb-2">Salary</h4>
      {salary && salary?.isSalaryPerHour && (
        <>
          <p className="text-sm text-black font-medium mb-1">Salary Per Hour</p>
          <p className="w-1/3 border-b mb-5">$ {staff?.salaries?.perHour?.value}</p>
        </>
      )}

      {salary && salary?.isSalaryCommission && <p className="text-sm text-black font-medium mb-1">Salary Commission</p>}
      {salary &&
        salary?.salaryCommission?.map((item, index) => (
          <div className="grid grid-cols-3 gap-5 mb-5" key={{ index }}>
            <div className="border-b">
              <p>From</p>
              <p>$ {item?.from}</p>
            </div>
            <div className="border-b">
              <p>To</p>
              <p>$ {item?.to}</p>
            </div>
            <div className="border-b">
              <p>Salary percented (%)</p>
              <p>$ {item?.commission}</p>
            </div>
          </div>
        ))}

      <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Product Salary</h4>
      <p className="w-1/3 border-b">% {staff?.productSalaries?.commission?.value}</p>

      <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Tip Fee</h4>
      <div className="grid grid-cols-2 gap-5">
        <div className="border-b">
          <p className="">Percent</p>
          <p className="">% {staff?.tipFees?.percent?.value}</p>
        </div>
        <div className="border-b">
          <p className="">Amount</p>
          <p className="">$ {staff?.tipFees?.fixedAmount?.value}</p>
        </div>
      </div>

      <h4 className="mt-5 text-xl font-semibold text-blue-500 pb-2">Payout by Cash</h4>
      <p className="">Percent</p>
      <p className="w-1/3 border-b">% {staff?.cashPercent}</p>

      <div className="flex items-center mt-5">
        <Button name="EDIT" type="ok" onClick={() => modalSalaryFormRef?.current?.handleEdit(salary)} />
        <Button name="BACK" type="cancel" onClick={() => setIsEditStaff(false)} moreClass="ml-5" />
      </div>
    </div>
  );

  const licenseEl = (
    <div className="">
      <h4 className="text-xl font-semibold text-blue-500 pb-2">Licenses</h4>
      <div className="mb-2">
        <p className="font-semibold">Driver License</p>
        <p>{staff?.driverLicense}</p>
      </div>
      <div className="mb-2">
        <p className="font-semibold">Social Security Number</p>
        <p>{staff?.ssn}</p>
      </div>
      <div className="mb-2">
        <p className="font-semibold">Professional License</p>
        <p>{staff?.professionalLicense}</p>
      </div>

      <div className="flex items-center mt-5">
        <Button
          name="EDIT"
          type="ok"
          onClick={() => modalLicenseFormRef?.current?.handleEdit({ ...staff, id: staffId })}
        />
        <Button name="BACK" type="cancel" onClick={() => setIsEditStaff(false)} moreClass="ml-5" />
      </div>
    </div>
  );

  const servicesEl = (
    <div className="">
      <h4 className="font-semibold text-xl text-blue-500 my-5">Services</h4>
      <p className="">Assign services this staff can be perform</p>

      {staff && (
        <Tree
          defaultExpandedKeys={getDefaultKey(staff)}
          checkedKeys={getDefaultKey(staff)}
          treeData={generateTreeData()}
          checkable={true}
        />
      )}

      <div className="flex items-center mt-5">
        <Button
          name="EDIT"
          type="ok"
          onClick={() => {
            modalServiceRef?.current?.handleShow &&
              modalServiceRef?.current?.handleShow({ ...staff, id: staffId, isDisabled: staff?.isDisabled });
            setTimeout(() => {
              reRender();
            }, [100]);
          }}
        />
        <Button name="BACK" type="cancel" onClick={() => setIsEditStaff(false)} moreClass="ml-5" />
      </div>
    </div>
  );

  const tabs = [
    {
      title: 'general',
      content: generalEl,
    },
    {
      title: 'working-time',
      content: workingTimeEl,
    },
    {
      title: 'salary',
      content: salaryEl,
    },
    {
      title: 'license',
      content: licenseEl,
    },
    {
      title: 'services',
      content: servicesEl,
    },
  ];

  const editStaffGeneral = async (data, defaultCheckedKeys, title) => {
    let serviceKey = defaultCheckedKeys;
    if (keyChecks !== defaultCheckedKeys) {
      serviceKey = keyChecks;
    }
    // get vlue gui len
    const string = JSON.stringify(serviceKey);
    const categories =
      categorys &&
      categorys
        ?.filter((category) => category?.categoryType === 'Service' && category?.isDisabled === 0)
        .map((category) => {
          const dataStemp = data?.categories?.filter((items) => items?.categoryId === category?.categoryId);
          const item = {
            id: dataStemp.length === 1 ? dataStemp[0]?.id : null,
            categoryId: category?.categoryId,
            name: category?.name,
          };
          if (dataStemp.length !== 1) {
            delete item?.id;
          }
          if (string?.indexOf(category?.categoryId) > -1) {
            item.selected = true;
          } else {
            item.selected = false;
          }

          let staffServices = [];

          services &&
            services
              ?.filter((service) => service?.categoryId === category?.categoryId && category?.isDisabled === 0)
              ?.map((service) => {
                const dataService =
                  dataStemp.length === 1
                    ? dataStemp[0]?.staffServices?.filter((items) => items?.serviceId === service?.serviceId)
                    : [];
                const serviceItem = {
                  id: dataService && dataService.length === 1 ? dataService[0]?.id : 0,
                  categoryId: category?.categoryId,
                  name: service?.name,
                  serviceId: service?.serviceId,
                };
                if (dataService?.length !== 1) {
                  delete serviceItem?.id;
                }
                if (string?.indexOf(service?.serviceId) > -1) {
                  serviceItem.selected = true;
                } else {
                  serviceItem.selected = false;
                }
                staffServices = [...staffServices, serviceItem];
                return service;
              });
          item.staffServices = staffServices;
          return item;
        });
    const categorieStemp = title === 'service' ? categories : data?.categories;
    const dataStemp = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      displayName: data?.displayName,
      address: {
        street: data?.address,
        city: data?.city,
        state: data?.stateId,
        zip: data?.zip,
      },
      codePhone: data?.codePhone,
      phone: data?.phone,
      email: data?.email,
      pin: data?.pin,
      isActive: data?.isActive,
      roleName: data?.roleName,
      isDisabled: data?.isDisabled,
      imageUrl: data?.imageUrl,
      categories: data?.categories,
    };
    const formValue = title === 'service' ? dataStemp : await form.validateFields();

    const ress = await MerchantService.getPin(id, formValue?.pin, staffId);
    if (ress?.codeNumber !== 200) {
      Message.error({ text: ress.message });
    } else {
      setIsLoading(true);
      const res = await MerchantService.editStaffGeneral(
        { ...formValue, categories: categorieStemp },
        staffId,
        id,
        data,
      );
      if (res?.data) {
        Message.success({ text: res?.message });
      } else {
        Message.error({ text: res?.message });
      }
      getStaff();
      modalRef?.current?.handleCancel();
      modalServiceRef?.current?.handleCancel();
      setIsLoading(false);
    }
  };

  const changeTab = (key) => {
    console.log(key);
  };

  const reRender = () => {
    const defaultCheckedKeys = getDefaultKey();
    form.setFieldsValue({
      ...modalRef?.current?.data,
      address: {
        street: modalRef?.current?.data?.address,
        city: modalRef?.current?.data?.city,
        state: modalRef?.current?.data?.stateId,
        zip: modalRef?.current?.data?.zip,
      },
    });

    return (
      <>
        <Form columns={ColumnGeneralInformationEdit({ listState, pinExists, modalRef, form })} form={form} />
        <div className="flex items-center my-5 justify-end">
          <Button name="Cancel" type="cancel" onClick={() => modalRef?.current?.handleCancel()} moreClass="mr-5" />
          <Button
            name="Save"
            type="ok"
            onClick={() => {
              editStaffGeneral(modalRef?.current?.data, defaultCheckedKeys);
            }}
          />
        </div>
      </>
    );
  };

  const reRenderService = () => {
    const defaultCheckedKeys = getDefaultKey();
    const treeData = generateTreeData();
    // set value for Form by vlaues not work so use form.setFieldsValue
    form.setFieldsValue({
      ...modalServiceRef?.current?.data,
    });
    return (
      <>
        <FormAnt form={formService}>
          <FormAnt.Item>
            <Tree
              defaultExpandedKeys={defaultCheckedKeys}
              defaultCheckedKeys={defaultCheckedKeys}
              checkable={true}
              treeData={treeData}
              onCheck={onCheck}
            />
          </FormAnt.Item>
        </FormAnt>
        <div className="flex items-center my-5 justify-end">
          <Button
            name="Cancel"
            type="cancel"
            onClick={() => modalServiceRef?.current?.handleCancel()}
            moreClass="mr-5"
          />
          <Button
            name="Save"
            type="ok"
            onClick={() => {
              editStaffGeneral(staff, defaultCheckedKeys, 'service');
            }}
          />
        </div>
      </>
    );
  };

  const modalRef = useRef();
  const modalServiceRef = useRef();
  const modalFormWorkingRef = useRef();
  const modalSalaryFormRef = useRef();
  const modalLicenseFormRef = useRef();

  return (
    <Spin spinning={isLoading}>
      <Tabs defaultActiveKey="general" onChange={changeTab}>
        {tabs.map((item, index) => (
          <Tabs.TabPane tab={<p className="capitalize">{item.title}</p>} key={item.title}>
            {item.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
      <ModalForm
        ref={modalLicenseFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        handleChange={getStaff}
        title={() => 'Edit'}
        Put={(value, staffId, parentID, data) => MerchantService.editLicense(value, staffId, id, staff)}
        columns={[
          {
            title: 'Driver License',
            name: 'driverLicense',
            formItem: {
              col: 4,
              colTablet: 4,
              rules: [
                {
                  type: 'custom',
                  validator: ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (/^[A-Za-z0-9]*$/.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Driver License Number Invalid!'));
                    },
                  }),
                },
              ],
            },
          },
          {
            title: 'Social Security Number',
            name: 'ssn',
            formItem: {
              col: 4,
              colTablet: 4,
            },
          },
          {
            title: 'Professional License',
            name: 'professionalLicense',
            formItem: {
              col: 4,
              colTablet: 4,
            },
          },
        ]}
      />
      <ModalForm
        ref={modalSalaryFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        handleChange={getStaff}
        title={() => 'Edit'}
        Put={(value, staffId, parentID, data) => MerchantService.editSalary(value, staffId, id, staff)}
        columns={ColumnStaffSalary({ isChecks, setIsChecks })}
      />
      <ModalForm
        ref={modalFormWorkingRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        title={() => 'Edit'}
        handleChange={getStaff}
        Put={(value, staffId) => MerchantService.editWorkingTimes(value, staffId, id, staff)}
        columns={ColumnWorkingTime()}
      />

      <Modal ref={modalRef} isLoading={isLoading} setIsLoading={setIsLoading} widthModal={900} title={() => 'Edit'}>
        {reRender()}
      </Modal>
      <Modal
        ref={modalServiceRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        title={() => 'Edit'}
      >
        {reRenderService()}
      </Modal>
    </Spin>
  );
};

export default EditStaff;
