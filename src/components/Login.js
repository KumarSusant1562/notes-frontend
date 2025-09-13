import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin, error }) {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={onLogin}>
        <input name="email" placeholder="Email" required /><br />
        <input name="password" type="password" placeholder="Password" required /><br />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="test-accounts">
        <b>Test Accounts:</b>
        <ul>
          <li>admin@acme.test / password</li>
          <li>user@acme.test / password</li>
          <li>admin@globex.test / password</li>
          <li>user@globex.test / password</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
