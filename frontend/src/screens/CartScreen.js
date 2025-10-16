import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import './CartScreen.css';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use useSelector to get the cart state from Redux
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const qtyChangeHandler = (id, qty) => {
    // Find the original item to get all its details
    const item = cartItems.find((i) => i.product === id);
    dispatch(addToCart({ ...item, qty }));
  };
  
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };
  
  const getCartSubTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };
  
  const checkoutHandler = () => {
    // For now, this just navigates. We will add Stripe logic later.
    navigate('/checkout'); // A placeholder for the checkout page
  };

  return (
    <div className="cart-screen">
      <div className="cart-screen-items">
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty. <Link to="/">Go Back</Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.product}>
              <div className="cart-item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <Link to={`/product/${item.product}`} className="cart-item-name">
                {item.name}
              </Link>
              <p className="cart-item-price">${item.price}</p>
              <select
                className="cart-item-select"
                value={item.qty}
                onChange={(e) => qtyChangeHandler(item.product, Number(e.target.value))}
              >
                {[...Array(item.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
              <button
                className="cart-item-delete-btn"
                onClick={() => removeFromCartHandler(item.product)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart-screen-summary">
        <div className="summary-info">
          <p>Subtotal ({getCartItemCount()}) items</p>
          <p>${getCartSubTotal()}</p>
        </div>
        <div>
          <button onClick={checkoutHandler} disabled={cartItems.length === 0}>
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;