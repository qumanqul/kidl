import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import Home from './pages/home.js'; // Home page component
import Profile from './pages/profile.js'; // Profile page component
import Login from './pages/login.js'; // Login page component
import CartProvider from "./context/CartContext.js";
import Cart from "./pages/Cart.js";
import ProductDetails from "./components/ProductDetails.js";
import Payment from './pages/payment.js';
import OrderDetails from './pages/OrderDetails.js';
import OrderInfo from './pages/orderInfo.js';
import OrderHistory from './pages/OrderHistory.js';
import Signup from './pages/SignUp.js';
import SearchResults from './pages/SearchResults.js';
import Admin from './pages/admin.js';


function App() {
  const [token, setToken] = useState(null); // State to store the JWT token


  const handleLogin = (newToken) => {
    console.log("Saving token:", newToken);
    setToken(newToken);
  };

  return (
   <CartProvider >
    <Router>
      <div className="App">
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order" element={<OrderDetails />} />
            <Route path="/order/:id" element={<OrderInfo />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path='/signup' element={<Signup />}/>
            <Route path='/search' element={<SearchResults />}/>
            <Route path='/admin' element={<Admin />}/>
      </Routes>
        </main>
        <footer>
          <p>&copy; 2025 My Store. All rights reserved.</p>
        </footer>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
