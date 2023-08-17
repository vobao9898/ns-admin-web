import { Form as FormAnt, Modal, Spin } from 'antd';
import { Form, Message } from 'components';
import React, { useState, useEffect, useCallback } from 'react';
import { ColumnRejectedRequest } from 'columns/request-management';
import { useNavigate, useParams } from 'react-router';
import { RequestManagementService } from 'services/request-management';
import { Title, Button } from 'layouts/components';
import moment from 'moment';

import '../../index.less';
import { routerLinks, convertFormValue } from 'utils';

const RejectedRequestProfile = () => {
  const [isVisiable, setIsVisiable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reject, setReject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState([]);

  const { id } = useParams();
  const [form] = FormAnt.useForm();
  const navigate = useNavigate();

  const getRejected = useCallback(async () => {
    const { data } = await RequestManagementService.getRejectedById(id);

    if (!data) navigate(routerLinks('Rejected Request'));
    data.general.tax = deleteDash(data?.general?.tax);
    data.general.zip = deleteDash(data?.general?.zip);

    const [codePhoneBusiness, phoneBusiness] = handlePhone(data?.general?.phoneBusiness);
    const [codePhoneContact, phoneContact] = handlePhone(data?.general?.phoneContact);

    data.general.codePhoneBusiness = codePhoneBusiness || '+1';
    data.general.phoneBusiness = phoneBusiness;
    data.general.codePhoneContact = codePhoneContact || '+1';
    data.general.phoneContact = phoneContact;

    data?.principals &&
      data?.principals?.map((item) => {
        const [codeHomePhone, homePhone] = handlePhone(item?.homePhone);
        const [codeMobilePhone, mobilePhone] = handlePhone(item?.mobilePhone);
        item.homePhone = homePhone;
        item.codeHomePhone = codeHomePhone || '+1';
        item.mobilePhone = mobilePhone;
        item.codeMobilePhone = codeMobilePhone || '+1';
        return item;
      });

    setReject(data);
    setIsLoading(false);
  }, [id, navigate]);

  const getState = useCallback(async () => {
    const { data } = await RequestManagementService.getState();
    const stateList = data?.map((item) => ({
      label: item.name,
      value: item.stateId,
    }));
    setState(stateList);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getRejected();
    getState();
  }, [getRejected, getState]);

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

  const deleteDash = (phone) => {
    return phone.replaceAll('-', '');
  };

  const cols = ColumnRejectedRequest({ state, setReject, reject });

  const handleDelete = () => {
    setIsVisiable(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    const res = await RequestManagementService.deleteRejected(id);
    if (res?.data) {
      Message.success({
        text: res?.message,
        // showCloseButton: false
      });
      navigate(routerLinks('Rejected Request'));
      return;
    }
    Message.error({ text: res?.message });
  };

  const revertHandle = async () => {
    setIsLoading(true);
    await RequestManagementService.revert(id);
    navigate(routerLinks('Pending Request'));
  };

  const handleEdit = async () => {
    let values = await form.validateFields();
    values = convertFormValue(cols, values, form);
    values = {
      ...values,
      stateName: reject?.state?.stateName,
      phoneBusiness: `${values?.codePhoneBusiness + values?.phoneBusiness}`,
      phoneContact: `${values?.codePhoneContact + values?.phoneContact}`,
    };
    setIsLoading(true);
    const data = await RequestManagementService.editReject(values, reject?.general?.generalId);
    if (data?.data) {
      Message.success({ text: data?.message });
    } else Message.error({ text: data?.message });
    await getRejected();
    setIsEdit(false);
    setIsLoading(false);
  };

  const bread = [
    {
      name: 'Rejected Request',
      path: 'Rejected Request',
    },
    {
      name: 'Detail',
    },
  ];
  const breadEdit = [
    {
      name: 'Rejected Request',
      path: 'Rejected Request',
    },
    {
      name: 'Edit',
    },
  ];

  const business = [
    {
      question: 'Have you ever accepted Credit/Debit cards before?',
      list: [
        { label: 'No', value: false },
        { label: 'Yes (if yes, who was your previous company)', value: true },
      ],
    },
    {
      question: 'Has a processor ever terminated your Merchant account?',
      list: [
        { label: 'No', value: false },
        { label: 'Yes (if yes, what was program and when)', value: true },
      ],
    },
    {
      question: 'Will product(s) or service(s) be sold outside of US?',
      list: [
        { label: 'No', value: false },
        { label: 'Yes (if yes, date filed)', value: true },
      ],
    },
    {
      question: 'Has Merchant been previously identified by Visa/Mastercard Risk Programs?',
      list: [
        { label: 'No', value: false },
        { label: 'Yes (if yes, who was the processor)', value: true },
      ],
    },
    {
      question:
        'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?',
      list: [
        { label: 'No', value: false },
        { label: 'Yes (if yes, who was the processor)', value: true },
      ],
    },
  ];

  let utc = reject?.adminUser?.created_date + 'Z';
  utc = moment(new Date(utc)).format('MM/DD/YYYY - hh:mm A');

  const RejectedDetail = () => (
    <div className="">
      <Title title={'Request Detail'} breadcrumbs={bread} />
      <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
        <div className="action pt-4">
          <div className="flex p-4 justify-between border-b border-blue-500 h-[60px] items-center">
            <p className="font-semibold text-lg text-black">ID: {reject?.merchantId}</p>
            <ul className="flex ">
              <li>
                <Button name="DELETE" onClick={() => handleDelete()} moreClass="mr-5" />
              </li>
              <li>
                <Button name="EDIT" onClick={() => setIsEdit(true)} moreClass="mr-5" />
              </li>
              <li>
                <Button name="REVERT" onClick={() => revertHandle()} moreClass="mr-5" />
              </li>
              <li>
                <Button name="BACK" onClick={() => navigate(routerLinks('Rejected Request'))} />
              </li>
            </ul>
          </div>
        </div>
        <div className="">
          <div className=" border-b border-blue-500 p-4">
            <p className="w-fit mb-3 px-8 py-2 text-white bg-red-500 font-bold text-lg">REJECTED</p>
            <p className="mt-3 font-semibold text-md text-black">
              By {reject?.adminUser?.first_name + ' ' + reject?.adminUser?.last_name}
            </p>
            <p className="mt-2 font-semibold text-md text-black">Date/Time: {utc}</p>
            <p className="mt-2 font-semibold text-md text-black">Reason:</p>
            <p className="mt-2">{reject?.reason}</p>
          </div>
        </div>
        <div className="px-4">
          <h4 className="my-5 font-bold text-blue-500 text-xl">General Information</h4>
          <div className="w-full flex flex-wrap">
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Legal Business Name</p>
                <p className="">{reject?.general?.legalBusinessName}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Doing Business As (DBA)</p>
                <p className="">{reject?.general?.doBusinessName}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Merchant type</p>
                <p className="">{reject?.type}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Federal Tax ID</p>
                <p className="">{reject?.general?.tax}</p>
              </div>
            </div>
            <div className="w-full mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Business Address (no P.O. Boxes)</p>
                <p className="">{reject?.general?.address}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">City</p>
                <p className="">{reject?.general?.city}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">State</p>
                <p className="">{reject?.state?.name}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                <p className="">{reject?.general?.zip}</p>
              </div>
            </div>
            <div className="w-full mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">DBA Address</p>
                <p className="">{reject?.general?.dbaAddress?.Address}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">City</p>
                <p className="">{reject?.general?.dbaAddress?.City}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">State</p>
                <p className="">{reject?.general?.dbaAddress?.StateName}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                <p className="">{reject?.general?.dbaAddress?.Zip}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Business Phone Number</p>
                <p className="">{reject?.general?.codePhoneBusiness + ' ' + reject?.general?.phoneBusiness}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Contact Email Address</p>
                <p className="">{reject?.general?.emailContact}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Contact Name</p>
                <p className="">{reject?.general?.firstName + ' ' + reject?.general?.lastName}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Title/Position</p>
                <p className="">{reject?.general?.title}</p>
              </div>
            </div>
            <div className="w-1/2 lg:w-1/3 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Contact Phone Number</p>
                <p className="">{reject?.general?.codePhoneContact + ' ' + reject?.general?.phoneContact}</p>
              </div>
            </div>
          </div>
          <h4 className="my-5 font-bold text-blue-500 text-xl">Business Information</h4>
          <div className="w-full mt-5 flex flex-wrap">
            {business.map((item, index) => {
              let value = false;
              let reply = '';
              reject?.business?.map((busi) => {
                if (busi.question === item.question) {
                  value = busi.answer;
                  reply = busi.answerReply;
                }
                return busi;
              });
              return (
                <div className="w-full xl:w-1/2 mb-7 pr-5" key={index}>
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">{item.question}</p>
                    <div className="flex items-center">
                      <input className="min-w-3 min-h-3" type="radio" checked={!value} onChange={() => {}} />
                      <label className="ml-2 mr-4 ">{item.list[0].label}</label>
                      <input className="min-w-3 min-h-3" type="radio" checked={value} onChange={() => {}} />
                      <label className="ml-2 ">{item.list[1].label}</label>
                    </div>
                    <p className="mt-1 font-medium text-sm text-black">Answer:</p>
                    <p className="">{reply}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h4 className="my-5 font-bold text-blue-500 text-xl">Bank Information</h4>
          <div className="w-full mt-5 flex flex-wrap">
            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Account Holder Name</p>
                <p className="">{reject?.businessBank.accountHolderName}</p>
              </div>
            </div>

            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Bank Name</p>
                <p className="">{reject?.businessBank.name}</p>
              </div>
            </div>

            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Routing Number (ABA)</p>
                <p className="">{reject?.businessBank.routingNumber}</p>
              </div>
            </div>

            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Account Number (DDA)</p>
                <p className="">{reject?.businessBank.accountNumber}</p>
              </div>
            </div>

            <div className="w-full mb-7 pr-5">
              <div className="">
                <p className="mb-2 font-medium text-sm text-black">Void Check</p>
                <div className="w-48 rounded-lg overflow-hidden">
                  <img className="w-full object-cover" src={reject?.businessBank.imageUrl} alt="void check" />
                </div>
              </div>
            </div>
          </div>

          <h4 className="my-5 font-bold text-blue-500 text-xl">Principal Information</h4>
          {reject &&
            reject?.principals?.map((item, index) => {
              const minusString = item.ssn.replace('-', '');
              const addString = minusString + '______';
              const ssn = '***-**-' + addString.slice(0, 4);
              return (
                <div key={index}>
                  <h4 className="text-lg font-semibold text-blue-500">Principal {index + 1}</h4>
                  <div className="w-full mt-5 flex flex-wrap">
                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Name</p>
                        <p className="">{item?.firstName + ' ' + item?.lastName}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Title/Position</p>
                        <p className="">{item?.title}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Ownership (%)</p>
                        <p className="">{item?.ownerShip}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Home Phone</p>
                        <p className="">{(item?.codeHomePhone || '+1') + ' ' + item?.homePhone}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Mobile Phone</p>
                        <p className="">{(item?.codeMobilePhone || '+1') + ' ' + item?.mobilePhone}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Address</p>
                        <p className="">{`${item?.address}, ${item?.city}, ${item?.state?.name}, ${item?.zip}`}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Date of Birth (mm/dd/yyyy)</p>
                        <p className="">{moment(item?.birthDate).format('MM/DD/YYYY')}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Email Address</p>
                        <p className="">{item?.email}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Driver License Number</p>
                        <p className="">{item?.driverNumber}</p>
                      </div>
                    </div>

                    <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">State Issued</p>
                        <p className="">{item?.stateIssuedName}</p>
                      </div>
                    </div>

                    <div className="w-1/2 mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Social Security Number (SSN)</p>
                        <p className="">{ssn}</p>
                      </div>
                    </div>

                    <div className="w-full mb-7 pr-5">
                      <div className="">
                        <p className="mb-2 font-medium text-sm text-black">Driver License Picture</p>
                        <div className="w-48 rounded-lg overflow-hidden">
                          <img className="w-full object-cover" src={item?.imageUrl} alt="void check" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const RejectedEdit = () => (
    <div className="">
      <Title title={'Edit Merchant Info'} breadcrumbs={breadEdit} />

      <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
        <div className="h-[60px] flex items-center my-4 px-4 border-b border-blue-500">
          <p className="font-semibold text-lg text-black">ID: {reject?.merchantId}</p>
        </div>
        <div className="form-edit-pending px-4">
          <Form
            values={{
              ...reject?.general,
              ...reject?.general?.dbaAddress,
              type: reject.type,
            }}
            columns={cols}
            form={form}
          ></Form>
        </div>
        <div className="flex px-4 mt-5">
          <Button name="CANCEL" type="cancel" onClick={() => setIsEdit(false)} moreClass="mr-5" />
          <Button name="SAVE" type="ok" onClick={() => handleEdit()} />
        </div>
      </div>
    </div>
  );

  return (
    <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={isLoading}>
      {!isEdit && RejectedDetail()}
      {isEdit && RejectedEdit()}

      <Modal
        visible={isVisiable}
        title={<p className="font-bold text-black text-lg">Delete Merchant?</p>}
        onCancel={() => setIsVisiable(false)}
        footer={
          <div className="">
            <button className="text-blue-500 px-3 py-1 hover:bg-blue-100 mr-5" onClick={() => setIsVisiable(false)}>
              DISAGREE
            </button>
            <button className="text-blue-500 px-3 py-1 hover:bg-blue-100" onClick={() => confirmDelete()}>
              AGREE
            </button>
          </div>
        }
      >
        <p>
          This Merchant will be remove from the app. You can not restore this Merchant, Are you sure you want to do
          this?.
        </p>
      </Modal>
    </Spin>
  );
};

export default RejectedRequestProfile;
