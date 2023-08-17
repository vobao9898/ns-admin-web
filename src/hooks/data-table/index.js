import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { v4 } from 'uuid';
import { Table, Radio, Checkbox, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';
import { Resizable } from 'react-resizable';

import { Pagination } from 'components';
import { checkTextToShort, cleanObjectKeyNull, getQueryStringParams } from 'utils';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const ResizableTitle = (props) => {
  const { onResize, width, minWidth, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      minConstraints={[minWidth, 0]}
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const Hook = ({
  isLoading,
  setIsLoading,
  Get,
  id = () => true,
  showList = true,
  footer,
  defaultRequest = {},
  pageIndex = 'page',
  pageSize = 'perPage',
  sort = 'sorts',
  filter = 'filter',
  fullTextSearch = 'fullTextSearch',
  columns = [],
  loading = false,
  showPagination = true,
  leftHeader,
  rightHeader,
  showSearch = true,
  save = true,
  searchPlaceholder,
  subHeader,
  xScroll = '100%',
  yScroll = null,
  emptyText = <div>No Data</div>,
  loadFirst = true,
  onRow = () => {},
  pageSizeOptions = [10, 20, 30, 40],
  pageSizeRender = (sizePage) => sizePage + ' / page',
  pageSizeWidth = '115px',
  paginationDescription = (from, to, total) => from + '-' + to + ' of ' + total + ' items',
  idElement = 'temp-' + v4(),
  className = 'data-table',
  ...prop
}) => {
  const [idTable] = useState('temp-' + v4());
  const idE = useRef(idElement);
  const [objData, setObjData] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const param = useRef(
    localStorage.getItem(idTable)
      ? JSON.parse(localStorage.getItem(idTable))
      : {
          [pageIndex]: 1,
          [pageSize]: 10,
          ...defaultRequest,
        },
  );
  const timeoutSearch = useRef();
  const cols = useRef();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      localStorage.removeItem(idTable);
    };
  }, [idTable]);

  const onChange = useCallback(
    async (request) => {
      if (request) {
        localStorage.setItem(idTable, JSON.stringify(request));
        param.current = { ...request };
        if (save) {
          if (request[sort] && typeof request[sort] === 'object') {
            request[sort] = JSON.stringify(request[sort]);
          }
          if (request[filter] && typeof request[filter] === 'object') {
            request[filter] = JSON.stringify(request[filter]);
          }
          navigate(location.pathname + '?' + new URLSearchParams(request).toString());
        }
      } else if (localStorage.getItem(idTable)) {
        param.current = JSON.parse(localStorage.getItem(idTable));
      }

      if (showList && Get) {
        setIsLoading && setIsLoading(true);
        const { data, count, ...prop } = await Get(param.current, id());
        if (data.length === 0 && param.current[pageIndex] > 1) {
          await onChange({
            ...param.current,
            page: param.current[pageIndex] - 1,
          });
        } else {
          setObjData(prop);
          setDataSource(data);
          setTotalData(count);
          setIsLoading && setIsLoading(false);
        }
      } else {
        setIsLoading && setIsLoading(false);
      }
    },
    [Get, id, idTable, pageIndex, setIsLoading, showList],
  );

  const params =
    save && location.search && location.search.indexOf('=') > -1
      ? { ...param.current, ...getQueryStringParams(location.search) }
      : param.current;

  if (params[filter] && typeof params[filter] === 'string') {
    params[filter] = JSON.parse(params[filter]);
  }
  if (params[sort] && typeof params[sort] === 'string') {
    params[sort] = JSON.parse(params[sort]);
  }

  const mount = useRef(false);
  const handleSearch = useCallback(async () => {
    if (loadFirst) {
      const _params = {
        ...params,
        [sort]: JSON.stringify(params[sort]),
        [filter]: JSON.stringify(params[filter]),
      };
      await onChange(cleanObjectKeyNull(_params));
    }
  }, [filter, fullTextSearch, loadFirst, onChange, pageIndex, pageSize, params, save, sort]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      handleSearch();
    }
  }, [mount, handleSearch, location.search, showList]);

  const groupButton = (confirm, clearFilters, key, value) => (
    <div className="grid grid-cols-2 gap-1">
      <button
        type={'button'}
        className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white"
        onClick={() => clearFilters()}
      >
        {t('components.datatable.reset')}
      </button>
      <button
        type={'button'}
        className="bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-400 inline-flex items-center"
        onClick={() => confirm(value)}
      >
        <i className="las la-search mr-1" />
        {t('components.datatable.search')}
      </button>
    </div>
  );
  const ref = useRef();
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchInput = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-1">
        <input
          className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4 mb-1"
          value={selectedKeys}
          type="text"
          placeholder={t('components.datatable.pleaseEnterValueToSearch')}
          onChange={(e) => setSelectedKeys(e.target.value)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </div>
    ),
    filterIcon: (filtered) => <i className="las la-lg la-search" style={{ color: filtered ? '#3699FF' : undefined }} />,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => ref.current.select());
      }
    },
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchRadio = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <RadioGroup options={filters} value={selectedKeys} onChange={(e) => setSelectedKeys(e.target.value + '')} />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-dot-circle" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchCheckbox = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <CheckboxGroup options={filters} value={selectedKeys} onChange={(e) => setSelectedKeys(e)} />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-check-square" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  // noinspection JSUnusedGlobalSymbols
  const getColumnSearchDate = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <RangePicker
          renderExtraFooter={() => (
            <button
              type={'button'}
              className="bg-blue-100 w-full px-3 py-1 rounded-xl hover:bg-blue-500 hover:text-white"
              onClick={() => document.activeElement.blur()}
            >
              {t('components.datatable.ok')}
            </button>
          )}
          format={['DD/MM/YYYY', 'DD/MM/YY']}
          value={!!selectedKeys && selectedKeys.length ? [moment(selectedKeys[0]), moment(selectedKeys[1])] : []}
          onChange={(e) => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: (filtered) => (
      <i className="las la-lg la-calendar" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  cols.current = columns
    .filter((col) => !!col && !!col.tableItem)
    .map((col, index) => {
      let item = col.tableItem;

      if (item.filter) {
        if (params[filter] && params[filter][col.name]) {
          item = { ...item, defaultFilteredValue: params[filter][col.name] };
        }

        switch (item.filter.type) {
          case 'radio':
            item = {
              ...item,
              ...getColumnSearchRadio(item.filter.list, col.name),
            };
            break;
          case 'checkbox':
            item = {
              ...item,
              ...getColumnSearchCheckbox(item.filter.list, col.name),
            };
            break;
          case 'date':
            item = { ...item, ...getColumnSearchDate(col.name) };
            break;
          default:
            item = { ...item, ...getColumnSearchInput(col.name) };
        }
        delete item.filter;
      }

      if (item.sorter && params[sort] && params[sort][col.name]) {
        item.defaultSortOrder =
          params[sort][col.name] === 'ASC' ? 'ascend' : params[sort][col.name] === 'DESC' ? 'descend' : '';
      }
      if (!item.render) {
        item.render = (text) => checkTextToShort(text);
      }
      if (item.width) {
        item.minWidth = item.width;
      }

      if (item.sorter && params[sort] && params[sort][col.name]) {
        item.defaultSortOrder =
          params[sort][col.name] === 'ASC' ? 'ascend' : params[sort][col.name] === 'DESC' ? 'descend' : '';
      }
      if (!item.render) {
        item.render = (text) => checkTextToShort(text);
      }
      if (item.width) {
        item.minWidth = item.width;
      }

      return {
        title: col.title,
        dataIndex: col.name,
        onHeaderCell: (column) => ({
          minWidth: column.width,
          width: column.width,
          onResize: handleResize(index),
        }),
        ...item,
      };
    });

  const [_columns, set_columns] = useState(cols.current.map((item) => item.width));
  if (_columns.length !== cols.current.length) {
    set_columns(cols.current.map((item) => item.width));
  }

  const handleResize =
    (index) =>
    (_, { size }) => {
      _columns[index] = size.width;
      cols.current[index].width = size.width;
      set_columns([..._columns]);
    };
  const handleTableChange = (pagination, filters = {}, sorts, tempFullTextSearch) => {
    let tempPageIndex = pagination ? pagination.current : params[pageIndex];
    const tempPageSize = pagination ? pagination.pageSize : params[pageSize];

    const tempSort =
      sorts && sorts?.field && sorts?.order
        ? {
            [sorts.field]: sorts.order === 'ascend' ? 'ASC' : sorts.order === 'descend' ? 'DESC' : '',
          }
        : sorts?.field
        ? null
        : sorts;

    if (tempFullTextSearch !== params[fullTextSearch]) {
      tempPageIndex = 1;
    }

    const tempParams = cleanObjectKeyNull({
      ...params,
      [pageIndex]: tempPageIndex,
      [pageSize]: tempPageSize,
      [sort]: tempSort,
      [filter]: cleanObjectKeyNull(filters),
      [fullTextSearch]: tempFullTextSearch,
    });
    onChange && onChange(tempParams);
  };

  return [
    onChange,
    (data, columns) => {
      if (columns) {
        columns = columns.map((col) => ({
          title: col.title,
          dataIndex: col.name,
        }));
      }
      return (
        <div className={classNames(className, 'intro-x')}>
          <div className="flex justify-between mb-2.5">
            {!!showSearch && (
              <div className="relative">
                <input
                  id={idE.current + '_input_search'}
                  className="w-52 h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4"
                  defaultValue={params[fullTextSearch]}
                  type="text"
                  placeholder={searchPlaceholder || t('components.datatable.pleaseEnterValueToSearch')}
                  onChange={() => {
                    clearTimeout(timeoutSearch.current);
                    timeoutSearch.current = setTimeout(() => {
                      handleTableChange(
                        null,
                        params[filter],
                        params[sort],
                        document.getElementById(idE.current + '_input_search').value,
                      );
                    }, 500);
                  }}
                  onKeyPress={(e) => {
                    e.key === 'Enter' &&
                      handleTableChange(
                        null,
                        params[filter],
                        params[sort],
                        document.getElementById(idE.current + '_input_search').value,
                      );
                  }}
                />
                <i
                  className={classNames('text-lg las absolute top-1.5 right-3 z-10', {
                    'la-search': !params[fullTextSearch],
                    'la-times': !!params[fullTextSearch],
                  })}
                  onClick={() => {
                    if (params[fullTextSearch]) {
                      document.getElementById(idE.current + '_input_search').value = '';
                      handleTableChange(null, params[filter], params[sort], null);
                    }
                  }}
                />
              </div>
            )}
            {!!leftHeader && <div>{leftHeader}</div>}
            {!!rightHeader && <div>{rightHeader}</div>}
          </div>
          {subHeader && subHeader(totalData)}
          {!!showList && (
            <Fragment>
              <Table
                components={{
                  header: {
                    cell: ResizableTitle,
                  },
                }}
                onRow={onRow}
                locale={{
                  emptyText: <div className="bg-gray-100 text-gray-400 py-4">{emptyText}</div>,
                }}
                loading={isLoading}
                columns={
                  columns ||
                  _columns.map((item, index) => {
                    if (item) {
                      cols.current[index].width = item;
                    }
                    return cols.current[index];
                  })
                }
                pagination={false}
                dataSource={(data || dataSource).map((item) => ({
                  ...item,
                  key: item.id || v4(),
                }))}
                onChange={(pagination, filters, sorts) =>
                  handleTableChange(null, params[filter], sorts, params[fullTextSearch])
                }
                showSorterTooltip={false}
                scroll={{ x: xScroll, y: yScroll }}
                size="small"
                {...prop}
              />
              {showPagination && (
                <Pagination
                  total={totalData}
                  pageIndex={+params[pageIndex]}
                  pageSize={+params[pageSize]}
                  pageSizeOptions={pageSizeOptions}
                  pageSizeRender={pageSizeRender}
                  pageSizeWidth={pageSizeWidth}
                  queryParams={(pagination) =>
                    handleTableChange(pagination, params[filter], params[sort], params[fullTextSearch])
                  }
                  paginationDescription={paginationDescription}
                  idElement={idE.current}
                  {...prop}
                />
              )}
            </Fragment>
          )}
          {!!footer && <div className="footer">{footer(objData)}</div>}
        </div>
      );
    },
    params,
  ];
};
export default Hook;
