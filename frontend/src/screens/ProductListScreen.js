import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './ProfileScreen.css'; // We can reuse the table styles from ProfileScreen
import './ProductListScreen.css'; // Import specific styles

const ProductListScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.user);

    // State for the list of products
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the delete action
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState(null);
    const [successDelete, setSuccessDelete] = useState(false);

    // State for the create action
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [errorCreate, setErrorCreate] = useState(null);

    useEffect(() => {
        // Reset success state on component mount
        setSuccessDelete(false);

        // Only admins should access this page
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        } else {
            const fetchProducts = async () => {
                try {
                    setLoading(true);
                    const { data } = await axios.get('/api/products');
                    setProducts(data);
                    setLoading(false);
                } catch (err) {
                    const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                    setError(message);
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [dispatch, navigate, userInfo, successDelete]); // Refetch products after a successful delete

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setLoadingDelete(true);
                setErrorDelete(null);

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                await axios.delete(`/api/products/${id}`, config);

                setLoadingDelete(false);
                setSuccessDelete(true); // Trigger useEffect to refetch products
            } catch (err) {
                const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                setErrorDelete(message);
                setLoadingDelete(false);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('A new sample product will be created. Are you sure?')) {
            try {
                setLoadingCreate(true);
                setErrorCreate(null);

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await axios.post(`/api/products`, {}, config);

                setLoadingCreate(false);
                navigate(`/admin/product/${data._id}/edit`);
            } catch (err) {
                const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                setErrorCreate(message);
                setLoadingCreate(false);
            }
        }
    };

    return (
        <div className="profile-orders">
            <div className="product-list-header">
                <h2>Products</h2>
                <button className="create-product-btn" onClick={createProductHandler} disabled={loadingCreate}>
                    {loadingCreate ? 'Creating...' : <><i className="fas fa-plus"></i> Create Product</>}
                </button>
            </div>

            {loadingDelete && <p>Deleting product...</p>}
            {errorDelete && <div className="form-error">{errorDelete}</div>}
            {loadingCreate && <p>Creating product...</p>}
            {errorCreate && <div className="form-error">{errorCreate}</div>}

            {loading ? (
                <p>Loading products...</p>
            ) : error ? (
                <div className="form-error">{error}</div>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>STOCK</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.countInStock}</td>
                                <td className="action-buttons">
                                    <Link to={`/admin/product/${product._id}/edit`}>
                                        <button className="edit-btn">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </Link>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteHandler(product._id)}
                                        disabled={loadingDelete}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductListScreen;