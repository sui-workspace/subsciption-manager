import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import Pick from 'lodash/pick';
import { useEffect, useMemo, useState } from 'react';

const convertParams = (params) => {
  return { ...params, size: params.pageSize, page: params.current };
};

const DynamicTable = (props) => {
  const { query, filters, queryKey, fields, refetchKey, pagination } = props;

  const [tableParams, setTableParams] = useState({
    current: 1,
    pageSize: 10,
    ...filters
  });

  const pickFields = useMemo(() => [...(fields || []), 'size', 'page'], [fields]);
  const params = useMemo(() => Pick(convertParams(tableParams), pickFields), [pickFields, tableParams]);
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: [queryKey, tableParams],
    queryFn: () => query(params)
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      ...tableParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
      filters,
      ...sorter
    });
  };

  const total = useMemo(() => {
    return data?.total || 0;
  }, [data?.total]);

  useEffect(() => {
    setTableParams({ ...tableParams, ...filters, current: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  return (
    <Table
      {...props}
      loading={isFetching || isLoading || !data}
      dataSource={data?.items || []}
      pagination={
        pagination === false
          ? false
          : { ...tableParams.pagination, current: tableParams.current, pageSize: tableParams.pageSize, total }
      }
      onChange={handleTableChange}
    />
  );
};

export default DynamicTable;
