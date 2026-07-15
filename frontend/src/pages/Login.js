import React, { useState } from "react";
import { Link } from "react-router-dom";
import api, { rootApi } from "../services/api";

const rescueBg = "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1600&q=80";
const ambulanceImg = "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=900&q=80";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "admin@relieflink.com", password: "admin123" });
  const [message, setMessage] = useState("");
  const [dbStatus, setDbStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testDb = async () => {
    setDbStatus("Checking SQL Server connection...");
    try {
      const res = await rootApi.get("/");
      setDbStatus(`${res.data.message} Database: ${res.data.databaseName}`);
    } catch (err) {
      setDbStatus(err.response?.data?.message || "Backend or SQL Server is not connected.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      if (res.data.success) onLogin({ user: res.data.user, token: res.data.token });
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed. Check backend and database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,18,45,.94), rgba(7,18,45,.72)), url(${rescueBg})` }}>
        <div className="brand-row"><div className="brand-mark"><i className="bi bi-shield-fill-check"></i></div><div><h3>ReliefLink</h3><span>Disaster Resource Management</span></div></div>
        <div className="auth-hero-content">
          <span className="status-chip"><i className="bi bi-broadcast-pin"></i> System Status Online</span>
          <h1>Together We Respond,<br/><strong>Together We Save Lives</strong></h1>
          <p>Allocate ambulances, food supplies and shelters from one professional SQL Server powered command center.</p>
          <div className="feature-list">
            <div><i className="bi bi-truck-front-fill"></i><b>Ambulance Allocation</b><small>Deploy emergency vehicles quickly</small></div>
            <div><i className="bi bi-box-seam-fill"></i><b>Food Distribution</b><small>Track stock and dispatch supplies</small></div>
            <div><i className="bi bi-house-heart-fill"></i><b>Shelter Management</b><small>Reserve safe capacity for victims</small></div>
          </div>
        </div>
        <div className="auth-metric-strip">
          <div><b>1,247</b><span>Active Cases</span></div><div><b>15,890</b><span>People Helped</span></div><div><b>3,456</b><span>Resources Deployed</span></div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <div className="floating-image-card"><img src={ambulanceImg} alt="Ambulance response"/><span>Live Response Unit</span></div>
        <div className="auth-card pro">
          <div className="text-center mb-4"><div className="auth-logo"><i className="bi bi-shield-check"></i></div><h2>Welcome Back</h2><p>Login to your ReliefLink dashboard</p></div>
          {message && <div className="alert alert-danger">{message}</div>}
          {dbStatus && <div className="alert alert-info">{dbStatus}</div>}
          <form onSubmit={submit}>
            <label>Email Address</label><input className="form-control mb-3" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
            <label>Password</label><input className="form-control mb-3" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
            <div className="d-flex justify-content-between align-items-center mb-3"><label className="small"><input type="checkbox" className="me-2"/>Remember me</label><span className="small text-primary">Forgot Password?</span></div>
            <button disabled={loading} className="btn btn-primary w-100 btn-lg gradient-btn">{loading ? "Signing in..." : "Login to Dashboard"}</button>
          </form>
          <button className="btn btn-outline-secondary w-100 mt-3" onClick={testDb}><i className="bi bi-database-check me-2"></i> Test SQL Server Connection</button>
          <div className="demo-credentials mt-3">Demo Admin: <b>admin@relieflink.com</b> / <b>admin123</b></div>
          <p className="text-center mt-3 mb-0">New authorized user? <Link to="/signup">Create account</Link></p>
        </div>
      </section>
    </div>
  );
}
