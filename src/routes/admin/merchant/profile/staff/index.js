import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import { Modal, Space, Form as FormAnt, Tree, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Form from 'components/form';
import { Message, Wizard, DataTable } from 'components';
import { ColumnGeneralInformation, ColumnLicense, ColumnWorkingTime } from 'columns/merchant/detail/staff';
import { useAuth } from 'globalContext';
import { ColumnStaff } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { Button } from 'layouts/components';
import EditStaff from './edit-staff';
import AddSalary from './Salary/AddSalary';

const Page = ({ location, id, toggleState, state, merchant, clickStaff }) => {
  const initWorkingTime = {
    Monday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Tuesday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Wednesday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Thursday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Friday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Saturday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
    Sunday: {
      isCheck: true,
      timeStart: '10:00 AM',
      timeEnd: '08:00 PM',
    },
  };
  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [addStaff, setAddStaff] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 1330);
  const [isVisiable, setIsVisiable] = useState(false);
  const [staffId, setStaffId] = useState();
  const [isArchive, setIsArchive] = useState(false);
  const [isEditStaff, setIsEditStaff] = useState(false);
  const [currentStaff, setCurrenStaff] = useState({});
  const [keyCheckeds, setKeyCheckeds] = useState();

  const [general, setGeneral] = useState({ roleName: 'Admin', isDisabled: 0, isActive: true, servicesAll: true });
  const [workingTime, setWorkingTime] = useState(initWorkingTime);
  const [salary, setSalary] = useState();
  const [license, setLicense] = useState({});

  const [pinExists, setPinExists] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [services, setServices] = useState([]);

  const [formGeneral] = FormAnt.useForm();
  const [formWorkingTime] = FormAnt.useForm();
  const [formSalary] = FormAnt.useForm();
  const [formLicense] = FormAnt.useForm();

  clickStaff(() => {
    setAddStaff(false);
    setIsEditStaff(false);
  });

  const initFunction = useCallback(async () => {
    const { data } = await MerchantService.getAllStaff({}, id);
    const pinArr = data && data.map((item) => item?.pin);
    setPinExists(pinArr);

    const categoryRes = await MerchantService.getAllCategory({}, id);
    setCategorys(categoryRes?.data);

    const serviceRes = await MerchantService.getAllService({}, id);
    setServices(serviceRes?.data);
  }, []);

  useEffect(() => {
    if (toggleState === 'staff') initFunction();
  }, [initFunction]);

  useEffect(() => {
    if (toggleState === 'staff') initFunction();
  }, [toggleState]);


  useEffect(() => {
    // handleChangeMerchant();
    function handleResize() {
      if (window.innerWidth > 1024 && !isDesktop) {
        set_isDesktop(true);
      } else if (window.innerWidth <= 1024 && isDesktop) {
        set_isDesktop(false);
      }
    }
    window.addEventListener('resize', handleResize, true);
    return () => window.removeEventListener('resize', handleResize, true);
  }, [location, isDesktop]);

  const listState =
    state &&
    state.map((item) => {
      return { label: item?.name, value: item?.stateId };
    });

  const resetNewStaff = () => {
    setGeneral({ roleName: 'Admin', isDisabled: 0, isActive: true, servicesAll: true });
    setWorkingTime(initWorkingTime);
    setSalary();
    setLicense();
  };

  const prev = () => {
    if (current === 3) {
      const data = formLicense.getFieldValue();
      setLicense(data);
    }
    setCurrent(current - 1);
  };

  const submit = async (values) => {
    var stemp = true;
    if (current === 0) {
      const general = await formGeneral.validateFields();
      const res = await MerchantService.getPin(id, general?.pin);
      if(res?.codeNumber !== 200){
        await setCurrent(0);
        Message.error({ text: res.message });
        stemp = false;
      }else{
        setGeneral(general);
      }

    }
    if (current === 1) setWorkingTime(values);
    if (current === 2) setSalary(values);
    if (current < 3) {
      if(stemp){
        setCurrent(current + 1);
      }
    }
    if (current === 3) {
      // categoy value
      const string = JSON.stringify(keyCheckeds || defaultCheckedKeys);
      const categoriesValue =
        categorys &&
        categorys
          ?.filter((category) => category?.categoryType === 'Service')
          .map((category) => {
            const item = {
              categoryId: category?.categoryId,
              name: category?.name,
            };
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
                  const serviceItem = {
                    categoryId: category?.categoryId,
                    name: service?.name,
                    serviceId: service?.serviceId,
                  };
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
      setIsLoading(true);
      const res = await MerchantService.addNewStaff(general, workingTime, salary, values, categoriesValue, id);
      if (res?.data) {
        Message.success({ text: res?.message });
        dataTableRef?.current?.onChange();
      } else {
        Message.error({ text: res?.message });
      }
      setCurrent(0);
      setAddStaff(false);
      setCurrenStaff({});
      setGeneral({ roleName: 'Admin', isDisabled: 0, isActive: true, servicesAll: true });
      setWorkingTime(initWorkingTime);
      setSalary();
      setIsLoading(false);
    }
    // catelogy = []
  };

  const onCheck = (key) => {
    setKeyCheckeds(key);
  };

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
  // New Gift Card
  const steps = [
    {
      title: 'General Information',
      content: (
        <>
          <Form
            columns={ColumnGeneralInformation({ t, formatDate, listState, pinExists, merchantId: id, setGeneral })}
            // textSubmit={'Next'}
            idSubmit={'submit-form'}
            // handSubmit={submit}
            form={formGeneral}
            values={general}
          />
          <Tree
            defaultCheckedKeys={keyCheckeds || defaultCheckedKeys}
            checkable={true}
            treeData={treeData}
            onCheck={onCheck}
          />
          <Button name="Next" type="ok" onClick={() => submit(defaultCheckedKeys)} moreClass="mt-2" />
        </>
      ),
    },
    {
      title: 'Working Time',
      content: (
        <div className="">
          <Form
            columns={ColumnWorkingTime({ listState })}
            textSubmit={'Next'}
            idSubmit={'submit-form'}
            values={workingTime}
            form={formWorkingTime}
            handSubmit={submit}
          />
        </div>
      ),
    },
    {
      title: 'Salary',
      content: <AddSalary handSubmit={submit} salary={salary} formSalary={formSalary} />,
    },
    {
      title: 'License',
      content: (
        <Form
          textSubmit={'Submit'}
          columns={ColumnLicense({ t, formatDate })}
          idSubmit={'submit-form'}
          handSubmit={submit}
          form={formLicense}
          values={license}
        />
      ),
    },
  ];

  const handleAddStaff = () => {
    setAddStaff(!addStaff);
  };
  const handleCancelAdd = () => {
    setAddStaff(!addStaff);
    setCurrent(0);
  };

  const handleArchive = async () => {
    let res = false;
    if (isArchive === 0) {
      res = await MerchantService.archive(staffId, id);
    }
    if (isArchive === 1) {
      res = await MerchantService.restore(staffId, id);
    }
    if (res.data) {
      setIsVisiable(false);
      Message.success({ text: res.message });
      await dataTableRef?.current?.onChange();
    }else{
      setIsVisiable(false);
      await dataTableRef?.current?.onChange();
    }
  };

  const dataTableRef = useRef();

  return (
    <Spin spinning={isLoading}>
      {!isEditStaff && (
        <>
          {addStaff ? (
            <Fragment>
              <div className="px-2">
                <div className="font-bold text-lg mb-1 text-blue-500">New Staff</div>
                <Wizard steps={steps} current={current} />
                <div className="steps-content">
                  {steps[current].content}
                  <div className="absolute right-0 bottom-0">
                    <Fragment>
                      {current > 0 && <Button onClick={prev} name="Previous" />}
                      <Button
                        type={'cancel'}
                        moreClass="ml-2"
                        onClick={() => {
                          handleCancelAdd();
                        }}
                        name="Cancel"
                      />
                    </Fragment>
                  </div>
                </div>
              </div>
            </Fragment>
          ) : (
            <DataTable
              ref={dataTableRef}
              save={false}
              xScroll={'100%'}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              id={() => id}
              columns={ColumnStaff({
                t,
                formatDate,
                handleEdit: (id, staff) => {
                  setCurrenStaff(staff);
                  setStaffId(id);
                  setIsEditStaff(true);
                },
                handleArchive: (id, isArchive) => {
                  setStaffId(id);
                  setIsVisiable(true);
                  setIsArchive(isArchive);
                },
              })}
              Get={MerchantService.getStaffs}
              rightHeader={
                <Space>
                  {!!permission && (
                    <Button
                      type={'ok'}
                      onClick={() => {
                        handleAddStaff();
                        setKeyCheckeds();
                        resetNewStaff();
                      }}
                      name="New Staff"
                    />
                  )}
                </Space>
              }
              onRow={(item) => ({
                onClick: (e) => {
                  if (e?.target?.cellIndex) {
                    setStaffId(item?.staffId);
                    setIsEditStaff(true);
                  }
                },
              })}
            />
          )}
        </>
      )}

      {isEditStaff && (
        <EditStaff
          staffId={staffId}
          id={id}
          staff={currentStaff}
          state={state}
          setIsEditStaff={setIsEditStaff}
          onChange={dataTableRef?.current?.onChange}
          pinExists={pinExists}
          categorys={categorys}
          services={services}
        />
      )}

      <Modal
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        visible={isVisiable}
        onCancel={() => setIsVisiable(false)}
        onOk={() => setIsVisiable(false)}
        title={isArchive === 0 ? 'Archive this Staff?' : 'Restore this Staff?'}
        footer={
          <div className="">
            <Button name="DISAGREE" type="cancel" onClick={() => setIsVisiable(false)} moreClass="mr-5" />
            <Button name="AGREE" type="ok" onClick={() => handleArchive()} moreClass="mr-5" />
          </div>
        }
      >
        {isArchive === 0
          ? 'This Staff will not appear on the app. You can restore this Staff by clicking the Restore button.'
          : 'This Staff will appear on the app as well as the related lists.'}
      </Modal>
    </Spin>
  );
};
export default Page;
