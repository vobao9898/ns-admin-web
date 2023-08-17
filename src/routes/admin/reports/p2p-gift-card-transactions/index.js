import { Select, DatePicker, Slider, Spin } from 'antd';
import { ColumnsGiftCardTransaction } from 'columns/reports';
import { HookDataTable } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import ReportService from 'services/reports';
import { Button, Title } from 'layouts/components';
import moment from 'moment';

const P2PTransactionGiftCard = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [amountRange, setAmountRange] = useState([0, 2000]);
  const [custom, setCustom] = useState([moment(new Date(year, month, 1)), moment(new Date(year, month + 1, 0))]);

  const changeTable = useCallback(async (params) => {
    handleChange && (await handleChange(params));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (paramsTable?.filter) {
      setTimeRange(paramsTable?.filter?.quickFilter);
      setCustom([moment(paramsTable?.filter?.timeStart), moment(paramsTable?.filter?.timeEnd)]);
      setAmountRange([paramsTable?.filter?.amountFrom, paramsTable?.filter?.amountTo]);

      paramsTable.quickFilter = paramsTable?.filter?.quickFilter;
      paramsTable.timeStart = paramsTable?.filter?.timeStart;
      paramsTable.timeEnd = paramsTable?.filter?.timeEnd;
      paramsTable.amountFrom = paramsTable?.filter?.amountFrom;
      paramsTable.amountTo = paramsTable?.filter?.amountTo;
      changeTable(paramsTable);
    }
  }, []);

  useEffect(() => {
    paramsTable.filter = {
      quickFilter: timeRange,
      timeStart: custom && custom[0],
      timeEnd: custom && custom[1],
      amountFrom: amountRange[0],
      amountTo: amountRange[1],
    };
    paramsTable.quickFilter = timeRange;
    paramsTable.timeStart = custom && custom[0];
    paramsTable.timeEnd = custom && custom[1];
    paramsTable.amountFrom = amountRange[0];
    paramsTable.amountTo = amountRange[1];
    setIsLoading(true);
    changeTable(paramsTable);
  }, [changeTable, timeRange, custom, amountRange]);

  const resetFilter = () => {
    setTimeRange('thisMonth');
    setCustom([moment(new Date(year, month, 1)), moment(new Date(year, month + 1, 0))]);
    setAmountRange([0, 2000]);
  };

  const subHeader = (
    <div className="mb-5 flex items-center flex-wrap">
      <div className="mb-3 flex items-center mr-5">
        <p className="mr-2 text-black font-medium">Time Range</p>
        <Select value={timeRange} onChange={(value) => setTimeRange(value)} className="min-w-[130px]">
          <Select.Option value="today">Today</Select.Option>
          <Select.Option value="yesterday">Yesterday</Select.Option>
          <Select.Option value="thisWeek">This Week</Select.Option>
          <Select.Option value="lastWeek">Last Week</Select.Option>
          <Select.Option value="thisMonth">This Month</Select.Option>
          <Select.Option value="lastMonth">Last Month</Select.Option>
          <Select.Option value="all">Custom</Select.Option>
        </Select>
      </div>

      {timeRange === 'all' && (
        <div className="mb-3 mr-5 flex items-center">
          <p className="text-black font-medium mr-2">From To</p>
          <DatePicker.RangePicker
            defaultValue={custom}
            onChange={(e) => setCustom(e)}
            className="w-[260px]"
            format="MM/DD/YYYY"
          />
        </div>
      )}

      <div className="mb-3 mr-5 flex items-center">
        <p className="mr-2 text-black font-medium">Amount Range</p>
        <Slider
          className="w-[150px]"
          min={0}
          max={2000}
          range
          value={amountRange}
          onChange={(e) => setAmountRange(e)}
        />
        <p className="ml-2">
          [{amountRange[0]} - {amountRange[1]}]
        </p>
      </div>

      <Button name="Reset" type="ok" onClick={() => resetFilter()} moreClass="ml-auto" />
    </div>
  );

  const [handleChange, TransactionsTable, paramsTable] = HookDataTable({
    columns: ColumnsGiftCardTransaction(),
    id: () => ({
      quickFilter: timeRange,
      timeStart: custom && custom[0],
      timeEnd: custom && custom[1],
      amountFrom: amountRange[0],
      amountTo: amountRange[1],
    }),
    Get: ReportService.getTransactionsGiftCard,
    isLoading,
    setIsLoading,
    subHeader: () => subHeader,
    searchPlaceholder: 'Search...',
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Consumer Reload Gift Card',
    },
  ];

  return (
    <Spin spinning={false}>
      <Title title="Consumer Reload Gift Card" breadcrumbs={bread} />

      <div className="p-4 rounded-xl shadow bg-gray-50">{TransactionsTable()}</div>
    </Spin>
  );
};

export default P2PTransactionGiftCard;
