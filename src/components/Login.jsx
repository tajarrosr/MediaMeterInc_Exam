import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 4;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (matchedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));
        navigate('/dtr');
      } else {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        setLoginError(
          attempts >= 3
            ? 'Maximum login attempts reached. Try again later.'
            : 'Email or password is incorrect.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4">
      <h1 className="font-[Raleway] text-[color:var(--color-primary)] text-[40px] font-bold">
        Exam Track
      </h1>

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
      >
        {/* Email */}
        <div className="mb-4">
          <label className="block font-inter text-[16px] font-bold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Username or Email"
            className="w-full border border-[#CBD5E1] rounded-[6px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-inter text-[16px] font-normal"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
              setLoginError('');
            }}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block font-inter text-[16px] font-bold text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-[#CBD5E1] rounded-[6px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-inter text-[16px] font-normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError('');
            }}
          />
        </div>

        {loginError && (
          <p className="text-red-500 text-sm mb-3">{loginError}</p>
        )}

        <button
          type="submit"
          disabled={!isPasswordValid || loginAttempts >= 3}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold font-inter text-[16px] ${
            isPasswordValid && loginAttempts < 3
              ? 'bg-[color:var(--color-primary)] hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Login
        </button>

        {/* Forgot Password */}
        <p
          className="text-[#64748B] text-sm text-center mt-3 cursor-pointer hover:underline"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </p>
      </form>

      <p className="text-[#64748B] text-[14px] font-inter font-normal mt-6 text-center">
        Copyright © 2024 FE Exam Track, All Rights Reserved.
      </p>
    </div>
  );
}
