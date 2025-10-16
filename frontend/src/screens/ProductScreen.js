import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from 'react-redux'; // Import useDispatch
import axios from 'axios';
import { addToCart } from '../redux/slices/cartSlice'; // Import our action
import './ProductScreen.css';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1); // State for the selected quantity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id: productId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    // Dispatch the addToCart action
    dispatch(addToCart({
        product: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        countInStock: product.countInStock,
        qty,
    }));
    // Redirect to the cart page
    navigate('/cart');
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="product-screen">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : (
        <>
          <div className="product-screen-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <div className="product-screen-details">
            <h2 className="details-name">{product.name}</h2>
            <p className="details-price">${formatPrice(product.price)}</p>
            <p className="details-description">{product.description}</p>
          </div>
          <div className="product-screen-actions">
            <div className="actions-status">
              Status: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
            {/* Only show quantity selector if the item is in stock */}
            {product.countInStock > 0 && (
              <div className="actions-qty">
                Qty: 
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button 
              className="add-to-cart-button" 
              disabled={product.countInStock === 0}
              onClick={addToCartHandler} // Add the onClick handler
            >
              Add To Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;