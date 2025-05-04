import { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import '../styles/auth.css';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('/identity/api/login/', {
        email,
        password,
      });
  
      console.log('Login successful:', response.data);
      sessionStorage.setItem('authToken', response.data.data.token);
      // Redirect or further logic
    } catch (err) {
      // Error already handled by interceptor
      console.error(`Something went wrong ${err}`);
    }

  };

  return (
    <>
      <header className="p-3 text-bg-dark"></header>
      <main className="form-signin w-100 m-auto position-absolute top-50 start-50 translate-middle">
        <form onSubmit={handleSubmit}>
          <img className="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input className="form-check-input" type="checkbox" value="remember-me" id="checkDefault" />
            <label className="form-check-label" htmlFor="checkDefault">
              Remember me
            </label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
          <p className="mt-5 mb-3 text-body-secondary">&copy; 2025</p>
        </form>
      </main>
    </>
  );
}
