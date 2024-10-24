'use client'
import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../utils/AuthContext'; // Update this import path
// import { useRouter } from 'next/router'; // Import useRouter if you're using Next.js
import './student-login.css';
import { useNavigate } from 'react-router-dom';

type LoginData = {
  code: string;
  name: string;
};

export function StudentLogin() {
    const [loginData, setLoginData] = useState<LoginData>({
      code: '',
      name: '',
    });
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const { login } = useAuth(); // Use the login function from AuthContext
    // const router = useRouter(); // Use router for navigation if you're using Next.js

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginData((prev) => ({ ...prev, [name]: value }));
      setError('');
    };
 
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!loginData.code || !loginData.name) {
        setError('Please enter both code and name');
        return;
      }
      try {
        const response = await api.post('/student-enter', {
          fullName: loginData.name,
          code: loginData.code
        });
        if (response.data.token) {
          login(response.data.token,"student"); // Use the login function from AuthContext
          navigate('/play');
        } else {
          setError('Unexpected response from server');
        }
      } catch (error) {
        console.error('Error entering student:', error);
        setError('Failed to enter student. Please try again.');
      }
    };
 
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-lg shadow-md w-96 container">
          <h2 className="text-3xl font-bold mb-6 text-center heading">
            Login para sa Estudyante
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium label-game-code">
                Game Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={loginData.code}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 input-game-code"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium label-name">
                Iyong Pangalan
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={loginData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 input-name"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 button-join-game"
            >
              Pumasok
            </button>
          </form>
        </div>
      </div>
    );
  }