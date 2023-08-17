import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Spin } from 'components';

const Hook = forwardRef(
  (
    {
      title,
      widthModal = 800,
      onOk,
      onCancel,
      GetById,
      isLoading,
      setIsLoading,
      firstChange = true,
      textSubmit,
      className = '',
      footerCustom,
      children,
      afterClose=()=>{},
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({ handleShow, handleCancel, data, set_data, setIsVisible }));

    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const isLoadingT = useRef(false);
    const [data, set_data] = useState({});
    const handleCancel = () => {
      setIsVisible(false);
      isLoadingT.current = false;
      !!onCancel && onCancel(data);
    };
    const handleOk = async () => {
      if (!isLoadingT.current) {
        isLoadingT.current = true;
        if (onOk) {
          setIsLoading && setIsLoading(true);
          const res = await onOk(data);
          setIsLoading && setIsLoading(false);
          !!res && handleCancel();
          isLoadingT.current = false;
          return res;
        }
        handleCancel();
      }
    };

    const handleShow = async (item = {}) => {
      if (GetById) {
        setIsLoading(true);
        const { data } = await GetById(item.id);
        item = { ...item, ...data };
        setIsLoading(false);
      }
      set_data(item);
      setIsVisible(true);
    };

    return (
      <Modal
        afterClose={afterClose}
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={widthModal}
        title={<h3 className="font-bold text-lg">{title(data)}</h3>}
        open={isVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={className}
        footer={
          !!onOk &&
          ((footerCustom && footerCustom(handleOk, handleCancel)) || (
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
                disabled={!firstChange}
                className={classNames('px-4 py-2.5 rounded-xl inline-flex items-center btn-save', {
                  'bg-gray-100 hover:bg-gray-300 hover:text-white text-gray-400': !firstChange,
                  'text-white bg-blue-500 hover:bg-blue-400': firstChange,
                })}
                onClick={handleOk}
              >
                {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
                {textSubmit || t('components.form.modal.save')}
              </button>
            </div>
          ))
        }
      >
        <Spin spinning={isLoading}>{children}</Spin>
      </Modal>
    );
  },
);
Hook.displayName = 'HookModal';
export default Hook;
