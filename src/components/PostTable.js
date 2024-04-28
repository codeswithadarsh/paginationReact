// components/PostTable.js
import React from 'react';
import { Table } from 'antd';

const PostTable = ({ posts }) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => tags.join(', '),
    },
  ];

  return <Table dataSource={posts} columns={columns} rowKey="id" />;
};

export default PostTable;