// App.js
import React, { lazy, Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';
import Pagination from './components/Pagination';
import { Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.css';
const { Title } = Typography;

const PostTable = lazy(() => import('./components/PostTable'));
const Filters = lazy(() => import('./components/Filters'));

const App = () => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState({ tags: [], search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const history = useHistory();

  const fetchPosts = async (tags, search, page) => {
    try {
      const skip = (page - 1) * 10;
      const response = await axios.get('https://dummyjson.com/posts', {
        params: {
          skip,
          limit: 10,
        },
      });
  
      setPosts(response.data.posts);
      setTotalPosts(response.data.total);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tagsQuery = queryParams.get('tags');
    const searchQuery = queryParams.get('search');
    const pageQuery = queryParams.get('page');
  
    const tags = tagsQuery ? tagsQuery.split(',') : [];
    const search = searchQuery || '';
    const page = pageQuery ? parseInt(pageQuery) : 1;
  
    setFilters({ tags, search });
  
    fetchPosts(tags, search, page);
  }, [location.search]);
  

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    const queryParams = new URLSearchParams();
    queryParams.set('tags', newFilters.tags.join(','));
    queryParams.set('search', newFilters.search);
    queryParams.set('page', '1');
    history.push(`?${queryParams.toString()}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); 
    const queryParams = new URLSearchParams();
    queryParams.set('tags', filters.tags.join(','));
    queryParams.set('search', filters.search);
    queryParams.set('page', page.toString());
    history.push(`?${queryParams.toString()}`);
  
    fetchPosts(filters.tags, filters.search, page);
    
  };

  const filteredPosts = posts.filter((post) => {
    const tagMatch = filters.tags.length === 0 || post.tags.some((tag) => filters.tags.includes(tag));
    const searchMatch = post.body.toLowerCase().includes(filters.search.toLowerCase());
    return tagMatch && searchMatch;
  });

return (
    <Router>
      <div style={{ padding: '20px' }}>
        <Title level={2}>React application Task</Title>
        <Suspense fallback={<div>Loading...</div>}>
          <Filters filters={filters} onFiltersChange={handleFiltersChange} />
        </Suspense>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <LoadingOutlined style={{ fontSize: '48px' }} spin />
          </div>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <PostTable posts={filteredPosts} />
            </Suspense>
            <Pagination
              currentPage={currentPage}
              totalPosts={totalPosts}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;