import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import

const OrderDetails = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [deliveryTime, setDeliveryTime] = useState(null); // State for delivery time
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateDeliveryTime = () => {
    const randomDays = Math.floor(Math.random() * (6 - 1 + 1)) + 3;
    setDeliveryTime(randomDays);  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token); 
      userId = decoded.id; 
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login"); 
      return;
    }

    const orderData = {
      userId,
      products: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
      paymentMethod,
      shippingAddress: { street: address, city, zipCode, country },
      deliveryTime, 
    };

    try {
      const response = await axios.post("http://localhost:3001/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearCart(); 
      navigate(`/order/${response.data._id}`); 
    } catch (error) {
      console.error("Failed to create the order:", error.response?.data || error.message);
    }
  };

  React.useEffect(() => {
    generateDeliveryTime(); 
  }, []);

  return (
    <div>
      <h1>Order Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        {city && (
          <div>
            <p>Expected Delivery Time: {deliveryTime} days</p>
          </div>
        )}

        <div>
          <label>Zip Code:</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>

        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default OrderDetails;
