import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
    orderDetailsRequest,
    orderDetailsSuccess,
    orderDetailsFail,
    orderDeliverRequest,
    orderDeliverSuccess,
    orderDeliverFail,
    orderDeliverReset
} from '../redux/slices/orderSlice';
import './OrderScreen.css';

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.user);
    const { order, loading, error, successDeliver, loadingDeliver } = useSelector((state) => state.order);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return; // Exit early if not logged in
        }
        
        if (!order || order._id !== orderId || successDeliver) {
            dispatch(orderDeliverReset());
            const fetchOrderDetails = async () => {
                try {
                    dispatch(orderDetailsRequest());
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get(`/api/orders/${orderId}`, config);
                    dispatch(orderDetailsSuccess(data));
                } catch (err) {
                    const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                    dispatch(orderDetailsFail(message));
                }
            };
            fetchOrderDetails();
        }
    }, [dispatch, navigate, userInfo, orderId, order, successDeliver]);
    
    const deliverHandler = async () => {
        try {
            dispatch(orderDeliverRequest());
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
            dispatch(orderDeliverSuccess());
        } catch (err)            {
            const message = err.response && err.response.data.message ? err.response.data.message : err.message;
            dispatch(orderDeliverFail(message));
        }
    };

    // --- THE FIX IS HERE ---
    // We check for 'loading' OR '!order' before attempting to render details.
    if (loading || !order) {
        return <p>Loading order...</p>;
    }
    
    if (error) {
        return <div className="form-error">{error}</div>;
    }

    return (
        <div className="order-screen">
            <h1>Order {order._id}</h1>
            <div className="order-details-container">
                <div className="order-main-content">
                    <div className="order-section">
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong> {order.user.name}</p>
                        <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p><strong>Address: </strong>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        <div className={order.isDelivered ? "status-success" : "status-error"}>
                            {order.isDelivered ? `Delivered on ${order.deliveredAt.substring(0,10)}` : 'Not Delivered'}
                        </div>
                    </div>
                    <div className="order-section">
                        <h2>Payment Method</h2>
                        <p><strong>Method: </strong>{order.paymentMethod}</p>
                        <div className="status-success">Paid on {order.createdAt.substring(0,10)}</div>
                    </div>
                    <div className="order-section">
                        <h2>Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="order-item">
                                <img src={item.imageUrl} alt={item.name} />
                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                <span>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-item"><span>Items</span><span>${order.totalPrice}</span></div>
                    <div className="summary-item"><span>Shipping</span><span>$0.00</span></div>
                    <div className="summary-item"><span>Tax</span><span>$0.00</span></div>
                    <div className="summary-item total"><span>Total</span><span>${order.totalPrice}</span></div>

                    {userInfo && userInfo.isAdmin && !order.isDelivered && (
                        <div className="admin-actions">
                            <button
                                type="button"
                                className="form-button"
                                onClick={deliverHandler}
                                disabled={loadingDeliver}
                            >
                                {loadingDeliver ? 'Marking...' : 'Mark As Delivered'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;