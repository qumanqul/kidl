import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.js";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";
import "../styles/home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTags, setFilterTags] = useState([]); // State for filter tags

  // Popular filter tags (you can customize these)
  const popularFilterTags = ["Best Seller", "New Arrival", "On Sale", "Top Rated"];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories from the products
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleFilterTagClick = (tag) => {
    // Toggle the selected filter tag
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter((t) => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
  };

  const applyFilters = () => {
    const lowerCaseCategory = selectedCategory.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "" ||
        product.category.toLowerCase() === lowerCaseCategory;

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Check if the product matches any of the selected filter tags
      const matchesFilterTags =
        filterTags.length === 0 ||
        filterTags.some((tag) => product.tags?.includes(tag));

      return matchesCategory && matchesPrice && matchesFilterTags;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, priceRange, filterTags]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="home">

      <div className="home-container">
        <div className="sidebar">
          <h3>Filters</h3>

          <div className="filter-section">
            <h4>Category</h4>
            <ul>
              <li
                className={!selectedCategory ? "active" : ""}
                onClick={() => handleCategoryChange("")}
              >
                All
              </li>
              {categories.map((category) => (
                <li
                  key={category}
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange[0]}
              onChange={(e) =>
                handlePriceChange(Number(e.target.value), priceRange[1])
              }
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange[1]}
              onChange={(e) =>
                handlePriceChange(priceRange[0], Number(e.target.value))
              }
            />
          </div>

          <div className="filter-section">
            <h4>Popular Filters</h4>
            <ul>
              {popularFilterTags.map((tag) => (
                <li
                  key={tag}
                  className={filterTags.includes(tag) ? "active" : ""}
                  onClick={() => handleFilterTagClick(tag)}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <button onClick={applyFilters}>Apply Filters</button>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;