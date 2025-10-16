import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
} from '../redux/slices/orderSlice';
import { cartClearItems } from '../redux/slices/cartSlice';

const PaymentSuccessScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const user = useSelector((state) => state.user);
  const { userInfo } = user;
  
  const orderState = useSelector((state) => state.order);
  const { order, loading, error, success } = orderState;

  // Calculate total price from cart items
  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  };

  useEffect(() => {
    // This effect should only run once after payment to create the order.
    // The check for cartItems.length > 0 prevents creating duplicate orders on refresh.
    if (userInfo && cartItems.length > 0) {
      const createOrder = async () => {
        dispatch(orderCreateRequest());
        try {
          // This is where a real app would have a shipping form. We'll hardcode it.
          const shippingAddress = {
              address: '123 Tech Lane',
              city: 'Futureville',
              postalCode: '98765',
              country: 'Cyberspace'
          };

          const orderData = {
            orderItems: cartItems,
            shippingAddress,
            totalPrice: getTotalPrice(),
          };

          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.post('/api/orders', orderData, config);

          dispatch(orderCreateSuccess(data));
          dispatch(cartClearItems());
        } catch (err) {
          const message = err.response && err.response.data.message ? err.response.data.message : err.message;
          dispatch(orderCreateFail(message));
        }
      };
      createOrder();
    }
    // We disable the exhaustive-deps warning because we intentionally want this to run only once
    // when the component mounts with the cart data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userInfo]);


  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {loading && <h2>Finalizing Your Order...</h2>}
      {error && <div className="form-error">{error}</div>}
      {success && (
        <>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase. Your order has been placed.</p>
          {order && (
            <Link 
              to={`/order/${order._id}`} 
              style={{ color: 'var(--accent-color)', marginTop: '1rem', display: 'inline-block' }}
            >
              View Your Order Details
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSuccessScreen;