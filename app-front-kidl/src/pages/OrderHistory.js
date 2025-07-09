import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must log in to view your order history.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch order history.");
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must log in to cancel an order.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/orders/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      setSuccessMessage(response.data.message || "Order has been cancelled successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel the order.");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (orders.length === 0) {
    return <p>You have no orders yet.</p>;
  }

  return (
    <div>
      <h1>Order History</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <h3>Order ID: {order._id}</h3>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            <p>Status: {order.status}</p>
            <p>Placed On: {new Date(order.createdAt).toLocaleDateString()}</p>
            <h4>Products:</h4>
            <ul>
              {order.products.map((product) => (
                <li key={product.productId}>
                  {product.name} - ${product.price} x {product.quantity}
                </li>
              ))}
            </ul>
            {order.status !== "Cancelled" && (
              <button onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
