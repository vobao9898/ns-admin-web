import React, { useState, Fragment, useRef, useEffect, useCallback } from 'react';
import { Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { Title, Button } from 'layouts/components';
import { ColumnPrincipal, ColumnPrincipalAdd } from 'columns/principal';
import { PrincipalService } from 'services/principal';
import { useAuth } from 'globalContext';
import { useLocation, useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { ModalForm } from 'components';
import HookDataTable from 'hooks/data-table';

const Principal = () => {
  const { t } = useTranslation();

  const { formatDate, permission } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [params, set_params] = useState();
  const modalFormRef = useRef();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [status, setStatus] = useState(state?.status ? state?.status : '-1');

  const [stateData, setStateData] = useState([]);

  const getStateData = useCallback(async () => {
    const { data } = await PrincipalService.getState();
    setStateData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getStateData();
  }, [getStateData]);

  const changeStatus = (value) => {
    setStatus(value);
    if (value === '-1') {
      if (params.filters) {
        delete params.filters.status;
      }
    } else {
      params.filters = {
        ...params.filters,
        status: value,
      };
    }
    handleChangePrincipal(params);
  };

  const handleReset = () => {
    if (status === '-1') return;
    if (params.filters) {
      delete params.filters.status;
    }
    handleChangePrincipal(params);
    setStatus('-1');
    setIsLoading(false);
  };

  const [handleChangePrincipal, DataTablePrincipal] = HookDataTable({
    isLoading,
    setIsLoading,
    pageSize: 'row',
    fullTextSearch: 'key',
    xScroll: 1400,
    filter: 'filters',
    sort: 'sort',
    Get: (params) => {
      set_params(params);
      return PrincipalService.getPrincipals(params);
    },
    onRow: (record) => ({
      onClick: () =>
        navigate(`${routerLinks('Principal')}/${record?.principalId}`, {
          state: { tab: 'information', modal: false, status },
        }),
    }),
    searchPlaceholder: 'Search...',
    columns: ColumnPrincipal({
      t,
      formatDate,
    }),
    rightHeader: (
      <Space>
        {!!permission && (
          <div className="grid lg:grid-cols-1 gap-3 lg:mb-0 mb-4">
            <Button
              name="Add Principal"
              type={'ok'}
              onClick={() => {
                modalFormRef?.current?.handleEdit();
              }}
            />
          </div>
        )}
      </Space>
    ),
    subHeader: () => (
      <div className="flex items-center mb-5">
        <div className="flex items-center">
          <h3 className="mr-2">Status: </h3>
          <Select style={{ width: '150px' }} value={status} onChange={(value) => changeStatus(value)}>
            <Select.Option value="-1">All</Select.Option>
            <Select.Option value="0">Active</Select.Option>
            <Select.Option value="1">Inactive</Select.Option>
          </Select>
        </div>
        <Button onClick={handleReset} name="Reset" type="ok" moreClass="ml-5" />
      </div>
    ),
  });

  const breadcrumbs = [
    {
      name: 'Principal List',
      path: 'principal',
    },
  ];

  return (
    <Fragment>
      <ModalForm
        ref={modalFormRef}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        widthModal={1200}
        handleChange={() => {
          handleChangePrincipal();
        }}
        title={(data) => (!data?.packageId ? 'Add Principal' : 'Edit')}
        Post={PrincipalService.create}
        columns={ColumnPrincipalAdd({ t, formatDate, stateData, modalFormRef })}
      />
      <Title title="Principal List" breadcrumbs={breadcrumbs} />
      <div className="p-4 bg-gray-50 shadow rounded-xl">{DataTablePrincipal()}</div>
    </Fragment>
  );
};

export default Principal;
