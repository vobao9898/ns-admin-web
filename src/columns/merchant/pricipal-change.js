import React from 'react';
import moment from 'moment';
import { PrincipalService } from 'services/principal';
import { Radio } from 'antd';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

const convertSSN = (ssn) => {
  let arr = [];
  let newSSN = '';
  if (ssn && typeof ssn === 'string') {
    newSSN = ssn;
    newSSN = newSSN.replaceAll('-', '');
    arr.push(newSSN.slice(0, 3));
    arr.push(newSSN.slice(3, 5));
    arr.push(newSSN.slice(5, 9));
    arr = arr.filter((x) => x);
    return arr.join('-');
  }
  return ssn;
};

const Column = ({ merchantId, state, modalFormRef, currentPrincipal, onSearch, onDisableBtn }) => {
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

  return [
    {
      title: '',
      name: 'search',
      formItem: {
        name: 'search',
        placeholder: 'Search Email, Social security number',
        col: 12,
        colTablet: 12,
        onKeyPress: async (event, form) => {
          const { key } = event;
          if (key === 'Enter') {
            const { search } = form.getFieldsValue();

            if (search) {
              const data = await PrincipalService.briefPrincipal(search, merchantId);

              onSearch(data);

              if (data && data.length > 0) {
                modalFormRef.current.handleEdit({
                  ...currentPrincipal,
                  id: currentPrincipal.principalId,
                  textNoResult: '',
                  search,
                });
              } else {
                modalFormRef.current.handleEdit({
                  ...currentPrincipal,
                  id: currentPrincipal.principalId,
                  search,
                  textNoResult: `Sorry, we couldn't find any results!`,
                });
              }

              form.setFieldsValue({
                principals: data,
                numberOfPrincipal: (data?.length || 1) + 1,
              });
            } else {
              modalFormRef.current.handleEdit({
                ...currentPrincipal,
                id: currentPrincipal.principalId,
                search,
                textNoResult: ``,
              });
              onDisableBtn(false);
            }
          }
        },
      },
    },
    {
      name: 'textNoResult',
      formItem: {
        col: 12,
        colTablet: 12,
        render: (form, value, generateForm, index) => {
          return <p className="font-bold">{value?.textNoResult}</p>;
        },
      },
    },
    {
      name: 'selectedId',
      formItem: {
        type: 'hidden',
      },
    },
    {
      title: '',
      name: 'principals',
      formItem: {
        type: 'list',
        textAdd: 'ADD PRINCIPAL',
        isTable: false,
        idCheck: true,
        column: [
          {
            title: 'Selected Id',
            name: 'isSelected',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals, selectedId } = form.getFieldsValue();
                const idx = index?.replace('0_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-5 flex space-x-2 items-center flex-row">
                      <Radio
                        checked={item.principalId === selectedId}
                        onChange={(event) => {
                          if (event.target.checked) {
                            principals.forEach((item, index) => {
                              if (parseInt(idx) === index) {
                                form.setFieldsValue({ selectedId: item.principalId });
                                onDisableBtn(true);
                              }
                            });
                          }
                        }}
                      />
                      <div className="font-bold text-lg text-blue-500">{`Principal Information ${item.principalId}`}</div>
                    </div>
                  );
                }
              },
              col: 12,
              colTablet: 12,
            },
          },
          {
            title: 'Name',
            name: 'name',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('1_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Name</div>
                      <div className="text-sm">{item?.firstName + ' ' + item?.lastName}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Title/Position',
            name: 'title',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('2_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];

                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Title/Position</div>
                      <div className="text-sm">{item?.title}</div>
                    </div>
                  );
                }
              },

              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Ownership',
            name: 'ownerShip',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('3_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Ownership</div>
                      <div className="text-sm">{item?.ownerShip}</div>
                    </div>
                  );
                }
              },

              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Home Phone',
            name: 'homePhone',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('4_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Home Phone</div>
                      <div className="text-sm">{item?.homePhone}</div>
                    </div>
                  );
                }
              },

              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Mobile Phone',
            name: 'mobiPhone',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('5_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Mobile Phone</div>
                      <div className="text-sm">{item?.mobilePhone}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Address',
            name: 'address',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('6_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Address</div>
                      <div className="text-sm">{`${item?.address || ' '}, ${item?.city || ' '}, ${
                        item?.stateIssuedName || ' '
                      }, ${item?.zip || ' '}`}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Social Security Number',
            name: 'ssn',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('7_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Social Security Number</div>
                      <div className="text-sm">{convertSSN(item?.ssn)}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Date of Birth',
            name: 'birthDate',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('8_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Date of Birth</div>
                      <div className="text-sm">{item && moment(item?.birthDate).format('MM/DD/YYYY')}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Email',
            name: 'email',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('9_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Email Address</div>
                      <div className="text-sm">{item && item?.email}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'Driver License Number',
            name: 'driverLicense',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('10_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Driver License Number</div>
                      <div className="text-sm">{item && item?.driverNumber}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            title: 'State Issued',
            name: 'stateIssued',
            formItem: {
              type: 'title',
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('11_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];
                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">State Issued</div>
                      <div className="text-sm">{item && item?.stateIssuedName}</div>
                    </div>
                  );
                }
              },
              col: 4,
              colTablet: 6,
            },
          },
          {
            formItem: {
              type: 'hidden',
              col: 3,
              colTablet: 6,
            },
          },
          {
            title: 'Driver License Picture',
            name: 'imageUrl',
            tableItem: {
              sorter: false,
            },
            formItem: {
              type: 'title',
              col: 3,
              render: (form, value, generateForm, index) => {
                const { principals } = form.getFieldsValue();
                const idx = index?.replace('13_', '');
                if (principals && idx && isNumeric(idx) && principals.length > parseInt(idx)) {
                  const item = principals[parseInt(idx)];

                  return (
                    <div className="mb-10">
                      <div className="text-sm font-semibold">Driver License Picture</div>
                      <div className="text-sm">
                        {isPdfFile(item?.imageUrl) ? (
                          renderPdf(item?.imageUrl)
                        ) : (
                          <img src={item && item?.imageUrl} alt="" />
                        )}
                      </div>
                    </div>
                  );
                }
              },
            },
          },
        ],
      },
    },
  ];
};
export default Column;
