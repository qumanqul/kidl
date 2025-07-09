import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderInfo = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to view this order.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order details.");
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div>
      <h1>Order Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {order ? (
        <>
          <h3>Order ID: {order._id}</h3>
          <p>Status: {order.status}</p>
          <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
          <h3>Shipping Address:</h3>
          <p>
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}
          </p>
          <h3>Products:</h3>
          <ul>
            {order.products.map((product) => (
              <li key={product.productId}>
                <strong>{product.name}</strong> - ${product.price} x {product.quantity}
              </li>
            ))}
          </ul>
          <p>Payment Method: {order.paymentMethod}</p>
        </>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default OrderInfo;
