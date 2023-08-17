import React from 'react';
import classNames from 'classnames';
import { ReactComponent as PdfIcon } from 'assets/images/pdf-icon.svg';

const Page = ({ logs }) => {
  const renderPricipalRow = (item, index) => {
    const { homePhone, mobilePhone, address, city, stateIssuedName, zip, stateName, driverNumber, ImageUrl } = item;

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
      <div
        className={classNames(
          'grid grid-cols-12 gap-6 px-5 py-5',
          { 'border-t border-blue-500': index !== 0 },
          { 'bg-[#f9fafb]': index % 2 === 0 },
          { 'bg-[#ffffff]': index % 2 !== 0 },
        )}
        key={index}
      >
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Home Phone</div>
          <div className="text-sm">{homePhone}</div>
        </div>
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Mobile Phone</div>
          <div className="text-sm">{mobilePhone}</div>
        </div>
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Address</div>
          <div className="text-sm">{`${address || ' '}, ${city || ' '}, ${stateIssuedName || ' '}, ${zip || ' '}`}</div>
        </div>
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">State Issued</div>
          <div className="text-sm">{stateName}</div>
        </div>
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Driver License Number</div>
          <div className="text-sm">{driverNumber}</div>
        </div>
        <div className="col-span-4"></div>
        <div className="sm:col-span-6 lg:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">
            {isPdfFile(ImageUrl) ? 'Driver License Pdf' : 'Driver License Picture'}
          </div>
          <div className="text-sm">{isPdfFile(ImageUrl) ? renderPdf(ImageUrl) : <img src={ImageUrl} alt="" />}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {logs &&
        logs.map((item, index) => {
          return renderPricipalRow(item, index);
        })}
    </div>
  );
};
export default Page;
