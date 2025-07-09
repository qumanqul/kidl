import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { CartContext } from "../context/CartContext.js";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleProfileClick = () => {
    navigate("/profile"); 
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]); 
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?name=${value}`); 
      setSuggestions(data); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?query=${searchTerm}`); 
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <h2 className="navbar-logo">KIDL</h2>
        </Link>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
        />
        {searchTerm && (
          <ul className="search-suggestions">
            {loading && <li>Loading...</li>}
            {!loading &&
              suggestions.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleSuggestionClick(product._id)}
                >
                  {product.name}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="navbar-right">
        <Link to="/cart">Cart ({cart.length})</Link>
        <button className="profile-button" onClick={handleProfileClick}>
          PROFILE
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
