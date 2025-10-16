import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar/Navbar';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen'; // <-- IMPORT
import OrderScreen from './screens/OrderScreen'; // <-- IMPORT
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen'; 

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/payment-success" element={<PaymentSuccessScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} /> {/* <-- ADD ROUTE */}
          <Route path="/order/:id" element={<OrderScreen />} /> {/* <-- ADD ROUTE */}            <Route path="/admin/productlist" element={<ProductListScreen />} /> {/* <-- ADD ROUTE */}
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} /> {/* <-- ADD ROUTE */}
          <Route path="/admin/orderlist" element={<OrderListScreen />} /> {/* <-- ADD ROUTE */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;