import React, { useState } from 'react';
import { Modal, Spin } from 'antd';
import { HookDataTable, HookModalForm } from 'hooks';
import { ColumnsTemplate } from 'columns/gift-card';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'globalContext';
import { GiftCardService } from 'services/gift-cart';
import { Title, Button } from 'layouts/components';

import './index.less';

const Template = () => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [id, setId] = useState(null);

  const archiveHandle = (isDisabled, templateId) => {
    if (isDisabled === 'active') {
      setIsArchive(true);
    }
    if (isDisabled === 'inactive') {
      setIsRestore(true);
    }
    setId(templateId);
  };

  const [showModalTemplate, ModalTemplate] = HookModalForm({
    title: (data) => (data.giftCardTemplateId ? 'Edit Template' : 'New Template'),
    Put: GiftCardService.editTemplate,
    Post: GiftCardService.createTemplate,
    columns: ColumnsTemplate({}),
    widthModal: 900,
    isLoading,
    setIsLoading,
    handleChange: async () => onChange(),
  });

  const [onChange, TemplateTable] = HookDataTable({
    columns: ColumnsTemplate({
      t,
      formatDate,
      handleEdit: showModalTemplate,
      archiveHandle,
    }),
    Get: GiftCardService.getTemplates,
    searchPlaceholder: 'Search by Name, Group',
    rightHeader: <Button name="New Template" type="ok" onClick={() => showModalTemplate({ isDisabled: 0 })} />,
    isLoading,
    setIsLoading,
  });

  const bread = [
    {
      name: 'Giftcard',
    },
    {
      name: 'Template',
    },
  ];

  return (
    <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={false}>
      <div className="col-span-2 row-span-2 grid">
        <Title title={'Gift Card Template'} breadcrumbs={bread} />
        <div className="p-4 shadow rounded-xl bg-gray-50">
          {TemplateTable()}
          {ModalTemplate()}
          <Modal
            title={isArchive ? 'ARCHIVE TEMPLATE' : 'Restore this Template ?'}
            visible={isArchive || isRestore}
            onCancel={() => {
              setIsArchive(false);
              setIsRestore(false);
              setId(null);
            }}
            onOk={async () => {
              setIsLoading(true);
              const type = isArchive ? 'disabled' : 'restore';
              await GiftCardService.updateStatus(type, id);
              onChange();
              setIsArchive(false);
              setIsRestore(false);
              setIsLoading(false);
            }}
          >
            {isArchive ? (
              <p>Are you sure you want to ARCHIVE this Template</p>
            ) : (
              <p>Are you sure you want to RESTORE this template?</p>
            )}
          </Modal>
        </div>
      </div>
    </Spin>
  );
};

export default Template;
