import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Checkbox, Radio, Switch, Slider, DatePicker as DateAntDesign } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { useAuth } from 'globalContext';
import { Upload } from 'components';
import { convertFormValue } from 'utils';
import {
  ColorButton,
  Chips,
  Editor,
  SelectTag,
  Select,
  TreeSelect,
  TableTransfer,
  Password,
  Mask,
  Addable,
  DatePicker,
  List,
} from './input';

const Component = ({
  className,
  columns,
  textSubmit,
  textCancel = 'components.form.modal.cancel',
  handSubmit,
  values = {},
  form,
  onFirstChange = () => {},
  widthLabel = null,
  checkHidden = false,
  extendForm = () => {},
  isShowCancel = false,
  extendButton = null,
  idSubmit = 'idSubmit',
  disableSubmit = false,
  classGroupButton = 'justify-center items-center',
  packageId = 0,
}) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [_columns, set_columns] = useState([]);
  const timeout = useRef();
  const refLoad = useRef(true);
  const [_render, set_render] = useState(false);

  const reRender = () => {
    set_render(!_render);
    refLoad.current = false;
  };

  const handleFilter = useCallback(async () => {
    columns = columns.filter((item) => !!item && !!item.formItem);

    if (
      JSON.stringify(
        _columns.map(({ name, formItem }, index) => ({
          name,
          formItem: {
            list: formItem?.list?.map(({ value, disabled }) => ({ value, disabled })) || [],
            disabled: formItem?.disabled ? formItem?.disabled(values, form, index) : false,
          },
        })),
      ) !==
      JSON.stringify(
        columns.map(({ name, formItem }, index) => ({
          name,
          formItem: {
            list: formItem?.list?.map(({ value, disabled }) => ({ value, disabled })) || [],
            disabled: formItem?.disabled ? formItem?.disabled(values, form, index) : false,
          },
        })),
      )
    ) {
      set_columns(columns);
    }
  }, [columns, values, _columns]);

  useEffect(() => {
    if (form && refLoad.current) {
      form.resetFields();
      form.setFieldsValue(values);
    }
    refLoad.current = true;
  }, [values]);

  useEffect(() => {
    handleFilter(values);
  }, [handleFilter, values]);

  const generateInput = (formItem, item, values, index) => {
    switch (formItem.type) {
      case 'hidden':
        break;
      // case "media":
      //   return <Media limit={formItem.limit} />;
      case 'list':
        return <List name={item.name} generateForm={generateForm} form={form} {...formItem} />;
      case 'addable':
        return <Addable name={item.name} generateForm={generateForm} form={form} {...formItem} />;
      case 'editor':
        return <Editor readOnly={!!formItem.disabled && formItem.disabled(values, form, index)} />;
      case 'color_button':
        return <ColorButton />;
      case 'upload':
        return <Upload disabledUpload={!!formItem.disabled && formItem.disabled(values, form, index)} {...formItem} />;
      case 'table_transfer':
        return <TableTransfer formItem={formItem} form={form} />;
      case 'password':
        return (
          <Password
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        );
      case 'textarea':
        return (
          <textarea
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
            className={classNames(
              'ant-input px-4 py-2.5 w-full rounded-xl text-gray-600 bg-white border border-solid border-gray-400 input-description min-h-[7rem]',
              {
                'bg-gray-100 text-gray-400': !!formItem.disabled && formItem.disabled(values, form, index),
              },
            )}
            rows="4"
            maxLength="1000"
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            onChange={(e) => formItem.onChange && formItem.onChange(e.target.value, form, reRender)}
          />
        );
      case 'slider_number':
        return (
          <Slider
            range
            tipFormatter={(value) =>
              (value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0') +
              (formItem.symbol ? formItem.symbol : '')
            }
            max={formItem.max ? formItem.max : 9999999}
            defaultValue={formItem.initialValues ? [formItem.initialValues.start, formItem.initialValues.end] : [0, 0]}
          />
        );
      case 'date':
        return (
          <DatePicker
            format={
              (!formItem.picker || formItem.picker === 'date') && formatDate + (formItem.showTime ? ' HH:mm' : '')
            }
            onChange={(date) => formItem.onChange && formItem.onChange(date, form, reRender)}
            disabledDate={(current) => formItem.disabledDate && formItem.disabledDate(current, form)}
            showTime={formItem.showTime}
            picker={formItem.picker || 'date'}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
            form={form}
            name={item.name}
          />
        );
      case 'date_range':
        return (
          <DateAntDesign.RangePicker
            onChange={(date) => formItem.onChange && formItem.onChange(date, form, reRender)}
            format={formatDate + (formItem.showTime ? ' HH:mm' : '')}
            disabledDate={(current) => formItem.disabledDate && formItem.disabledDate(current, form)}
            defaultValue={formItem.initialValues && [formItem.initialValues.start, formItem.initialValues.end]}
            showTime={formItem.showTime}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        );
      case 'checkbox':
        return formItem.list ? (
          <Checkbox.Group
            options={formItem.list}
            onChange={(value) => formItem.onChange && formItem.onChange(value, form, reRender)}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        ) : (
          <Checkbox
            onChange={(value) => formItem.onChange && formItem.onChange(value.target.checked, form, reRender)}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          >
            {formItem.label}
          </Checkbox>
        );
      case 'radio':
        return (
          <Radio.Group
            options={formItem.list}
            buttonStyle={formItem.style}
            optionType={formItem.style ? 'button' : ''}
            defaultValue={packageId !== 0 ? packageId : formItem?.value && formItem?.value}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
            onChange={({ target }) => formItem.onChange && formItem.onChange(target.value, form, reRender)}
          />
        );
      case 'tag':
        return (
          <SelectTag
            maxTagCount={formItem.maxTagCount || 'responsive'}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            tag={formItem.tag}
            form={form}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        );
      case 'chips':
        return (
          <Chips
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        );
      case 'select':
        return (
          <Select
            showSearch={formItem.showSearch}
            maxTagCount={formItem.maxTagCount || 'responsive'}
            onChange={(value) => formItem.onChange && formItem.onChange(value, form, reRender)}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            formItem={formItem}
            form={form}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
          />
        );
      case 'tree_select':
        return (
          <TreeSelect
            formItem={formItem}
            showSearch={formItem.showSearch}
            form={form}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
          />
        );
      case 'switch':
        return (
          <Switch
            checkedChildren={<i className="las la-lg la-check" />}
            unCheckedChildren={<i className="las la-lg la-times" />}
            defaultChecked={!!values && values[item.name] === 1}
          />
        );
      case 'switchCategory':
        return (
          <div className="">
            <Switch
              onChange={(value) => formItem.onChange && formItem.onChange(value, form, reRender)}
              formItem={formItem}
              showSearch={formItem.showSearch}
              form={form}
              disabled={!!formItem.disabled && formItem.disabled(values, form)}
              placeholder={formItem.placeholder || item.title}
              checked={form?.getFieldValue('isSubCategory')}
            ></Switch>
            {!form?.getFieldValue('isSubCategory') && (
              <div className="flex mt-2">
                <div className="text-[red] mr-1">Note:</div>
                <div>products can only be added to subcategories</div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <Mask
            typePassword={formItem?.typePassword}
            form={form}
            mask={formItem.mask}
            addonBefore={formItem.addonBefore}
            addonAfter={formItem.addonAfter}
            maxLength={formItem.maxLength}
            placeholder={formItem.placeholder || t('components.form.Enter') + ' ' + item.title.toLowerCase()}
            onBlur={(e) => {formItem.onBlur && formItem.onBlur(e, form, onFirstChange)}}
            onChange={(value) => formItem.onChange && formItem.onChange(value, form, reRender, onFirstChange)}
            disabled={!!formItem.disabled && formItem.disabled(values, form, index)}
            onFirstChange={onFirstChange}
            onKeyPress={(event) => formItem.onKeyPress && formItem.onKeyPress(event, form)}
          />
        );
    }
  };
  const generateForm = (item, index, showLabel = true, name) => {
    if (!!item?.formItem?.condition && !item?.formItem?.condition(values[item.name], form, index)) {
      return;
    }
    if (item?.formItem?.render) {
      return item?.formItem?.render(form, values, generateForm, index, reRender, onFirstChange);
    }
    if (item.formItem) {
      const rules = [];
      switch (item.formItem.type) {
        case 'number':
          rules.push(() => ({
            validator(_, value) {
              if (!value || (/^[1-9]*\d+(\.\d{1,2})?$/.test(value) && parseInt(value) < 1000000000)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('components.form.only number')));
            },
          }));
          break;
        case 'only_number':
          rules.push(() => ({
            validator(_, value) {
              if (!value || /^[0-9]+$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('components.form.only number')));
            },
          }));
          break;
        default:
      }

      if (item.formItem.rules) {
        item.formItem.rules
          .filter((item) => !!item)
          .map((rule) => {
            switch (rule.type) {
              case 'required':
                if (!rule.message) {
                  rule.message = t('components.form.ruleRequired');
                }
                rules.push({
                  required: true,
                  message: rule.message,
                });
                if (!item.formItem.type) {
                  rules.push({
                    whitespace: true,
                    message: t('components.form.ruleRequired'),
                  });
                }
                break;
              case 'email':
                if (!rule.message) {
                  rule.message = t('components.form.ruleEmail');
                }
                rules.push(() => ({
                  validator(_, value) {
                    const regexEmail =
                      /^(([^<>()[\]\\.,;:$%^&*\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!value || (typeof value === 'string' && regexEmail.test(value.trim()))) {
                      return Promise.resolve();
                    } else if (
                      typeof value === 'object' &&
                      value.length > 0 &&
                      value.filter((item) => !regexEmail.test(item)).length === 0
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'min':
                if (!rule.message) {
                  switch (item.formItem.type) {
                    case 'number':
                      rule.message = t('components.form.ruleMin', {
                        min: rule.value,
                      });
                      break;
                    case 'only_number':
                      rule.message = t('components.form.ruleMinNumberLength', {
                        min: rule.value,
                      });
                      break;
                    default:
                      rule.message = t('components.form.ruleMinLength', {
                        min: rule.value,
                      });
                  }
                }
                if (item.formItem.type === 'number') {
                  rules.push(() => ({
                    validator(_, value) {
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) < rule.value) {
                            return Promise.reject(new Error(rule.message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                } else {
                  rules.push({
                    type: item.formItem.type === 'number' ? 'number' : 'string',
                    min: rule.value,
                    message: rule.message,
                  });
                }

                break;
              case 'max':
                if (!rule.message) {
                  switch (item.formItem.type) {
                    case 'number':
                      rule.message = t('components.form.ruleMax', {
                        max: rule.value,
                      });
                      break;
                    case 'only_number':
                      rule.message = t('components.form.ruleMaxNumberLength', {
                        max: rule.value,
                      });
                      break;
                    default:
                      rule.message = t('components.form.ruleMaxLength', {
                        max: rule.value,
                      });
                  }
                }
                if (item.formItem.type === 'number') {
                  rules.push(() => ({
                    validator(_, value) {
                      if (!value || /^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                        if (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value)) {
                          if (parseFloat(value) > rule.value) {
                            return Promise.reject(new Error(rule.message));
                          }
                        }
                      }
                      return Promise.resolve();
                    },
                  }));
                } else {
                  rules.push({
                    type: item.formItem.type === 'number' ? 'number' : 'string',
                    max: rule.value,
                    message: rule.message,
                  });
                }

                break;
              case 'url':
                if (!rule.message) {
                  rule.message = t('components.form.incorrectPathFormat');
                }
                rules.push({
                  type: 'url',
                  message: rule.message,
                });
                break;
              case 'only_text':
                if (!rule.message) {
                  rule.message = t('components.form.only text');
                }
                rules.push(() => ({
                  validator(_, value) {
                    if (!value || /^[A-Za-z]+$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'only_text_space':
                if (!rule.message) {
                  rule.message = t('components.form.only text');
                }
                rules.push(() => ({
                  validator(_, value) {
                    if (!value || /^[a-zA-Z ]+$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(rule.message));
                  },
                }));
                break;
              case 'password':
                rules.push(() => ({
                  validator: async (rule, value) => {
                    if (!!value && value.trim() !== '' && value.length > rule.min ? rule.min - 1 : 0) {
                      if (/^(?!.* )(?=.*\d)(?=.*[A-Z]).*$/.test(value)) return Promise.resolve();
                      else return Promise.reject(t('components.form.rulePassword'));
                    } else return Promise.resolve();
                  },
                }));
                break;
              case 'custom':
                rules.push(rule.validator);
                break;
              default:
            }
            return rule;
          });
      }

      const otherProps = {
        key: index,
        label: showLabel && item.title,
        name: name || item.name,
        labelAlign: 'left',
        validateTrigger: 'onBlur',
      };
      if (rules.length) {
        otherProps.rules = rules;
      }
      if (widthLabel) {
        otherProps.labelCol = { flex: widthLabel };
      }

      if (item.formItem.type === 'switch' || item.formItem.type === 'checkbox') {
        otherProps.valuePropName = 'checked';
      }
      if (item.formItem.type === 'hidden') {
        otherProps.hidden = true;
      }
      if (item.formItem.type === 'select' || item.formItem.type === 'upload') {
        otherProps.validateTrigger = 'onChange';
      }

      return item.formItem.type !== 'addable' ? (
        <Form.Item {...otherProps}>{generateInput(item.formItem, item, values, index)}</Form.Item>
      ) : (
        generateInput(item.formItem, item, values, index)
      );
    }
    return null;
  };

  const handFinish = (values) => {
    values = convertFormValue(columns, values);
    handSubmit && handSubmit(values);
  };

  return (
    <Form
      className={className}
      form={form}
      layout={!widthLabel ? 'vertical' : 'horizontal'}
      onFinishFailed={(failed) =>
        failed?.errorFields?.length && form?.scrollToField(failed?.errorFields[0].name, { behavior: 'smooth' })
      }
      onFinish={handFinish}
      initialValues={convertFormValue(columns, values, false)}
      onValuesChange={async (objValue) => {
        onFirstChange(objValue);
        if (form && checkHidden) {
          clearTimeout(timeout.current);
          timeout.current = setTimeout(async () => {
            for (const key in objValue) {
              if (Object.prototype.hasOwnProperty.call(objValue, key)) {
                columns.filter((_item) => _item.name === key);
              }
            }
            refLoad.current = false;
            set_columns(columns);
            await handleFilter({ ...values, ...form.getFieldsValue() });
          }, 500);
        }
      }}
    >
      <div
        className={
          'sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12' +
          'lg:col-span-1 lg:col-span-2 lg:col-span-3 lg:col-span-4 lg:col-span-5 lg:col-span-6 lg:col-span-7 lg:col-span-8 lg:col-span-9 lg:col-span-10 lg:col-span-11 lg:col-span-12 hidden'
        }
      />
      <div className={'group-input'}>
        <div className={'grid gap-x-5 grid-cols-12'}>
          {_columns.map(
            (column, index) =>
              (!column?.formItem?.condition || !!column?.formItem?.condition(values[column.name], form)) && (
                <div
                  className={classNames(
                    column?.formItem?.classItem,
                    'col-span-12' +
                      (' sm:col-span-' +
                        (column?.formItem?.colTablet
                          ? column?.formItem?.colTablet
                          : column?.formItem?.col
                          ? column?.formItem?.col
                          : 12)) +
                      (' lg:col-span-' + (column?.formItem?.col ? column?.formItem?.col : 12)),
                  )}
                  key={index}
                >
                  {generateForm(column, index)}
                </div>
              ),
          )}
        </div>

        {extendForm && extendForm(values)}
      </div>

      <div className={classNames('flex', classGroupButton)}>
        {extendButton && extendButton(values)}
        {isShowCancel && (
          <button
            className="bg-blue-500 text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1"
            type="reset"
          >
            {t(textCancel)}
          </button>
        )}
        {textSubmit && (
          <button
            className={classNames('text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1', {
              'bg-blue-500': !disableSubmit,
              'bg-blue-400': disableSubmit,
            })}
            id={idSubmit}
            type={form ? 'button' : 'submit'}
            onClick={() => form && form.submit()}
            disabled={disableSubmit}
          >
            {textSubmit}
          </button>
        )}
      </div>
    </Form>
  );
};
export default Component;
