import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../redux/slices/userSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const getCartItemCount = () => {
    return cartItems.reduce((qty, item) => qty + item.qty, 0);
  };

  const logoutHandler = () => {
    dispatch(userLogout());
    // We can also add logic here to clear the cart and other states
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AETHER</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/cart">
            <i className="fas fa-shopping-cart"></i>
            <span>
              Cart <span className="cart-badge">{getCartItemCount()}</span>
            </span>
          </Link>
                  {/* ADMIN MENU - ADD THIS BLOCK */}
        {userInfo && userInfo.isAdmin && (
            <li className="dropdown">
                <div className="dropdown-toggle">
                    <i className="fas fa-user-shield"></i> Admin <i className="fas fa-caret-down"></i>
                </div>
                <ul className="dropdown-menu">
                    <li><Link to="/admin/userlist">Users</Link></li>
                    <li><Link to="/admin/productlist">Products</Link></li>
                    <li><Link to="/admin/orderlist">Orders</Link></li>
                </ul>
            </li>)}
        </li>
        {userInfo ? (
          <li className="dropdown">
            <div className="dropdown-toggle">
              <i className="fas fa-user"></i> {userInfo.name} <i className="fas fa-caret-down"></i>
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler} className="logout-button">
                  Logout
                </button>
              </li>
            </ul>
          </li>
        ) : (
          <li>
            <Link to="/login">
              <i className="fas fa-user"></i> Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;