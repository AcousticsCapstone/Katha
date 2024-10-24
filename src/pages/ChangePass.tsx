'use client'

import React, { useState } from 'react'
import api from '../utils/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1)
  interface ApiResponse {
  data: {
    message: string
  }
}
  const handleSubmitPassword = async (e: React.FormEvent) => {
  e.preventDefault()

  if (newPassword !== confirmPassword) {
    setMessage('New passwords do not match')
    return
  }

  try {
    const response = await api.post('/request-password-change', {
      currentPassword,
      newPassword
    }) as ApiResponse
    setMessage(response.data.message)
    setStep(2)
  } catch (error) {
    setMessage('An error occurred. Please try again.')
  }
}

  const handleSubmitVerification = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const response = await api.post('/verify-password-change', {
      verificationCode,
      newPassword
    }) as ApiResponse
    setMessage(response.data.message)
    setStep(3)
  } catch (error) {
    setMessage('Invalid verification code. Please try again.')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-[400px] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#4ECCA3] text-white p-6">
          <h2 className="text-2xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </h2>
          <p className="text-[#E6FFF6]">
            {step === 1 && "Enter your current and new password"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Your password has been changed successfully"}
          </p>
        </div>
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#4ECCA3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#4ECCA3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#4ECCA3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
                />
              </div>
              <button type="submit" className="w-full bg-[#F7B731] hover:bg-[#F7B731]/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Change Password
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmitVerification} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#4ECCA3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
                />
              </div>
              <button type="submit" className="w-full bg-[#F7B731] hover:bg-[#F7B731]/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Verify
              </button>
            </form>
          )}
          {step === 3 && (
            <div className="bg-[#4ECCA3] text-white p-4 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold">Success</span>
              <p>Your password has been successfully changed.</p>
            </div>
          )}
        </div>
        {message && (
          <div className={`p-4 ${message.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold">Info</span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
