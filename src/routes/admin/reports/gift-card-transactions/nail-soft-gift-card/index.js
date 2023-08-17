import { Space, Select, DatePicker } from 'antd';
import { ColumnsNailSoftGiftCard } from 'columns/gift-card-transactions';
import { DataTable } from 'components';
import { useAuth } from 'globalContext';
import { Button } from 'layouts/components';
import ReportService from 'services/reports';
import React, { Fragment, useRef, useState } from 'react';
import moment from 'moment';

const TIME_OPTIONS = [
  {
    id: 1,
    value: 'today',
    label: 'Today',
  },
  {
    id: 2,
    value: 'yesterday',
    label: 'Yesterday',
  },
  {
    id: 3,
    value: 'thisWeek',
    label: 'This Week',
  },
  {
    id: 4,
    value: 'lastWeek',
    label: 'Last Week',
  },
  {
    id: 5,
    value: 'thisMonth',
    label: 'This Month',
  },
  {
    id: 6,
    value: 'lastMonth',
    label: 'Last Month',
  },
  {
    id: 7,
    value: 'custom',
    label: 'Custom',
  },
];

const NailSoftGiftCard = ({ id }) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const { permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [custom, setCustom] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);

  const dataTableRef = useRef();

  const resetFilter = async () => {
    setTimeRange('thisMonth');
    setCustom([]);

    if (dataTableRef?.current) {
      dataTableRef?.current?.onChange &&
        (await dataTableRef?.current?.onChange({
          ...dataTableRef?.current?.params,
          quickFilter: 'thisMonth',
        }));
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    const data = await ReportService.exportGiftCardTransactions(dataTableRef?.current?.params, 'consumer_card');
    if (data) {
      window.open(data);
    }
    setIsLoading(false);
  };

  const handleChangeDatePicker = async (values) => {
    setCustom(values);
    if (dataTableRef?.current) {
      dataTableRef?.current?.onChange &&
        (await dataTableRef?.current?.onChange({
          ...dataTableRef?.current?.params,
          timeStart: moment(values[0]).format('L'),
          timeEnd: moment(values[1]).format('L'),
        }));
    }
  };

  const handleChangeSelect = async (value) => {
    setTimeRange(value);
    if (dataTableRef?.current && dataTableRef?.current.onChange) {
      let filter = {
        quickFilter: value,
      };
      if (value === 'custom') {
        filter = {
          ...filter,
          timeStart: moment(custom[0]).format('L'),
          timeEnd: moment(custom[1]).format('L'),
        };
      } else {
        setCustom([new Date(year, month, 1), new Date(year, month + 1, 0)]);
      }
      await dataTableRef?.current?.onChange({
        ...dataTableRef?.current?.params,
        ...filter,
      });
    }
  };

  const rightHeader = (
    <Space>
      {!!permission && (
        <Fragment>
          <div className="flex gap-3">
            <div className="flex items-center flex-wrap">
              <div className="flex items-center mr-2">
                <p className="mr-2 text-black font-medium">Time Range</p>
                <Select value={timeRange} onChange={(value) => handleChangeSelect(value)} className="min-w-[130px]">
                  {TIME_OPTIONS.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.value}>
                        {item.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              {timeRange === 'custom' && (
                <div className="flex items-center">
                  <p className="text-black font-medium mr-2">From To</p>
                  <DatePicker.RangePicker
                    defaultValue={[moment(custom[0]), moment(custom[1])]}
                    onChange={(e) => handleChangeDatePicker(e)}
                    className="w-[260px]"
                    format={'MM/DD/YYYY'}
                    allowClear={false}
                  />
                </div>
              )}
            </div>
            <Button type={'ok'} onClick={resetFilter} name="Reset" />
            <Button type={'ok'} onClick={handleExport} name="Export" moreClass="w-[120px]" />
          </div>
        </Fragment>
      )}
    </Space>
  );

  return (
    <Fragment>
      <DataTable
        ref={dataTableRef}
        save={false}
        xScroll={'100%'}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        id={() => id}
        Get={async (params) => {
          return ReportService.getGiftCardTransactions(params, 'consumer_card');
        }}
        columns={ColumnsNailSoftGiftCard()}
        rightHeader={rightHeader}
        classHeader="flex-col space-y-2 xl:flex-row xl:space-y-0"
      />
    </Fragment>
  );
};

export default NailSoftGiftCard;
