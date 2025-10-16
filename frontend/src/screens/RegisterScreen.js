import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,
} from '../redux/slices/userSlice';

import FormContainer from '../components/FormContainer/FormContainer';
import '../Form.css';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((state) => state.user);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
        setMessage(null);
        dispatch(userRegisterRequest());
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/users/register', { name, email, password }, config);
            dispatch(userRegisterSuccess(data));
            // Also log the user in right after they register
            // dispatch(userLoginSuccess(data)); // This is handled by userRegisterSuccess now
            navigate(redirect);
        } catch (err) {
            const message = err.response && err.response.data.message ? err.response.data.message : err.message;
            dispatch(userRegisterFail(message));
        }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <div className="form-error">{message}</div>}
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="form-link">
        Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;