import { Form as FormAnt, Spin } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { routerLinks } from 'utils';
import AccountService from 'services/accounts';
import Form from 'components/form';
import { ColumnUsersEdit } from 'columns/accounts';
import { Title, Button } from 'layouts/components';
import { keyUser } from 'variable';

import './index.less';
import { Message, Upload } from 'components';
import moment from 'moment';
import { useAuth } from 'globalContext';

const UserProfile = () => {
  // const avatarDefault = 'https://media.harmonypayment.com/1637248573046319245_4711cf95-5265-43f9-9ba7-aa2014bfe4fb.png';
  const navigate = useNavigate();
  const location = useLocation();

  const adminUser = useAuth().user?.userAdmin;
  const { changeUserInformation } = useAuth();

  const { id } = useParams();
  const [form] = FormAnt.useForm();
  const [passForm] = FormAnt.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [imgUpload, setImgUpload] = useState('');
  const [fileId, setFileId] = useState();
  const [isEditPassword, setIsEditPassword] = useState(false);

  const getUser = useCallback(async () => {
    const data = await AccountService.getUserById(id);
    data.code = handlePhone(data?.phone)?.code;
    data.phone = handlePhone(data?.phone)?.phone;
    setUser(data);
    setImgUpload(data?.imageUrl);
    setIsEdit(false);
    setIsLoading(false);
  }, [id, location]);

  useEffect(() => {
    setIsLoading(true);
    getUser();
  }, [getUser]);

  const handlePhone = (data) => {
    let [code, phone] = getInfoPhone(data);
    phone = getPhoneOnlyNumber(phone);
    return { code, phone };
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

  const colPassword = [
    {
      title: 'New Password',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">New Password</h4>,
      },
    },
    {
      title: 'New Password',
      name: 'newPassword',
      formItem: {
        col: 6,
        type: 'password',
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'confirmNewPassword',
      title: 'Confirm New Password',
      formItem: {
        type: 'password',
        col: 6,
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Two passwords that you enter is inconsistent!'));
              },
            }),
          },
        ],
      },
    },
  ];

  const colUserPassword = [
    {
      title: 'Current Password',
      formItem: {
        render: () => <h4 className="font-semibold text-xl text-blue-500">Current Password</h4>,
      },
    },
    {
      title: 'Current Password',
      name: 'current password',
      formItem: {
        type: 'password',
        col: 6,
        rules: [
          { type: 'required' },
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator(rule, value) {
                const oldPassword = JSON.parse(localStorage.getItem(keyUser));
                if (!value || value === oldPassword?.userAdmin?.password) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Current password is incorrect'));
              },
            }),
          },
        ],
      },
    },
  ];

  const bread = [
    {
      name: 'Accounts',
    },
    {
      name: location?.state?.isUser ? 'User' : 'Admin',
      path: 'Users',
    },
    {
      name: 'Profile',
    },
  ];

  const uploadHandle = (file) => {
    setImgUpload(file[0]?.url);
    setFileId(file[0]?.fileId);
  };

  const handleEnable = async (status, id) => {
    if (status === 1) {
      await AccountService.enableUser(id);
      const data = await AccountService.getUserById(id);
      data.code = handlePhone(data?.phone)?.code;
      data.phone = handlePhone(data?.phone)?.phone;
      setUser(data);
      setImgUpload(data?.imageUrl);
    } else {
      await AccountService.disableUser(id);
      const data = await AccountService.getUserById(id);
      data.code = handlePhone(data?.phone)?.code;
      data.phone = handlePhone(data?.phone)?.phone;
      setUser(data);
      setImgUpload(data?.imageUrl);
    }
  };

  const editHandle = async () => {
    if (!isEditPassword) {
      form.validateFields().then(async (newProfile) => {
        newProfile.code = newProfile?.code || '+1';
        const value = {
          ...user,
          email: newProfile?.email,
          birthDate: moment(newProfile?.birthDate)._i,
          address: newProfile?.address,
          fileId: fileId || user?.fileId,
          imageUrl: imgUpload,
          phone: newProfile?.code + ' ' + newProfile?.phone,
          gender: newProfile?.gender,
        };
        const res = await AccountService.editUser(value, id);
        if (!res.data) {
          Message.error({ text: res?.message });
          return false;
        } else if (res) {
          setIsLoading(true);
          const data = await AccountService.getUserById(id);
          data.code = handlePhone(data?.phone)?.code;
          data.phone = handlePhone(data?.phone)?.phone;
          if (adminUser?.waUserId === +id && data) {
            changeUserInformation(data);
          }
          setUser(data);
          setImgUpload(data?.imageUrl);
          setIsEdit(false);
          setIsLoading(false);
        }
      });
    }
    if (isEditPassword) {
      let value = await passForm.validateFields();
      value = {
        oldPassword: user.password,
        newPassword: value?.newPassword,
      };
      setIsLoading(true);
      const res = await AccountService.changePassword(value, id);
      if (res?.data) {
        setIsLoading(true);
        const data = await AccountService?.getUserById(id);
        if (adminUser?.waUserId === +id && data) {
          changeUserInformation(data);
        }
        setIsEdit(false);
        Message.success({ text: res?.message });
        setIsLoading(false);
      }
      setIsEdit(false);
      setIsEditPassword(false);
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Title title={location?.state?.isUser ? 'User Profile' : 'Admin User Profile'} breadcrumbs={bread} />
      <div className="p-4 flex justify-between bg-gray-50 shadow rounded-xl">
        <div className="w-1/3">
          <div className="flex justify-center">
            {!isEdit && (
              <div
                className="w-[200px] h-[200px] rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${user?.imageUrl})`,
                }}
              ></div>
            )}
          </div>
          {isEdit && (
            <>
              <Upload className="item-center" onlyImage={true} action="File" onChange={uploadHandle}>
                <div className="flex justify-center">
                  <div
                    className="w-[200px] h-[200px] rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${imgUpload})`,
                    }}
                  ></div>
                </div>
                <button className="w-full mt-5 p-2 font-semibold text-black border shadow">Upload</button>
              </Upload>
              <p
                className={`mt-5 hover:underline cursor-pointer ${isEditPassword ? 'text-blue-300' : 'text-blue-500'}`}
                onClick={() => setIsEditPassword(false)}
              >
                <i className="las la-pen"></i> Profile
              </p>
              <p
                className={`mt-3 hover:underline cursor-pointer ${isEditPassword ? 'text-blue-500' : 'text-blue-300'}`}
                onClick={() => setIsEditPassword(true)}
              >
                <i className="las la-shield-alt"></i> Change Password
              </p>
            </>
          )}
        </div>
        <div className="w-3/4 pl-5">
          <div className="py-2 flex justify-between border-b border-black/10">
            <div className="">
              <h2 className="mb-1 font-bold text-black text-3xl">{user && user?.firstName + ' ' + user?.lastName}</h2>
              <h4 className="text-lg text-blue-500 font-medium">{user && user?.roleName}</h4>
            </div>
            <div className="flex items-center">
              {!isEdit && (
                <>
                  {!location?.state?.isUser && (
                    <Button name="BACK" onClick={() => navigate(routerLinks('Users'))} moreClass="mr-5" />
                  )}
                  {!location?.state?.isUser && (
                    <Button
                      name={user?.isDisabled === 0 ? 'DISABLE' : 'ENABLE'}
                      onClick={() => handleEnable(user?.isDisabled, id)}
                      moreClass="mr-5"
                    />
                  )}
                  <Button
                    name="EDIT"
                    type="ok"
                    onClick={() => {
                      setIsEdit(true);
                      setIsEditPassword(false);
                    }}
                  />
                </>
              )}
              {isEdit && (
                <>
                  <Button name="CANCEL" type="cancel" onClick={() => setIsEdit(false)} moreClass="mr-5" />
                  <Button name="SAVE" type="ok" onClick={() => editHandle()} />
                </>
              )}
            </div>
          </div>
          {!isEdit && (
            <div className="">
              <h4 className="my-5 text-lg text-blue-500 font-semibold">Contact Information</h4>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Phone</p>
                  <p className="text-black font-semibold">{user?.code + ' ' + user?.phone}</p>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Address</p>
                  <p className="text-black font-semibold">{user && user?.address}</p>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Email</p>
                  <p className="text-black font-semibold">{user?.email}</p>
                </div>
              </div>

              <h4 className="my-5 text-lg text-blue-500 font-semibold">Basic Information</h4>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Date of Birth</p>
                  <p className="text-black font-semibold">{moment(user?.birthDate).format('MM/DD/YYYY')}</p>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Gender</p>
                  <p className="text-black font-semibold" style={{ textTransform: 'capitalize' }}>
                    {user && user?.gender}
                  </p>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                  <p>Gender</p>
                  <p className="text-black font-semibold" style={{ textTransform: 'capitalize' }}>
                    {user && user?.gender}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEdit && (
            <div className="mt-5">
              {!isEditPassword && <Form columns={ColumnUsersEdit()} values={user} form={form} />}
              {isEditPassword && (
                <>
                  {/* <h4 className="my-5 text-lg text-blue-500 font-semibold">New Password</h4> */}
                  <Form
                    form={passForm}
                    columns={location?.state?.isUser ? [...colUserPassword, ...colPassword] : colPassword}
                    handSubmit={editHandle}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
};

export default UserProfile;
