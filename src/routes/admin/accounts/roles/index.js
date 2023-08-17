
import { Spin, Space, Checkbox, Input } from 'antd';
import { columnRoles } from 'columns/roles';
import { HookDataTable } from 'hooks';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Title, Button } from 'layouts/components';
import { PermissionService } from 'services/permission';
import { DataTable, Modal, Message } from 'components';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'globalContext';
import { ColumnRoleDepartment } from 'columns/accounts';
import AccountService from 'services/accounts';

const Roles = () => {
  const bread = [
    {
      name: 'Accounts',
    },
    {
      name: 'Roles',
    },
  ];

  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [originPermission, setOriginPermission] = useState([]);
  const [data, set_data] = useState({});
  const [name, setName] = useState('');
  const [dataCheck, setDataCheck] = useState([]);
  const [editable, setEditable] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [dataEdit, setDataEdit] = useState(null);
  const [isLoaddingDepartment, setIsLoaddingDepartment] = useState(false);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [parram, setParram] = useState({page: "1", row: "10", pages: 0});
  const timeout = useRef();

  const loadData = async () => {
    const dataDepartmentStemp = await AccountService.getDepartment();
    const dataUserStemp = await AccountService.getUsers(parram);
    await setDataDepartment(dataDepartmentStemp.data);
    await setDataUser(dataUserStemp.data);
    setParram({...parram, pages: dataUserStemp.pages})
  };

  useEffect(async () => {
    const data = await PermissionService.getPermission();
    await setOriginPermission(data.data);
    await renderData(data.data);
    await setIsLoading(false);
    loadData();
  }, []);

  const editDepartment = async () => {
    const dataStemp = [];
    dataCheck.forEach((item) => dataStemp.push(item.waUserId));
    const value = { departmentName: name, members: dataStemp };
    setIsLoading(true);
    if(!name.trim()){
      Message.error({ text: 'Please enter department name!' });
      setIsLoading(false);
    }else if(dataCheck.length===0){
      Message.error({ text: 'Please select a member!' });
      setIsLoading(false);
    }else{
      if (dataEdit && dataEdit?.departmentId) {
        const res = await AccountService.editDepartment(value, dataEdit?.departmentId);
        if (res?.data) {
          Message.success({ text: res?.message });
          const dataDepartmentStemp = await AccountService.getDepartment();
          await setDataDepartment(dataDepartmentStemp.data);
        } else {
          Message.error({ text: res?.message });
        }
      } else {
        const res = await AccountService.createDepartment(value);
        if (res?.data) {
          Message.success({ text: res?.message });
          const dataDepartmentStemp = await AccountService.getDepartment();
          await setDataDepartment(dataDepartmentStemp.data);
        } else {
          Message.error({ text: res?.message });
        }
      }
      modalRef?.current?.handleCancel();
      setIsLoading(false);
    }
  };

  const renderData = (data) => {
    const fullActions = [];
    data.map((item, index) => {
      if (index !== 0) fullActions.push(...item.actions);
      return item;
    });

    data[0].actions.map((i) => {
      switch (i.waRoleId) {
        case 1:
          i.adminstrator = i.roleIsActive;
          break;
        case 2:
          i.manager = i.roleIsActive;
          break;

        case 3:
          i.staff1 = i.roleIsActive;
          break;

        case 4:
          i.staff2 = i.roleIsActive;
          break;
        default:
          break;
      }

      fullActions.map((a1) => {
        if (i.action === a1.action) {
          switch (a1.waRoleId) {
            case 1:
              i.adminstrator = a1.roleIsActive;
              break;
            case 2:
              i.manager = a1.roleIsActive;
              break;

            case 3:
              i.staff1 = a1.roleIsActive;
              break;

            case 4:
              i.staff2 = a1.roleIsActive;
              break;
            default:
              break;
          }
        }
        return a1;
      });
      return i;
    });

    const final = data[0];

    const dashboard1 = [];
    const requestManagement1 = [];
    const merchant1 = [];
    const consumer1 = [];
    const giftCard1 = [];
    const pricingPlan1 = [];
    const account1 = [];
    const report1 = [];

    final.actions.map((i) => {
      switch (i.modulePage) {
        case 'Dashboard':
          dashboard1.push(i);
          break;
        case 'Request Management':
          requestManagement1.push(i);
          break;
        case 'Merchant':
          merchant1.push(i);
          break;
        case 'Consumer':
          consumer1.push(i);
          break;
        case 'Gift Card':
          giftCard1.push(i);
          break;
        case 'Pricing Plan':
          pricingPlan1.push(i);
          break;
        case 'Accounts':
          account1.push(i);
          break;
        case 'Reports':
          report1.push(i);
          break;
        default:
          break;
      }
      return i;
    });
    data.dashboard = dashboard1;
    data.requestManagement = requestManagement1;
    data.merchant = merchant1;
    data.consumer = consumer1;
    data.giftCard = giftCard1;
    data.pricingPlan = pricingPlan1;
    data.account = account1;
    data.report = report1;
    set_data(data);
  };

  const onCheckPermisison = (status, action, roleID) => {
    setEditable(true);
    const origin = originPermission;
    origin.map((i) => {
      if (i.waRoleId === roleID) {
        i.actions.map((a) => {
          if (a.action === action) {
            a.roleIsActive = status;
          }
          return a;
        });
      }
      return i;
    });

    renderData(origin);
    setOriginPermission(origin);
  };

  const [, RoleTable] = HookDataTable({
    showHeader: false,
    showSearch: false,
    columns: columnRoles(onCheckPermisison),
    // Get: RolesService.getAllRoles,
    isLoading,
    setIsLoading,
    showPagination: false,
    loadFirst: false,
  });

  const handleRestoreDepartment = async (data) => {
    const res = await AccountService.editDepartmentRestore(data);
    if (res?.data) {
      Message.success({ text: res?.message });
      loadData();
    } else {
      Message.error({ text: res?.message });
    }
  };

  const handleArchiveDepartment = async (data) => {
    const res = await AccountService.editDepartmentArchive(data);
    if (res?.data) {
      Message.success({ text: res?.message });
      loadData();
    } else {
      Message.error({ text: res?.message });
    }
  };

  const onChange = (item) => {
    const dataStemp = dataCheck;
    const indexcheck = dataCheck.findIndex((items) => items.waUserId === item.waUserId);
    if (indexcheck === -1) {
      dataStemp.push(item);
      setDataCheck([...dataStemp]);
    } else {
      const dataStemps = dataStemp.filter((items) => items.waUserId !== item.waUserId);
      setDataCheck(dataStemps);
    }
  };

  const onChangeSearchMember = (e) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      const dataDepartmentStemp = await AccountService.getUsers({ fullTextSearch: e.target.value,  isGetBrief: true});
      setDataUser(dataDepartmentStemp.data);
    }, 1000);
  };

  const defaultChecked = (id) => {
    const dataStemp = dataCheck.findIndex((item) => item.waUserId === id);
    if (dataStemp !== -1) {
      return true;
    }
    return false;
  };

  const deleteMembers = (id) => {
    const dataStemp = dataCheck.filter((item) => item.waUserId !== id);
    setDataCheck(dataStemp);
  };

  const handleEdit = (data) => {
    setDataEdit(data);
    setDataCheck(data.members);
    modalRef?.current?.handleShow && modalRef?.current?.handleShow({ ...data, id: data?.id});
    setName(data?.departmentName)
  };


  const handleAfterClose = async() =>{
    setDataEdit(null);
    setDataCheck([]);
    setName('');
    const dataUserStemp = await AccountService.getUsers(parram);
    await setDataUser(dataUserStemp.data);
  }
  const dataTableRef = useRef();
  const modalRef = useRef();
  const handleScroll = async(e) =>{
    setIsLoaddingDepartment(true);
    const element = e.currentTarget;
    const sum = element.scrollHeight - element.scrollTop - element.offsetHeight;
    if (sum<1){
      if(parseInt(parram.page)+1<=parram.pages){
        const res = await AccountService.getUsers({page: parseInt(parram.page) +1, row: parram.row});
        const data = dataUser.concat(res.data)
        await setDataUser(data);
        await setParram({...parram,page:parseInt(parram.page)+1, pages: res.pages})
        await reRender();
      }
    }
    await setIsLoaddingDepartment(false);
  }
  const reRender = () => {
    return (
      <>
       <Input
          className="mb-1 h-30 text-gray-600 bg-white px-4 ant-input border rounded-xl"
          placeholder="Enter department name"
          onChange={(e)=> setName(e.target.value)}
          value={name}
          style={{ width: 300, height: '40px' }}
        />
        <div className="font-bold text-lg mb-1 text-blue-700">Members</div>
        <div className="grid grid-cols-4">
          <div className="col-span-2 border-[1px] border-l-[0px]">
            <div className="m-2">
              <Input
                className="mb-1 h-30 text-gray-600 bg-white px-4 ant-input border rounded-xl"
                placeholder="Search Member"
                onChange={onChangeSearchMember}
                style={{ width: 300, height: '40px' }}
              />
            </div>
          </div>
          <div className="col-span-2 mb-2 h-full w-full border-b-[1px] border-t-[1px]">
            <div className="ml-2 h-full">
              <div className="grid grid-flow-col h-full">
                <div className="col-span-6 flex h-full ">
                  <div className="font-bold text-base mb-1 flex items-center">Selected</div>
                </div>
                <div className="col-span-6 flex justify-end mr-12 flex items-center">{dataCheck.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-2 overflow-scroll border-[1px] border-l-[0px]" style={{ height: '300px' }} onScroll={handleScroll}>
            <div className="mt-2 ml-2">
            <Spin spinning={isLoaddingDepartment}>
              {dataUser &&
                  dataUser.map((item, index) => {
                    return (
                      <div key={item?.id}>
                        <div className="grid grid-flow-col mb-3">
                          <div className="col-span-6 flex">
                            <img className="rounded-full object-cover object-center h-8 w-8" src={item?.imageUrl}></img>
                            <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
                          </div>
                          <div className="col-span-6 flex justify-end mr-4">
                            <Checkbox checked={defaultChecked(item.waUserId)} onChange={() => onChange(item)}></Checkbox>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </Spin>
            </div>
          </div>
          <div className="col-span-2 overflow-y-scroll border-[1px] border-r-[0px]" style={{ height: '300px' }}>
            <div className="mt-2 ml-2">
              {dataCheck &&
                dataCheck.map((item, index) => {
                  return (
                    <div key={item?.id}>
                      <div className="grid grid-flow-col mb-3">
                        <div className="col-span-6 flex">
                          <img className="rounded-full object-cover object-center h-8 w-8" src={item?.imageUrl}></img>
                          <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
                        </div>
                        <div className="col-span-6 flex justify-end mr-4 items-center">
                          <i
                            className="las la-times-circle"
                            style={{ fontSize: '20px' }}
                            onClick={() => deleteMembers(item?.waUserId)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex items-center my-5 justify-end">
          <Button
            name="Cancel"
            type="cancel"
            onClick={() => {
              modalRef?.current?.handleCancel();
            }}
            moreClass="mr-5"
          />
          <Button
            name="Save"
            type="ok"
            onClick={() => {
              editDepartment(modalRef?.current?.data);
            }}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        afterClose = {()=>handleAfterClose()}
        ref={modalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        title={() => (dataEdit && dataEdit?.departmentId ? 'Edit' : 'Add')}
      >
        {reRender()}
      </Modal>
      <Spin spinning={isLoading}>
        <Title title="Roles" breadcrumbs={bread} />
        <div className="mb-5 p-4 rounded-lg shadow bg-gray-50 col-span-2 row-span-2 grid">
          <DataTable
            ref={dataTableRef}
            save={false}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            data={dataDepartment}
            id={() => 1}
            showSearch={false}
            columns={ColumnRoleDepartment({
              t,
              formatDate,
              handleEdit,
              handleRestoreDepartment,
              handleArchiveDepartment,
              // setOldData,
              // category,
            })}
            // onRow={(...params) => ({
            //   onClick: (e) => {
            //     if (e?.target?.cellIndex) {
            //       setDeail(params[0]);
            //     }
            //   },
            // })}
            leftHeader={<div className="font-bold text-lg mb-4 text-black">Department</div>}
            rightHeader={
              <Space>
                {!!permission && (
                  <Fragment>
                    <Button
                      type={'ok'}
                      name="New Department"
                      onClick={() => {
                        modalRef?.current?.handleShow &&
                          modalRef?.current?.handleShow({ ...dataDepartment, id: dataUser?.id });
                        setTimeout(() => {
                          reRender();
                        }, [100]);
                      }}
                    />
                  </Fragment>
                )}
              </Space>
            }
          />
        </div>
        <div className="p-4 rounded-lg shadow bg-gray-50 col-span-2 row-span-2 grid">
          <div className="grid grid-flow-col">
            <h3 className="col-span-4"></h3>
            <h3 className="text-blue-500 font-extrabold text-lg">Administrator</h3>
            <h3 className="text-blue-500 font-extrabold text-lg">Manager</h3>
            <h3 className="text-blue-500 font-extrabold text-lg">Staff Level 1</h3>
            <h3 className="text-blue-500 font-extrabold text-lg">Staff Level 2</h3>
          </div>
          <h1 className="text-lg">
            <strong>Dashboard</strong>
          </h1>
          {data.dashboard ? RoleTable(data.dashboard) : null}
          <h1 className="text-lg mt-6">
            <strong>Request Management</strong>
          </h1>
          {data.requestManagement ? RoleTable(data.requestManagement) : null}
          <h1 className="text-lg mt-6">
            <strong>Merchant</strong>
          </h1>
          {data.merchant ? RoleTable(data.merchant) : null}
          <h1 className="text-lg mt-6">
            <strong>Consumer</strong>
          </h1>
          {data.consumer ? RoleTable(data.consumer) : null}
          <h1 className="text-lg mt-6">
            <strong>Gift Card</strong>
          </h1>
          {data.giftCard ? RoleTable(data.giftCard) : null}
          <h1 className="text-lg mt-6">
            <strong>Pricing Plan</strong>
          </h1>
          {data.pricingPlan ? RoleTable(data.pricingPlan) : null}
          <h1 className="text-lg mt-6">
            <strong>Account</strong>
          </h1>
          {data.account ? RoleTable(data.account) : null}
          <h1 className="text-lg mt-6">
            <strong>Report</strong>
          </h1>
          {data.report ? RoleTable(data.report) : null}
        </div>
        {editable && (
          <Button
            name="Save"
            onClick={async () => {
              await PermissionService.putPermission(originPermission);
              const data = await PermissionService.getPermission();
              setOriginPermission(data.data);
              renderData(data.data);
              setEditable(false);
            }}
            type="ok"
            moreClass="mt-5"
          />
        )}
      </Spin>
    </>
  );
};

export default Roles;
