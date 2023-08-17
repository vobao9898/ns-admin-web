import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HookModalForm } from 'hooks';
import { ColumnConsumer, ColumnArchive } from 'columns/consumer';
import { useAuth } from 'globalContext';
import { UserService } from 'services/user';
import { Button } from 'layouts/components';

import '../index.less';

const General = ({ data, getDetail }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [handleArchive, ModalFormArchive] = HookModalForm({
    title: () => 'Are you sure you want to Archive Consumer?',
    isLoading,
    setIsLoading,
    columns: ColumnArchive({ t, formatDate }),
    textSubmit: 'Confirm',
    Put: UserService.putArchive,
    handleChange: async () => await getDetail(),
    widthModal: 600,
  });

  const [handleEdit, ModalForm] = HookModalForm({
    title: (data) => 'Edit General Information',
    isLoading,
    setIsLoading,
    handleChange: async () => await getDetail(),
    columns: ColumnConsumer({
      t,
      formatDate,
    }),
    Put: UserService.put,
    widthModal: 600,
  });

  return (
    <Fragment>
      {ModalForm()}
      {ModalFormArchive()}
      <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
      <div className="grid grid-cols-12 gap-6 mb-4">
        <div className="sm:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">First Name</div>
          <div className="text-sm">{data?.firstName}</div>
        </div>
        <div className="sm:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Last Name</div>
          <div className="text-sm">{data?.lastName}</div>
        </div>
        <div className="sm:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Contact Email</div>
          <div className="text-sm break-words">{data?.email}</div>
        </div>
        <div className="sm:col-span-4 col-span-12">
          <div className="text-sm font-semibold mb-2">Number Phone</div>
          <div className="text-sm">{(data?.codePhone || '+1') + data?.phone}</div>
        </div>
      </div>
      <Button name="EDIT" type="ok" onClick={() => handleEdit(data)} moreClass="mr-5" />
      <Button
        name={data?.isDisabled ? 'ENABLE' : 'ARCHIVE'}
        type={data?.isDisabled ? 'ok' : 'cancel'}
        onClick={async () => {
          if (!data?.isDisabled) {
            handleArchive(data);
          } else {
            await UserService.putRestore(data.id);
            await getDetail();
          }
        }}
      />
    </Fragment>
  );
};

export default General;
