import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  myOrdersListRequest,
  myOrdersListSuccess,
  myOrdersListFail,
} from '../redux/slices/orderSlice';
import './ProfileScreen.css';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchMyOrders = async () => {
        dispatch(myOrdersListRequest());
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.get('/api/orders/myorders', config);
          dispatch(myOrdersListSuccess(data));
        } catch (err) {
          const message = err.response && err.response.data.message ? err.response.data.message : err.message;
          dispatch(myOrdersListFail(message));
        }
      };
      fetchMyOrders();
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <div className="profile-screen">
      <div className="profile-info">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {userInfo?.name}</p>
        <p><strong>Email:</strong> {userInfo?.email}</p>
      </div>
      <div className="profile-orders">
        <h2>My Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <div className="form-error">{error}</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <button className="details-btn">Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;