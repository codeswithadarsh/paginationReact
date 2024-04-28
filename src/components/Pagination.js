// components/Pagination.js
import React from 'react';
import { Pagination as AntPagination } from 'antd';

const Pagination = ({ currentPage, totalPosts, onPageChange }) => {
  const pageSize = 10;
  const totalPages = Math.ceil(totalPosts / pageSize);

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <AntPagination
      current={currentPage}
      total={totalPosts}
      pageSize={pageSize}
      onChange={handlePageChange}
      style={{ marginTop: '20px', textAlign: 'center' }}
    />
  );
};

export default Pagination;