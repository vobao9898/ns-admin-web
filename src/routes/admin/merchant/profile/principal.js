import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MerchantService } from 'services/merchant';
import { ModalForm } from 'components';
import { useAuth } from 'globalContext';
import { ColumnPrincipalChange, ColumnMerchantAddPrincipal } from 'columns/merchant';
import { Button } from 'layouts/components';
import moment from 'moment';
import classNames from 'classnames';
import { PrincipalService } from 'services/principal';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';

const Page = ({ id, toggleState, principals, principal, handleChange, state, clickPrincipal, merchant }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [showDetail, setShowDetail] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState();
  const [currentPrincipalId, setCurrentPrincipalId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [stateData, setStateData] = useState([]);

  clickPrincipal(() => {
    setShowDetail(false);
  });

  const getStateData = useCallback(async () => {
    const { data } = await MerchantService.getState();
    setStateData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const [principal] = principals && principals.filter((item) => item?.principalId === currentPrincipalId);
    setCurrentPrincipal(principal);
  }, [principals]);

  useEffect(() => {
    setIsLoading(true);
    getStateData();
  }, [getStateData]);

  const handleClickPrincipal = (principal) => {
    setShowDetail(true);
    setCurrentPrincipal(principal);
    setCurrentPrincipalId(principal?.principalId);
  };

  const modalFormRef = useRef();
  const modalConfirmRef = useRef();
  const modalFormAddPricipalRef = useRef();

  const handleSearch = (pricipals) => {};

  const footerFormPricipalChange = (handleOk, handleCancel) => {
    return (
      <div className="flex justify-end">
        <button
          type={'button'}
          className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
          onClick={handleCancel}
        >
          {t('components.form.modal.cancel')}
        </button>
        <button
          type={'button'}
          disabled={!disableBtn}
          className={classNames('px-4 py-2.5 rounded-xl inline-flex items-center btn-save', {
            'bg-gray-100 hover:bg-gray-300 hover:text-white text-gray-400': !disableBtn,
            'text-white bg-blue-500 hover:bg-blue-400': disableBtn,
          })}
          onClick={handleOk}
        >
          {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
          {t('components.form.modal.save')}
        </button>
      </div>
    );
  };

  const handSetDisableBtn = (isDisabled) => {
    setDisableBtn(isDisabled);
  };

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

  return (
    <Fragment>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={1200}
        parentID={() => id}
        handleChange={() => {
          handleChange();
          setShowDetail(false);
          setDisableBtn(false);
        }}
        Put={(values) => {
          const { selectedId } = values;
          MerchantService.changePricipal(id, selectedId, currentPrincipalId);
        }}
        title={(data) => (data?.id ? 'Change Pricipal' : 'Add')}
        footerCustom={footerFormPricipalChange}
        columns={ColumnPrincipalChange({
          t,
          merchantId: id,
          formatDate,
          state,
          modalFormRef,
          onSearch: (pricipals) => handleSearch(pricipals),
          onDisableBtn: (isDisabled) => handSetDisableBtn(isDisabled),
          currentPrincipal,
          modalConfirmRef,
        })}
      />

      <ModalForm
        ref={modalFormAddPricipalRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={1200}
        handleChange={() => {
          handleChange();
          setShowDetail(false);
        }}
        Post={async (values) => {
          const resp = await PrincipalService.create(values);
          if (resp && resp.data) {
            await MerchantService.changePricipal(id, resp.data);
          }
        }}
        Put={async (value, principalId, parentId, oldData) => {
          const resp = await PrincipalService.update(value, principalId, parentId, oldData);
          if (resp && principals.findIndex((x) => x.principalId === principalId) === -1) {
            await MerchantService.changePricipal(id, principalId);
          }
        }}
        title={(data) => (!data?.packageId ? 'Add Principal' : 'Edit')}
        columns={ColumnMerchantAddPrincipal({ t, stateData, formatDate, modalFormAddPricipalRef })}
      />

      {!showDetail ? (
        <div>
          {principals &&
            principals?.map((item, index) => (
              <div
                className="w-full rounded-xl px-3 py-2 shadow-sm bg-white mb-3 cursor-pointer"
                onClick={() => {
                  handleClickPrincipal(item);
                }}
                key={index}
              >
                {'Principal' + (index + 1)}: {item?.firstName + ' ' + item?.lastName}
              </div>
            ))}
          <div>
            <Button
              type={'ok'}
              name={'Add principal'}
              onClick={() => {
                modalFormAddPricipalRef?.current?.handleEdit();
              }}
            />
          </div>
        </div>
      ) : (
        <Fragment>
          <div className="font-bold text-lg mb-4 text-blue-500">Principal Information</div>
          <div className="grid grid-cols-12 gap-6 mb-4">
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Name</div>
              <div className="text-sm">
                {principals && currentPrincipal?.firstName + ' ' + currentPrincipal?.lastName}
              </div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Title/Position</div>
              <div className="text-sm">{principals && currentPrincipal?.title}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Ownership</div>
              <div className="text-sm">{principals && currentPrincipal?.ownerShip}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Home Phone</div>
              <div className="text-sm">
                {principals && currentPrincipal?.codeHomePhone + ' ' + currentPrincipal?.homePhone}
              </div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Mobile Phone</div>
              <div className="text-sm">
                {principals && currentPrincipal?.codeMobilePhone + ' ' + currentPrincipal?.mobilePhone}
              </div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Address</div>
              <div className="text-sm">{`${currentPrincipal?.address || ' '}, ${currentPrincipal?.city || ' '}, ${
                currentPrincipal?.stateIssuedName || ' '
              }, ${currentPrincipal?.zip || ' '}`}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Social Security Number</div>
              <div className="text-sm">{principals && convertSSN(currentPrincipal?.ssn)}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Date of Birth</div>
              <div className="text-sm">{principals && moment(currentPrincipal?.birthDate).format('MM/DD/YYYY')}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Email Address</div>
              <div className="text-sm">{principals && currentPrincipal?.email}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">Driver License Number</div>
              <div className="text-sm">{principals && currentPrincipal?.driverNumber}</div>
            </div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">State Issued</div>
              <div className="text-sm">{principals && currentPrincipal?.stateIssuedName}</div>
            </div>

            <div className="col-span-4"></div>
            <div className="sm:col-span-6 lg:col-span-4 col-span-12">
              <div className="text-sm font-semibold mb-2">
                {isPdfFile(currentPrincipal?.imageUrl) ? 'Driver License Pdf' : 'Driver License Picture'}
              </div>
              <div className="text-sm">
                {isPdfFile(currentPrincipal?.imageUrl) ? (
                  renderPdf(currentPrincipal?.imageUrl)
                ) : (
                  <img src={currentPrincipal?.imageUrl} alt="" />
                )}
              </div>
            </div>
          </div>
          <Button
            type="ok"
            name="Edit"
            onClick={() =>
              modalFormRef?.current?.handleEdit({
                ...currentPrincipal,
                id: currentPrincipal?.principalId,
                addressPrincipal: {
                  address: currentPrincipal?.address,
                  city: currentPrincipal?.city,
                  state: currentPrincipal?.stateId,
                  zip: currentPrincipal?.zip,
                },
                driverLicense: currentPrincipal?.driverNumber,
                yearAtThisAddress: currentPrincipal?.yearAddress,
              })
            }
            moreClass="mr-2"
          />
          <Button
            type="cancel"
            name="Back"
            onClick={() => {
              setShowDetail(!showDetail);
            }}
          />
        </Fragment>
      )}
    </Fragment>
  );
};
export default Page;
