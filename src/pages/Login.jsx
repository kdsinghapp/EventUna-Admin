import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@yopmail.com");
  const [password, setPassword] = useState("admin@420");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center relative"
      style={{
        backgroundImage: 'url("/Images/46485.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        cursor: loading ? 'wait' : 'default',
      }}
    >
      {/* Overlay with blur and dark tint */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(34, 34, 34, 0.45)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-gray-200 w-80 relative"
        style={{ zIndex: 2, cursor: loading ? 'wait' : 'auto' }}
      >
        <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700 tracking-wide drop-shadow">Admin Login</h2>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
          type="submit"
          style={{ cursor: loading ? 'wait' : 'pointer' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
