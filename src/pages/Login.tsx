import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../utils/AuthContext';

interface FormData {
  email: string;
  password: string;
  username: string;
}

const MAX_ATTEMPTS = 5; // Maximum login attempts
const LOCKOUT_DURATION = 15 * 60 * 1000; // Lockout duration in milliseconds

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
  });
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLocked) {
      const endTime = Date.now() + LOCKOUT_DURATION;
      timer = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(timer);
          setIsLocked(false);
          setAttempts(0); // Reset attempts after lockout duration
        } else {
          setRemainingTime(Math.ceil(timeLeft / 1000)); // Set remaining time in seconds
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isLocked]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };


  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validatePassword(formData.password)) {
      setMessage('Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.');
      return;
    }
  
    if (isLocked) {
      setMessage(`Account is locked. Please try again in ${remainingTime} seconds.`);
      return;
    }
  
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await api.post(endpoint, formData);
  
      if (isLogin && response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(response.data.token, response.data.accountType);
        setMessage('Login successful!');
        navigate('/'); // Redirect to dashboard
      } else {
        setAttempts(prev => prev + 1);
        if (attempts + 1 >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setMessage('Too many failed attempts. Your account is locked for 15 minutes.');
        } else {
          setMessage(response.data.message);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setAttempts(prev => prev + 1);
        setMessage(error.response.data.message || 'An error occurred');
      } else {
        setMessage('An unexpected error occurred');
      }
  
      // Lock user if the maximum attempts are reached
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setMessage('Too many failed attempts. Your account is locked for 15 minutes.');
      }
    }
  };

  return (
    <div className="row full-height justify-content-center">
      <div className="col-12 text-center align-self-center py-5">
        <div className="section pb-5 pt-5 pt-sm-2 text-center">
          <h6 className="mb-0 pb-3">
            <span>Log In </span>
            <span>Sign Up</span>
          </h6>
          <input
            className="checkbox"
            type="checkbox"
            id="reg-log"
            name="reg-log"
            onChange={() => setIsLogin(!isLogin)}
          />
          <label htmlFor="reg-log"></label>
          <div className="card-3d-wrap mx-auto">
            <div className="card-3d-wrapper">
              <div className="card-front">
                <div className="center-wrap">
                  <div className="section text-center">
                    <h4 className="mb-4 pb-3">Log In</h4>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mt-2">
                        <input
                          type="email"
                          name="email"
                          className="form-style"
                          placeholder="Iyong Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <i className="input-icon uil uil-at"></i>
                      </div>
                      <div className="form-group mt-2">
                        <input
                          type="password"
                          name="password"
                          className="form-style"
                          placeholder="Iyong Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <i className="input-icon uil uil-lock-alt"></i>
                      </div>
                      <button className="btn mt-4" type="submit" disabled={isLocked}>Mag-login</button>
                      {message && <p className="error-message" style={{ color: 'red' }}>{message}</p>}
                    </form>
                  </div>
                </div>
              </div>
              <div className="card-back">
                <div className="center-wrap">
                  <div className="section text-center">
                    <h4 className="mb-4 pb-3">Rehistro</h4>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group mt-2">
                        <input
                          type="text"
                          name="username"
                          className="form-style"
                          placeholder="Iyong Buong Pangalan"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                        <i className="input-icon uil uil-user"></i>
                      </div>
                      <div className="form-group mt-2">
                        <input
                          type="email"
                          name="email"
                          className="form-style"
                          placeholder="Iyong Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <i className="input-icon uil uil-at"></i>
                      </div>
                      <div className="form-group mt-2">
                        <input
                          type="password"
                          name="password"
                          className="form-style"
                          placeholder="Iyong Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <i className="input-icon uil uil-lock-alt"></i>
                      </div>
                      <button className="btn mt-4" type="submit">Magrehistro</button>
                      {message && <p className="error-message" style={{ color: 'red' }}>{message}</p>}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
