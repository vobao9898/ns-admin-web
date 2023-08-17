import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 } from 'uuid';
import { smoothDnD } from './smooth-dnd';
import { Pagination, Spin } from 'components';
import { useLocation, useNavigate } from 'react-router';
import { getQueryStringParams } from '../../utils';
import { useTranslation } from 'react-i18next';
import chartDown from '../../assets/images/chartDown.png';
// import chartTop from '../../assets/images/chartTop/png';
const Component = ({
  idRequest,
  Get,
  Put,
  ChangeColumn,
  allowSetStatus = true,
  renderItem = (subItem) => <strong>{subItem.task_name}</strong>,
  isMoveColumn = true,
  widthCard = 300,
  showPagination = true,
  pageIndex = 'page',
  pageSize = 'perPage',
  idElement = 'trello',
  paginationDescription = (from, to, total) => from + '-' + to + ' of ' + total + ' items',
  pageSizeOptions = [10, 20, 30, 40],
  pageSizeRender = (sizePage) => sizePage + ' / page',
  pageSizeWidth = '115px',
  save = true,
  defaultRequest = {},
  showSearch = true,
  fullTextSearch = 'fullTextSearch',
  searchPlaceholder,
  name=null,
}) => {
  const listData = useRef([]);
  const [idTable] = useState('temp-' + v4());
  const [id] = useState(v4());
  const [isLoading, set_isLoading] = useState(true);
  const domListData = useRef([]);
  const listStatus = useRef([]);
  const [totalData, setTotalData] = useState(10);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const timeout = useRef();
  const param = useRef(
    localStorage.getItem(idTable)
      ? JSON.parse(localStorage.getItem(idTable))
      : {
          [pageIndex]: 1,
          [pageSize]: 10,
          ...defaultRequest,
        },
  );

  const params =
    save && location.search && location.search.indexOf('=') > -1
      ? { ...param.current, ...getQueryStringParams(location.search) }
      : param.current;

  const mounted = useRef(false);
  const initFunction = useCallback(
    async (params) => {
      navigate(location.pathname + '?' + new URLSearchParams(params).toString());
      domListData.current.map((item) => item.dispose());
      domListData.current = [];
      set_isLoading(true);
      const { data, count } = await Get(params, idRequest, name);
      listData.current = data || [];
      setTotalData(count);
      set_isLoading(false);

      let _removedIndex = null;
      let _removedIndexColumn = null;
      let _addedIndex = null;
      let _addedIndexColumn = null;
      const divId = document.getElementById(id);

      if (divId) {
        data.map((item, indexData) => {
          listStatus.current.push({ value: item.id, label: item.name });
          if (item.allowActions?.allowEdit) {
            const childId = document.getElementById(item.id);
            if (childId) {
              domListData.current[item.id] = smoothDnD(document.getElementById(item.id), {
                groupName: id,
                getChildPayload: (index) => index,
                lockAxis: allowSetStatus ? undefined : 'xy',
                onDrop: async ({ removedIndex, addedIndex }) => {
                  if (allowSetStatus) {
                    if (removedIndex !== null) {
                      _removedIndex = removedIndex;
                      _removedIndexColumn = indexData;
                    }
                    if (addedIndex !== null) {
                      _addedIndex = addedIndex;
                      _addedIndexColumn = indexData;
                    }
                    if (_removedIndex !== null && _addedIndex !== null) {
                      const _item = {
                        ...listData.current[_removedIndexColumn].tasks[_removedIndex],
                      };
                      listData.current[_removedIndexColumn].tasks.splice(_removedIndex, 1);
                      listData.current[_addedIndexColumn].tasks.splice(_addedIndex, 0, _item);
                      _removedIndex = null;
                      _addedIndex = null;
                      document.getElementById(id + '-task-' + listData.current[_removedIndexColumn].id).textContent =
                        listData.current[_removedIndexColumn].tasks.length;
                      document.getElementById(id + '-task-' + listData.current[_addedIndexColumn].id).textContent =
                        listData.current[_addedIndexColumn].tasks.length;
                      !!Put && (await Put(_item.id, listData.current[_addedIndexColumn].id));
                    }
                  }
                },
              });
            }
          }
          return item;
        });
      }
      setTimeout(async () => {
        if (divId) {
          smoothDnD(divId, {
            orientation: 'horizontal',
            dragHandleSelector: '.move-drag',
            getChildPayload: (index) => index,
            onDrop: async ({ addedIndex, payload }) => {
              const column = data[payload];
              data.splice(payload, 1);
              data.splice(addedIndex, 0, column);
              !!ChangeColumn &&
                (await ChangeColumn(
                  idRequest,
                  data.map((item, index) => ({ id: item.id, position: index })),
                ));
            },
          });
        }
      });
    },
    [ChangeColumn, Get, Put, allowSetStatus, id, idRequest],
  );

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      initFunction(params);
    }
  }, []);

  return (
    <Spin spinning={isLoading}>
      <div className="flex justify-between mb-2.5">
        {!!showSearch && (
          <div className="relative">
            <input
              id={idElement + '_input_search'}
              className="w-52 h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4"
              defaultValue={params.fullTextSearch}
              type="text"
              placeholder={searchPlaceholder || t('components.datatable.pleaseEnterValueToSearch')}
              onChange={(event) => {
                clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                  params[fullTextSearch] = event.target.value;
                  initFunction(params);
                }, 500);
              }}
            />
            <i className="text-lg las la-search absolute top-1.5 right-3 z-10" />
          </div>
        )}
      </div>
      {!isLoading && (
        <div className={'overflow-x-auto'}>
          <div
            id={id}
            className="drag-horizontal"
            style={{ minWidth: listData.current.length * widthCard + 'px', minHeight: '200px' }}
          >
            {listData.current.map((item) => (
              <div
                className="group-card"
                style={{ backgroundColor: item.backgroundColor, width: widthCard, marginRight: name === 'dashboard' ? '10px' : 0, borderRadius: name === 'dashboard' ? '8px':'0px', overflow: 'hidden'}}
                key={item.id}
              >
                <div className="flex justify-between p-2">
                  <h3 style={{ color: item.frontColor , width: name === 'dashboard'?'100%':'auto', textAlign: name === 'dashboard'?'center':'left', fontSize: name === 'dashboard' ? '16px': '13px', padding: name === 'dashboard' ? '10px 0': '0', fontWeight: name === 'dashboard' ? 'bold' : 'normal'}}>
                    {item.name} {name === 'dashboard' ? "":(<span id={id + '-task-' + item.id}>{item.tasks.length}</span>)}
                  </h3>
                  {isMoveColumn && item?.allowActions?.allowEdit && (
                    <i style={{ color: "#fff" }} className="move-drag las  la-lg la-arrows-alt flex items-center" />
                  )}
                </div>
                {name === 'dashboard' ? (
                  <div id={item.id} className="drag-vertical" style={{background: '#fff', textAlign:"center", fontSize:'28px', padding: '20px 0', fontWeight: 'bold', paddingTop: '30px'}}>
                   {item?.tasks?.length}
                  </div>
                ) : (
                  <div id={item.id} className="drag-vertical">
                    {item.tasks.map((subItem, subIndex) => renderItem(item, subItem, subIndex))}
                  </div>
                )}
                {name === 'dashboard' ? (
                  <div id={item.id} className="drag-vertical flex justify-content" style={{background: '#fff', fontSize:'15px', paddingBottom: "20px", display: "flex", justifyContent:'center'}}>
                      <div className='flex justify-content'>
                          <div className='flex justify-content items-center' style={{color: '#f44538'}}><img src={chartDown} alt="" width={25} height={25} className="mr-1"/>20%</div>
                          <div className='ml-2 flex items-center'>previous day</div>
                      </div>
                  </div>
                ) : (
                  <div id={item.id} className="drag-vertical">
                    {item.tasks.map((subItem, subIndex) => renderItem(item, subItem, subIndex))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showPagination && (
        <Pagination
          total={totalData}
          pageIndex={+params[pageIndex]}
          pageSize={+params[pageSize]}
          pageSizeOptions={pageSizeOptions}
          pageSizeRender={pageSizeRender}
          pageSizeWidth={pageSizeWidth}
          queryParams={(pagination) => {
            params[pageIndex] = pagination.current;
            params[pageSize] = pagination.pageSize;
            initFunction(params);
          }}
          paginationDescription={paginationDescription}
          idElement={idElement}
        />
      )}
    </Spin>
  );
};
export default Component;
