import React, { Fragment, useState } from 'react';
import { Form, Checkbox } from 'antd';
import classNames from 'classnames';

const Component = ({ name, column = [], generateForm, form, isTable = true, idCheck }) => {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const onCheckAllChange = (e) => {
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    const array = form.getFieldValue(name).map((item) => {
      item[idCheck + 'Checked'] = e.target.checked;
      return item;
    });
    setCheckedList(e.target.checked ? array.map((item) => item[idCheck]) : []);
    form.setFieldValue(name, array);
  };
  const onCheckChange = (e, array, index) => {
    if (e.target.checked) {
      checkedList.push(array[index][idCheck]);
      setIndeterminate(array.length !== checkedList.length);
      if (array.length === checkedList.length) {
        setCheckAll(true);
      }
    } else {
      checkedList.splice(checkedList.indexOf(array[index][idCheck]), 1);
      setCheckAll(false);
      setIndeterminate(checkedList.length !== 0);
    }
    setCheckedList(checkedList);
    array[index][idCheck + 'Checked'] = e.target.checked;
    if (form.setFieldValue) {
      form.setFieldValue(name, array);
    }
  };
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) =>
        isTable ? (
          <Fragment>
            <div className={'table w-full border-collapse addable'} style={{ minWidth: column.length * 150 }}>
              <div className="table-row">
                {!!idCheck && (
                  <div className={'table-cell font-bold p-1 text-center w-10'}>
                    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} />
                  </div>
                )}
                <div className={'table-cell border bg-gray-300 font-bold p-1 text-center w-10'}>STT</div>
                {column.map((col, index) => (
                  <div
                    key={index}
                    className={classNames('table-cell border bg-gray-300 font-bold p-1 text-center', {
                      'w-full': column.length === 1,
                      'w-1/2': column.length === 2,
                      'w-1/3': column.length === 3,
                      'w-1/4': column.length === 4,
                      'w-1/5': column.length === 5,
                      'w-1/6': column.length === 6,
                    })}
                  >
                    {col.title}
                  </div>
                ))}
                <div className={'w-8 h-1'} />
              </div>
              {fields.map(({ key, name: n, ...restField }, i) => (
                <div className="table-row" key={i}>
                  {!!idCheck && (
                    <div className={'table-cell text-center'}>
                      <Checkbox
                        onChange={(e) => onCheckChange(e, form.getFieldValue(name), n)}
                        checked={checkedList.indexOf(form.getFieldValue(name)[n][idCheck]) > -1}
                      />
                    </div>
                  )}
                  <div className={'table-cell border bg-gray-300 text-center'}>{i + 1}</div>
                  {column.map((col, index) => (
                    <div className={'table-cell border relative'} key={index}>
                      {generateForm(col, index + '_' + i, false, [n, col.name])}
                    </div>
                  ))}
                  <div className={'table-cell align-middle w-12 sm:w-8'}></div>
                </div>
              ))}
            </div>
            <div className={'flex justify-end btn-add'}></div>
          </Fragment>
        ) : (
          <div className={'addable'}>
            {fields.map(({ key, name: n, ...restField }, i) => (
              <div className={'grid gap-x-5 grid-cols-12'} key={i}>
                {column.map((col, index) => (
                  <div
                    className={classNames(
                      col?.formItem?.classItem,
                      'col-span-12' +
                        (' sm:col-span-' +
                          (col?.formItem?.colTablet
                            ? col?.formItem?.colTablet
                            : col?.formItem?.col
                            ? col?.formItem?.col
                            : 12)) +
                        (' lg:col-span-' + (col?.formItem?.col ? col?.formItem?.col : 12)),
                    )}
                    key={index}
                  >
                    {generateForm(col, index + '_' + i, true, [n, col.name])}
                  </div>
                ))}
                <div className={'table-cell align-middle w-8'}></div>
              </div>
            ))}
            <div className={'flex justify-end'}></div>
          </div>
        )
      }
    </Form.List>
  );
};
export default Component;
