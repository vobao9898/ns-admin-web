import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { Space, Select, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

import { useAuth } from 'globalContext';
import { ColumnTransactions } from 'columns/consumer';
import HookDataTable from 'hooks/data-table';
import { PaymentTransactionService } from 'services/payment-transaction';
import { Button } from 'layouts/components';
import moment from 'moment';

const Transactions = ({ id }) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  const { t } = useTranslation();
  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('All');
  const [fromTo, setFromTo] = useState([new Date(year, month, 1), new Date(year, month + 1, 0)]);

  const changeTable = useCallback(async (param) => {
    handleChange && (await handleChange(param));
  }, []);

  useEffect(() => {
    const params = {
      ...paramTables,
      quickFilter: timeRange,
      from: moment(fromTo[0]).format('L'),
      to: moment(fromTo[1]).format('L'),
    };
    changeTable(params);
  }, [changeTable, timeRange, fromTo]);

  const [handleChange, DataTable, paramTables] = HookDataTable({
    isLoading,
    id: () => id,
    setIsLoading,
    Get: (id, params) => {
      return PaymentTransactionService.get(id, params);
    },
    columns: ColumnTransactions({
      t,
      formatDate,
    }),
    save: false,
    searchPlaceholder: 'Search...',
    rightHeader: (
      <Space>
        {!!permission && (
          <Fragment>
            <div className="flex items-center">
              <div className="flex items-center">
                <p className="mr-2 font-medium">From - To:</p>
                <DatePicker.RangePicker
                  value={[moment(fromTo[0]), moment(fromTo[1])]}
                  className="w-[260px]"
                  format="MM/DD/YYYY"
                  onChange={(value) => setFromTo(value)}
                />
              </div>
              <div className="flex items-center ml-5">
                <div className="mr-2 font-medium">Time range: </div>
                <Select value={timeRange} onChange={(value) => setTimeRange(value)} className="min-w-[120px]">
                  <Select.Option value="All">All</Select.Option>
                  <Select.Option value="thisWeek">This Week</Select.Option>
                  <Select.Option value="thisMonth">This Month</Select.Option>
                </Select>
              </div>
              <Button
                name="Reset"
                type="ok"
                onClick={() => {
                  setTimeRange('All');
                  setFromTo([new Date(year, month, 1), new Date(year, month + 1, 0)]);
                }}
                moreClass="ml-5"
              />
            </div>
          </Fragment>
        )}
      </Space>
    ),
  });

  return (
    <Fragment>
      <div className="font-bold text-lg mb-4 text-blue-500">Transactions Management</div>
      {DataTable()}
    </Fragment>
  );
};

export default Transactions;
