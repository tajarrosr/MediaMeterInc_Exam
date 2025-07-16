import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSend = async () => {
    const res = await fetch('http://localhost:3000/users');
    const users = await res.json();
    const exists = users.find((user) => user.email === email);

    if (exists) {
      setMessage('Password reset link sent to your email.');
    } else {
      setMessage('Email not found.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-[color:var(--color-primary)]">
          Forgot Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-[#CBD5E1] rounded-[6px] px-3 py-2 mb-3 text-[16px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {message && <p className="text-sm text-gray-600 mb-3">{message}</p>}
        <div className="flex justify-between">
          <button
            onClick={handleSend}
            className="bg-[color:var(--color-primary)] text-white px-4 py-2 rounded"
          >
            Send
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-[#64748B] underline"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
