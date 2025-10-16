import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomeScreen.css';

// Components
import ProductCard from '../components/ProductCard/ProductCard';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Because of the proxy, we can just use a relative path
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means this effect runs once when the component mounts

  return (
    <div className="homescreen">
      <h2 className="homescreen-title">Latest Products</h2>
      <div className="homescreen-products">
        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;