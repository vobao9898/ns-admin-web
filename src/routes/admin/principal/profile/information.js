import React, { useRef, useState, useEffect } from 'react';
import { ColumnPrincipalEdit } from 'columns/principal';
import { ModalForm } from 'components';
import { useAuth } from 'globalContext';
import { Button } from 'layouts/components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { PrincipalService } from 'services/principal';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';

const Page = ({ id, principal, state, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrincipal, setCurrentPrincipal] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modalFormRef = useRef();
  const modalConfirmRef = useRef();

  const { formatDate } = useAuth();

  useEffect(() => {
    setCurrentPrincipal(principal);
  }, [principal]);

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

  const renderInformation = (currentPrincipal) => {
    if (!currentPrincipal) return null;

    const {
      firstName,
      lastName,
      title,
      homePhone,
      mobilePhone,
      email,
      stateIssuedName,
      address,
      ownerShip,
      birthDate,
      driverNumber,
      ssn,
      imageUrl,
      city,
      zip,
      codeHomePhone,
      codeMobilePhone,
    } = currentPrincipal;

    return (
      <>
        <div className="font-bold text-lg mb-4 text-blue-500">Principal Information</div>
        <div className="grid grid-cols-12 gap-6 mb-4">
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Name</div>
            <div className="text-sm">{firstName + ' ' + lastName}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Title/Position</div>
            <div className="text-sm">{title}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Ownership</div>
            <div className="text-sm">{ownerShip}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Home Phone</div>
            <div className="text-sm">{codeHomePhone + ' ' + homePhone}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Mobile Phone</div>
            <div className="text-sm"> {codeMobilePhone + ' ' + mobilePhone}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Address</div>
            <div className="text-sm">{`${address || ' '}, ${city || ' '}, ${stateIssuedName || ' '}, ${
              zip || ' '
            }`}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Social Security Number</div>
            <div className="text-sm">{convertSSN(ssn)}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Date of Birth</div>
            <div className="text-sm">{birthDate && moment(birthDate).format('MM/DD/YYYY')}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Email Address</div>
            <div className="text-sm">{email}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">Driver License Number</div>
            <div className="text-sm">{driverNumber}</div>
          </div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">State Issued</div>
            <div className="text-sm">{stateIssuedName}</div>
          </div>
          <div className="col-span-4"></div>
          <div className="sm:col-span-6 lg:col-span-4 col-span-12">
            <div className="text-sm font-semibold mb-2">
              {isPdfFile(imageUrl) ? 'Driver License Pdf' : 'Driver License Picture'}
            </div>
            {isPdfFile(imageUrl) ? renderPdf(imageUrl) : <img src={imageUrl} alt="" />}
          </div>
        </div>
        <Button
          type="ok"
          name="Edit"
          onClick={() =>
            modalFormRef?.current?.handleEdit({
              ...principal,
              id: principal?.principalId,
              addressPrincipal: {
                address: principal?.address,
                city: principal?.city,
                state: principal?.stateId,
                zip: principal?.zip,
              },
              driverLicense: principal?.driverNumber,
              yearAtThisAddress: principal?.yearAddress,
            })
          }
          moreClass="mr-2"
        />
        <Button type="cancel" name="Back" onClick={() => navigate(routerLinks('Principal'))} />
      </>
    );
  };

  return (
    <div>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={900}
        parentID={() => id}
        handleChange={() => {
          handleChange();
        }}
        Put={PrincipalService.update}
        title={(data) => (data?.id ? 'Edit' : 'Add')}
        columns={ColumnPrincipalEdit({
          t,
          formatDate,
          state,
          modalFormRef,
          currentPrincipal,
          modalConfirmRef,
        })}
      />
      {renderInformation(currentPrincipal)}
    </div>
  );
};
export default Page;
