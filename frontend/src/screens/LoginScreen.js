import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
} from '../redux/slices/userSlice';

import FormContainer from '../components/FormContainer/FormContainer';
import '../Form.css'; // Import general form styles

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((state) => state.user);
  
  // Redirect if user is already logged in
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(userLoginRequest());
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );
      dispatch(userLoginSuccess(data));
      navigate(redirect);
    } catch (err) {
      const message = err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(userLoginFail(message));
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="form-link">
        New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;