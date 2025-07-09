import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { fetchProductById } from "../services/productService"; // Create this service function

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from URL
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); 
  };

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.images[0]} alt={product.name} width="200" />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;
