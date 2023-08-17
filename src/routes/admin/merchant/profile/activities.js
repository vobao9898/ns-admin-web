import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from 'globalContext';
import { ColumnActivity } from 'columns/merchant';
import { MerchantService } from 'services/merchant';
import { DataTable } from 'components';

const Page = ({ id }) => {
  const { t } = useTranslation();
  const { formatDate } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const dataTableRef = useRef();

  return (
    <DataTable
      ref={dataTableRef}
      save={false}
      xScroll={'100%'}
      showSearch={false}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      id={() => id}
      Get={MerchantService.getActivity}
      columns={ColumnActivity({ t, formatDate })}
    />
  );
};
export default Page;
