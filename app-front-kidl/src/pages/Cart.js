import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handleMakeOrder = () => {
    navigate("/order"); 
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                <img src={item.images[0]} alt={item.name} width="50" />
                <Link to={`/product/${item._id}`}>{item.name}</Link> - 
                <span>${item.price}</span> - 
                <span>
                  Quantity: 
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  {item.quantity}
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </span>
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <button onClick={clearCart}>Clear Cart</button>
          <button onClick={handleMakeOrder}>Make Order</button>
        </>
      )}
    </div>
  );
};

export default Cart;
