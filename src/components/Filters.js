// components/Filters.js
import React, { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Filters = ({ filters, onFiltersChange }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/posts');
        const allTags = new Set();
        response.data.posts.forEach((post) => {
          post.tags.forEach((tag) => allTags.add(tag));
        });
        setTags(Array.from(allTags));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagsChange = (value) => {
    onFiltersChange({ ...filters, tags: value });
  };

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select tags"
        onChange={handleTagsChange}
        optionLabelProp="label"
        value={filters.tags}
      >
        {tags.map((tag) => (
          <Option key={tag} value={tag}>
            {tag}
          </Option>
        ))}
      </Select>
      <Input
        placeholder="Search posts"
        value={filters.search}
        onChange={handleSearchChange}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default Filters;