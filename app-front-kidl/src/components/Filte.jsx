import React, { useState } from "react";

const FilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);   };

  return (
    <div className="filters-container">
      <h2>Filters</h2>
      <div className="filter-group">
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Enter category"
        />
      </div>
      <div className="filter-group">
        <label>Min Price:</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Enter min price"
        />
      </div>
      <div className="filter-group">
        <label>Max Price:</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Enter max price"
        />
      </div>
      <div className="filter-group">
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          name="tags"
          value={filters.tags}
          onChange={handleChange}
          placeholder="e.g., electronics, kitchen"
        />
      </div>
      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterComponent;
