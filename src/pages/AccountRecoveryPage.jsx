import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import '../styles/AccountRecoveryPage.css';

const AccountRecoveryPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState('initial'); // 'initial', 'otp_username', 'otp_password', 'success_username', 'success_password'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveredUsername, setRecoveredUsername] = useState('');

  const handleRequestOtp = async (type) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (type === 'username') {
        await userService.requestUsernameOTP(email);
        setStage('otp_username');
      } else {
        await userService.requestPasswordOTP(email);
        setStage('otp_password');
      }
      setMessage('An OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUsername = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await userService.verifyUsernameOTP(email, otp);
      setRecoveredUsername(response.data);
      setStage('success_username');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userService.resetPassword(email, otp, newPassword);
      setStage('success_password');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderInitial = () => (
    <>
      <h2>Account Recovery</h2>
      <p className="subtitle">Enter your email to recover your username or reset your password.</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="button-group">
        <button onClick={() => handleRequestOtp('username')} disabled={loading || !email}>
          {loading ? 'Sending...' : 'Recover Username'}
        </button>
        <button onClick={() => handleRequestOtp('password')} disabled={loading || !email}>
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </div>
    </>
  );

  const renderOtpUsername = () => (
    <form onSubmit={handleVerifyUsername}>
      <h2>Verify Your Identity</h2>
      <p className="subtitle">Enter the OTP sent to {email}.</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Get Username'}
      </button>
    </form>
  );
  
  const renderOtpPassword = () => (
    <form onSubmit={handleResetPassword}>
      <h2>Reset Your Password</h2>
      <p className="subtitle">Enter the OTP and your new password.</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Set New Password'}
      </button>
    </form>
  );

  const renderSuccessUsername = () => (
    <>
      <h2>Username Recovered!</h2>
      <p className="subtitle">Your username is:</p>
      <div className="recovered-username">{recoveredUsername}</div>
      <Link to="/login" className="btn-back">Back to Login</Link>
    </>
  );

  const renderSuccessPassword = () => (
    <>
      <h2>Password Reset!</h2>
      <p className="subtitle">Your password has been successfully reset.</p>
      <Link to="/login" className="btn-back">Back to Login</Link>
    </>
  );

  const renderStage = () => {
    switch (stage) {
      case 'otp_username': return renderOtpUsername();
      case 'otp_password': return renderOtpPassword();
      case 'success_username': return renderSuccessUsername();
      case 'success_password': return renderSuccessPassword();
      default: return renderInitial();
    }
  };

  return (
    <div className="recovery-container">
      <div className="recovery-form">
        {renderStage()}
        {message && <p className="message success-message">{message}</p>}
        {error && <p className="message error-message">{error}</p>}
        {stage !== 'success_username' && stage !== 'success_password' && (
          <Link to="/login" className="back-link-bottom">Back to Login</Link>
        )}
      </div>
    </div>
  );
};

export default AccountRecoveryPage; 