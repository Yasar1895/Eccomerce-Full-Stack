import React, { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email,password);
      onLogin(res.access_token);
    } catch (e) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} style={{flexDirection:'column', gap:8}}>
      <h3>Login</h3>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="button" disabled={loading}>{loading ? "Logging..." : "Login"}</button>
    </form>
  );
}
