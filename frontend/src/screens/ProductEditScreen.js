import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import FormContainer from '../components/FormContainer/FormContainer';
import '../Form.css'; // Reuse our general form styles

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // Component-level state for the form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImageUrl(data.imageUrl);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        const message = err.response && err.response.data.message ? err.response.data.message : err.message;
        setError(message);
        setLoading(false);
      }
    };

    // Only fetch if the user is an admin, otherwise redirect
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchProduct();
    }
  }, [productId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        setLoadingUpdate(true);
        setErrorUpdate(null);

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.put(
            `/api/products/${productId}`,
            { name, price, imageUrl, countInStock, description },
            config
        );
        
        setLoadingUpdate(false);
        navigate('/admin/productlist'); // Redirect after successful update
    } catch (err) {
        const message = err.response && err.response.data.message ? err.response.data.message : err.message;
        setErrorUpdate(message);
        setLoadingUpdate(false);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="back-link">
        &larr; Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <p>Updating product...</p>}
        {errorUpdate && <div className="form-error">{errorUpdate}</div>}

        {loading ? (
          <p>Loading product data...</p>
        ) : error ? (
          <div className="form-error">{error}</div>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" className="form-control" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Count In Stock</label>
              <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="form-button" disabled={loadingUpdate}>
              Update
            </button>
          </form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;