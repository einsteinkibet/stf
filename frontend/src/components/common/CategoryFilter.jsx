import React, { useState, useEffect } from 'react';
import { Form, Accordion } from 'react-bootstrap';
import { categoriesAPI } from '../../api/api';

const CategoryFilter = ({ selectedCategories, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      
      // Handle different API response structures
      let categoriesData = [];
      
      if (Array.isArray(response.data)) {
        // If response.data is already an array
        categoriesData = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        // If response has results array (Django REST Framework pagination)
        categoriesData = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response has data array
        categoriesData = response.data.data;
      } else if (response.data.categories && Array.isArray(response.data.categories)) {
        // If response has categories array
        categoriesData = response.data.categories;
      }
      
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onCategoryChange(newSelection);
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <Accordion defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Categories</Accordion.Header>
        <Accordion.Body>
          {categories && categories.length > 0 ? (
            categories.map(category => (
              <Form.Check
                key={category.id}
                type="checkbox"
                id={`category-${category.id}`}
                label={category.name}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="mb-2"
              />
            ))
          ) : (
            <div className="text-muted">No categories available</div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CategoryFilter;