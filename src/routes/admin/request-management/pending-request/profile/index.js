import { Select, Spin, Form as FormAnt } from 'antd';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ColumnPendingRequest } from 'columns/request-management';
import { useNavigate, useParams } from 'react-router';
import { RequestManagementService } from 'services/request-management';
import { convertFormValue, maskNumber, routerLinks } from 'utils';
import { Form, Message, ModalForm } from 'components';
import moment from 'moment';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';
import '../../index.less';
import { Title, Button } from 'layouts/components';

const PendingRequestDetail = () => {
  const [form] = FormAnt.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [status, setStatus] = useState();
  const [state, setState] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const getPending = useCallback(async () => {
    const { data } = await RequestManagementService.getPendingById(id);
    data?.principals &&
      data?.principals.map((item) => {
        // fix date.clone not function
        item.birthDate = moment(item?.birthDate);
        return item;
      });
    if (!data) {
      navigate(routerLinks('Pending Request'));
      return;
    }

    if (data?.isApproved === 1) {
      navigate(routerLinks('Approved Request') + '/' + data?.merchantId);
    }

    if (data?.isRejected === 1) {
      navigate(routerLinks('Rejected Request') + '/' + data?.merchantId);
    }

    data.general.phoneContact = deleteDash(data?.general?.phoneContact);
    data.general.phoneBusiness = deleteDash(data?.general?.phoneBusiness);
    data.general.tax = deleteDash(data?.general?.tax);
    data.general.zip = deleteDash(data?.general?.zip);

    data.businessBank.accountNumber = deleteDash(data?.businessBank?.accountNumber);
    data.businessBank.routingNumber = deleteDash(data?.businessBank?.routingNumber);

    const [codePhoneContact, phoneContact] = getInfoPhone(data?.general?.phoneContact);
    const [codePhoneBusiness, phoneBusiness] = getInfoPhone(data?.general?.phoneBusiness);

    data.general.phoneContact = formatPhone(phoneContact);
    data.general.codePhoneContact = codePhoneContact || '+1';
    data.general.phoneBusiness = formatPhone(phoneBusiness);
    data.general.codePhoneBusiness = codePhoneBusiness || '+1';

    data?.principals &&
      data.principals.map((item) => {
        item.homePhone = deleteDash(item?.homePhone);
        item.mobilePhone = deleteDash(item?.mobilePhone);

        item.zip = deleteDash(item?.zip);
        item.driverNumber = deleteDash(item?.driverNumber);
        item.ssn = deleteDash(item?.ssn);

        const [codeHomePhone, homePhone] = getInfoPhone(item.homePhone);
        const [codeMobilePhone, mobilePhone] = getInfoPhone(item.mobilePhone);
        item.homePhone = formatPhone(homePhone);
        item.codeHomePhone = codeHomePhone || '+1';
        item.mobilePhone = formatPhone(mobilePhone);
        item.codeMobilePhone = codeMobilePhone || '+1';
        return item;
      });

    setPending(data);
    setStatus(data?.status);
    setIsLoading(false);
  }, [id, navigate]);

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

  const deleteDash = (phone) => {
    phone = phone + '';
    phone = phone.replaceAll('(', '');
    phone = phone.replaceAll(')', '');
    phone = phone.replaceAll('-', '');
    return phone;
  };

  const formatPhone = (phone) => {
    let result = '';
    phone = phone.replaceAll(' ', '');
    phone?.split('')?.map((char, i) => {
      if (i === 2 && phone?.length > 2) {
        result = result + char + ' ';
      } else if (i === 5 && phone?.length > 6) {
        result = result + char + '-';
      } else result = result + char;
      return char;
    });
    return result;
  };

  const getState = useCallback(async () => {
    const { data } = await RequestManagementService.getState();
    const stateList = data?.map((item) => ({
      label: item.name,
      value: item.stateId,
    }));
    setState(stateList);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getPending();
    getState();
  }, [getPending, getState]);

  const bread = [
    {
      name: 'Pending Request',
      path: 'Pending Request',
    },
    {
      name: 'Details',
    },
  ];
  const breadEdit = [
    {
      name: 'Pending Request',
      path: 'Pending Request',
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

  const handleSave = async () => {
    let value = await form.validateFields();
    value = convertFormValue(ColumnPendingRequest({ form, state }), value, form);

    setIsLoading(true);
    const data = await RequestManagementService.editPending(value, pending, id);
    if (data?.data) {
      Message.success({ text: data?.message });
      await getPending();
    }
    if (!data?.data) {
      Message.error({ text: data?.message });
    }

    const pendingEl = document.querySelector('#pending');
    pendingEl.scrollIntoView({ behavior: 'smooth' });

    setIsEdit(false);
    setIsLoading(false);
  };

  const changeStatus = async (value) => {
    setIsLoading(true);
    await RequestManagementService.updateStatus({ Status: value }, id);
    await getPending();
  };

  let utc = pending?.handlingActivities[0]?.createDate;
  utc = moment(utc).format('MM/DD/YYYY - hh:mm A');
  const rejectModalRef = useRef();
  const acceptModalRef = useRef();

  const isPdfFile = (fileName) => {
    if (!fileName) return false;
    const extension = fileName.split('.').pop();
    if (extension === 'pdf') return true;
    return false;
  };

  const renderPdf = (url) => {
    return (
      <div className="relative flex flex-col p-2 rounded-md border border-gray-300 w-[120px] h-[120px]">
        <div className="flex items-center justify-center flex-grow w-full">
          <PdfIcon
            className="cursor-pointer"
            onClick={() => {
              window.open(url, '_blank');
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={isLoading} id="pending">
      {!isEdit && (
        <div className="">
          <Title title={'Request Detail'} breadcrumbs={bread} />

          <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
            <div className="flex mt-4 px-4 justify-between border-b border-blue-500 h-[60px] items-center">
              <p className="font-semibold text-lg text-black">ID-{pending?.merchantId}</p>
              <ul className="flex ">
                <li>
                  <Button name="BACK" moreClass="mr-5" onClick={() => navigate(routerLinks('Pending Request'))} />
                </li>
                <li>
                  <Button name="REJECT" onClick={rejectModalRef?.current?.handleEdit} moreClass="mr-5" />
                </li>
                <li>
                  <Button name="EDIT" onClick={() => setIsEdit(true)} moreClass="mr-5" />
                </li>
                <li>
                  <Button name="ACCEPT" type="ok" onClick={acceptModalRef?.current?.handleEdit} />
                </li>
              </ul>
            </div>
            <div className="">
              <div className=" border-b border-blue-500 p-4">
                <Select value={status} onChange={(value) => changeStatus(value)} className="capitalize">
                  <Select.Option value={0}>Pending</Select.Option>
                  <Select.Option value={1}>Handling</Select.Option>
                </Select>
                {pending?.handlingActivities.length !== 0 && (
                  <div>
                    <p className="mt-3 font-semibold text-md text-black">
                      By {pending?.handlingActivities[0]?.waUserName}
                    </p>
                    <p className="mt-2 font-semibold text-md text-black">Date/Time: {utc}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4">
              <h4 className="my-5 font-bold text-blue-500 text-xl">General Information</h4>
              <div className="w-full flex flex-wrap">
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Legal Business Name</p>
                    <p className="">{pending?.general.legalBusinessName}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Doing Business As (DBA)</p>
                    <p className="">{pending?.general.doBusinessName}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Merchant type</p>
                    <p className="">{pending?.type === 'Restaurant' ? 'Table Management' : pending?.type}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Federal Tax ID</p>
                    <p className="">{pending?.general.tax}</p>
                  </div>
                </div>
                <div className="w-full mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Business Address (no P.O. Boxes)</p>
                    <p className="">{pending?.general.address}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">City</p>
                    <p className="">{pending?.general.city}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">State</p>
                    <p className="">{pending?.state?.name}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                    <p className="">{pending?.zip}</p>
                  </div>
                </div>
                <div className="w-full mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">DBA Address</p>
                    <p className="">{pending?.general.dbaAddress?.Address}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">City</p>
                    <p className="">{pending?.general.dbaAddress?.City}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">State</p>
                    <p className="">{pending?.general.dbaAddress?.StateName}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                    <p className="">{pending?.general.dbaAddress?.Zip}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Business Phone Number</p>
                    <p className="">{pending?.general.codePhoneBusiness + ' ' + pending?.general.phoneBusiness}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Contact Email Address</p>
                    <p className="">{pending?.general.emailContact}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Contact Name</p>
                    <p className="">{pending?.general.firstName + ' ' + pending?.general?.lastName}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Title/Position</p>
                    <p className="">{pending?.general.title}</p>
                  </div>
                </div>
                <div className="w-1/2 lg:w-1/3 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Contact Phone Number</p>
                    <p className="">{pending?.general.codePhoneContact + ' ' + pending?.general.phoneContact}</p>
                  </div>
                </div>
              </div>

              <h4 className="my-5 font-bold text-blue-500 text-xl">Business Information</h4>
              <div className="w-full mt-5 flex flex-wrap">
                {business.map((item, index) => {
                  let value = false;
                  pending?.business.map((busi) => {
                    if (busi.question === item.question) value = busi.answer;
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
                    <p className="">{pending?.businessBank.accountHolderName}</p>
                  </div>
                </div>

                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Bank Name</p>
                    <p className="">{pending?.businessBank.name}</p>
                  </div>
                </div>

                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Routing Number</p>
                    <p className="">{pending?.businessBank.routingNumber}</p>
                  </div>
                </div>

                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Account Number(DDA)</p>
                    <p className="">{pending?.businessBank.accountNumber}</p>
                  </div>
                </div>

                <div className="w-1/2 lg:w-full mb-7 pr-5">
                  <div className="">
                    <p className="mb-2 font-medium text-sm text-black">Void Check</p>
                    <div className="w-48 rounded-md overflow-hidden">
                      {isPdfFile(pending?.businessBank.imageUrl) ? (
                        renderPdf(pending?.businessBank.imageUrl)
                      ) : (
                        <img className="w-full object-cover" src={pending?.businessBank.imageUrl} alt="void check" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="my-5 font-bold text-blue-500 text-xl">Principal Information</h4>
              {pending?.principals.map((item, index) => {
                const minusString = item.ssn.replace('-', '');
                const addString = minusString + '______';
                const ssn = '***-**-' + addString.slice(0, 4);
                return (
                  <div key={index}>
                    <h2 className="text-lg font-semibold text-blue-500">Principal {index + 1}</h2>
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
                          <p className="">{item.title}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">Ownership(%)</p>
                          <p className="">{item.ownerShip}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">Home Phone</p>
                          <p className="">{(item.codeHomePhone || '+1') + ' ' + item.homePhone}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">Mobile Phone</p>
                          <p className="">{(item.codeMobilePhone || '+1') + ' ' + item.mobilePhone}</p>
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
                          <p className="">{moment(item.birthDate).format('L')}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">Email Address</p>
                          <p className="">{item.email}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">Driver License Number</p>
                          <p className="">{item.driverNumber}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 font-medium text-sm text-black">State Issued</p>
                          <p className="">{item.stateIssuedName}</p>
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
                          <div className="w-48 rounded-md overflow-hidden">
                            {isPdfFile(item.imageUrl) ? (
                              renderPdf(item.imageUrl)
                            ) : (
                              <img className="w-full object-cover" src={item.imageUrl} alt="void check" />
                            )}
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
      )}
      {isEdit && (
        <div>
          <Title title={'Edit Pending Merchant'} breadcrumbs={breadEdit} />

          <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
            <div className="mt-4 px-4 border-b border-blue-500 h-[60px] flex items-center">
              <p className="font-semibold text-lg text-black">HP-{id}</p>
            </div>
            <div className="px-4 pt-4">
              <div className="form-edit-pending mt-5">
                <Form
                  values={{
                    type: pending?.type,
                    principals: pending?.principals,
                    generalInfo: {
                      ...pending?.general,
                      codePhoneBusiness: pending?.general?.codePhoneBusiness,
                      codePhoneContact: pending?.general?.codePhoneContact,
                      businessAddress: {
                        address: pending?.general?.address,
                        city: pending?.general?.city,
                        stateId: pending?.general?.stateId,
                        zip: pending?.general?.zip,
                      },
                    },
                    bankInfo: pending?.businessBank,
                    imageUrl: pending?.businessBank?.imageUrl,
                  }}
                  columns={ColumnPendingRequest({ form, state, setPending, pending })}
                  form={form}
                />
              </div>
            </div>

            <div className="flex px-4 mt-5">
              <Button name="CANCEL" type="cancel" onClick={() => setIsEdit(false)} moreClass="mr-5" />
              <Button name="SAVE" type="ok" onClick={() => handleSave()} />
            </div>
          </div>
        </div>
      )}

      <ModalForm
        ref={acceptModalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={600}
        title={() => 'Confirmation'}
        Post={RequestManagementService.acceptPending}
        parentID={() => pending.merchantId}
        handleChange={() => navigate(routerLinks('Pending Request'))}
        columns={[
          {
            title: 'Merchant ID',
            name: 'merchantCode',
            formItem: {
              type: 'only_number',
              rules: [{ type: 'required' }, { type: 'min', value: 4 }, { type: 'max', value: 20 }],
            },
          },
          {
            title: 'Transaction Fee',
            name: 'transactionsFee',
            formItem: {
              rules: [{ type: 'required' }],
              mask: maskNumber,
            },
          },
          {
            title: 'Discount Rate',
            name: 'discountRate',
            formItem: {
              rules: [{ type: 'required' }],
              mask: maskNumber,
            },
          },
        ]}
      />
      <ModalForm
        ref={rejectModalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={600}
        title={() => 'Confirmation'}
        Post={RequestManagementService.rejectPending}
        parentID={() => pending.merchantId}
        handleChange={() => navigate(routerLinks('Pending Request'))}
        columns={[
          {
            title: 'REASONS FOR REJECTION',
            name: 'reason',
            formItem: {
              type: 'textarea',
            },
          },
        ]}
      />
    </Spin>
  );
};

export default PendingRequestDetail;
