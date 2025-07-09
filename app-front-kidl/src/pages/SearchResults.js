import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "../styles/search.css"


const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query"); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3001/api/products/sinput?name=${query}`);
        setProducts(data);
        setFilteredProducts(data); 
        setLoading(false);

        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        setError("Error fetching products.");
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters(category, priceRange);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newRange = { ...priceRange, [name]: value };
    setPriceRange(newRange);
    applyFilters(selectedCategory, newRange);
  };

  const applyFilters = (category, range) => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category.toLowerCase() === category.toLowerCase();
      const matchesPrice =
        product.price >= range.min && product.price <= range.max;
      return matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="search-results">
      <h1>Search Results for: "{query}"</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      <div className="filters">
        <div className="filter-category">
          <h3>Category</h3>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cat === selectedCategory ? "active" : ""}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-price">
          <h3>Price Range</h3>
          <label>
            Min:
            <input
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
            />
          </label>
          <label>
            Max:
            <input
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
            />
          </label>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          !loading && <p>No products found for "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
