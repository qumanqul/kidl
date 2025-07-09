import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product); 
  };

  const { name, description, price, images } = product;

  return (
    <div className="product-card">
      <img src={images[0] || "https://www.galeriapolnocna.pl/cache/_store/media-expert_main.jpeg_alpha-0_nc_366x366_im.webp"} alt={name} className="product-image" />
      <Link to={`/product/${product._id}`}>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>${price}</p>
      </Link>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
