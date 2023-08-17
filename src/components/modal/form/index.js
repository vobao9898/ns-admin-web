import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form as FormAnt } from 'antd';

import { Modal, Form } from 'components/index';
import { convertFormValue } from 'utils';
import { ColumnCategory } from 'columns/merchant';

const Hook = forwardRef(
  (
    {
      parentID = () => {},
      title,
      isLoading,
      setIsLoading,
      handleChange,
      Post,
      Put,
      Patch,
      Delete,
      GetById,
      values,
      readOnly,
      firstRun,
      widthModal = 1200,
      columns,
      textSubmit,
      className = '',
      footerCustom,
      setPackageId = () => {},
      afterClose = () => {},
      dataIsSubCategory,
      isWarHouse,
      isRetailer,
      isColumn,
      ...propForm
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({ handleEdit, handleDelete, form }));

    const [form] = FormAnt.useForm();
    const [firstChange, set_firstChange] = useState(false);
    const [data, set_data] = useState({});

    const handleEdit = async (item = {}, isItem) => {
      set_firstChange(false);
      !!firstRun && (await firstRun(item));
      if (isItem) {
        set_data(item);
        await modal?.current?.handleShow(item);
      } else {
        if (item && item.id && GetById) {
          setIsLoading(true);
          const { data } = await GetById(item.id, parentID(), item);
          item = { ...item, ...data };
          setIsLoading(false);
        }
        if (item && !item.id && !GetById) {
          const itemStemp = { ...item };
          itemStemp.id = item?.packageId;
          set_data(itemStemp);
          await modal?.current?.handleShow(itemStemp);
        } else {
          set_data(item);
          await modal?.current?.handleShow(item);
        }
      }
    };
    const handleDelete = async (id, item) => {
      Delete && (await Delete(id, parentID(), item));
      handleChange && (await handleChange());
    };

    const modal = useRef();
    return (
      <Modal
        afterClose={afterClose}
        ref={modal}
        widthModal={widthModal}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        firstChange={firstChange}
        textSubmit={textSubmit}
        className={className}
        footerCustom={footerCustom}
        title={(data) => title(data)}
        onOk={async (data) => {
          return form
            .validateFields()
            .then(async (values) => {
              values = convertFormValue(columns, values, form);
              if (!!Post || !!Put) {
                try {
                  setIsLoading(true);
                  const res = await (data.id === undefined
                    ? Post(values, parentID())
                    : Put(values, data.id, parentID(), data));
                  if (res !== false) {
                    values = res?.data;
                  } else {
                    setIsLoading(false);
                    return false;
                  }
                } catch (e) {
                  setIsLoading(false);
                }
              }
              handleChange && (await handleChange(values, data));
              return true;
            })
            .catch(() => false);
        }}
      >
        <Form
          {...propForm}
          onFirstChange={(datas) => {
            if (datas?.packageId) {
              setPackageId && setPackageId(datas?.packageId);
              const valueForm = form.getFieldValue();
              form.setFieldValue({ ...valueForm, additionStaff: 0 });
              set_data({ ...data, additionStaff: 0, packageId: datas?.packageId });
            }
            set_firstChange(true);
          }}
          values={data}
          form={form}
          columns={
            isColumn
              ? ColumnCategory({
                  isWarHouse,
                  dataIsSubCategory,
                  set_data,
                  form,
                  modal: () => {
                    modal?.current?.handleShow(data);
                  },
                  data,
                  isRetailer,
                  set_firstChange,
                })
              : columns
          }
          readOnly={readOnly}
        />
      </Modal>
    );
  },
);
Hook.displayName = 'HookModalForm';
export default Hook;
