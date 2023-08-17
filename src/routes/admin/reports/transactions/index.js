import { Select, Radio, DatePicker, Slider, Spin } from 'antd';
import { ColumnTransactions } from 'columns/reports';
import { HookDataTable } from 'hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReportService from 'services/reports';
import { Button, Title } from 'layouts/components';
import moment from 'moment';

const Transactions = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const timeoutSearch = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [custom, setCustom] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);
  const [status, setStatus] = useState('-1');
  const [amountRange, setAmountRange] = useState([0, 2000]);
  const [amountRanges, setAmountRanges] = useState([0, 2000]);

  const changeTable = useCallback(async (params) => {
    onChange && (await onChange(params));
    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (paramsTable.filter) {
      setStatus(paramsTable?.filter?.status);
      setTimeRange(paramsTable?.filter?.quickFilter);
      if (paramsTable?.filter?.amountFrom !== '-1') {
        setAmountRange([paramsTable?.filter?.amountFrom, paramsTable?.filter?.amountTo]);
      }

      if (paramsTable?.filter?.quickFilter === 'custom') {
        setCustom([paramsTable?.filter?.timeStart, paramsTable?.filter?.timeEnd]);
      }
    }
  }, []);

  useEffect(() => {
    paramsTable.filter = {
      quickFilter: timeRange,
      status,
      amountFrom: amountRanges[0] === 0 && amountRanges[1] === 2000 ? '-1' : amountRanges[0],
      amountTo: amountRanges[0] === 0 && amountRanges[1] === 2000 ? '-1' : amountRanges[1],
    };
    if (timeRange === 'custom') {
      paramsTable.filter = {
        ...paramsTable?.filter,
        timeStart: moment(custom[0]).format('L'),
        timeEnd: moment(custom[1]).format('L'),
      };
    }

    changeTable(paramsTable);
  }, [changeTable, timeRange, amountRanges, custom, status]);

  useEffect(() => {
    clearTimeout(timeoutSearch.current);
    timeoutSearch.current = setTimeout(() => {
      setAmountRanges(amountRange);
    }, 1000);
  }, [amountRange]);

  const resetFilter = () => {
    setTimeRange('thisMonth');
    setCustom([]);
    setStatus('-1');
    setAmountRange([0, 2000]);
  };
  const subHeader = (
    <div className="">
      <div className="mb-5 flex items-center flex-wrap">
        <div className="flex items-center mr-5 mb-3">
          <p className="mr-2 text-black font-medium">Time Range</p>
          <Select value={timeRange} onChange={(value) => setTimeRange(value)} className="min-w-[130px]">
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
              defaultValue={[moment(custom[0]), moment(custom[1])]}
              onChange={(e) => setCustom(e)}
              className="w-[260px]"
              format={'MM/DD/YYYY'}
            />
          </div>
        )}

        <div className="mr-5 mb-3 flex items-center">
          <p className="mr-2 text-black font-medium">Amount Range</p>
          <Slider
            className="w-[150px]"
            min={0}
            max={2000}
            range
            value={amountRange}
            blur={(value) => {
              console.log('');
            }}
            onChange={(value) => {
              setAmountRange(value);
            }}
          />
          <p className="ml-2">
            [{amountRange[0]} - {amountRange[1]}]
          </p>
        </div>

        <Button name="Reset" type="ok" onClick={() => resetFilter()} moreClass="lg:ml-auto mb-3" />
      </div>
    </div>
  );

  const leftHeader = (
    <div className="mb-2 mt-1 ml-5 flex items-center w-screen">
      <div className="flex items-center mr-5">
        <p className="mr-2 text-black font-medium">Status</p>
        <Radio.Group value={status} buttonStyle="solid" onChange={(e) => setStatus(e.target.value)}>
          <Radio.Button value="-1">All</Radio.Button>
          <Radio.Button value="1">Success</Radio.Button>
          <Radio.Button value="2">Failure</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );

  const onRefund = async (id) => {
    const data = await ReportService.transactionRefund(id);
    if (data) {
      onChange();
    } else {
      setIsLoading(false);
    }
  };

  const [onChange, TransactionsTable, paramsTable] = HookDataTable({
    columns: ColumnTransactions({ onRefund, isLoading, setIsLoading }),
    Get: async (params, id) => {
      const res = await ReportService.getTransactions(params);
      return res;
    },
    isLoading,
    setIsLoading,
    loadFirst: false,
    leftHeader,
    subHeader: () => subHeader,
    searchPlaceholder: 'Search...',
    xScroll: '100vw',
  });

  const bread = [
    {
      name: 'Report',
    },
    {
      name: 'Transactions',
    },
  ];

  return (
    <Spin spinning={false}>
      <Title title="Transactions" breadcrumbs={bread} />
      <div className="p-4 rounded-xl shadow bg-gray-50">
        <div className="w-full overflow-hidden">{TransactionsTable()}</div>
      </div>
    </Spin>
  );
};

export default Transactions;
