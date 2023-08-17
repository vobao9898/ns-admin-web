import { ColumnsGiftCardSold } from 'columns/reports';
import { HookDataTable } from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import ReportService from 'services/reports';
import { Select, DatePicker } from 'antd';
import { useNavigate, useLocation } from 'react-router';
import { routerLinks } from 'utils';
import { Button, Title } from 'layouts/components';
import moment from 'moment';

const GiftCardSold = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(state?.timeRange ? state?.timeRange : 'thisMonth');
  const [timeStart, setTimeStart] = useState(state?.timeStart ? state?.timeStart : '');
  const [timeEnd, setTimeEnd] = useState(state?.timeEnd ? state?.timeEnd : '');
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const changeTable = useCallback(async (parmas) => {
    setIsLoading(true);
    handleChange && (await handleChange(parmas));
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   if (typeof paramsTable?.filter === 'string') {
  //     const initTimeRange = JSON.parse(paramsTable?.filter).quickFilter;
  //     const initTimeStart = JSON.parse(paramsTable?.timeStart);
  //     const initTimeEnd = JSON.parse(paramsTable?.timeEnd);
  //     setTimeRange(initTimeRange);
  //     setTimeStart(initTimeStart);
  //     setTimeEnd(initTimeEnd);

  //     paramsTable.quickFilter = initTimeRange;
  //     paramsTable.timeStart = initTimeStart;
  //     paramsTable.timeEnd = initTimeEnd;
  //     changeTable(paramsTable);
  //   }
  //   else
  //   {
  //     paramsTable.quickFilter = paramsTable?.filter?.quickFilter;
  //     paramsTable.timeStart = paramsTable?.filter?.timeStart;
  //     paramsTable.timeEnd = paramsTable?.filter?.timeEnd;
  //     changeTable(paramsTable);
  //   }
  // }, []);

  useEffect(() => {
    paramsTable.filter = {
      quickFilter: timeRange,
      timeStart,
      timeEnd,
    };

    paramsTable.quickFilter = timeRange;
    paramsTable.timeStart = timeStart;
    paramsTable.timeEnd = timeEnd;
    changeTable(paramsTable);
  }, [changeTable, timeRange, timeStart, timeEnd]);

  const resetFilter = () => {
    setTimeRange('thisMonth');
    setTimeStart(new Date(year, month, 1));
    setTimeEnd(new Date(year, month + 1, 0));
  };

  const datePickerHandle = (value) => {
    const [start, end] = value;
    setTimeStart(start.format('L'));
    setTimeEnd(end.format('L'));
  };

  const changeTimeRange = (value) => {
    setTimeRange(value);
    setTimeStart(new Date(year, month, 1));
    setTimeEnd(new Date(year, month + 1, 0));
  };

  const subHeader = (
    <div className="mb-5 ml-5 flex items-center flex-wrap">
      <div className="flex items-center mr-5 mb-3">
        <p className="mr-2 text-black font-medium">Time Range</p>
        <Select
          value={timeRange}
          onChange={(value) => {
            if (value === 'custom') {
              setTimeStart(moment(firstDay).format('MM/DD/YYYY'));
              setTimeEnd(moment(lastDay).format('MM/DD/YYYY'));
            }
            changeTimeRange(value);
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
        <div className="mr-5 flex items-center mb-3">
          <p className="text-black font-medium mr-2">From To</p>
          <DatePicker.RangePicker
            defaultValue={[moment(timeStart), moment(timeEnd)]}
            onChange={(e) => datePickerHandle(e)}
            className="w-[260px]"
            format="MM/DD/YYYY"
          />
        </div>
      )}

      <Button name="Reset" type="ok" onClick={() => resetFilter()} moreClass="mb-3" />
    </div>
  );

  const [handleChange, GiftCardSoldTable, paramsTable] = HookDataTable({
    columns: ColumnsGiftCardSold(),
    id: () => timeRange,
    Get: async (params, id) => {
      const res = await ReportService.getGiftCardSolds(params);
      return res;
    },
    isLoading,
    setIsLoading,
    subHeader: () => subHeader,
    onRow: (item) => {
      return {
        onClick: () => {
          if (item?.date?.indexOf('Total') === -1) {
            navigate(`${routerLinks('Gift Card Sold')}/${item.merchantId}`, {
              state: { date: item?.date, timeRange, timeStart, timeEnd },
            });
          }
        },
      };
    },

    searchPlaceholder: 'Search...',
  });

  const bread = [
    {
      name: 'Reports',
    },
    {
      name: 'Gift Card Sold',
    },
  ];

  return (
    <div className="grid">
      <Title title="Gift Card Sold" breadcrumbs={bread} />

      <div className="mb-5 p-4 shadow rounded-xl bg-gray-50">{GiftCardSoldTable()}</div>
    </div>
  );
};

export default GiftCardSold;
