import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';
import { RequestManagementService } from 'services/request-management';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';
import moment from 'moment';
import { Message } from 'components';

const ApprovedRequestDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [approve, setApprove] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getApproved = useCallback(async () => {
    setIsLoading(true);
    const data = await RequestManagementService.getApprovedById(id);
    if (!data?.data) {
      Message.error({ text: data?.message });
      navigate(routerLinks('Approved Request'));
      return;
    }
    setApprove(data?.data);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    getApproved();
  }, [getApproved]);

  const bread = [
    {
      name: 'Approved Request',
      path: 'Approved Request',
    },
    {
      name: 'Detail',
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

  let utc = approve?.approvedDate + 'Z';
  utc = moment(new Date(utc)).format('MM/DD/YYYY - hh:mm A');

  return (
    <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={isLoading}>
      <div className="">
        <Title title={'Merchant Profile'} breadcrumbs={bread} />

        <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
          <div className="p-4 flex justify-between border-b border-blue-500">
            <p className="font-bold text-black text-xl">ID: {id}</p>
            <Button name="BACK" onClick={() => navigate(routerLinks('Approved Request'))} />
          </div>

          <div className="p-4 border-b border-blue-500">
            <p className="w-fit mb-3 px-8 py-2 text-white bg-green-500 font-bold text-lg">APPROVED</p>
            <p className="mb-2 text-blue-500 font-bold text-lg">
              By {approve && approve?.adminUser?.first_name + ' ' + approve?.adminUser?.last_name}
            </p>
            <p className="font-semibold text-black text-md">Date/Time: {utc}</p>
          </div>

          <div className="px-4">
            <h4 className="my-5 font-bold text-blue-500 text-xl">General Information</h4>
            <div className="w-full flex flex-wrap">
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Legal Business Name</p>
                  <p className="">{approve?.general.legalBusinessName}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Doing Business As (DBA)</p>
                  <p className="">{approve?.general.doBusinessName}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Merchant Type</p>
                  <p className="">{approve?.type}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Federal Tax ID</p>
                  <p className="">{approve?.general.tax}</p>
                </div>
              </div>
              <div className="w-full mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Business Address (no P.O. Boxes)</p>
                  <p className="">{approve?.general.address}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">City</p>
                  <p className="">{approve?.general.city}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">State</p>
                  <p className="">{approve?.state.name}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Zip Code</p>
                  <p className="">{approve?.general.zip}</p>
                </div>
              </div>
              <div className="w-full mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">DBA Address</p>
                  <p className="">{approve?.general.dbaAddress.Address}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">City</p>
                  <p className="">{approve?.general.dbaAddress.City}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">State</p>
                  <p className="">{approve?.general.dbaAddress.StateName}</p>
                </div>
              </div>
              <div className="w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Zip Code</p>
                  <p className="">{approve?.general.dbaAddress.Zip}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Business Phone Number</p>
                  <p className="">{approve?.general.phoneBusiness}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Contact Email Address</p>
                  <p className="">{approve?.general.emailContact}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Contact Name</p>
                  <p className="">{approve?.general.firstName + ' ' + approve?.general.lastName}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Title/Position</p>
                  <p className="">{approve?.general.title}</p>
                </div>
              </div>
              <div className="w-1/2 lg:w-1/3 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Contact Phone Number</p>
                  <p className="">{approve?.general.phoneContact}</p>
                </div>
              </div>
            </div>

            <h4 className="my-5 font-bold text-blue-500 text-xl">Business Information</h4>
            <div className="w-full mt-5 flex flex-wrap">
              {business.map((item, index) => {
                let value = false;
                approve?.business.map((busi) => {
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
                  <p className="mb-2 text-black text-sm font-medium">Account Holder Name</p>
                  <p className="">{approve?.businessBank?.accountHolderName}</p>
                </div>
              </div>

              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Bank Name</p>
                  <p className="">{approve?.businessBank?.name}</p>
                </div>
              </div>

              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Routing Number</p>
                  <p className="">{approve?.businessBank?.routingNumber}</p>
                </div>
              </div>

              <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Account Number (DDA)</p>
                  <p className="">{approve?.businessBank?.accountNumber}</p>
                </div>
              </div>

              <div className="w-full mb-7 pr-5">
                <div className="">
                  <p className="mb-2 text-black text-sm font-medium">Void Check</p>
                  <div className="w-48 rounded-lg overflow-hidden">
                    <img className="w-full object-cover" src={approve?.businessBank?.imageUrl} alt="void check" />
                  </div>
                </div>
              </div>
            </div>

            <h4 className="my-5 font-bold text-blue-500 text-xl">Principal Information</h4>
            {approve &&
              approve.principals.map((item, index) => {
                const minusString = item.ssn.replace('-', '');
                const addString = minusString + '______';
                const ssn = '***-**-' + addString.slice(0, 4);
                return (
                  <div key={index}>
                    <h4 className="text-lg text-blue-500 font-semibold">Principal {index + 1}</h4>
                    <div className="w-full mt-5 flex flex-wrap">
                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Name</p>
                          <p className="">{item?.firstName + ' ' + item?.lastName}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Title/Position</p>
                          <p className="">{item.title}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Ownership (%)</p>
                          <p className="">{item.ownerShip}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Home Phone</p>
                          <p className="">{item.homePhone}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Mobile Phone</p>
                          <p className="">{item.mobilePhone}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Address</p>
                          <p className="">{`${item?.address}, ${item?.city}, ${item?.state?.name}, ${item?.zip}`}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Date of Birth (mm/dd/yy)</p>
                          <p className="">{moment(item.birthDate).format('L')}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Email Address</p>
                          <p className="">{item.email}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Driver License Number</p>
                          <p className="">{item.driverNumber}</p>
                        </div>
                      </div>

                      <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">State Issued</p>
                          <p className="">{item.stateIssuedName}</p>
                        </div>
                      </div>

                      <div className="w-1/2 mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Social Security Number (SSN)</p>
                          <p className="">{ssn}</p>
                        </div>
                      </div>

                      <div className="w-full mb-7 pr-5">
                        <div className="">
                          <p className="mb-2 text-black text-sm font-medium">Driver License Picture</p>
                          <div className="w-48 rounded-lg overflow-hidden">
                            <img className="w-full object-cover" src={item.imageUrl} alt="void check" />
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
    </Spin>
  );
};

export default ApprovedRequestDetail;
