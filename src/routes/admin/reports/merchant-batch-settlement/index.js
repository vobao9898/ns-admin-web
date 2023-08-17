import { Select, DatePicker } from 'antd';
import { ColumnsMerchantBatchSettlement } from 'columns/reports';
import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ReportService from 'services/reports';
import { routerLinks } from 'utils';
import { Title, Button } from 'layouts/components';
import moment from 'moment';

const MerchantBatchSettlement = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(state?.timeRange ? state?.timeRange : 'thisMonth');
  const [timeStart, setTimeStart] = useState(state?.timeStart ? state?.timeStart : '');
  const [timeEnd, setTimeEnd] = useState(state?.timeEnd ? state?.timeEnd : '');

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  useEffect(() => {
    onChange && onChange();
  }, [timeRange, timeStart, timeEnd]);

  const resetFilter = () => {
    setTimeRange('thisMonth');
    setTimeStart('');
    setTimeEnd('');
  };

  const datePickerHandle = (value) => {
    const [start, end] = value;
    setTimeStart(start.format('L'));
    setTimeEnd(end.format('L'));
  };

  const subHeader = (
    <div className="mb-5 flex items-center">
      <div className="flex items-center mr-5">
        <p className="mr-2 text-black font-medium">Time Range</p>
        <Select
          value={timeRange}
          onChange={(value) => {
            if (value === 'custom') {
              setTimeStart(moment(firstDay).format('MM/DD/YYYY'));
              setTimeEnd(moment(lastDay).format('MM/DD/YYYY'));
            }
            setTimeRange(value);
          }}
          className="min-w-[130px]"
        >
          <Select.Option value="today">Today</Select.Option>
          <Select.Option value="yesterday">Yesterday</Select.Option>
          <Select.Option value="thisWeek">This Week</Select.Option>
          <Select.Option value="lastWeek">Last Week</Select.Option>
          <Select.Option value="thisMonth">This Month</Select.Option>
          <Select.Option value="lastMonth">Last Month</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
      </div>

      {timeRange === 'custom' && (
        <div className="mr-5 flex items-center">
          <p className="text-black font-medium mr-2">From To</p>
          <DatePicker.RangePicker
            defaultValue={[moment(timeStart), moment(timeEnd)]}
            onChange={(e) => datePickerHandle(e)}
            className="w-[260px]"
            format="MM/DD/YYYY"
          />
        </div>
      )}

      <Button name="Reset" type="ok" onClick={() => resetFilter()} />
    </div>
  );

  const [onChange, TransactionsTable] = HookDataTable({
    columns: ColumnsMerchantBatchSettlement(),
    Get: async (params, id) => {
      params = {
        ...params,
        quickFilter: timeRange,
        timeStart,
        timeEnd,
      };
      const res = await ReportService.getMerchantBatchSettlements(params);
      return res;
    },
    isLoading,
    setIsLoading,
    searchPlaceholder: 'Search...',
    rightHeader: (
      <Button
        name="Close Settlement"
        type="ok"
        moreClass="mr-2"
        onClick={() => navigate(routerLinks('Merchant Batch Settlement') + '/close')}
      />
    ),
    subHeader: () => subHeader,
    onRow: (item) => {
      return {
        onClick: () => {
          if (item?.settlementId !== -1) {
            navigate(`${routerLinks('Merchant Batch Settlement')}/${item.settlementId}-${item?.merchantId}`, {
              state: { timeRange, timeStart, timeEnd },
            });
          }
        },
      };
    },
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Batchs',
    },
  ];

  return (
    <>
      <Title title="Merchant Batch Settlement" breadcrumbs={bread} />
      <div className="p-4 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
        <div className="w-full overflow-hidden">{TransactionsTable()}</div>
      </div>
    </>
  );
};

export default MerchantBatchSettlement;
