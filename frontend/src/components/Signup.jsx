import React, { useState } from "react";
import { signup } from "../api";

export default function Signup({ onSignup }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(email,password);
      onSignup(res.access_token);
    } catch (e) {
      alert("Signup failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} style={{flexDirection:'column', gap:8}}>
      <h3>Sign up</h3>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="button" disabled={loading}>{loading ? "Signing..." : "Sign up"}</button>
    </form>
  );
}
